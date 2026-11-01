"use client";

import React from 'react'

export const WindowDragBoundary = React.forwardRef<HTMLDivElement>(function WindowDragBoundary(_, ref) {
    return <div ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
})
