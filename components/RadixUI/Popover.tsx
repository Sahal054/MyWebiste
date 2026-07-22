"use client";

import React, { useLayoutEffect, useRef, useState, useEffect, forwardRef } from 'react'
import { Popover as RadixPopover } from 'radix-ui'
import ScrollArea from 'components/RadixUI/ScrollArea'
import { X } from 'lucide-react'
import { useApp } from '../../context/App'

interface PopoverProps {
    trigger: React.ReactNode
    title?: string
    children: React.ReactNode
    dataScheme: string
    header?: boolean
    className?: string
    contentClassName?: string
    sideOffset?: number
    side?: 'top' | 'right' | 'bottom' | 'left'
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    ({ trigger, header, title, children, dataScheme, className = '', contentClassName = '', sideOffset = 5, side = 'bottom', open, onOpenChange }, ref) => {
        const scrollRef = useRef<HTMLDivElement>(null)
        const { websiteMode } = useApp()
        const [appContainer, setAppContainer] = useState<HTMLElement | null>(null)

        useEffect(() => {
            if (websiteMode) {
                setAppContainer(document.getElementById('app-container'))
            }
        }, [websiteMode])

        useLayoutEffect(() => {
            if (scrollRef.current) {
                const element = scrollRef.current
                element.style.display = 'none'
                element.offsetHeight 
                element.style.display = ''
            }
        }, [children])

        return (
            <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
                <RadixPopover.Trigger asChild className={className}>
                    {trigger}
                </RadixPopover.Trigger>
                <RadixPopover.Portal>
                    <RadixPopover.Content
                        collisionBoundary={appContainer}
                        ref={ref}
                        data-scheme={dataScheme}
                        className={`rounded p-1 bg-primary text-primary shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:animate-slideDownAndFade max-w-[100vw] z-50 ${contentClassName}`}
                        sideOffset={sideOffset}
                        align="center"
                        side={side}
                    >
                        <div className="flex flex-col gap-2.5 h-full">
                            {header && (
                                <div className="flex justify-between items-center">
                                    {title && <strong>{title}</strong>}
                                    <div className="flex items-center">
                                        <RadixPopover.Close aria-label="Close" asChild>
                                            <button className="hover:bg-accent rounded-sm p-0.5">
                                                <X className="size-4" />
                                            </button>
                                        </RadixPopover.Close>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef}>
                                <ScrollArea className="h-full">{children}</ScrollArea>
                            </div>
                        </div>
                        <RadixPopover.Arrow className="fill-primary" />
                    </RadixPopover.Content>
                </RadixPopover.Portal>
            </RadixPopover.Root>
        )
    }
)
Popover.displayName = 'Popover'