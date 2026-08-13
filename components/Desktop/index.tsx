"use client";

import React, { useRef, useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DraggableDesktopIcon from './DraggableDesktopIcon'
import Dock from './Dock'
import StickyNote from '../SickyNote'
import { AppItem } from '../OSIcons/AppIcon'
import { useApp } from '../../context/App'
import ContextMenu, { ContextMenuItemProps } from '../RadixUI/ContextMenu'
import { Check } from 'lucide-react'
import { storeMediaFile } from './mediaStorage'
import { CERTIFICATIONS_FOLDER_ID, CERTIFICATIONS_FOLDER_NAME } from '../../lib/certifications'

// ── Wallpaper presets ─────────────────────────────────────────────────────────
type GardenConfig = {
    lightTexture: string
    darkTexture: string
    illustration: string
}
const WALLPAPERS: {
    id: string; name: string; value: string; thumb: string | null;
    isUrl: boolean; color: string; gardenConfig?: GardenConfig
}[] = [
    {
        id: 'sandy',
        name: 'Default Garden',
        value: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png',
        thumb: 'https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_light_03a349af5c.png',
        isUrl: false, // 
        color: '#f5efe0',
        gardenConfig: {
            lightTexture: 'https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_light_03a349af5c.png',
            darkTexture: 'https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_dark_9ab088797a.png',
            illustration: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
        },
    },
    {
        id: 'xp',
        name: 'Windows XP',
        value: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1786567632/wp2660135-windows-95-wallpaper-hd_wzzsvd.jpg',
        thumb: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1786567632/wp2660135-windows-95-wallpaper-hd_wzzsvd.jpg',
        isUrl: true, // Keep true for the images
        color: '#1a1c23',
    },
    {
        id: '95',
        name: 'Vaporwave',
        value: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1786571773/wp2660154-windows-95-wallpaper-hd_ufwq12.jpg',
        thumb: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1786571773/wp2660154-windows-95-wallpaper-hd_ufwq12.jpg',
        isUrl: true, // Keep true for the images
        color: '#2d3250',
    },
]

const MEDIA_DEFAULTS: Record<string, string> = {
    'png': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'jpg': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'jpeg': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'gif': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'webp': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'mov': 'https://res.cloudinary.com/dyyfvzis2/video/upload/v1786568222/vlipsy-talk-show-laughing-hysterically-Uc0JpkND_nyt3va.mp4',
    'mp4': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'avi': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'webm': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
}

function WallpaperPicker({
    current, onPick, onClose,
}: {
    current: string | null
    onPick: (v: string | null) => void
    onClose: () => void
}) {
    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1e2130] border-2 border-black dark:border-gray-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] rounded-xl p-5 w-[340px]"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 dark:text-white">
                    Choose Wallpaper
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    {WALLPAPERS.map(wp => (
                        <button
                            key={wp.id}
                            onClick={() => { onPick(wp.value); onClose() }}
                            className="relative group flex flex-col items-center gap-1.5 focus:outline-none"
                        >
                            <div
                                className={`w-full h-16 rounded-lg border-2 overflow-hidden transition-all ${
                                    current === wp.value
                                        ? 'border-black dark:border-white scale-105 shadow-md'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400'
                                }`}
                                style={wp.isUrl
                                    ? { backgroundImage: `url(${wp.thumb ?? wp.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                    : { backgroundColor: wp.color }
                                }
                            >
                                {current === wp.value && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                        <Check className="w-4 h-4 text-white drop-shadow" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                                {wp.name}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Remove wallpaper */}
                {current && (
                    <button
                        onClick={() => { onPick(null); onClose() }}
                        className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
                    >
                        ✕ Remove wallpaper
                    </button>
                )}
            </div>
        </div>
    )
}

// ── Desktop ───────────────────────────────────────────────────────────────────
export default function Desktop() {
    const constraintsRef = useRef<HTMLDivElement>(null)
    const mediaInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const {
        setNotificationsOpen, toggleDarkMode, darkMode, wallpaper, setWallpaper,
        setDocOpen,
        setNewDocOpen, setNewDocMinimized, setOpenSavedDocId,
        savedDocs, moveToTrash, addSavedDoc, addMediaDoc,
        isTrashOpen, setTrashOpen, setTrashMinimized,
        setProjectsOpen, setProjectsMinimized,
        projectFolderItems, addToProjectFolder,
        userFolders, createFolder, addDocToFolder,
        setActiveFolderWindowId, setFolderWindowOpen, setFolderWindowMinimized,
        setMediaWindowOpen, setMediaWindowMinimized, setActiveMediaDocId,
        openPdfWindow,
        activeFolderWindowId,
        deleteFolder,
        addDocToCertifications,
        setContactOpen,
        setContactMinimized,
    } = useApp()
    const [showWallpaperPicker, setShowWallpaperPicker] = useState(false)
    const [newFolderPrompt, setNewFolderPrompt] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [addFilePrompt, setAddFilePrompt] = useState(false)
    const [newFileName, setNewFileName] = useState('')
    const [addDeviceMediaPrompt, setAddDeviceMediaPrompt] = useState(false)
    const [resetKey, setResetKey] = useState(0)

    const isMediaFilename = (name: string) => ['mov', 'mp4', 'avi', 'webm', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(name.toLowerCase().split('.').pop() ?? '')
    const isPdfFilename = (name: string) => name.toLowerCase().endsWith('.pdf')

    const openSavedItem = (docId: string) => {
        const doc = savedDocs.find(d => d.id === docId)
        if (!doc) return
        if (isMediaFilename(doc.filename)) {
            setActiveMediaDocId(doc.id)
            setMediaWindowMinimized(false)
            setMediaWindowOpen(true)
            return
        }
        if (isPdfFilename(doc.filename)) {
            openPdfWindow(doc.id)
            return
        }
        setNewDocMinimized(false)
        setOpenSavedDocId(doc.id)
        setNewDocOpen(true)
    }

    const [showMobileWarning, setShowMobileWarning] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            // Standard mobile breakpoint is 768px
            if (window.innerWidth < 768) {
                setShowMobileWarning(true)
            } else {
                setShowMobileWarning(false)
            }
        }
        
        // Check immediately on mount
        checkMobile() 
        
        // Listen for window resizing
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleDeviceMediaPick = async (file: File) => {
        const { storageKey, mimeType } = await storeMediaFile(file)
        addMediaDoc(file.name, storageKey, mimeType)
        setMediaWindowMinimized(false)
    }


    const desktopApps: AppItem[] = [
        { label: 'Resume',  iconUrl:'https://res.cloudinary.com/dmukukwp6/image/upload/typewriter_classic_3e6454d7f6.png',    Icon: null, onClick: () => setDocOpen(true) },
        { label: CERTIFICATIONS_FOLDER_NAME, Icon: null, iconUrl:'https://res.cloudinary.com/dmukukwp6/image/upload/folder_classic_d2fdf96f82.png', onClick: () => { setActiveFolderWindowId(CERTIFICATIONS_FOLDER_ID); setFolderWindowOpen(true); setFolderWindowMinimized(false) } },
        { label: 'Projects',Icon: null, iconUrl:'https://res.cloudinary.com/dmukukwp6/image/upload/document_bb8267664e.png', onClick: () => { setProjectsMinimized(false); setProjectsOpen(true) } },
        // { label: 'Spreadsheet', Icon: null, onClick: () => router.push('/experience') },
        // { label: 'Envelope',    Icon: null, iconUrl: 'https://res.cloudinary.com/dmukukwp6/image/upload/contact_4af3eed18f.png', onClick: () => { setContactMinimized(false); setContactOpen(true) } },
        { label: 'Trash', Icon: null, iconUrl: 'https://res.cloudinary.com/dmukukwp6/image/upload/trash_classic_20ed394a8d.png', onClick: () => { setTrashMinimized(false); setTrashOpen(true) } },
        
    ]

    const dockApps: AppItem[] = [
        {
            label: 'New Doc',
            Icon: null,
            iconUrl:'https://res.cloudinary.com/dmukukwp6/image/upload/doc_classic_7f14381c43.png',
            onClick: () => { setNewDocMinimized(false); setOpenSavedDocId(null); setNewDocOpen(true) },
        },
        { label: 'Server Stats', Icon: null, iconUrl:'https://res.cloudinary.com/dmukukwp6/image/upload/data_warehouse_classic_224c4dcd25.png', onClick: () => setNotificationsOpen(true) },
        { label: 'Envelope', Icon: null, iconUrl: 'https://res.cloudinary.com/dmukukwp6/image/upload/envelope_classic_8ccd5e8abc.png', onClick: () => { setContactMinimized(false); setContactOpen(true) } },
        { label: 'Trash',    Icon: null,  iconUrl: 'https://res.cloudinary.com/dmukukwp6/image/upload/trash_classic_20ed394a8d.png', onClick: () => { setTrashMinimized(false); setTrashOpen(true) }},
    ]

    const contextMenuItems: ContextMenuItemProps[] = [
        // {
        //     type: 'item',
        //     label: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        //     onClick: toggleDarkMode,
        // },

        { 
            type: 'item', 
            label: 'Reset icons', 
            onClick: () => setResetKey(prev => prev + 1) 
        },                              
        { type: 'separator' },
        { type: 'item', label: 'Change Wallpaper', onClick: () => setShowWallpaperPicker(true) },
        { type: 'separator' },
        { type: 'item', label: 'New Folder…', onClick: () => { setFolderName(''); setNewFolderPrompt(true) } },
        { type: 'item', label: 'Add File…', onClick: () => { setNewFileName(''); setAddFilePrompt(true) } },
        { type: 'item', label: 'Add Media From Device…', onClick: () => setAddDeviceMediaPrompt(true) },
    ]

    // Exclude trashed, in-projects-folder, and in-user-folder docs
    const savedDocApps: AppItem[] = savedDocs
        .filter(d => !d.trashed && !projectFolderItems.includes(d.id) && !userFolders.some(f => f.items.includes(d.id)))
        .map(doc => ({
            label: doc.filename,
            Icon: null,
            id: doc.id,
            isDeletable: true,
            onClick: () => openSavedItem(doc.id),
        }))





    useEffect(() => {
        const hasVisited = localStorage.getItem('has-visited-os')
               
        if (!hasVisited) {
            // Wait for App.tsx to populate the savedDocs, then find home.mdx
            const homeDoc = savedDocs.find(d => d.filename === 'home.mdx')
            
            if (homeDoc) {
                setOpenSavedDocId(homeDoc.id)
                setNewDocMinimized(false)
                setNewDocOpen(true)
                // Mark them as a returning visitor so this doesn't happen again
                localStorage.setItem('has-visited-os', 'true')
            }
        }
    }, [savedDocs, setOpenSavedDocId, setNewDocMinimized, setNewDocOpen])

    const activeGardenConfig = WALLPAPERS.find(w => w.value === wallpaper)?.gardenConfig ?? null

    // Build the background style from the stored wallpaper value
    const bgStyle: React.CSSProperties = wallpaper && !activeGardenConfig
        ? wallpaper.startsWith('#') || wallpaper.startsWith('rgb')
            ? { backgroundColor: wallpaper }
            : { backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {}

    return (
        <>
            <ContextMenu menuItems={contextMenuItems} className="w-full h-full">
                <div
                    ref={constraintsRef}
                    className="relative w-full h-screen overflow-hidden"
                    style={bgStyle}
                    data-scheme="primary"
                >
                    {/* --- POSTHOG STYLE WALLPAPER LAYOUT --- */}
                    {activeGardenConfig && (
                        <div className="absolute inset-0 pointer-events-none z-0">
                            {/* Light mode repeating texture */}
                            <div
                                className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-300"
                                style={{
                                    backgroundImage: `url('${activeGardenConfig.lightTexture}')`,
                                    backgroundSize: '100px 100px',
                                    backgroundRepeat: 'repeat',
                                }}
                            />
                            {/* Dark mode repeating texture */}
                            <div
                                className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
                                style={{
                                    backgroundImage: `url('${activeGardenConfig.darkTexture}')`,
                                    backgroundSize: '200px 200px',
                                    backgroundRepeat: 'repeat',
                                }}
                            />
                            {/* Illustration (Bottom Right) */}
                            <div
                                className="absolute"
                                style={{
                                    bottom: '16px',
                                    right: '16px',
                                    width: 'clamp(300px, 50vw, 750px)',
                                    zIndex: 10,
                                }}
                            >
                                <img
                                    loading="lazy"
                                    src={activeGardenConfig.illustration}
                                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                                    draggable={false}
                                    alt="Desktop illustration"
                                />
                            </div>
                        </div>
                    )}
                    {/* --- END WALLPAPER LAYOUT --- */}
                    <StickyNote />
                    <div key={resetKey} className="p-6 flex flex-col flex-wrap gap-6 h-full content-start">
                        {desktopApps.map((app, index) => (
                            <div
                                key={index}
                                className="relative w-24 h-24"
                                id={app.label === 'Trash' ? 'trash-desktop' : undefined}
                                data-folder-id={app.label === 'Projects' ? 'projects' : app.label === CERTIFICATIONS_FOLDER_NAME ? CERTIFICATIONS_FOLDER_ID : undefined}
                            >
                                <DraggableDesktopIcon app={app} constraintsRef={constraintsRef} />
                            </div>
                        ))}
                        {savedDocApps.map((app, index) => (
                            <div key={`saved-${index}`} className="relative w-24 h-24">
                                <DraggableDesktopIcon
                                    app={app}
                                    constraintsRef={constraintsRef}
                                    onDropOnTrash={moveToTrash}
                                    onDropOnFolder={(docId, folderId) => {
                                        if (folderId === 'projects') addToProjectFolder(docId)
                                        else if (folderId === CERTIFICATIONS_FOLDER_ID) addDocToCertifications(docId)
                                        else addDocToFolder(folderId, docId)
                                    }}
                                />
                            </div>
                        ))}
                        {userFolders.filter(folder => !folder.trashed).map(folder => (
                            <div
                                key={folder.id}
                                className="relative w-24 h-24"
                                data-folder-id={folder.id}
                            >
                                <DraggableDesktopIcon
                                    app={{
                                        label: folder.name,
                                        Icon: null,
                                        id: folder.id,
                                        isDeletable: true,
                                        onClick: () => { setActiveFolderWindowId(folder.id); setFolderWindowOpen(true); setFolderWindowMinimized(false) },
                                    }}
                                    constraintsRef={constraintsRef}
                                    onDropOnTrash={(folderId) => {
                                        deleteFolder(folderId)
                                        if (activeFolderWindowId === folderId) {
                                            setFolderWindowOpen(false)
                                            setActiveFolderWindowId(null)
                                            setFolderWindowMinimized(false)
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <Dock apps={dockApps} />
                </div>
            </ContextMenu>
            {showWallpaperPicker && (
                <WallpaperPicker
                    current={wallpaper}
                    onPick={setWallpaper}
                    onClose={() => setShowWallpaperPicker(false)}
                />
            )}

            {/* New Folder prompt */}
            {newFolderPrompt && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    onClick={() => setNewFolderPrompt(false)}
                >
                    <div
                        className="bg-white dark:bg-[#1e2130] border-2 border-black dark:border-gray-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] rounded-xl p-5 w-[280px]"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 dark:text-white">New Folder</h3>
                        <input
                            type="text"
                            value={folderName}
                            onChange={e => setFolderName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && folderName.trim()) {
                                    createFolder(folderName.trim())
                                    setNewFolderPrompt(false)
                                }
                                if (e.key === 'Escape') setNewFolderPrompt(false)
                            }}
                            placeholder="Folder name"
                            autoFocus
                            className="w-full border-2 border-black dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-[#2a2d3a] dark:text-white focus:outline-none focus:border-blue-500 mb-3"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setNewFolderPrompt(false)}
                                className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!folderName.trim()}
                                onClick={() => { if (folderName.trim()) { createFolder(folderName.trim()); setNewFolderPrompt(false) } }}
                                className="px-3 py-1.5 text-xs font-bold bg-black text-white dark:bg-white dark:text-black rounded-lg disabled:opacity-40 hover:opacity-80 transition-opacity"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Warning Prompt */}
            {showMobileWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center">
                    <div className="bg-white dark:bg-[#1e2130] border-2 border-black dark:border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold uppercase tracking-widest mb-3 dark:text-white">
                            Desktop Recommended
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                            This interactive OS portfolio is best experienced on a PC or laptop. The mobile view may be limited.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowMobileWarning(false)}
                                className="px-5 py-2.5 text-sm font-bold bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-80 transition-opacity w-full"
                            >
                                Continue anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add File prompt */}
            {addFilePrompt && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    onClick={() => setAddFilePrompt(false)}
                >
                    <div
                        className="bg-white dark:bg-[#1e2130] border-2 border-black dark:border-gray-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] rounded-xl p-5 w-[300px]"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-1 dark:text-white">Add File</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Use extensions like .png, .mov, .pdf for media icons.</p>
                        <input
                            type="text"
                            value={newFileName}
                            onChange={e => setNewFileName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && newFileName.trim()) {
                                    // FIX: Grab the correct media default URL when pressing Enter
                                    const ext = newFileName.trim().toLowerCase().split('.').pop() ?? ''
                                    const content = MEDIA_DEFAULTS[ext] ?? ''
                                    addSavedDoc(newFileName.trim(), content)
                                    setAddFilePrompt(false)
                                }
                                if (e.key === 'Escape') setAddFilePrompt(false)
                            }}
                            placeholder="photo.png, video.mov, notes"
                            autoFocus
                            className="w-full border-2 border-black dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-[#2a2d3a] dark:text-white focus:outline-none focus:border-blue-500 mb-3"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setAddFilePrompt(false)}
                                className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!newFileName.trim()}
                                onClick={() => {
                                    if (!newFileName.trim()) return
                                    const ext = newFileName.trim().toLowerCase().split('.').pop() ?? ''
                                    const content = MEDIA_DEFAULTS[ext] ?? ''
                                    addSavedDoc(newFileName.trim(), content)
                                    setAddFilePrompt(false)
                                }}
                                className="px-3 py-1.5 text-xs font-bold bg-black text-white dark:bg-white dark:text-black rounded-lg disabled:opacity-40 hover:opacity-80 transition-opacity"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {addDeviceMediaPrompt && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    onClick={() => setAddDeviceMediaPrompt(false)}
                >
                    <div
                        className="bg-white dark:bg-[#1e2130] border-2 border-black dark:border-gray-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] rounded-xl p-5 w-[320px]"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-2 dark:text-white">Add Media</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Pick an image, video, or PDF from your device. It will be saved as a desktop item.
                        </p>
                        <input
                            ref={mediaInputRef}
                            type="file"
                            accept="image/*,video/*,application/pdf"
                            className="hidden"
                            onChange={async e => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                try {
                                    await handleDeviceMediaPick(file)
                                    setAddDeviceMediaPrompt(false)
                                } catch {
                                    alert('Media upload failed. Check your Cloudinary upload preset and network connection.')
                                } finally {
                                    e.target.value = ''
                                }
                            }}
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setAddDeviceMediaPrompt(false)}
                                className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => mediaInputRef.current?.click()}
                                className="px-3 py-1.5 text-xs font-bold bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
                            >
                                Choose File
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
