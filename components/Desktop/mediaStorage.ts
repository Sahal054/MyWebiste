const DB_NAME = 'desktop-media-db'
const DB_VERSION = 1
const STORE_NAME = 'files'

export const MAX_MEDIA_FILES = 20
export const MAX_MEDIA_BYTES = 100 * 1024 * 1024

export interface StoredMediaRecord {
    id: string
    name: string
    mimeType: string
    size: number
    blob: Blob
    createdAt: number
}

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' })
            }
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

async function getAllRecords(): Promise<StoredMediaRecord[]> {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result as StoredMediaRecord[])
        request.onerror = () => reject(request.error)
        tx.oncomplete = () => db.close()
        tx.onerror = () => db.close()
    })
}

async function putRecord(record: StoredMediaRecord): Promise<void> {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        store.put(record)
        tx.oncomplete = () => {
            db.close()
            resolve()
        }
        tx.onerror = () => {
            db.close()
            reject(tx.error)
        }
    })
}

async function deleteRecord(id: string): Promise<void> {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        store.delete(id)
        tx.oncomplete = () => {
            db.close()
            resolve()
        }
        tx.onerror = () => {
            db.close()
            reject(tx.error)
        }
    })
}

export async function storeMediaFile(file: File): Promise<{ storageKey: string; mimeType: string }> {
    const records = await getAllRecords()
    const totalBytes = records.reduce((sum, record) => sum + record.size, 0)

    if (records.length >= MAX_MEDIA_FILES) {
        throw new Error(`You can only store up to ${MAX_MEDIA_FILES} media files locally.`)
    }
    if (totalBytes + file.size > MAX_MEDIA_BYTES) {
        throw new Error(`Local media storage is limited to ${Math.round(MAX_MEDIA_BYTES / 1024 / 1024)} MB.`)
    }

    const storageKey = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    await putRecord({
        id: storageKey,
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        blob: file,
        createdAt: Date.now(),
    })
    return { storageKey, mimeType: file.type || 'application/octet-stream' }
}

export async function loadMediaObjectUrl(storageKey: string): Promise<string | null> {
    const records = await getAllRecords()
    const record = records.find(item => item.id === storageKey)
    if (!record) return null
    return URL.createObjectURL(record.blob)
}

export async function deleteMediaFile(storageKey: string): Promise<void> {
    await deleteRecord(storageKey)
}

export async function clearMediaFiles(): Promise<void> {
    const records = await getAllRecords()
    await Promise.all(records.map(record => deleteRecord(record.id)))
}
