"use client";
import React, { useState } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Maximize2, Minimize2, FileText, Film, FolderMinus, Image as ImageIcon } from 'lucide-react'
import { useApp } from '../../context/App'
import { CERTIFICATIONS_FOLDER_ID, CERTIFICATIONS_FOLDER_NAME } from '../../lib/certifications'

function fileIcon(filename: string) {
    const ext = filename.toLowerCase().split('.').pop() ?? ''
    if (['mov', 'mp4', 'avi', 'webm'].includes(ext)) return Film
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return ImageIcon
    return FileText
}

export default function FolderWindow() {
    const {
        isFolderWindowOpen, setFolderWindowOpen,
        isFolderWindowMinimized, setFolderWindowMinimized,
        activeFolderWindowId, setActiveFolderWindowId,
        userFolders, certificationDocs, savedDocs,
        removeDocFromFolder,
        setNewDocOpen, setNewDocMinimized, setOpenSavedDocId,
        setMediaWindowOpen, setActiveMediaDocId,
        openPdfWindow,
    } = useApp()
    const dragControls = useDragControls()
    const [isMaximized, setIsMaximized] = useState(false)
    const W = 620, H = 420

    const folder = activeFolderWindowId === CERTIFICATIONS_FOLDER_ID
        ? { id: CERTIFICATIONS_FOLDER_ID, name: CERTIFICATIONS_FOLDER_NAME, items: certificationDocs.map(doc => doc.id) }
        : userFolders.find(f => f.id === activeFolderWindowId)
    const folderDocs = folder?.id === CERTIFICATIONS_FOLDER_ID
        ? certificationDocs
        : savedDocs.filter(d => folder?.items.includes(d.id))
    const isVideo = (filename: string) => ['mov', 'mp4', 'avi', 'webm'].includes(filename.toLowerCase().split('.').pop() ?? '')
    const isImage = (filename: string) => ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(filename.toLowerCase().split('.').pop() ?? '')
    const isPdf = (filename: string) => filename.toLowerCase().endsWith('.pdf')

    const handleClose = () => {
        setFolderWindowOpen(false)
        setActiveFolderWindowId(null)
        setFolderWindowMinimized(false)
    }

    const openItem = (docId: string) => {
        const doc = savedDocs.find(d => d.id === docId)
        const certificationDoc = certificationDocs.find(d => d.id === docId)
        const target = doc ?? certificationDoc
        if (!target) return
        if (isVideo(target.filename) || isImage(target.filename)) {
            setActiveMediaDocId(target.id)
            setMediaWindowOpen(true)
            return
        }
        if (isPdf(target.filename)) {
            openPdfWindow(target.id)
            return
        }
        if (folder?.id === CERTIFICATIONS_FOLDER_ID) return
        setNewDocMinimized(false)
        setOpenSavedDocId(target.id)
        setNewDocOpen(true)
    }

    return (
        <AnimatePresence>
            {isFolderWindowOpen && folder && !isFolderWindowMinimized && (
                <motion.div
                    drag={!isMaximized}
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="fixed z-[46] flex flex-col overflow-hidden select-none rounded-xl"
                    data-folder-window-id={folder.id}
                    style={isMaximized ? { inset: '1rem' } : { top: '10vh', left: `calc(50% - ${W / 2}px)`, width: W, height: H }}
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
                                onClick={handleClose}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:opacity-90"
                            >
                                <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000]" strokeWidth={3} />
                            </button>
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setFolderWindowMinimized(true)}
                                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#e0a21c] flex items-center justify-center hover:opacity-90"
                            >
                                <Minimize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#5a3800]" strokeWidth={3} />
                            </button>
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setIsMaximized(m => !m)}
                                className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aaa2f] flex items-center justify-center hover:opacity-90"
                            >
                                <Maximize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#003d00]" strokeWidth={3} />
                            </button>
                        </div>
                        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-gray-700 dark:text-gray-200">
                            {folder.name}
                        </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#1e2130]">
                        {/* Sidebar */}
                        <div className="w-40 flex-shrink-0 border-r border-gray-200 dark:border-white/10 p-4 flex flex-col gap-3 bg-gray-50 dark:bg-[#191b26]">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📁</span>
                                <span className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">{folder.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {folderDocs.length} {folderDocs.length === 1 ? 'file' : 'files'}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-auto leading-relaxed">
                                Drag desktop icons onto this folder to add files.
                            </p>
                        </div>

                        {/* File grid */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {folderDocs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                                    <span className="text-4xl opacity-30">📂</span>
                                    <p className="text-sm text-gray-400 dark:text-gray-600">This folder is empty</p>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-600">Drag desktop files onto the folder icon to add them</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-4">
                                    {folderDocs.map(doc => {
                                        const Icon = fileIcon(doc.filename)
                                        return (
                                            <div key={doc.id} className="group flex flex-col items-center gap-1.5">
                                                <div className="relative w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30 transition-all">
                                                    <button
                                                        type="button"
                                                        onClick={() => openItem(doc.id)}
                                                        className="absolute inset-0 flex items-center justify-center"
                                                    >
                                                        <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                                                    </button>
                                                    {folder.id !== CERTIFICATIONS_FOLDER_ID && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDocFromFolder(folder.id, doc.id)}
                                                            title="Remove from folder"
                                                            onPointerDown={e => e.stopPropagation()}
                                                            className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <FolderMinus className="w-5 h-5 text-white" strokeWidth={2} />
                                                        </button>
                                                    )}
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
