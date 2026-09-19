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
        const check = () => setIsMobile(window.innerWidth < 640)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // Hide dock on mobile when a full-screen window is covering everything
    if (isMobile && isNewDocOpen) return null

return (
        <div className="safe-bottom fixed bottom-2 left-1/2 z-40 flex max-w-[calc(100vw-1rem)] w-fit -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-2xl border-2 border-black/60 bg-white/80 p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] backdrop-blur-md dark:border-white/20 dark:bg-black/40 sm:bottom-4 sm:gap-2 sm:p-2">
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
                        className={`group relative flex min-h-11 min-w-11 shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-xl p-1.5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 sm:p-2.5 ${
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
                                className={`h-9 w-9 object-contain transition-transform sm:h-10 sm:w-10 ${isTrashTargeted ? 'scale-105' : 'group-hover:-translate-y-1 group-focus-visible:-translate-y-1'}`}
                                draggable={false}
                            />
                        ) : (
                            <AppIcon
                                // If you have a 'Trash Open' SVG, this will swap to it. Otherwise, it uses the standard 'Trash'.
                                name={isTrashTargeted ? 'Trash Open' : app.label}
                                className={`h-7 w-7 transition-transform ${isTrashTargeted ? 'text-red-500' : 'text-gray-800 dark:text-gray-100 group-hover:-translate-y-1 group-focus-visible:-translate-y-1'}`}
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

                        <span className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">
                            {app.label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
 