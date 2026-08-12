"use client";
import React, { useState } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Minus,Maximize2, FileText, Film, RotateCcw, Trash2, Image as ImageIcon, Folder } from 'lucide-react'
import { useApp } from '../../context/App'

function fileIcon(filename: string) {
    const ext = filename.toLowerCase().split('.').pop() ?? ''
    if (['mov', 'mp4', 'avi', 'webm'].includes(ext)) return Film
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return ImageIcon
    return FileText
}

export default function TrashWindow() {
    const { isTrashOpen, setTrashOpen, isTrashMinimized, setTrashMinimized, savedDocs, userFolders, restoreDoc, restoreFolder, deleteDoc, deleteFolderPermanently, emptyTrash } = useApp()
    const dragControls = useDragControls()
    const [isMaximized, setIsMaximized] = useState(false)
    const W = 700, H = 460
    const trashed = savedDocs.filter(d => d.trashed)
    const trashedFolders = userFolders.filter(f => f.trashed)

    return (
        <AnimatePresence>
            {isTrashOpen && !isTrashMinimized && (
                <motion.div
                    id="trash-window"
                    drag={!isMaximized}
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="fixed z-[48] flex flex-col overflow-hidden select-none rounded-xl"
                    style={isMaximized ? { inset: '1rem' } : { top: '8vh', left: `calc(50% - ${W / 2}px - 20px)`, width: W, height: H }}
                >
                    <div className="absolute inset-0 rounded-xl border-2 border-black/60 dark:border-white/20 pointer-events-none z-10" />
                    <div className="absolute inset-0 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] pointer-events-none" />

                    {/* Title bar */}
                    <div
                        className={`relative flex items-center justify-between px-3 h-9 bg-[#e8e6e2] dark:bg-[#2a2d3a] border-b border-black/20 dark:border-white/10 flex-shrink-0 ${!isMaximized ? 'cursor-grab active:cursor-grabbing' : ''}`}
                        onPointerDown={!isMaximized ? e => dragControls.start(e) : undefined}
                    >
                        <div className="flex items-center gap-1.5 group/lights">
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setTrashOpen(false)}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:opacity-90"
                            >
                                <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000]" strokeWidth={3} />
                            </button>

                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setTrashMinimized(true)}
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
                        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-gray-700 dark:text-gray-200">Trash</span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#1e2130]">
                        {/* Sidebar */}
                        <div className="w-44 flex-shrink-0 border-r border-gray-200 dark:border-white/10 p-4 flex flex-col gap-3 bg-gray-50 dark:bg-[#191b26]">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🗑️</span>
                                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">Trash</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Drag desktop files here to remove them. Restore or delete permanently.
                            </p>
                            {trashed.length > 0 && (
                                <button
                                    onClick={emptyTrash}
                                    className="mt-auto px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                    Empty Trash
                                </button>
                            )}
                        </div>

                        {/* File grid */}
                        <div className="flex-1 overflow-y-auto p-5">
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">Recently Deleted</span>
                                <span className="text-xs text-gray-400">({trashed.length + trashedFolders.length})</span>
                            </div>
                            {trashed.length === 0 && trashedFolders.length === 0 ? (
                                <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-16">Trash is empty</p>
                            ) : (
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-4">
                                    {trashedFolders.map(folder => (
                                        <div key={folder.id} className="group flex flex-col items-center gap-1.5">
                                            <div className="relative w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30 transition-all">
                                                <Folder className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                                                <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => restoreFolder(folder.id)}
                                                        title="Restore folder"
                                                        className="p-1.5 bg-white/20 hover:bg-green-500 rounded-lg transition-colors"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteFolderPermanently(folder.id)}
                                                        title="Delete permanently"
                                                        className="p-1.5 bg-white/20 hover:bg-red-500 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-600 dark:text-gray-400 text-center leading-tight max-w-full truncate px-1">
                                                {folder.name}
                                            </span>
                                        </div>
                                    ))}
                                    {trashed.map(doc => {
                                        const Icon = fileIcon(doc.filename)
                                        return (
                                            <div key={doc.id} className="group flex flex-col items-center gap-1.5">
                                                <div className="relative w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30 transition-all">
                                                    <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                                                    <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                                        <button
                                                            onClick={() => restoreDoc(doc.id)}
                                                            title="Restore"
                                                            className="p-1.5 bg-white/20 hover:bg-green-500 rounded-lg transition-colors"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteDoc(doc.id)}
                                                            title="Delete permanently"
                                                            className="p-1.5 bg-white/20 hover:bg-red-500 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-gray-600 dark:text-gray-400 text-center leading-tight max-w-full truncate px-1">
                                                    {doc.filename}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
