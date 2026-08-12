"use client";
import React, { useState } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X,  Minus,Maximize2, ExternalLink, FileText, Film, FolderMinus, Image as ImageIcon } from 'lucide-react'
import { useApp } from '../../context/App'



// // Edit your portfolio projects here
// const PORTFOLIO = [
//     { 
//         id: 'p1', 
//         name: 'Little Lemon Booking',  
//         lang: 'Python',    
//         desc: 'Django/SQL application handling concurrent users with <200ms response times and 98.5% automated test coverage.',        
//         url: 'https://github.com/Sahal054/Little-lemon-capstone-project' 
//     },
//     { 
//         id: 'p2', 
//         name: 'Biometric Encryption',  
//         lang: 'Python',        
//         desc: 'Architected a secure matching system using Gabor filters and Fully Homomorphic Encryption (FHE) to secure 640-dimensional feature vectors.',   
//         url: 'https://github.com/Sahal054/Encrypted_image_preprocessing' 
//     },
//     { 
//         id: 'p3', 
//         name: 'Travel Companion',  
//         lang: 'React',  
//         desc: 'Interactive travel application featuring responsive UI design, dynamic routing, and complex state management.',             
//         url: 'https://github.com/Sahal054/Travel_app' 
//     },
//     { 
//         id: 'p4', 
//         name: 'Task Manager OS',  
//         lang: 'TypeScript',  
//         desc: 'Robust To-Do application demonstrating CRUD operations, browser storage persistence, and dynamic DOM rendering.',             
//         url: 'https://github.com/Sahal054/To-Do-app' 
//     },
// ]



// const LANG_COLOR: Record<string, string> = {
//     TypeScript:  'bg-yellow-500',
//     Python: 'bg-blue-500',
//     React: 'bg-cyan-400',
//     'React Native': 'bg-cyan-500',
//     JavaScript: 'bg-yellow-400',
//     Rust: 'bg-orange-500',
//     Go: 'bg-teal-500',
// }


// Edit your portfolio projects here
const PORTFOLIO = [

    { 
        id: 'p1', 
        name: 'Travel Companion',  
        lang: 'Python', 
        tech: ['FastApi', 'Next.JS'], 
        desc: 'Interactive travel application featuring responsive UI design, dynamic routing, and complex state management.',             
        url: 'https://github.com/Sahal054/Travel_app' 
    },
    { 
        id: 'p2', 
        name: 'Little Lemon Booking',  
        lang: 'Python',
        tech: ['Django', 'PostgreSQL','meta'],
        desc: 'Django/SQL application handling concurrent users with <200ms response times and 98.5% automated test coverage.',        
        url: 'https://github.com/Sahal054/Little-lemon-capstone-project' 
    },
    { 
        id: 'p3', 
        name: 'Biometric Encryption',  
        lang: 'Python', 
        tech: ['Zama', 'FHE'],       
        desc: 'Architected a secure matching system using Gabor filters and Fully Homomorphic Encryption (FHE) to secure 640-dimensional feature vectors.',   
        url: 'https://github.com/Sahal054/Encrypted_image_preprocessing' 
    },

    { 
        id: 'p4', 
        name: 'Task Manager OS',  
        lang: 'JavaScript', 
        tech: ['HTML', 'CSS'], 
        desc: 'Robust To-Do application demonstrating CRUD operations, browser storage persistence, and dynamic DOM rendering.',             
        url: 'https://github.com/Sahal054/To-Do-app' 
    },
]

const LANG_COLOR: Record<string, string> = {
    TypeScript: 'bg-yellow-500',
    Python: 'bg-blue-500', 
    React: 'bg-cyan-400',
    'React Native': 'bg-cyan-500',
    JavaScript: 'bg-yellow-400',
    Rust: 'bg-orange-500',
    Go: 'bg-teal-500',
}

function fileIcon(filename: string) {
    const ext = filename.toLowerCase().split('.').pop() ?? ''
    if (['mov', 'mp4', 'avi'].includes(ext)) return Film
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return ImageIcon
    return FileText
}

export default function ProjectWindow() {
    const { isProjectsOpen, setProjectsOpen, isProjectsMinimized, setProjectsMinimized, savedDocs, projectFolderItems, removeFromProjectFolder } = useApp()
    const dragControls = useDragControls()
    const [isMaximized, setIsMaximized] = useState(false)
    const W = 760, H = 500
    const folderDocs = savedDocs.filter(d => projectFolderItems.includes(d.id))

    return (
        <AnimatePresence>
            {isProjectsOpen && !isProjectsMinimized && (
                <motion.div
                    drag={!isMaximized}
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="fixed z-[47] flex flex-col overflow-hidden select-none rounded-xl"
                    style={isMaximized ? { inset: '1rem' } : { top: '7vh', left: `calc(50% - ${W / 2}px + 30px)`, width: W, height: H }}
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
                                onClick={() => { setProjectsMinimized(false); setProjectsOpen(false) }}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:opacity-90"
                            >
                                <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000]" strokeWidth={3} />
                            </button>
                           <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setProjectsMinimized(true)}
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
                        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-gray-700 dark:text-gray-200">Projects</span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#1e2130]">
                        {/* Sidebar */}
                        <div className="w-44 flex-shrink-0 border-r border-gray-200 dark:border-white/10 p-4 flex flex-col gap-3 bg-gray-50 dark:bg-[#191b26]">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📁</span>
                                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">Projects</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Portfolio repos and desktop files dropped into this folder.
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-auto">
                                Drag desktop files onto the Projects icon to add them here.
                            </p>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
                            {/* Portfolio section */}
                            <section>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">Portfolio</span>
                                    <span className="text-xs text-gray-400">({PORTFOLIO.length})</span>
                                </div>
                                {/* CHANGED: minmax(240px) to make cards wider so text fits better */}
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                                    {PORTFOLIO.map(p => (
                                        <a
                                            key={p.id}
                                            href={p.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex flex-col gap-1.5 p-3.5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 bg-gray-50 dark:bg-white/5 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{p.name}</span>
                                                <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1 transition-opacity" strokeWidth={2} />
                                            </div>
                                            {/* CHANGED: line-clamp-4 and slightly larger text for readability */}
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4 mt-1">{p.desc}</p>
                                            {p.lang && (
                                            <div className="flex items-center flex-wrap gap-2 mt-auto pt-3">
                                                {/* Primary Language */}
                                                {p.lang && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${LANG_COLOR[p.lang] ?? 'bg-gray-400'}`} />
                                                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{p.lang}</span>
                                                    </div>
                                                )}
                                                
                                                {/* Tech Stack Badges */}
                                                {p.tech && p.tech.length > 0 && (
                                                    <div className="flex items-center gap-1.5 border-l border-gray-300 dark:border-gray-600 pl-2">
                                                        {p.tech.map(t => (
                                                            <span 
                                                                key={t} 
                                                                className="px-1.5 py-[2px] bg-gray-200/80 dark:bg-white/10 rounded-md text-[9px] font-medium text-gray-600 dark:text-gray-400 tracking-wide uppercase"
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </section>

                            {/* Files dropped into folder */}
                            {folderDocs.length > 0 && (
                                <section>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">Files in Folder</span>
                                        <span className="text-xs text-gray-400">({folderDocs.length})</span>
                                    </div>
                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-4">
                                        {folderDocs.map(doc => {
                                            const Icon = fileIcon(doc.filename)
                                            return (
                                                <div key={doc.id} className="group flex flex-col items-center gap-1.5">
                                                    <div className="relative w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30 transition-all">
                                                        <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                                                        <button
                                                            onClick={() => removeFromProjectFolder(doc.id)}
                                                            title="Remove from folder"
                                                            className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <FolderMinus className="w-5 h-5 text-white" strokeWidth={2} />
                                                        </button>
                                                    </div>
                                                    <span className="text-[10px] text-gray-600 dark:text-gray-400 text-center leading-tight max-w-full truncate px-1">
                                                        {doc.filename}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
