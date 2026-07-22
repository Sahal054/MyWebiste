"use client";

import React from 'react'
import { X, Bell } from 'lucide-react'
import { useApp } from '../../context/App'
import ScrollArea from '../RadixUI/ScrollArea'
import { motion, AnimatePresence } from 'framer-motion'

// Interface for your notification data structure
export interface OSNotification {
    id: string
    title: string
    message: string
    time: string
    read: boolean
}

export default function NotificationsPanel() {
    // Assuming your App context manages the panel's open/close state.
    // If your context uses different variable names, update them here.
    const { isNotificationsOpen, setNotificationsOpen } = useApp()

    // Placeholder data - replace with your actual state or store logic
    const notifications: OSNotification[] = [
        {
            id: '1',
            title: 'Welcome to the OS',
            message: 'Your Next.js desktop environment is ready.',
            time: 'Just now',
            read: false,
        }
    ]

    return (
        <AnimatePresence>
            {isNotificationsOpen && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-4 right-4 w-80 h-[calc(100vh-2rem)] z-50 flex flex-col bg-background border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden"
                    data-scheme="primary"
                    data-app="Notifications"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b-2 border-primary bg-accent/10">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" strokeWidth={1.5} />
                            <h2 className="font-bold text-primary m-0 text-sm uppercase tracking-wider">Notifications</h2>
                        </div>
                        <button
                            onClick={() => setNotificationsOpen(false)}
                            className="p-1 hover:bg-black/10 rounded-md transition-colors cursor-pointer"
                            aria-label="Close notifications"
                        >
                            <X className="w-5 h-5 text-primary" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <ScrollArea className="flex-1 bg-background" fadeOverflow={8}>
                        <div className="p-4 flex flex-col gap-3">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-3 border-2 rounded-md transition-all ${
                                            notif.read
                                                ? 'border-gray-200 bg-gray-50 opacity-75'
                                                : 'border-primary bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                        }`}
                                    >
                                        <h3 className="text-sm font-bold m-0 mb-1 leading-tight">{notif.title}</h3>
                                        <p className="text-xs text-gray-600 m-0 mb-2 leading-relaxed">{notif.message}</p>
                                        <span className="text-[10px] text-gray-400 font-mono uppercase">
                                            {notif.time}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-10">
                                    <Bell className="w-8 h-8 mb-2 opacity-50" strokeWidth={1} />
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </motion.div>
            )}
        </AnimatePresence>
    )
}