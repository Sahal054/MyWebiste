"use client";

import React,{ useRef }  from 'react'
import { motion } from 'framer-motion'
import { AppIcon, AppItem } from '../OSIcons/AppIcon'
import { useApp } from '../../context/App'

interface DraggableDesktopIconProps {
    app: AppItem
    constraintsRef: React.RefObject<HTMLDivElement | null>
    onDropOnTrash?: (id: string) => void 
}

export default function DraggableDesktopIcon({ app, constraintsRef ,onDropOnTrash}: DraggableDesktopIconProps) {
    const { setIsHoveringTrash } = useApp();
    const isHoveringRef = useRef(false); // Tracks state without forcing re-renders

    // Helper function to check if cursor is over either trash can
const checkTrashIntersection = (info: any) => {
        const dockTrash = document.getElementById('trash-dock');
        const desktopTrash = document.getElementById('trash-desktop');

        const isOver = (el: HTMLElement | null) => {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            // Expanded hit area by 10px to make dropping easier
            return (
                info.point.x >= (rect.left - 10) && info.point.x <= (rect.right + 10) &&
                info.point.y >= (rect.top - 10) && info.point.y <= (rect.bottom + 10)
            );
        };

        return isOver(dockTrash) || isOver(desktopTrash);
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
        // 1. Reset hover visual state immediately
        isHoveringRef.current = false;
        setIsHoveringTrash(false);

        // 2. Process deletion if necessary
        if (!app.isDeletable || !app.id || !onDropOnTrash) return;

        if (checkTrashIntersection(info)) {
            onDropOnTrash(app.id);
        }
    };



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
            className="flex flex-col items-center justify-center w-24 h-24 gap-2 cursor-pointer group active:cursor-grabbing hover:bg-black/5 rounded-lg transition-colors absolute z-10"
        >
            <div className="w-14 h-14 flex items-center justify-center bg-white border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                {/* Dynamically loads the Lucide icon based on the app label */}
                <AppIcon name={app.label} className="w-8 h-8 text-primary" />
            </div>
            
            <span className="text-xs font-bold text-primary bg-background/80 px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-full text-center select-none border border-transparent group-hover:border-primary/20">
                {app.label}
            </span>
        </motion.div>
    )
}