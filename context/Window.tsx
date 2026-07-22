"use client";

import React, { createContext, useContext } from 'react'

interface AppWindowSize {
    width?: string | number
    height?: string | number
}

interface AppWindow {
    path?: string
    meta?: { title?: string }
    size?: AppWindowSize
    appSettings?: { size?: { autoHeight?: boolean } }
}

interface ActiveInternalMenu {
    name?: string
}

interface WindowContextValue {
    appWindow: AppWindow | null
    activeInternalMenu: ActiveInternalMenu | null
}

const WindowContext = createContext<WindowContextValue>({
    appWindow: null,
    activeInternalMenu: null,
})

export function WindowProvider({ children }: { children: React.ReactNode }) {
    return (
        <WindowContext.Provider value={{ appWindow: null, activeInternalMenu: null }}>
            {children}
        </WindowContext.Provider>
    )
}

export function useWindow(): WindowContextValue {
    return useContext(WindowContext)
}
