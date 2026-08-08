"use client";

import React, { useState, useEffect } from 'react'
import { AppIcon, AppItem } from '../OSIcons/AppIcon'
import { useApp } from '../../context/App'

interface DockProps {
    apps: AppItem[]
}

// Which app labels have a managed "open" window in the OS
function useOpenApps() {
    const { isNewDocOpen, isContactOpen } = useApp()
    return {
        'New Doc': isNewDocOpen,
        'Envelope': isContactOpen,
    } as Record<string, boolean>
}

export default function Dock({ apps }: DockProps) {
    const openApps = useOpenApps()
    const { isNewDocOpen, isHoveringTrash } = useApp()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // Hide dock on mobile when a full-screen window is covering everything
    if (isMobile && isNewDocOpen) return null

return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-black/40 backdrop-blur-md border-2 border-black/60 dark:border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] rounded-2xl p-2 flex items-center gap-2 z-40 w-fit">
            {apps.map((app, i) => {
                // Determine if this specific button is the Trash and if it's currently being hovered by a dragged file
                const isTrash = app.label === 'Trash';
                const isTrashTargeted = isTrash && isHoveringTrash;

                return (
                    <button
                        key={i}
                        // Assign ID directly to the trash button for accurate collision detection
                        id={isTrash ? 'trash-dock' : undefined}
                        onClick={app.onClick}
                        className={`p-2.5 rounded-xl transition-all duration-200 group relative cursor-pointer flex flex-col items-center gap-0.5 ${
                            isTrashTargeted 
                                ? 'bg-red-500/20 scale-110 shadow-inner' // Active drop state
                                : 'hover:bg-black/10 dark:hover:bg-white/10' // Default hover state
                        }`}
                        aria-label={`Open ${app.label}`}
                    >
                        {app.iconUrl ? (
                            <img
                                src={app.iconUrl}
                                alt={app.label}
                                className={`w-10 h-10 object-contain transition-transform ${isTrashTargeted ? 'scale-105' : 'group-hover:-translate-y-1'}`}
                                draggable={false}
                            />
                        ) : (
                            <AppIcon
                                // If you have a 'Trash Open' SVG, this will swap to it. Otherwise, it uses the standard 'Trash'.
                                name={isTrashTargeted ? 'Trash Open' : app.label}
                                className={`w-7 h-7 transition-transform ${isTrashTargeted ? 'text-red-500' : 'text-gray-800 dark:text-gray-100 group-hover:-translate-y-1'}`}
                            />
                        )}
                        {/* Active dot — shown when the app's window is open */}
                        <span
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${
                                openApps[app.label]
                                    ? 'bg-gray-800 dark:bg-white opacity-100 scale-100'
                                    : 'opacity-0 scale-0'
                            }`}
                        />

                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-lg z-50">
                            {app.label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
 