"use client";

import React from 'react'

interface TooltipProps {
    content?: React.ReactNode | ((setOpen: (open: boolean) => void) => React.ReactNode)
    children: React.ReactNode
    className?: string
    tooltipClassName?: string
    offset?: [number, number]
    placement?: string
}

export default function Tooltip({ children }: TooltipProps) {
    return <>{children}</>
}
