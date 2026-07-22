"use client";

import { TooltipContent, TooltipContentProps } from 'components/GlossaryElement'
import Tooltip from 'components/Tooltip'
import NextLink from 'next/link'
import React, { useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import ContextMenu, { ContextMenuItemProps } from 'components/RadixUI/ContextMenu'
import { useApp } from '../../context/App'
import { useWindow } from '../../context/Window'

const createStandardMenuItems = (url: string, isExternal = false): ContextMenuItemProps[] => {
    const fullUrl = url?.startsWith('/') ? `https://yoursite.com${url}` : url
    return [
        {
            type: 'item',
            disabled: isExternal,
            children: isExternal ? (
                <span>Open in new window</span>
            ) : (
                <NextLink href={url} target="_blank">
                    Open in new window
                </NextLink>
            ),
        },
        {
            type: 'item',
            children: (
                <a href={url} target="_blank" rel="noreferrer">
                    Open in new browser tab
                </a>
            ),
        },
        {
            type: 'item',
            children: <span onClick={() => navigator.clipboard.writeText(fullUrl)}>Copy link address</span>,
        },
    ]
}

export interface Props {
    to?: string
    href?: string
    children: React.ReactNode
    className?: string
    wrapperClassName?: string
    onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => void
    disablePrefetch?: boolean
    external?: boolean
    externalNoIcon?: boolean
    iconClasses?: string
    glossary?: TooltipContentProps[]
    preview?: TooltipContentProps
    disabled?: boolean
    contextMenu?: boolean
    customMenuItems?: ContextMenuItemProps[]
    [key: string]: any 
}

const MenuWrapper = ({ children, menuItems, className = '' }: { children: React.ReactNode; menuItems: ContextMenuItemProps[]; className?: string }) => {
    return (
        <ContextMenu menuItems={menuItems} className={className}>
            {children}
        </ContextMenu>
    )
}

function resolveRelativeLink(url?: string, href?: string) {
    if (!url || !href) return url
    const mdRegex = /\.(md|mdx)(?=$|[?#])/
    const relativeRegex = /^\.\.?\//
    const isMarkdownLink = relativeRegex.test(url) && mdRegex.test(url)
    if (isMarkdownLink) {
        try {
            const urlObj = new URL(url, href)
            return urlObj.pathname.replace(mdRegex, '') + urlObj.search + urlObj.hash
        } catch {
            return url
        }
    }
    return url
}

export default function Link({
    to,
    href,
    children,
    className = '',
    wrapperClassName = '',
    disabled,
    onClick,
    disablePrefetch,
    external,
    externalNoIcon,
    iconClasses = '',
    glossary,
    contextMenu = true,
    customMenuItems = [],
    ...other
}: Props): React.JSX.Element {
    const { appWindow } = useWindow()
    const { compact } = useApp()
    
    // In Next.js App Router, we get the current path from usePathname() if needed, 
    // but for resolving relative links, standard window.location works for client components.
    const locationHref = typeof window !== 'undefined' ? window.location.href : ''
    const initialUrl = to || href
    const url = resolveRelativeLink(initialUrl, locationHref)

    const internal = !disablePrefetch && url && /^\/(?!\/)/.test(url)
    const isAppUrl = url && /(app)\.yoursite\.com/.test(url) 

    const preview =
        other.preview ||
        glossary?.find((glossaryItem) => {
            return glossaryItem?.slug === url?.replace(/https:\/\/yoursite.com/gi, '')
        })

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => {
        onClick && onClick(e)

        if (compact && url && !internal) {
            e.preventDefault()
            window.open(url, '_blank', 'noopener,noreferrer')
        }
    }

    const isExternal = Boolean(!internal || !!external || !!externalNoIcon || (url && !url.startsWith('/') && !url.includes('yoursite.com')))

    const menuItems =
        contextMenu && url
            ? [
                  ...createStandardMenuItems(url, isExternal),
                  ...(customMenuItems.length > 0 ? [{ type: 'separator' as const }, ...customMenuItems] : []),
              ]
            : []

    const content = !contextMenu || !url ? (
        <>
            {onClick && !url ? (
                <button onClick={handleClick} className={className} disabled={disabled}>
                    {children}
                </button>
            ) : internal ? (
                preview ? (
                    <Tooltip
                        tooltipClassName={compact ? 'hidden' : ''}
                        offset={[0, 0]}
                        placement="left-start"
                        content={(setOpen) => (
                            <TooltipContent
                                setOpen={setOpen}
                                title={preview.title}
                                slug={url}
                                description={preview.description}
                                video={preview.video}
                            />
                        )}
                    >
                        <NextLink {...other} href={url} className={className} onClick={handleClick}>
                            {children || null}
                        </NextLink>
                    </Tooltip>
                ) : (
                    <NextLink {...other} href={url} className={className} onClick={handleClick}>
                        {children}
                    </NextLink>
                )
            ) : (
                <a
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    {...other}
                    href={url}
                    className={`${className} group`}
                    target={external || externalNoIcon ? '_blank' : ''}
                >
                    {external ? (
                        <span className="inline-flex justify-center items-center group">
                            <span className="font-semibold underline">{children}</span>
                            <ArrowUpRight className={`size-4 text-muted group-hover:text-secondary relative ${iconClasses}`} />
                        </span>
                    ) : (
                        children
                    )}
                </a>
            )}
        </>
    ) : (
        <MenuWrapper menuItems={menuItems} className={wrapperClassName}>
             {onClick && !url ? (
                <button onClick={handleClick} className={className} disabled={disabled}>
                    {children}
                </button>
            ) : internal ? (
                <NextLink {...other} href={url} className={className} onClick={handleClick}>
                    {children}
                </NextLink>
            ) : (
                <a
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    {...other}
                    href={url}
                    className={`${className} group`}
                    target={external || externalNoIcon ? '_blank' : ''}
                >
                    {external ? (
                        <span className="inline-flex justify-center items-center group">
                            <span className="font-semibold underline">{children}</span>
                            <ArrowUpRight className={`size-4 text-muted group-hover:text-secondary relative ${iconClasses}`} />
                        </span>
                    ) : (
                        children
                    )}
                </a>
            )}
        </MenuWrapper>
    )

    return content
}