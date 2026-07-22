"use client";

import React, { createContext, useContext, useState } from 'react'

interface AppContextValue {
    isNotificationsOpen: boolean
    setNotificationsOpen: (open: boolean) => void
    websiteMode: boolean
    compact: boolean
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isNotificationsOpen, setNotificationsOpen] = useState(false)

    return (
        <AppContext.Provider
            value={{
                isNotificationsOpen,
                setNotificationsOpen,
                websiteMode: false,
                compact: false,
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
