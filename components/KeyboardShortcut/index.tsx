"use client";

import React from 'react'

interface KeyboardShortcutProps {
    text: string
    size?: 'xs' | 'sm' | 'md'
    className?: string
}

export default function KeyboardShortcut({ text, size = 'sm', className = '' }: KeyboardShortcutProps) {
    const sizeClass = size === 'xs' ? 'text-[10px] px-1 py-0.5' : 'text-xs px-1.5 py-0.5'
    return (
        <kbd className={`font-mono rounded border border-border bg-accent/50 text-muted ${sizeClass} ${className}`}>
            {text}
        </kbd>
    )
}
