"use client";

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DraggableDesktopIcon from './DraggableDesktopIcon'
import Dock from './Dock'
import { AppItem } from '../OSIcons/AppIcon'
import { useApp } from '../../context/App'
import ContextMenu, { ContextMenuItemProps } from '../RadixUI/ContextMenu'
import { Check } from 'lucide-react'

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
        name: 'Sandy Cream',
        value: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png',
        thumb: 'https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_light_03a349af5c.png',
        isUrl: false,
        color: '#f5efe0',
        gardenConfig: {
            lightTexture: 'https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_light_03a349af5c.png',
            darkTexture: 'https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_dark_9ab088797a.png',
            illustration: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
        },
    },
    {
        id: 'night',
        name: 'Night',
        value: '#1a1c23',
        thumb: null,
        isUrl: false,
        color: '#1a1c23',
    },
    {
        id: 'slate',
        name: 'Slate Blue',
        value: '#2d3250',
        thumb: null,
        isUrl: false,
        color: '#2d3250',
    },
]

const MEDIA_DEFAULTS: Record<string, string> = {
    'png': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'jpg': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'jpeg': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'gif': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'webp': 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png',
    'mov': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
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
    const router = useRouter()
    const {
        setNotificationsOpen, toggleDarkMode, darkMode, wallpaper, setWallpaper,
        setDocOpen,
        setNewDocOpen, setNewDocMinimized, setOpenSavedDocId,
        savedDocs, moveToTrash, addSavedDoc,
        isTrashOpen, setTrashOpen,
        setProjectsOpen,
        projectFolderItems, addToProjectFolder,
        userFolders, createFolder, addDocToFolder,
        setActiveFolderWindowId, setFolderWindowOpen, setFolderWindowMinimized,
        setMediaWindowOpen, setActiveMediaDocId,
    } = useApp()
    const [showWallpaperPicker, setShowWallpaperPicker] = useState(false)
    const [newFolderPrompt, setNewFolderPrompt] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [addFilePrompt, setAddFilePrompt] = useState(false)
    const [newFileName, setNewFileName] = useState('')

    const isMediaFilename = (name: string) => ['mov', 'mp4', 'avi', 'webm', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(name.toLowerCase().split('.').pop() ?? '')

    const openSavedItem = (docId: string) => {
        const doc = savedDocs.find(d => d.id === docId)
        if (!doc) return
        if (isMediaFilename(doc.filename)) {
            setActiveMediaDocId(doc.id)
            setMediaWindowOpen(true)
            return
        }
        setNewDocMinimized(false)
        setOpenSavedDocId(doc.id)
        setNewDocOpen(true)
    }


    const desktopApps: AppItem[] = [
        { label: 'Resume',      Icon: null, onClick: () => setDocOpen(true) },
        { label: 'Projects',    Icon: null, onClick: () => setProjectsOpen(true) },
        { label: 'Spreadsheet', Icon: null, onClick: () => router.push('/experience') },
        { label: 'Envelope',    Icon: null, onClick: () => router.push('/contact') },
        { label: 'Server Stats', Icon: null, onClick: () => setNotificationsOpen(true) },
        { label: 'Trash', Icon: null, iconUrl: 'https://res.cloudinary.com/dmukukwp6/image/upload/trash_classic_20ed394a8d.png', onClick: () => setTrashOpen(true) },
        
    ]

    const dockApps: AppItem[] = [
        {
            label: 'New Doc',
            Icon: null,
            onClick: () => { setNewDocMinimized(false); setOpenSavedDocId(null); setNewDocOpen(true) },
        },
        { label: 'Notebook', Icon: null, onClick: () => router.push('/projects') },
        { label: 'Envelope', Icon: null, onClick: () => router.push('/contact') },
        { label: 'Trash',    Icon: null, onClick: () => setTrashOpen(true)},
    ]

    const contextMenuItems: ContextMenuItemProps[] = [
        {
            type: 'item',
            label: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            onClick: toggleDarkMode,
        },
        { type: 'separator' },
        { type: 'item', label: 'Change Wallpaper', onClick: () => setShowWallpaperPicker(true) },
        { type: 'separator' },
        { type: 'item', label: 'New Folder…', onClick: () => { setFolderName(''); setNewFolderPrompt(true) } },
        { type: 'item', label: 'Add File…', onClick: () => { setNewFileName(''); setAddFilePrompt(true) } },
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
                    <div className="p-6 flex flex-col flex-wrap gap-6 h-full content-start">
                        {desktopApps.map((app, index) => (
                            <div
                                key={index}
                                className="relative w-24 h-24"
                                id={app.label === 'Trash' ? 'trash-desktop' : undefined}
                                data-folder-id={app.label === 'Projects' ? 'projects' : undefined}
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
                                        else addDocToFolder(folderId, docId)
                                    }}
                                />
                            </div>
                        ))}
                        {userFolders.map(folder => (
                            <div
                                key={folder.id}
                                className="relative w-24 h-24"
                                data-folder-id={folder.id}
                            >
                                <DraggableDesktopIcon
                                    app={{
                                        label: folder.name,
                                        Icon: null,
                                        onClick: () => { setActiveFolderWindowId(folder.id); setFolderWindowOpen(true); setFolderWindowMinimized(false) },
                                    }}
                                    constraintsRef={constraintsRef}
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
                                    addSavedDoc(newFileName.trim(), '')
                                    setAddFilePrompt(false)
                                }
                                if (e.key === 'Escape') setAddFilePrompt(false)
                            }}
                            placeholder="photo.png, video.mov, notes…"
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
        </>
    )
}
