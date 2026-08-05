"use client";

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { useApp } from '../../context/App'
import { loadMediaObjectUrl } from '../Desktop/mediaStorage'

function isVideo(filename: string) {
    return ['mov', 'mp4', 'avi', 'webm'].includes(filename.toLowerCase().split('.').pop() ?? '')
}

function isImage(filename: string) {
    return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(filename.toLowerCase().split('.').pop() ?? '')
}

export default function MediaWindow() {
    const { isMediaWindowOpen, setMediaWindowOpen, isMediaWindowMinimized, setMediaWindowMinimized, activeMediaDocId, setActiveMediaDocId, savedDocs } = useApp()
    const dragControls = useDragControls()
    const [isMaximized, setIsMaximized] = useState(false)
    const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)

    const doc = savedDocs.find(d => d.id === activeMediaDocId)

    useEffect(() => {
        let objectUrl: string | null = null
        let cancelled = false

        const resolve = async () => {
            if (!doc || (!isVideo(doc.filename) && !isImage(doc.filename))) {
                setResolvedSrc(null)
                return
            }
            if (doc.mediaStorageKey) {
                const url = await loadMediaObjectUrl(doc.mediaStorageKey)
                if (cancelled) {
                    if (url) URL.revokeObjectURL(url)
                    return
                }
                objectUrl = url
                setResolvedSrc(url)
                return
            }

            setResolvedSrc(doc.content || doc.filename)
        }

        void resolve()

        return () => {
            cancelled = true
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [doc])

    if (!doc || (!isVideo(doc.filename) && !isImage(doc.filename))) return null

    const close = () => {
        setMediaWindowOpen(false)
        setMediaWindowMinimized(false)
        setActiveMediaDocId(null)
    }

    const isVideoFile = isVideo(doc.filename)

    return (
        <AnimatePresence>
            {isMediaWindowOpen && !isMediaWindowMinimized && (
                <motion.div
                    drag={!isMaximized}
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="fixed z-[44] flex flex-col overflow-hidden select-none rounded-xl"
                    style={isMaximized ? { inset: '1rem' } : { top: '12vh', left: '50%', transform: 'translateX(-50%)', width: 720, height: 500 }}
                >
                    <div className="absolute inset-0 rounded-xl border-2 border-black/60 dark:border-white/20 pointer-events-none z-10" />
                    <div className="absolute inset-0 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] pointer-events-none" />

                    <div
                        className={`relative flex items-center justify-between px-3 h-9 bg-[#e8e6e2] dark:bg-[#2a2d3a] border-b border-black/20 dark:border-white/10 flex-shrink-0 ${!isMaximized ? 'cursor-grab active:cursor-grabbing' : ''}`}
                        onPointerDown={!isMaximized ? e => dragControls.start(e) : undefined}
                    >
                        <div className="flex items-center gap-1.5 group/lights">
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={close}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:opacity-90"
                            >
                                <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000]" strokeWidth={3} />
                            </button>
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setMediaWindowMinimized(true)}
                                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#e0a21c] flex items-center justify-center hover:opacity-90"
                            >
                                <Minimize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#5a3800]" strokeWidth={3} />
                            </button>
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setIsMaximized(m => !m)}
                                className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aaa2f] flex items-center justify-center hover:opacity-90"
                            >
                                {isMaximized ? (
                                    <Minimize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#003d00]" strokeWidth={3} />
                                ) : (
                                    <Maximize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#003d00]" strokeWidth={3} />
                                )}
                            </button>
                        </div>
                        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[60%]">
                            {doc.filename}
                        </span>
                    </div>

                    <div className="flex-1 bg-black/90 dark:bg-black flex items-center justify-center overflow-hidden">
                        {isVideoFile ? (
                            <video
                                src={resolvedSrc ?? undefined}
                                controls
                                autoPlay
                                muted
                                loop
                                className="max-w-full max-h-full"
                            />
                        ) : (
                            <img
                                src={resolvedSrc ?? undefined}
                                alt={doc.filename}
                                className="max-w-full max-h-full object-contain"
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
