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
        isContactOpen, isContactMinimized, setContactMinimized, setContactOpen,
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
        isContactOpen && isContactMinimized && {
            key: 'contact',
            label: 'Contact',
            color: 'bg-cyan-400',
            onClick: () => { setContactMinimized(false); setContactOpen(true) },
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
                    className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-2 overflow-x-auto px-1 pb-1"
                >
                    {pills.map(p => (
                        <button
                            key={p.key}
                            onClick={p.onClick}
                            className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border-2 border-black/60 bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:shadow-none dark:border-white/20 dark:bg-gray-800/90 dark:text-gray-100"
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
        <main className="relative h-[100dvh] min-h-[100svh] w-screen overflow-hidden">
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
