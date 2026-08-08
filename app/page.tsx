"use client";

import Desktop from '../components/Desktop'
import ServerStatsPanel from '../components/ServerStatsPanel'
import DocumentWindow from '../components/DocumentWindow'
import DocEditorWindow from '../components/DocEditorWindow'
import ProjectWindow from '@/components/ProjectsWindow'
import TrashWindow from '../components/TrashWindow'
import FolderWindow from '../components/FolderWindow'
import MediaWindow from '../components/MediaWindow'
import PdfWindow from '../components/PdfWindow'
import ContactWindow from '../components/ContactsWindow'
import { useApp } from '../context/App'
import { motion, AnimatePresence } from 'framer-motion'
import { CERTIFICATIONS_FOLDER_ID, CERTIFICATIONS_FOLDER_NAME } from '../lib/certifications'

// Minimized pill strip — sits above the dock for all minimized windows
function MinimizedTaskbar() {
    const {
        isDocOpen, isDocMinimized, setDocMinimized,
        isNewDocOpen, isNewDocMinimized, setNewDocMinimized,
        isProjectsOpen, isProjectsMinimized, setProjectsMinimized,
        isFolderWindowOpen, isFolderWindowMinimized, setFolderWindowMinimized,
        activeFolderWindowId, userFolders,
        isTrashOpen, isTrashMinimized, setTrashMinimized, setTrashOpen,
        isMediaWindowOpen, isMediaWindowMinimized, setMediaWindowMinimized,
        activeMediaDocId, savedDocs,
        pdfWindows, certificationDocs, restorePdfWindow,
    } = useApp()

    const activeFolder = activeFolderWindowId === CERTIFICATIONS_FOLDER_ID
        ? { id: CERTIFICATIONS_FOLDER_ID, name: CERTIFICATIONS_FOLDER_NAME }
        : userFolders.find(folder => folder.id === activeFolderWindowId)
    const activeMediaDoc = savedDocs.find(doc => doc.id === activeMediaDocId)
    const pdfDocs = [...savedDocs, ...certificationDocs]

    const pdfPills = pdfWindows
        .filter(window => window.minimized)
        .map((window, index, array) => {
            const doc = pdfDocs.find(item => item.id === window.docId)
            if (!doc) return null
            const duplicates = array.filter(item => item.docId === window.docId).length
            return {
                key: window.windowId,
                label: duplicates > 1 ? `${doc.filename} ${array.filter(item => item.docId === window.docId).indexOf(window) + 1}` : doc.filename,
                color: 'bg-indigo-400',
                onClick: () => restorePdfWindow(window.windowId),
            }
        })
        .filter(Boolean) as { key: string; label: string; color: string; onClick: () => void }[]

    const pills = [
        isDocOpen && isDocMinimized && {
            key: 'resume',
            label: 'resume.mdx',
            color: 'bg-yellow-400',
            onClick: () => setDocMinimized(false),
        },
        isNewDocOpen && isNewDocMinimized && {
            key: 'newdoc',
            label: 'New Doc',
            color: 'bg-blue-400',
            onClick: () => setNewDocMinimized(false),
        },
        isProjectsOpen && isProjectsMinimized && {
            key: 'projects',
            label: 'Projects',
            color: 'bg-emerald-400',
            onClick: () => setProjectsMinimized(false),
        },
        isFolderWindowOpen && isFolderWindowMinimized && activeFolder && {
            key: 'folder',
            label: activeFolder.name,
            color: 'bg-green-400',
            onClick: () => setFolderWindowMinimized(false),
        },
        isTrashOpen && isTrashMinimized && {
            key: 'trash',
            label: 'Trash',
            color: 'bg-red-400',
            onClick: () => { setTrashMinimized(false); setTrashOpen(true) },
        },
        isMediaWindowOpen && isMediaWindowMinimized && activeMediaDoc && {
            key: 'media',
            label: activeMediaDoc.filename,
            color: 'bg-purple-400',
            onClick: () => setMediaWindowMinimized(false),
        },
        ...pdfPills,
    ].filter(Boolean) as { key: string; label: string; color: string; onClick: () => void }[]

    return (
        <AnimatePresence>
            {pills.length > 0 && (
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 60, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2"
                >
                    {pills.map(p => (
                        <button
                            key={p.key}
                            onClick={p.onClick}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-black/60 dark:border-white/20 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] transition-all text-sm font-medium text-gray-800 dark:text-gray-100"
                        >
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.color}`} />
                            <span className="text-xs">{p.label}</span>
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function Home() {
    return (
        <main className="relative w-screen h-screen overflow-hidden">
            <Desktop />
            <ServerStatsPanel />
            <DocumentWindow />
            <ProjectWindow />
            <DocEditorWindow />
            <TrashWindow />
            <FolderWindow />
            <MediaWindow />
            <PdfWindow />
            <ContactWindow />
            <MinimizedTaskbar />
        </main>
    )
}
