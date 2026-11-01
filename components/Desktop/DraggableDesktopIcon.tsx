"use client";
import React, { useRef, useState, useEffect } from 'react'
import { motion, PanInfo, useAnimationControls, useMotionValue } from 'framer-motion'
import { AppIcon, AppItem } from '../OSIcons/AppIcon'
import { useApp } from '../../context/App'

interface DraggableDesktopIconProps {
    app: AppItem
    constraintsRef: React.RefObject<HTMLDivElement | null>
    onDropOnTrash?: (id: string) => void
    onDropOnFolder?: (docId: string, folderId: string) => void
}

export default function DraggableDesktopIcon({ app, constraintsRef, onDropOnTrash, onDropOnFolder }: DraggableDesktopIconProps) {
    const { setIsHoveringTrash,wallpaper } = useApp();
    const isHoveringRef = useRef(false); // Tracks state without forcing re-renders
    const didDragRef = useRef(false)
    const lastTapRef = useRef(0)
    const controls = useAnimationControls()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const DEFAULT_WALLPAPER = 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png';
    const isCustomTheme = wallpaper !== null && wallpaper !== DEFAULT_WALLPAPER;
    const isPdf = app.label.toLowerCase().endsWith('.pdf')
    const isFolder = app.isFolder === true
    const handleMobileDoubleTap = (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault()
        const now = Date.now()
        if (now - lastTapRef.current < 450) {
            lastTapRef.current = 0
            app.onClick?.()
            return
        }
        lastTapRef.current = now
    }


    const getDraggedRect = (event: unknown): DOMRect | null => {
        const target = (event as { currentTarget?: EventTarget | null }).currentTarget
        return target instanceof HTMLElement ? target.getBoundingClientRect() : null
    }

    // Treat a drop as a hit when the dragged icon overlaps a trash target.
    const checkTrashIntersection = (event: unknown, info: PanInfo) => {
        const dockTrash = document.getElementById('trash-dock');
        const desktopTrash = document.getElementById('trash-desktop');
        const trashWindow = document.getElementById('trash-window');
        const draggedRect = getDraggedRect(event)

        const isOver = (el: HTMLElement | null) => {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            if (draggedRect) {
                return draggedRect.left < rect.right && draggedRect.right > rect.left &&
                    draggedRect.top < rect.bottom && draggedRect.bottom > rect.top
            }
            return info.point.x >= rect.left && info.point.x <= rect.right &&
                info.point.y >= rect.top && info.point.y <= rect.bottom
        };

        return isOver(dockTrash) || isOver(desktopTrash) || isOver(trashWindow);
    };

    const updateDropTargetHighlight = (event: unknown, info: PanInfo, includeFolders = true) => {
        const draggedRect = getDraggedRect(event)
        const draggedElement = (event as { currentTarget?: EventTarget | null }).currentTarget
        const selector = includeFolders
            ? '[data-folder-id], #trash-desktop, #trash-dock, #trash-window'
            : '#trash-desktop, #trash-dock, #trash-window'
        const targets = document.querySelectorAll<HTMLElement>(selector)
        targets.forEach(target => {
            if (target === draggedElement) return
            const rect = target.getBoundingClientRect()
            const isOver = draggedRect
                ? draggedRect.left < rect.right && draggedRect.right > rect.left &&
                    draggedRect.top < rect.bottom && draggedRect.bottom > rect.top
                : info.point.x >= rect.left && info.point.x <= rect.right &&
                    info.point.y >= rect.top && info.point.y <= rect.bottom
            target.classList.toggle(
                target.id === 'trash-dock' ? 'drop-target-retro-trash' : 'drop-target-retro',
                isOver,
            )
        })
    }

    const clearDropTargetHighlight = () => {
        document.querySelectorAll<HTMLElement>('[data-folder-id], #trash-desktop, #trash-dock, #trash-window')
            .forEach(target => target.classList.remove('drop-target-retro', 'drop-target-retro-trash'))
    }

    // Fires continuously while dragging
    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!app.isDeletable) {
            clearDropTargetHighlight()
            return
        }
        
        const isIntersecting = checkTrashIntersection(event, info);
        updateDropTargetHighlight(event, info, !isFolder)
        
        // Only update the global context if the state actually changes
        if (isIntersecting !== isHoveringRef.current) {
            isHoveringRef.current = isIntersecting;
            setIsHoveringTrash(isIntersecting);
        }
    };

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640)
        check()
        window.addEventListener('resize', check)
        window.addEventListener('blur', clearDropTargetHighlight)
        return () => {
            window.removeEventListener('resize', check)
            window.removeEventListener('blur', clearDropTargetHighlight)
            clearDropTargetHighlight()
        }
    }, [])

    // Checks if the mouse coordinates intersect with the Trash icon
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        isHoveringRef.current = false
        setIsHoveringTrash(false)
        clearDropTargetHighlight()

        if (app.isDeletable && app.id && checkTrashIntersection(event, info) && onDropOnTrash) {
            onDropOnTrash(app.id)
            return
        }

        // Folder drop detection — scans folder icons and open folder windows.
        if (app.id && onDropOnFolder) {
            const folderEls = document.querySelectorAll('[data-folder-id], [data-folder-window-id]')
            for (const el of Array.from(folderEls)) {
                                const draggedRect = getDraggedRect(event)
                                const r = el.getBoundingClientRect()
                                const hit = draggedRect
                                        ? draggedRect.left < r.right && draggedRect.right > r.left &&
                                            draggedRect.top < r.bottom && draggedRect.bottom > r.top
                                        : info.point.x >= r.left && info.point.x <= r.right &&
                                            info.point.y >= r.top && info.point.y <= r.bottom
                if (hit) {
                    const folderId = el.getAttribute('data-folder-id') ?? el.getAttribute('data-folder-window-id')
                    if (folderId) onDropOnFolder(app.id, folderId)
                    return
                }
            }
        }

        const iconId = app.id ?? app.label
        const draggedElement = document.querySelector(`[data-desktop-icon-id="${CSS.escape(iconId)}"]`)
        if (!(draggedElement instanceof HTMLElement)) return

        const draggedRect = draggedElement.getBoundingClientRect()
        const desktopRect = constraintsRef.current?.getBoundingClientRect()
        if (!desktopRect) return

        const otherRects = Array.from(document.querySelectorAll('[data-desktop-icon-id]'))
            .filter(element => element !== draggedElement)
            .map(element => element.getBoundingClientRect())
        const overlaps = (rect: DOMRect) => otherRects.some(other =>
            rect.left < other.right &&
            rect.right > other.left &&
            rect.top < other.bottom &&
            rect.bottom > other.top
        )

        if (!overlaps(draggedRect)) return

        const gap = 8
        const clampPosition = (position: { left: number; top: number }) => ({
            left: Math.max(desktopRect.left, Math.min(position.left, desktopRect.right - draggedRect.width)),
            top: Math.max(desktopRect.top, Math.min(position.top, desktopRect.bottom - draggedRect.height)),
        })
        const candidates = otherRects.flatMap(other => [
            { left: other.right + gap, top: draggedRect.top },
            { left: other.left - draggedRect.width - gap, top: draggedRect.top },
            { left: draggedRect.left, top: other.bottom + gap },
            { left: draggedRect.left, top: other.top - draggedRect.height - gap },
        ]).map(clampPosition)
        const candidate = candidates
            .filter(position => !overlaps(new DOMRect(position.left, position.top, draggedRect.width, draggedRect.height)))
            .sort((a, b) => {
                const distanceA = Math.hypot(a.left - draggedRect.left, a.top - draggedRect.top)
                const distanceB = Math.hypot(b.left - draggedRect.left, b.top - draggedRect.top)
                return distanceA - distanceB
            })[0]

        if (candidate) {
            void controls.start({
                x: x.get() + candidate.left - draggedRect.left,
                y: y.get() + candidate.top - draggedRect.top,
                transition: { type: 'spring', stiffness: 500, damping: 35 },
            })
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (didDragRef.current) {
            event.preventDefault()
            didDragRef.current = false
            return
        }
        app.onClick?.()
    }


    return (
        <motion.div
            data-desktop-icon-id={app.id ?? app.label}
            data-folder-id={isFolder && app.id ? app.id : undefined}
            id={app.label === 'Trash' ? 'trash-desktop' : undefined}
            drag={!isMobile}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            animate={controls}
            style={{ x, y }}
            onDragStart={() => { didDragRef.current = true }}
            onDrag={handleDrag}       //    Track drag in real time
            onDragEnd={handleDragEnd}
            onClick={!isMobile && isPdf && !isFolder ? handleClick : undefined}
            onDoubleClick={!isMobile && (isFolder || !isPdf) ? app.onClick : undefined}
            onPointerUp={isMobile ? handleMobileDoubleTap : undefined}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            whileDrag={{ zIndex: 50, scale: 1.05 }}
            // className={`flex flex-col items-center justify-center w-24 h-24 gap-2 cursor-pointer group active:cursor-grabbing transition-colors absolute z-10 ${isPlainImageIcon ? 'hover:bg-transparent' : 'hover:bg-black/5 rounded-lg'}`}
                    // className={`flex flex-col items-center justify-center w-24 h-24 gap-2 cursor-pointer group active:cursor-grabbing transition-colors absolute z-10 hover:bg-black/4 rounded-lg`}

            className={`flex flex-col items-center justify-center w-24 h-24 gap-2 cursor-pointer group active:cursor-grabbing transition-colors absolute z-10 hover:bg-black/4 rounded-lg`}
        >
            {/* <div className={`flex items-center justify-center overflow-hidden ${isPlainImageIcon ? 'w-12 h-12 bg-transparent border-0 shadow-none rounded-none' : 'w-14 h-14 bg-white border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'}`}></div> */}
            <div className={`flex items-center justify-center overflow-hidden 'w-12 h-12 bg-transparent border-0 shadow-none rounded-none group-hover:shadow-[0.5px_0.5px_0.5px_0.5px_rgba(0,0,0,1)] transition-shadow'}`}>
                {app.iconUrl ? (
                    <img src={app.iconUrl} alt={app.label} className={ 'w-12 h-12 object-contain'} draggable={false} />
                ) : (
                    <AppIcon name={app.label} className="w-8 h-8 text-primary" />
                )}
            </div>
            {/* <span className={`text-xs font-bold text-primary truncate max-w-full text-center select-none border border-transparent ${isPlainImageIcon ? 'bg-transparent px-0 py-0 rounded-none' : 'bg-background/80 px-2 py-0.5 rounded backdrop-blur-sm group-hover:border-primary/20'}`}></span> */}
            {/* <span className={`text-xs font-bold text-primary truncate max-w-full text-center select-none border border-transparent 'bg-transparent px-0 py-0 rounded-none`}> */}
            <span 
                className={`text-[11px] font-bold tracking-wide truncate max-w-full text-center select-none px-1 ${
                    isCustomTheme ? 'text-white' : 'text-primary'
                }`}
                style={isCustomTheme ? { textShadow: '0px 1px 3px rgba(0,0,0,0.8), 0px 1px 1px rgba(0,0,0,0.8)' } : {}}
            >
                {app.label}
            </span>
        </motion.div>
    )
}