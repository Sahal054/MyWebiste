"use client";

import * as React from 'react'
import { Menubar as RadixMenubar } from 'radix-ui'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ScrollArea from './ScrollArea'
import KeyboardShortcut from 'components/KeyboardShortcut'
import { useApp } from '../../context/App'

export type MenuItemType = {
    type: 'item' | 'submenu' | 'separator'
    label?: string
    link?: string
    shortcut?: string | string[]
    disabled?: boolean
    icon?: React.ReactNode
    items?: MenuItemType[]
    onClick?: () => void
    node?: React.ReactNode
    external?: boolean
    active?: boolean
    mobileDestination?: string | false
}

export type MenuType = {
    trigger: React.ReactNode
    bold?: boolean
    items: MenuItemType[]
    mobileLink?: string
    hideChevron?: boolean
}

const RootClasses = 'flex gap-px py-0.5 h-full'
const TriggerClasses = `group flex select-none items-center justify-between gap-0.5 rounded px-1.5 py-0.5 text-[13px] leading-none text-primary outline-none data-[highlighted]:bg-accent hover:bg-accent-2 data-[state=open]:bg-accent`
const ItemClasses = 'hover:bg-accent group relative flex h-[25px] select-none justify-between items-center rounded text-[13px] leading-none text-primary bg-primary outline-none data-[disabled]:pointer-events-none data-[disabled]:text-muted [&>span]:inline-flex [&>span]:w-full'
const SubTriggerClasses = 'hover:bg-accent group relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-primary bg-primary outline-none data-[disabled]:pointer-events-none data-[disabled]:text-muted'
const ContentClasses = 'bg-primary min-w-[180px] md:min-w-[220px] rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[transform,opacity] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)]'

const MenuItemContent = (item: MenuItemType, forceIconIndent?: boolean) => {
    const iconContent = item.icon ? (
        <span className="mr-2 flex items-center">{item.icon}</span>
    ) : forceIconIndent ? (
        <span style={{ display: 'inline-block', width: 16, minWidth: 16 }} className="mr-2" />
    ) : null

    return (
        <>
            {iconContent}
            {item.label}
            <div className="ml-auto pl-5 group-hover:text-secondary data-[highlighted]:text-secondary">
                <ChevronRight className="size-4" />
            </div>
        </>
    )
}

const MenuItem: React.FC<{
    portalContainer: HTMLElement | null
    appContainer: HTMLElement | null
    item: MenuItemType
    forceIconIndent?: boolean
    menuIndex: number
    onCloseMenu?: () => void
}> = ({ item, forceIconIndent, portalContainer, appContainer, onCloseMenu }) => {
    const router = useRouter();

    if (item.type === 'separator') {
        return <RadixMenubar.Separator className="m-[5px] h-px bg-border" />
    }

    if (item.node) {
        return (
            <RadixMenubar.Item className={ItemClasses} disabled={item.disabled} onClick={item.onClick}>
                {item.node}
            </RadixMenubar.Item>
        )
    }

    return (
        <RadixMenubar.Item
            className={`${ItemClasses} ${item.active ? 'bg-accent' : ''}`}
            disabled={item.disabled}
            onClick={() => {
                if (item.onClick) item.onClick();
                if (item.link) {
                    if (item.external) {
                        window.open(item.link, '_blank');
                    } else {
                        router.push(item.link);
                    }
                    onCloseMenu?.();
                }
            }}
        >
            <span className="px-2.5 flex w-full justify-between items-center gap-2">
                <span className="flex-1 flex items-center gap-2">
                    {item.icon ? item.icon : forceIconIndent ? <span style={{ width: 16 }} /> : null}
                    <span>{item.label}</span>
                </span>
                {item.shortcut && (
                    <div className="ml-auto pl-5 hidden md:block">
                        <KeyboardShortcut text={Array.isArray(item.shortcut) ? item.shortcut.join(' ') : item.shortcut} size="xs" />
                    </div>
                )}
            </span>
        </RadixMenubar.Item>
    )
}

export interface MenuBarProps {
    menus: MenuType[]
    className?: string
    triggerAsChild?: boolean
    showChevronDown?: boolean
}

const MenuBar: React.FC<MenuBarProps> = ({ menus, className, triggerAsChild, showChevronDown }) => {
    const [openMenuIndex, setOpenMenuIndex] = React.useState<number | null>(null)
    const rootRef = React.useRef<HTMLDivElement | null>(null)

    return (
        <RadixMenubar.Root
            ref={rootRef}
            data-scheme="tertiary"
            className={`${RootClasses} ${className || ''}`}
            value={openMenuIndex !== null ? String(openMenuIndex) : ''}
            onValueChange={(value) => setOpenMenuIndex(value ? Number(value) : null)}
        >
            {menus.map((menu, menuIndex) => (
                <RadixMenubar.Menu key={menuIndex} value={String(menuIndex)}>
                    <RadixMenubar.Trigger asChild={triggerAsChild} className={TriggerClasses}>
                        {menu.trigger}
                        {showChevronDown && !menu.hideChevron && <ChevronDown className="size-5 opacity-60 -mr-2" />}
                    </RadixMenubar.Trigger>
                    <RadixMenubar.Portal>
                        <RadixMenubar.Content className={ContentClasses} align="start" sideOffset={5}>
                            {menu.items.map((item, itemIndex) => (
                                <MenuItem
                                    key={`${menuIndex}-${itemIndex}`}
                                    item={item}
                                    menuIndex={menuIndex}
                                    portalContainer={null}
                                    appContainer={null}
                                    onCloseMenu={() => setOpenMenuIndex(null)}
                                />
                            ))}
                        </RadixMenubar.Content>
                    </RadixMenubar.Portal>
                </RadixMenubar.Menu>
            ))}
        </RadixMenubar.Root>
    )
}

export default MenuBar