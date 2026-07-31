"use client";

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface SavedDoc {
    id: string
    filename: string
    content: string
    createdAt: number
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

    // Projects Window

    isProjectsOpen:boolean
    setProjectsOpen:(open:boolean) => void
    isProjectsMinimized: boolean
    setProjectsMinimized:(open:boolean) => void
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
    updateSavedDoc: (id: string, content: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const SANDY_CREAM_URL = 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png'
const DOCS_KEY = 'user-docs'

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

    useEffect(() => {
        const savedDark = localStorage.getItem('darkMode') === 'true'
        const savedWallpaper = localStorage.getItem('wallpaper')
        setDarkMode(savedDark)
        setWallpaperState(savedWallpaper ?? SANDY_CREAM_URL)
        try {
            const raw = localStorage.getItem(DOCS_KEY)
            if (raw) setSavedDocs(JSON.parse(raw))
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
            filename: filename.endsWith('.mdx') ? filename : `${filename}.mdx`,
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

    const clearAllDocs = () =>{
        setSavedDocs([])
        localStorage.removeItem(DOCS_KEY)
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
                updateSavedDoc,
                isProjectsOpen,
                setProjectsOpen,
                isProjectsMinimized,
                setProjectsMinimized,
                clearAllDocs,
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
