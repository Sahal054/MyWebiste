"use client";

import React, { useRef } from 'react'
import { useRouter } from 'next/navigation'
import DraggableDesktopIcon from './DraggableDesktopIcon'
import Dock from './Dock'
import { AppItem } from '../OSIcons/AppIcon'
import { useApp } from '../../context/App'

export default function Desktop() {
    // Defines the boundary for the drag-and-drop physics
    const constraintsRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    
    // Assuming you have this context for handling global OS states like menus or modals
    const { setNotificationsOpen } = useApp() 

    // Define your desktop apps here. The 'label' strings must match the cases in AppIcon.tsx
    const desktopApps: AppItem[] = [
        { label: 'Doc', Icon: null, onClick: () => router.push('/about') },
        { label: 'Notebook', Icon: null, onClick: () => router.push('/projects') },
        { label: 'Spreadsheet', Icon: null, onClick: () => router.push('/experience') },
        { label: 'Envelope', Icon: null, onClick: () => router.push('/contact') },
        { label: 'Forums', Icon: null, onClick: () => setNotificationsOpen(true) },
        { label: 'Trash', Icon: null, onClick: () => console.log('Emptying trash...') },
    ]

    return (
        <div 
            ref={constraintsRef} 
            className="relative w-full h-[calc(100vh-3rem)] overflow-hidden bg-background bg-cover bg-center"
            data-scheme="primary"
        >
            {/* 
              This container manages the initial grid layout for icons.
              Once dragged, framer-motion handles the absolute positioning.
            */}
            <div className="p-6 flex flex-col flex-wrap gap-6 h-full content-start">
                {desktopApps.map((app, index) => (
                    <div key={index} className="relative w-24 h-24">
                        <DraggableDesktopIcon app={app} constraintsRef={constraintsRef} />
                    </div>
                ))}
            </div>

            {/* Render the Dock (typically visible on mobile or fixed at the bottom) */}
            <Dock apps={desktopApps} />
        </div>
    )
}