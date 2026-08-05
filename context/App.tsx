"use client";

import React, { createContext, useContext, useState, useEffect } from 'react'
import { deleteMediaFile, clearMediaFiles } from '../components/Desktop/mediaStorage'

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
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const SANDY_CREAM_URL = 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png'
const FOLDERS_KEY = 'user-folders'
const DOCS_KEY = 'user-docs'
const DEFAULT_MOV_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

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
    const [isTrashOpen, setTrashOpen] = useState(false)
    const [isTrashMinimized, setTrashMinimized] = useState(false)
    const [isHoveringTrash, setIsHoveringTrash] = useState(false)
    const [projectFolderItems, setProjectFolderItems] = useState<string[]>([])
    const [userFolders, setUserFolders] = useState<UserFolder[]>([])
    const [isFolderWindowOpen, setFolderWindowOpen] = useState(false)
    const [isFolderWindowMinimized, setFolderWindowMinimized] = useState(false)
    const [activeFolderWindowId, setActiveFolderWindowId] = useState<string | null>(null)
    const [isMediaWindowOpen, setMediaWindowOpen] = useState(false)
    const [isMediaWindowMinimized, setMediaWindowMinimized] = useState(false)
    const [activeMediaDocId, setActiveMediaDocId] = useState<string | null>(null)


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
                if (parsedDocs.length === 0) {
                    const defaultMov = {
                        id: 'doc-default-mov',
                        filename: 'demo.mov',
                        content: DEFAULT_MOV_URL,
                        createdAt: Date.now(),
                    }
                    setSavedDocs([defaultMov])
                    localStorage.setItem(DOCS_KEY, JSON.stringify([defaultMov]))
                }
            } else {
                const defaultMov = {
                    id: 'doc-default-mov',
                    filename: 'demo.mov',
                    content: DEFAULT_MOV_URL,
                    createdAt: Date.now(),
                }
                setSavedDocs([defaultMov])
                localStorage.setItem(DOCS_KEY, JSON.stringify([defaultMov]))
            }
            const pf = localStorage.getItem('project-folder')
            if (pf) setProjectFolderItems(JSON.parse(pf))
            const uf = localStorage.getItem(FOLDERS_KEY)
            if (uf) setUserFolders(JSON.parse(uf))
        } catch {}
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
            id: `doc-${Date.now()}`,
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
            id: `doc-${Date.now()}`,
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
