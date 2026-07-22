"use client";

import React from 'react'

export interface TooltipContentProps {
    term?: string
    slug?: string
    title?: string
    description?: string
    video?: string
    setOpen?: (open: boolean) => void
    children?: React.ReactNode
    className?: string
}

export function TooltipContent({ children }: TooltipContentProps) {
    return <>{children}</>
}
