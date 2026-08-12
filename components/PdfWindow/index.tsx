"use client";

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Maximize2, Minus } from 'lucide-react'
import { useApp } from '../../context/App'
import { loadMediaObjectUrl } from '../Desktop/mediaStorage'

function PdfWindowCard({ windowId, docId }: { windowId: string; docId: string }) {
    const {
        pdfWindows,
        closePdfWindow,
        minimizePdfWindow,
        savedDocs,
        certificationDocs,
    } = useApp()
    const dragControls = useDragControls()
    const [isMaximized, setIsMaximized] = useState(false)
    const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)
    const W = 760, H = 560

    const doc = [...savedDocs, ...certificationDocs].find(item => item.id === docId)
    const windowState = pdfWindows.find(item => item.windowId === windowId)

    useEffect(() => {
        let objectUrl: string | null = null
        let cancelled = false

        const resolve = async () => {
            if (!doc || !doc.filename.toLowerCase().endsWith('.pdf')) {
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

            setResolvedSrc(doc.content || null)
        }

        void resolve()

        return () => {
            cancelled = true
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [doc])

    if (!doc || !doc.filename.toLowerCase().endsWith('.pdf') || !windowState) return null

    return (
        <motion.div
            drag={!isMaximized}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed z-[45] flex flex-col overflow-hidden select-none rounded-xl"
            style={isMaximized ? { inset: '1rem' } : { top: '10vh', left: '50%', transform: 'translateX(-50%)', width: W, height: H }}
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
                        onClick={() => closePdfWindow(windowId)}
                        className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:opacity-90"
                    >
                        <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000]" strokeWidth={3} />
                    </button>
                           <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => minimizePdfWindow(windowId,true)}
                                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#e0a21c] flex items-center justify-center hover:opacity-90 active:opacity-70"
                                aria-label="Minimize"
                            >
                                <Minus className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#5a3800]" strokeWidth={3} />
                            </button>
                    <button
                        onPointerDown={e => e.stopPropagation()}
                        onClick={() => setIsMaximized(m => !m)}
                        className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aaa2f] flex items-center justify-center hover:opacity-90"
                    >
                        <Maximize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#003d00]" strokeWidth={3} />
                    </button>
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[60%]">
                    {doc.filename}
                </span>
            </div>

            <div className="flex-1 bg-white dark:bg-[#1e2130] overflow-hidden">
                <iframe
                    src={resolvedSrc ?? undefined}
                    title={doc.filename}
                    className="w-full h-full border-0"
                />
            </div>
        </motion.div>
    )
}

export default function PdfWindow() {
    const { pdfWindows } = useApp()

    return (
        <AnimatePresence>
            {pdfWindows.map(window => (
                !window.minimized && (
                    <PdfWindowCard key={window.windowId} windowId={window.windowId} docId={window.docId} />
                )
            ))}
        </AnimatePresence>
    )
}
