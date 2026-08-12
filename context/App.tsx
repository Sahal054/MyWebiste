"use client";

import React, { createContext, useContext, useState, useEffect } from 'react'
import { deleteMediaFile, clearMediaFiles } from '../components/Desktop/mediaStorage'
import { CERTIFICATION_RECORDS } from '../lib/certifications'

export interface UserFolder {
    id: string
    name: string
    items: string[]
    trashed?: boolean
}

export interface SavedDoc {
    id: string
    filename: string
    content: string
    createdAt: number
    trashed?: boolean
    mediaStorageKey?: string
    mediaMimeType?: string
}

interface AppContextValue {
    isNotificationsOpen: boolean
    setNotificationsOpen: (open: boolean) => void
    websiteMode: boolean
    compact: boolean
    darkMode: boolean
    toggleDarkMode: () => void
    wallpaper: string | null
    setWallpaper: (url: string | null) => void
    // Trash
    clearAllDocs: () => void
    deleteDoc: (id: string) => void
    moveToTrash: (id: string) => void
    restoreDoc: (id: string) => void
    emptyTrash: () => void
    isTrashOpen: boolean
    setTrashOpen: (open: boolean) => void
    isTrashMinimized: boolean
    setTrashMinimized: (min: boolean) => void
    isHoveringTrash: boolean
    setIsHoveringTrash: (val: boolean) => void
    // Projects folder
    isProjectsOpen: boolean
    setProjectsOpen: (open: boolean) => void
    isProjectsMinimized: boolean
    setProjectsMinimized: (open: boolean) => void
    projectFolderItems: string[]
    addToProjectFolder: (id: string) => void
    removeFromProjectFolder: (id: string) => void
    // Resume window (pre-populated personal resume)
    isDocOpen: boolean
    setDocOpen: (open: boolean) => void
    isDocMinimized: boolean
    setDocMinimized: (min: boolean) => void
    // New-doc / saved-doc editor window
    isNewDocOpen: boolean
    setNewDocOpen: (open: boolean) => void
    isNewDocMinimized: boolean
    setNewDocMinimized: (min: boolean) => void
    openSavedDocId: string | null
    setOpenSavedDocId: (id: string | null) => void
    // User-created documents
    savedDocs: SavedDoc[]
    addSavedDoc: (filename: string, content: string) => SavedDoc
    addMediaDoc: (filename: string, storageKey: string, mimeType: string) => SavedDoc
    updateSavedDoc: (id: string, content: string) => void
    // User-created folders
    userFolders: UserFolder[]
    createFolder: (name: string) => UserFolder
    addDocToFolder: (folderId: string, docId: string) => void
    removeDocFromFolder: (folderId: string, docId: string) => void
    deleteFolder: (folderId: string) => void
    restoreFolder: (folderId: string) => void
    deleteFolderPermanently: (folderId: string) => void
    certificationDocs: SavedDoc[]
    addDocToCertifications: (docId: string) => void
    removeDocFromCertifications: (docId: string) => void
    isFolderWindowOpen: boolean
    setFolderWindowOpen: (open: boolean) => void
    isFolderWindowMinimized: boolean
    setFolderWindowMinimized: (min: boolean) => void
    activeFolderWindowId: string | null
    setActiveFolderWindowId: (id: string | null) => void
    isMediaWindowOpen: boolean
    setMediaWindowOpen: (open: boolean) => void
    isMediaWindowMinimized: boolean
    setMediaWindowMinimized: (min: boolean) => void
    activeMediaDocId: string | null
    setActiveMediaDocId: (id: string | null) => void
    pdfWindows: PdfWindowState[]
    openPdfWindow: (docId: string) => string
    closePdfWindow: (windowId: string) => void
    minimizePdfWindow: (windowId: string, minimized: boolean) => void
    restorePdfWindow: (windowId: string) => void
    // Contact window
    isContactOpen: boolean
    setContactOpen: (open: boolean) => void
    isContactMinimized: boolean;
    setContactMinimized: (minimized: boolean) => void;
}

export interface PdfWindowState {
    windowId: string
    docId: string
    minimized: boolean
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const SANDY_CREAM_URL = 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png'
const FOLDERS_KEY = 'user-folders'
const DOCS_KEY = 'user-docs'
const DEFAULT_MOV_URL = 'https://res.cloudinary.com/dyyfvzis2/video/upload/v1786567457/vlipsy-south-park-briefcases-explode-7hp31LuO_aojxz3.mp4'
// FIX: Corrected "cloudinarsy" to "cloudinary"
const DEFAULT_IMG_URL = 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1786567626/G2wT8rBXsAANZ6u_rvnn6w.jpg'

const WELCOME_CONTENT = `
<div style="font-family: sans-serif; max-width: 650px; line-height: 1.6;">
    <h1 style="font-size: 26px; font-weight: bold; margin-bottom: 12px;">👋 Hello there, Welcome to my Desktop OS</h1>
    <p style="margin-bottom: 24px; font-size: 15px;">
     Inspired by the macOS desktop experience, I built this fully interactive desktop environment from scratch using Next.js, React, and Framer Motion. The idea was to experiment with client-side state management, browser persistence, and building a UI that behaves like a real desktop.
    </p>
    <h3 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid rgba(150,150,150,0.3); padding-bottom: 8px; margin-bottom: 16px;">✨ Things you can do right now:</h3>
       <p style="margin-bottom: 8px; font-size: 15px;"><b>📁 File System & Drag-and-Drop</b></p>
         <ul style="margin-bottom: 24px; padding-left: 20px; font-size: 14px; color: opacity-80;">
                <li style="margin-bottom: 8px;"><b>Create & Edit:</b> Click "New Doc" in the dock to open the text editor. Your text auto-saves directly to your browser's <code>localStorage</code>.</li>
                <li style="margin-bottom: 8px;"><b>Folders:</b> Right-click the desktop background to create new folders. You can physically drag and drop any document or media file straight into a folder window to organize your desktop.</li>
                <li style="margin-bottom: 8px;"><b>The Trash Can:</b> Done with a file? Drag and drop it directly onto the Trash icon (either on the desktop or the dock). It has real collision detection. You can even drag entire folders containing files into the trash to delete them all at once.</li>
        </ul>

     <p style="margin-bottom: 8px; font-size: 15px;"><b>🖼️ Media Handling (IndexedDB)</b></p>
         <ul style="margin-bottom: 24px; padding-left: 20px; font-size: 14px; color: opacity-80;">
             <li style="margin-bottom: 8px;"><b>Upload Your Own:</b> Right-click the desktop and select "Add Media From Device". You can upload local images, <code>.mp4</code> or <code>.mov</code> videos, and <code>.pdf</code> files. They will generate an icon on the desktop and open in dedicated media viewers.</li>
                      </ul>
    <ul style="margin-bottom: 32px; padding-left: 20px; font-size: 15px; color: opacity-90; line-height: 1.7;">
        <li style="margin-bottom: 8px;"><b>📂 Explore my Projects:</b> Open the Projects folder to dive into my recent work.</li>
        <li style="margin-bottom: 8px;"><b>📌 Check my current focus:</b> Glance at the retro Sticky Note in the corner to see exactly what I'm actively working on or learning today.</li>
        <li style="margin-bottom: 8px;"><b>📜 View my Certifications:</b> Open the desktop folder to browse my credentials inside a custom-built PDF viewer.</li>
        <li style="margin-bottom: 8px;"><b>📊 View live Server Stats:</b> This entire website is actually being hosted on my personal home laptop server! Click the "Server Stats" icon to see live metrics on how the hardware is holding up.</li>
        <li style="margin-bottom: 8px;"><b>✉️ Leave a Review:</b> Open the Envelope app in the dock to send me a message, ask a question, or leave a review about the site.</li>
    </ul>
    <h3 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid rgba(150,150,150,0.3); padding-bottom: 8px; margin-bottom: 16px;">🛠️ What's happening under the hood?</h3>
    <p style="margin-bottom: 16px; font-size: 15px;">
        <b>Heavy Media Processing:</b> If you upload a video or PNG, standard local storage would crash immediately. To fix this, I made a pipeline using your browser's <code>IndexedDB</code>. It securely processes and stores heavy media blobs entirely on the client side, keeping the whole OS fast.
    </p>
    <p style="margin-bottom: 16px; font-size: 15px;">
        <b>State Physics & Persistence:</b> The drag-and-drop mechanics, window z-indexing, and collision detection (like throwing a folder into the trash) are all managed through complex React state. Plus, whether you write a custom markdown doc or change the wallpaper, it instantly persists to <code>localStorage</code>.
    </p>
    <p style="margin-bottom: 16px; font-size: 15px;">
        <b>Serverless APIs & Hardware:</b> When you submit a review via the Envelope, it hits a Next.js serverless route that triggers a Discord webhook, pinging my phone instantly. All of this is being served and routed directly from my home lab setup.
    </p>
    <p style="font-style: italic; color: #777; margin-top: 32px; font-size: 15px; text-align: center;">
        Go ahead and make yourself at home. Upload a video, change the theme, or just drag this exact file into the trash. Have fun exploring!
    </p>
</div>
`
export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isNotificationsOpen, setNotificationsOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [wallpaper, setWallpaperState] = useState<string | null>(null)
    const [isDocOpen, setDocOpen] = useState(false)
    const [isDocMinimized, setDocMinimized] = useState(false)
    const [isNewDocOpen, setNewDocOpen] = useState(false)
    const [isNewDocMinimized, setNewDocMinimized] = useState(false)
    const [openSavedDocId, setOpenSavedDocId] = useState<string | null>(null)
    const [savedDocs, setSavedDocs] = useState<SavedDoc[]>([])
    const [isProjectsOpen, setProjectsOpen] = useState(false)
    const [isProjectsMinimized, setProjectsMinimized] = useState(false)
    const [isContactOpen, setContactOpen] = useState(false)
    const [isTrashOpen, setTrashOpen] = useState(false)
    const [isTrashMinimized, setTrashMinimized] = useState(false)
    const [isHoveringTrash, setIsHoveringTrash] = useState(false)
    const [projectFolderItems, setProjectFolderItems] = useState<string[]>([])
    const [userFolders, setUserFolders] = useState<UserFolder[]>([])
    const [certificationDocs, setCertificationDocs] = useState<SavedDoc[]>(
        CERTIFICATION_RECORDS.map(record => ({
            id: record.id,
            filename: record.filename,
            content: record.url,
            createdAt: record.createdAt,
        }))
    )
    const [isFolderWindowOpen, setFolderWindowOpen] = useState(false)
    const [isFolderWindowMinimized, setFolderWindowMinimized] = useState(false)
    const [activeFolderWindowId, setActiveFolderWindowId] = useState<string | null>(null)
    const [isMediaWindowOpen, setMediaWindowOpen] = useState(false)
    const [isMediaWindowMinimized, setMediaWindowMinimized] = useState(false)
    const [activeMediaDocId, setActiveMediaDocId] = useState<string | null>(null)
    const [pdfWindows, setPdfWindows] = useState<PdfWindowState[]>([])
    const [isContactMinimized, setContactMinimized] = useState(false);


    useEffect(() => {
        const savedDark = localStorage.getItem('darkMode') === 'true'
        const savedWallpaper = localStorage.getItem('wallpaper')
        setDarkMode(savedDark)
        setWallpaperState(savedWallpaper ?? SANDY_CREAM_URL)
        try {
            const raw = localStorage.getItem(DOCS_KEY)
            if (raw) {
                const parsedDocs = JSON.parse(raw) as SavedDoc[]
                setSavedDocs(parsedDocs)
            } else {
                // IT'S A NEW VISITOR - Generate all 3 files in one clean sweep!
                const homeDoc: SavedDoc = {
                    id: `doc-home-${Date.now()}`,
                    filename: 'home.mdx',
                    content: WELCOME_CONTENT,
                    createdAt: Date.now(),
                }
                const movDoc: SavedDoc = {
                    id: `doc-mov-${Date.now()}`,
                    filename: 'demo.mov',
                    content: DEFAULT_MOV_URL,
                    createdAt: Date.now(),
                }
                const imgDoc: SavedDoc = {
                    id: `doc-img-${Date.now()}`,
                    filename: 'painting.jpg',
                    content: DEFAULT_IMG_URL,
                    createdAt: Date.now(),
                }

                // Bundle them together and save exactly once
                const initialDocs = [imgDoc, movDoc, homeDoc]
                setSavedDocs(initialDocs)
                localStorage.setItem(DOCS_KEY, JSON.stringify(initialDocs))
            }

            const pf = localStorage.getItem('project-folder')
            if (pf) setProjectFolderItems(JSON.parse(pf))
            const uf = localStorage.getItem(FOLDERS_KEY)
            if (uf) setUserFolders(JSON.parse(uf))
        } catch {}  
        void fetch('/api/certifications')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (!data?.docs) return
                setCertificationDocs(data.docs.map((doc: typeof CERTIFICATION_RECORDS[number]) => ({
                    id: doc.id,
                    filename: doc.filename,
                    content: doc.url,
                    createdAt: doc.createdAt,
                })))
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        const html = document.documentElement
        if (darkMode) html.classList.add('dark')
        else html.classList.remove('dark')
        localStorage.setItem('darkMode', String(darkMode))
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode(prev => !prev)

    const setWallpaper = (url: string | null) => {
        setWallpaperState(url)
        if (url) localStorage.setItem('wallpaper', url)
        else localStorage.removeItem('wallpaper')
    }

    const addSavedDoc = (filename: string, content: string): SavedDoc => {
        const doc: SavedDoc = {
            id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            filename: filename.includes('.') ? filename : `${filename}.mdx`,
            content,
            createdAt: Date.now(),
        }
        setSavedDocs(prev => {
            const updated = [doc, ...prev]
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
        return doc
    }

    const addMediaDoc = (filename: string, storageKey: string, mimeType: string): SavedDoc => {
        const doc: SavedDoc = {
            id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            filename,
            content: '',
            createdAt: Date.now(),
            mediaStorageKey: storageKey,
            mediaMimeType: mimeType,
        }
        setSavedDocs(prev => {
            const updated = [doc, ...prev]
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
        return doc
    }

    const clearAllDocs = () => {
        setSavedDocs(prev => {
            prev.forEach(doc => {
                if (doc.mediaStorageKey) void deleteMediaFile(doc.mediaStorageKey)
            })
            return []
        })
        localStorage.removeItem(DOCS_KEY)
        void clearMediaFiles()
    }

    const updateFolderTrashState = (folderId: string, trashed: boolean) => {
        const folder = userFolders.find(f => f.id === folderId)
        if (!folder) return

        setUserFolders(prev => {
            const updated = prev.map(f => f.id === folderId ? { ...f, trashed } : f)
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })

        setSavedDocs(prev => {
            const updated = prev.map(d => folder.items.includes(d.id) ? { ...d, trashed } : d)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const moveToTrash = (id: string) => {
        setSavedDocs(prev => {
            const updated = prev.map(d => d.id === id ? { ...d, trashed: true } : d)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const restoreDoc = (id: string) => {
        setSavedDocs(prev => {
            const updated = prev.map(d => d.id === id ? { ...d, trashed: false } : d)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const emptyTrash = () => {
        setSavedDocs(prev => {
            const updated = prev.filter(d => !d.trashed)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
        setUserFolders(prev => {
            const updated = prev.filter(f => !f.trashed)
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const addToProjectFolder = (id: string) => {
        setProjectFolderItems(prev => {
            if (prev.includes(id)) return prev
            const updated = [...prev, id]
            localStorage.setItem('project-folder', JSON.stringify(updated))
            return updated
        })
    }

    const removeFromProjectFolder = (id: string) => {
        setProjectFolderItems(prev => {
            const updated = prev.filter(i => i !== id)
            localStorage.setItem('project-folder', JSON.stringify(updated))
            return updated
        })
    }

    const createFolder = (name: string): UserFolder => {
        const folder: UserFolder = { id: `folder-${Date.now()}`, name, items: [] }
        setUserFolders(prev => {
            const updated = [...prev, folder]
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
        return folder
    }

    const addDocToFolder = (folderId: string, docId: string) => {
        setUserFolders(prev => {
            const updated = prev.map(f =>
                f.id === folderId && !f.items.includes(docId)
                    ? { ...f, items: [...f.items, docId] }
                    : f
            )
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const removeDocFromFolder = (folderId: string, docId: string) => {
        setUserFolders(prev => {
            const updated = prev.map(f =>
                f.id === folderId ? { ...f, items: f.items.filter(i => i !== docId) } : f
            )
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const deleteFolder = (folderId: string) => {
        updateFolderTrashState(folderId, true)
    }

    const restoreFolder = (folderId: string) => {
        updateFolderTrashState(folderId, false)
    }

    const deleteFolderPermanently = (folderId: string) => {
        const folder = userFolders.find(f => f.id === folderId)
        if (!folder) return

        setUserFolders(prev => {
            const updated = prev.filter(f => f.id !== folderId)
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })

        setSavedDocs(prev => {
            const updated = prev.filter(d => !folder.items.includes(d.id))
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const addDocToCertifications = (docId: string) => {
        setSavedDocs(prev => {
            const target = prev.find(doc => doc.id === docId)
            if (!target) return prev
            setCertificationDocs(current => {
                if (current.some(doc => doc.id === docId)) return current
                const updatedCerts = [...current, target]
                return updatedCerts
            })
            const updated = prev.filter(doc => doc.id !== docId)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const removeDocFromCertifications = (docId: string) => {
        setCertificationDocs(prev => {
            const target = prev.find(doc => doc.id === docId)
            if (!target) return prev
            const updated = prev.filter(doc => doc.id !== docId)
            return updated
        })
        setSavedDocs(prev => {
            const target = certificationDocs.find(doc => doc.id === docId)
            if (!target) return prev
            if (prev.some(doc => doc.id === docId)) return prev
            const updated = [target, ...prev]
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const openPdfWindow = (docId: string) => {
        const windowId = `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        setPdfWindows(prev => [...prev, { windowId, docId, minimized: false }])
        return windowId
    }

    const closePdfWindow = (windowId: string) => {
        setPdfWindows(prev => prev.filter(window => window.windowId !== windowId))
    }

    const minimizePdfWindow = (windowId: string, minimized: boolean) => {
        setPdfWindows(prev => prev.map(window => window.windowId === windowId ? { ...window, minimized } : window))
    }

    const restorePdfWindow = (windowId: string) => {
        minimizePdfWindow(windowId, false)
    }

    const deleteDoc = (id: string) => {
        setSavedDocs(prev => {
            const target = prev.find(d => d.id === id)
            if (target?.mediaStorageKey) void deleteMediaFile(target.mediaStorageKey)
            const updated = prev.filter(d => d.id !== id)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }
    const updateSavedDoc = (id: string, content: string) => {
        setSavedDocs(prev => {
            const updated = prev.map(d => d.id === id ? { ...d, content } : d)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    return (
        <AppContext.Provider
            value={{
                isNotificationsOpen,
                setNotificationsOpen,
                websiteMode: false,
                compact: false,
                darkMode,
                toggleDarkMode,
                wallpaper,
                setWallpaper,
                isDocOpen,
                setDocOpen,
                isDocMinimized,
                setDocMinimized,
                isNewDocOpen,
                setNewDocOpen,
                isNewDocMinimized,
                setNewDocMinimized,
                openSavedDocId,
                setOpenSavedDocId,
                savedDocs,
                addSavedDoc,
                addMediaDoc,
                updateSavedDoc,
                isProjectsOpen,
                setProjectsOpen,
                isProjectsMinimized,
                setProjectsMinimized,
                isContactOpen,
                setContactOpen,
                clearAllDocs,
                deleteDoc,
                moveToTrash,
                restoreDoc,
                emptyTrash,
                isHoveringTrash,
                setIsHoveringTrash,
                isTrashOpen,
                setTrashOpen,
                isTrashMinimized,
                setTrashMinimized,
                projectFolderItems,
                addToProjectFolder,
                removeFromProjectFolder,
                userFolders,
                createFolder,
                addDocToFolder,
                removeDocFromFolder,
                deleteFolder,
                restoreFolder,
                deleteFolderPermanently,
                certificationDocs,
                addDocToCertifications,
                removeDocFromCertifications,
                isFolderWindowOpen,
                setFolderWindowOpen,
                isFolderWindowMinimized,
                setFolderWindowMinimized,
                activeFolderWindowId,
                setActiveFolderWindowId,
                isMediaWindowOpen,
                setMediaWindowOpen,
                isMediaWindowMinimized,
                setMediaWindowMinimized,
                activeMediaDocId,
                setActiveMediaDocId,
                pdfWindows,
                openPdfWindow,
                closePdfWindow,
                minimizePdfWindow,
                restorePdfWindow,
                isContactMinimized,
                setContactMinimized,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp(): AppContextValue {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
    return ctx
}
