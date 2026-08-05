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
// Add or replace any of these three URLs with your own Cloudinary links.
const WALLPAPERS: { id: string; name: string; value: string; thumb: string | null; isUrl: boolean; color: string }[] = [
    {
        id: 'sandy',
        name: 'Sandy Cream',
        value: 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png',
        thumb: 'https://res.cloudinary.com/dyyfvzis2/image/upload/w_1401,h_1400,c_fill/v1784807608/BgImageLight_xrzkez.png',
        isUrl: true,
        color: '',
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
        savedDocs, deleteDoc,
        isTrashOpen,setTrashOpen,
        setProjectsOpen,setProjectsMinimized,
        websiteMode,clearAllDocs
    } = useApp()
    const [showWallpaperPicker, setShowWallpaperPicker] = useState(false)


    const desktopApps: AppItem[] = [
        { label: 'Resume',      Icon: null, onClick: () => setDocOpen(true) },
        { label: 'Projects',    Icon: null, onClick: () => setProjectsOpen(true)  },
        { label: 'Spreadsheet', Icon: null, onClick: () => router.push('/experience') },
        { label: 'Envelope',    Icon: null, onClick: () => router.push('/contact') },
        { label: 'Server Stats',      Icon: null, onClick: () => setNotificationsOpen(true) },
        { label: 'Trash',    Icon: null, onClick: () => setTrashOpen(true)},
        
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
        {
            type: 'item',
            label: 'Change Wallpaper',
            onClick: () => setShowWallpaperPicker(true),
        },
    ]

    // Build saved-doc icon items — each creates a desktop file that opens in the editor
    const savedDocApps: AppItem[] = savedDocs.map(doc => ({
        label: doc.filename,
        Icon: null,
        id: doc.id,
        isDeletable:true,

        
        onClick: () => { setNewDocMinimized(false); setOpenSavedDocId(doc.id); setNewDocOpen(true) },
    }))

    const isGardenTheme = wallpaper === 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png';

    // Build the background style from the stored wallpaper value
    const bgStyle: React.CSSProperties = wallpaper  && !isGardenTheme
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
                    {isGardenTheme && (
                        <div className="absolute inset-0 pointer-events-none z-0">
                            {/* Light mode repeating texture */}
                            <div
                                className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-300"
                                style={{
                                    backgroundImage: "url('https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_light_03a349af5c.png')",
                                    backgroundSize: '100px 100px',
                                    backgroundRepeat: 'repeat',
                                }}
                            />
                            {/* Dark mode repeating texture */}
                            <div
                                className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
                                style={{
                                    backgroundImage: "url('https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_dark_9ab088797a.png')",
                                    backgroundSize: '200px 200px',
                                    backgroundRepeat: 'repeat',
                                }}
                            />

                            {/* Main Garden Graphic (Bottom Right) */}
                            {/* <div className={`absolute bottom-0 right-0 md:bottom-4 md:right-4`}>
                                <img
                                    loading="lazy"
                                    src="https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_light_opt_compressed_5094746caf.png"
                                    width={1401}
                                    height={1400}
                                    // Replaced size-* with explicit width and h-auto
                                    className={"w-[350px] md:w-[750px] h-auto'} dark:hidden object-contain"}
                                    draggable={false}
                                    alt="Sahal Tech Garden"
                                />
                            </div> */}

                            {/* Main Garden Graphic (Bottom Right) */}
                                <div 
                                    className="absolute"
                                    style={{
                                        bottom: '16px',
                                        right: '16px',
                                        width: 'clamp(300px, 50vw, 750px)',
                                        zIndex: 10
                                    }}
                                >
                                    <img
                                        loading="lazy"
                                        src="https://res.cloudinary.com/dyyfvzis2/image/upload/v1784988973/BgImageLight-removebgreal_tipb9u.png"
                                        style={{ 
                                            width: '100%', 
                                            height: 'auto', 
                                            display: 'block',
                                            objectFit: 'contain'
                                        }}
                                        draggable={false}
                                        alt="Sahal Tech Garden"
                                    />
                                </div>
                        </div>
                    )}
                    {/* --- END WALLPAPER LAYOUT --- */}
                    <div className="p-6 flex flex-col flex-wrap gap-6 h-full content-start">
                        {desktopApps.map((app, index) => (
                            // Add an ID to the desktop trash icon so we can detect drops!
                            <div key={index} className="relative w-24 h-24" id={app.label === 'Trash' ? 'trash-desktop' : undefined}>
                                <DraggableDesktopIcon app={app} constraintsRef={constraintsRef} />
                            </div>
                        ))}
                        {savedDocApps.map((app, index) => (
                            <div key={`saved-${index}`} className="relative w-24 h-24">
                                {/* Pass the delete function down */}
                                <DraggableDesktopIcon app={app} constraintsRef={constraintsRef} onDropOnTrash={deleteDoc} />
                            </div>
                        ))}
                    </div>

                    {/* Important: You will need to pass an ID to the Trash icon inside your Dock.tsx file too! */}
                    <div id="trash-dock">
                        <Dock apps={dockApps} />
                    </div>
                </div>
            </ContextMenu>
           {/* NEW: The Trash Manager Modal */}
            {isTrashOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setTrashOpen(false)}>
                    <div className="bg-white dark:bg-[#1e2130] w-[400px] max-h-[60vh] flex flex-col rounded-xl shadow-2xl border-2 border-black/40 overflow-hidden" onClick={e => e.stopPropagation()}>
                        
                        {/* Header */}
                        <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-black/30 border-b border-gray-200 dark:border-white/10">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                🗑️ Trash Manager
                            </h3>
                            <button onClick={() => setTrashOpen(false)} className="text-gray-500 hover:text-red-500 font-bold">✕</button>
                        </div>

                        {/* File List */}
                        <div className="p-4 flex-1 overflow-y-auto">
                            {savedDocs.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm font-medium">Trash is empty. All documents are safe.</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {savedDocs.map(doc => (
                                        <li key={doc.id} className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate pr-4">{doc.filename}</span>
                                            <button 
                                                onClick={() => deleteDoc(doc.id)} 
                                                className="px-3 py-1 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-900/30 dark:hover:bg-red-500 dark:text-red-400 text-xs rounded transition-colors font-bold"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer Action */}
                        {savedDocs.length > 0 && (
                            <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                                <button 
                                    onClick={clearAllDocs}
                                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold shadow transition-colors"
                                >
                                    Empty Trash (Delete All)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showWallpaperPicker && (
                <WallpaperPicker
                    current={wallpaper}
                    onPick={setWallpaper}
                    onClose={() => setShowWallpaperPicker(false)}
                />
            )}
        </>
    )
}
