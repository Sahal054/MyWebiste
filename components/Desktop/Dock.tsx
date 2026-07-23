"use client";

import React, { useState, useEffect } from 'react'
import { AppIcon, AppItem } from '../OSIcons/AppIcon'
import { useApp } from '../../context/App'

interface DockProps {
    apps: AppItem[]
}

// Which app labels have a managed "open" window in the OS
function useOpenApps() {
    const { isNewDocOpen } = useApp()
    return {
        'New Doc': isNewDocOpen,
    } as Record<string, boolean>
}

export default function Dock({ apps }: DockProps) {
    const openApps = useOpenApps()
    const { isNewDocOpen } = useApp()
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
            {apps.map((app, i) => (
                <button
                    key={i}
                    onClick={app.onClick}
                    className="p-2.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-colors group relative cursor-pointer flex flex-col items-center gap-0.5"
                    aria-label={`Open ${app.label}`}
                >
                    <AppIcon
                        name={app.label}
                        className="w-7 h-7 text-gray-800 dark:text-gray-100 group-hover:-translate-y-1 transition-transform"
                    />

                    {/* Active dot — shown when the app's window is open */}
                    <span
                        className={`w-1 h-1 rounded-full transition-all duration-300 ${
                            openApps[app.label]
                                ? 'bg-gray-800 dark:bg-white opacity-100 scale-100'
                                : 'opacity-0 scale-0'
                        }`}
                    />

                    {/* Tooltip */}
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-lg">
                        {app.label}
                    </span>
                </button>
            ))}
        </div>
    )
}
