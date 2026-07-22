"use client";

import React from 'react'
import { AppIcon, AppItem } from '../OSIcons/AppIcon'

interface DockProps {
    apps: AppItem[]
}

export default function Dock({ apps }: DockProps) {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-2 flex items-center gap-2 z-40 overflow-x-auto max-w-[90vw]">
            {apps.map((app, i) => (
                <button
                    key={i}
                    onClick={app.onClick}
                    className="p-3 hover:bg-black/10 rounded-xl transition-colors group relative cursor-pointer"
                    aria-label={`Open ${app.label}`}
                >
                    <AppIcon 
                        name={app.label} 
                        className="w-7 h-7 text-primary group-hover:-translate-y-1 transition-transform" 
                    />
                    
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {app.label}
                    </span>
                </button>
            ))}
        </div>
    )
}