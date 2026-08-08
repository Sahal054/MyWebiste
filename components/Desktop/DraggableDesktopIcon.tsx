"use client";

import React,{ useRef }  from 'react'
import { motion } from 'framer-motion'
import { AppIcon, AppItem } from '../OSIcons/AppIcon'
import { useApp } from '../../context/App'

interface DraggableDesktopIconProps {
    app: AppItem
    constraintsRef: React.RefObject<HTMLDivElement | null>
    onDropOnTrash?: (id: string) => void
    onDropOnFolder?: (docId: string, folderId: string) => void
}

export default function DraggableDesktopIcon({ app, constraintsRef, onDropOnTrash, onDropOnFolder }: DraggableDesktopIconProps) {
    const { setIsHoveringTrash } = useApp();
    const isHoveringRef = useRef(false); // Tracks state without forcing re-renders
    const isTrash = app.label === 'Trash'


    // Helper function to check if cursor is over either trash can
const checkTrashIntersection = (info: any) => {
        const dockTrash = document.getElementById('trash-dock');
        const desktopTrash = document.getElementById('trash-desktop');
    const trashWindow = document.getElementById('trash-window');

        const isOver = (el: HTMLElement | null) => {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            // Expanded hit area by 10px to make dropping easier
            return (
                info.point.x >= (rect.left - 10) && info.point.x <= (rect.right + 10) &&
                info.point.y >= (rect.top - 10) && info.point.y <= (rect.bottom + 10)
            );
        };

        return isOver(dockTrash) || isOver(desktopTrash) || isOver(trashWindow);
    };

    // NEW: Fires continuously while dragging
    const handleDrag = (event: any, info: any) => {
        if (!app.isDeletable) return;
        
        const isIntersecting = checkTrashIntersection(info);
        
        // Only update the global context if the state actually changes
        if (isIntersecting !== isHoveringRef.current) {
            isHoveringRef.current = isIntersecting;
            setIsHoveringTrash(isIntersecting);
        }
    };

    // Checks if the mouse coordinates intersect with the Trash icon
    const handleDragEnd = (event: any, info: any) => {
        isHoveringRef.current = false
        setIsHoveringTrash(false)

        if (!app.isDeletable || !app.id) return

        if (checkTrashIntersection(info) && onDropOnTrash) {
            onDropOnTrash(app.id)
            return
        }

        // Folder drop detection — scans folder icons and open folder windows.
        if (onDropOnFolder) {
            const folderEls = document.querySelectorAll('[data-folder-id], [data-folder-window-id]')
            for (const el of Array.from(folderEls)) {
                const r = el.getBoundingClientRect()
                const hit = info.point.x >= r.left - 10 && info.point.x <= r.right + 10 &&
                            info.point.y >= r.top - 10 && info.point.y <= r.bottom + 10
                if (hit) {
                    const folderId = el.getAttribute('data-folder-id') ?? el.getAttribute('data-folder-window-id')
                    if (folderId) onDropOnFolder(app.id, folderId)
                    return
                }
            }
        }
    }



    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDrag={handleDrag}       // NEW: Track drag in real time
            onDragEnd={handleDragEnd}
            onDoubleClick={app.onClick}
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
            <span className={`text-xs font-bold text-primary truncate max-w-full text-center select-none border border-transparent 'bg-transparent px-0 py-0 rounded-none`}>
                {app.label}
            </span>
        </motion.div>
    )
}