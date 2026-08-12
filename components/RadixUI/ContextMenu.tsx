"use client";

import * as React from 'react'
import { ContextMenu as RadixContextMenu } from 'radix-ui'

export interface ContextMenuItemProps {
    type: 'item' | 'separator'
    label?: string
    onClick?: () => void
    disabled?: boolean
    children?: React.ReactNode
    shortcut?: string[]
}

export interface ContextMenuProps {
    children: React.ReactNode
    menuItems: ContextMenuItemProps[]
    className?: string
}

const ContextMenu = ({ children, menuItems, className }: ContextMenuProps) => {
    const TriggerClasses = className || ''
    
    // PostHog Dark Theme Content Wrapper
    const ContentClasses = 'min-w-[220px] bg-[#1d1f27] text-[#e2e2e4] border border-white/10 rounded-xl p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden font-medium text-[13px] z-[100] animate-in fade-in zoom-in-95 duration-100'
    
    // PostHog Dark Theme Item Wrapper
    const ItemClasses = 'group relative flex h-[32px] select-none items-center justify-between rounded-lg px-3 text-[13px] leading-none text-[#e2e2e4] outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-white/10 transition-colors cursor-pointer'
    
    // Subtle Dark Theme Separator
    const SeparatorClasses = 'm-[5px] h-px bg-white/10'

    return (
        <RadixContextMenu.Root>
            <RadixContextMenu.Trigger className={TriggerClasses}>{children}</RadixContextMenu.Trigger>

            <RadixContextMenu.Portal>
                {/* Removed data-scheme="primary" so your light mode settings don't override the dark menu */}
                <RadixContextMenu.Content className={ContentClasses}>
                    {menuItems.map((item, index) => {
                        if (item.type === 'separator') {
                            return <RadixContextMenu.Separator key={index} className={SeparatorClasses} />
                        }

                        return (
                            <RadixContextMenu.Item
                                key={index}
                                className={ItemClasses}
                                disabled={item.disabled}
                                onSelect={(e) => {
                                    item.onClick?.()
                                    
                                    // Preserved your original Escape event hack!
                                    setTimeout(() => {
                                        const escapeEvent = new KeyboardEvent('keydown', {
                                            key: 'Escape',
                                            bubbles: true,
                                        })
                                        document.dispatchEvent(escapeEvent)
                                    }, 0)
                                }}
                            >
                                <span>{item.children || item.label}</span>
                                
                                {/* Custom Dark Mode Shortcut Boxes */}
                                {item.shortcut && (
                                    <div className="flex gap-1">
                                        {item.shortcut.map((key, i) => (
                                            <span key={i} className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-md bg-white/5 border border-white/10 text-gray-400 text-[11px] font-mono leading-none pt-0.5">
                                                {key}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </RadixContextMenu.Item>
                        )
                    })}
                </RadixContextMenu.Content>
            </RadixContextMenu.Portal>
        </RadixContextMenu.Root>
    )
}

export default ContextMenu