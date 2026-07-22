"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { AppIcon, AppItem } from '../OSIcons/AppIcon'

interface DraggableDesktopIconProps {
    app: AppItem
    constraintsRef: React.RefObject<HTMLDivElement | null>
}

export default function DraggableDesktopIcon({ app, constraintsRef }: DraggableDesktopIconProps) {
    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDoubleClick={app.onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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