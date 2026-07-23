"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import {
    Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight,
    ChevronDown, Undo, Redo,
    X, Minus, Maximize2, Save,
} from 'lucide-react'
import { useApp } from '../../context/App'

const MIN_W = 420
const MIN_H = 300

export default function DocEditorWindow() {
    const {
        isNewDocOpen, setNewDocOpen,
        isNewDocMinimized, setNewDocMinimized,
        openSavedDocId, setOpenSavedDocId,
        savedDocs, addSavedDoc, updateSavedDoc,
    } = useApp()

    const dragControls = useDragControls()
    const editorRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)
    const [filename, setFilename] = useState('untitled.mdx')
    const [editingFilename, setEditingFilename] = useState(false)
    const [isMaximized, setIsMaximized] = useState(false)
    const [size, setSize] = useState({ w: 700, h: 500 })
    const [isMobile, setIsMobile] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')
    const [currentDocId, setCurrentDocId] = useState<string | null>(null)

    // Keep a stable ref to savedDocs so effects don't re-run on every doc list change
    const savedDocsRef = useRef(savedDocs)
    savedDocsRef.current = savedDocs

    // Mobile detection
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // Load content when the window opens or the target doc changes
    useEffect(() => {
        if (!isNewDocOpen) {
            setCurrentDocId(null)
            return
        }
        // setTimeout ensures the contenteditable div is mounted
        const t = setTimeout(() => {
            if (!editorRef.current) return
            if (openSavedDocId) {
                const doc = savedDocsRef.current.find(d => d.id === openSavedDocId)
                if (doc) {
                    editorRef.current.innerHTML = doc.content
                    setFilename(doc.filename)
                    setCurrentDocId(openSavedDocId)
                    return
                }
            }
            // Blank new doc
            editorRef.current.innerHTML = ''
            setFilename('untitled.mdx')
            setCurrentDocId(null)
        }, 0)
        return () => clearTimeout(t)
    }, [isNewDocOpen, openSavedDocId])

    const close = () => {
        setNewDocOpen(false)
        setOpenSavedDocId(null)
    }

    // Save: create a new desktop file or update an existing one
    const saveDoc = useCallback(() => {
        if (!editorRef.current) return
        const content = editorRef.current.innerHTML
        if (currentDocId) {
            updateSavedDoc(currentDocId, content)
        } else {
            // First save: register a new file on the desktop
            const doc = addSavedDoc(filename, content)
            setCurrentDocId(doc.id)
            setOpenSavedDocId(doc.id)   // link the window to the new file
        }
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
    }, [currentDocId, filename, addSavedDoc, updateSavedDoc, setOpenSavedDocId])

    // Ctrl+S / Cmd+S
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                saveDoc()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [saveDoc])

    const exec = (cmd: string) => {
        document.execCommand(cmd, false, undefined)
        editorRef.current?.focus()
    }

    const startResize = useCallback((
        e: React.PointerEvent,
        edges: { right?: boolean; bottom?: boolean }
    ) => {
        e.preventDefault()
        e.stopPropagation()
        const sx = e.clientX, sy = e.clientY
        const sw = size.w, sh = size.h
        const onMove = (ev: PointerEvent) => setSize(prev => ({
            w: edges.right  ? Math.max(MIN_W, sw + ev.clientX - sx) : prev.w,
            h: edges.bottom ? Math.max(MIN_H, sh + ev.clientY - sy) : prev.h,
        }))
        const onUp = () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
    }, [size])

    const isVisible  = isNewDocOpen && !isNewDocMinimized
    const isFloating = !isMobile && !isMaximized

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={windowRef}
                    drag={isFloating}
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    initial={{ scale: 0.95, opacity: 0, y: isMobile ? 40 : 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: isMobile ? 40 : 20 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className={`fixed z-[45] flex flex-col overflow-hidden select-none ${
                        isMobile ? 'rounded-none' : 'rounded-xl'
                    }`}
                    style={
                        isMobile
                            ? { inset: 0 }
                            : isMaximized
                                ? { inset: '1rem' }
                                : {
                                    top: '10vh',
                                    left: `calc(50% - ${size.w / 2}px + 30px)`,
                                    width: size.w,
                                    height: size.h,
                                }
                    }
                >
                    {/* Border + shadow */}
                    <div className="absolute inset-0 rounded-xl border-2 border-black/60 dark:border-white/20 pointer-events-none z-10" />
                    <div className="absolute inset-0 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] pointer-events-none" />

                    {/* ── Title bar ── */}
                    <div
                        className={`relative flex items-center justify-between px-3 h-9 bg-[#e8e6e2] dark:bg-[#2a2d3a] border-b border-black/20 dark:border-white/10 flex-shrink-0 ${
                            isFloating ? 'cursor-grab active:cursor-grabbing' : ''
                        }`}
                        onPointerDown={isFloating ? e => dragControls.start(e) : undefined}
                    >
                        {/* Traffic lights */}
                        <div className="flex items-center gap-1.5 group/lights">
                            <button onPointerDown={e => e.stopPropagation()} onClick={close}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:opacity-90 active:opacity-70" aria-label="Close">
                                <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000]" strokeWidth={3} />
                            </button>
                            <button onPointerDown={e => e.stopPropagation()} onClick={() => setNewDocMinimized(true)}
                                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#e0a21c] flex items-center justify-center hover:opacity-90 active:opacity-70" aria-label="Minimize">
                                <Minus className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#5a3800]" strokeWidth={3} />
                            </button>
                            <button onPointerDown={e => e.stopPropagation()} onClick={() => setIsMaximized(m => !m)}
                                className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aaa2f] flex items-center justify-center hover:opacity-90 active:opacity-70" aria-label="Fullscreen">
                                <Maximize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#003d00]" strokeWidth={3} />
                            </button>
                        </div>

                        {/* Filename (click to rename) */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 text-[13px] font-semibold text-gray-700 dark:text-gray-200">
                            {editingFilename ? (
                                <input autoFocus value={filename}
                                    onChange={e => setFilename(e.target.value)}
                                    onBlur={() => setEditingFilename(false)}
                                    onKeyDown={e => e.key === 'Enter' && setEditingFilename(false)}
                                    onPointerDown={e => e.stopPropagation()}
                                    className="bg-transparent border-b border-current outline-none w-40 text-center" />
                            ) : (
                                <button onPointerDown={e => e.stopPropagation()} onClick={() => setEditingFilename(true)}
                                    className="flex items-center gap-0.5 hover:opacity-60 transition-opacity">
                                    {filename}<ChevronDown className="w-3 h-3 opacity-50" />
                                </button>
                            )}
                        </div>

                        {/* Save button */}
                        <button
                            onPointerDown={e => e.stopPropagation()}
                            onClick={saveDoc}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                                saveStatus === 'saved'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200'
                            }`}
                        >
                            <Save className="w-3 h-3" />
                            {saveStatus === 'saved' ? 'Saved!' : currentDocId ? 'Save' : 'Save to Desktop'}
                        </button>
                    </div>

                    {/* ── Toolbar ── */}
                    <div className="flex items-center gap-0.5 px-2 py-1 bg-white dark:bg-[#1e2130] border-b border-gray-200 dark:border-white/10 flex-shrink-0 flex-wrap">
                        {([
                            { Icon: Undo,      cmd: 'undo',          title: 'Undo' },
                            { Icon: Redo,      cmd: 'redo',          title: 'Redo' },
                        ] as const).map(({ Icon, cmd, title }) => (
                            <button key={cmd} onMouseDown={e => { e.preventDefault(); exec(cmd) }} title={title}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                        <div className="w-px h-4 bg-gray-200 dark:bg-white/15 mx-0.5 flex-shrink-0" />
                        {([
                            { Icon: Bold,      cmd: 'bold',          title: 'Bold' },
                            { Icon: Italic,    cmd: 'italic',        title: 'Italic' },
                            { Icon: Underline, cmd: 'underline',     title: 'Underline' },
                        ] as const).map(({ Icon, cmd, title }) => (
                            <button key={cmd} onMouseDown={e => { e.preventDefault(); exec(cmd) }} title={title}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                        <div className="w-px h-4 bg-gray-200 dark:bg-white/15 mx-0.5 flex-shrink-0" />
                        {([
                            { Icon: AlignLeft,   cmd: 'justifyLeft',   title: 'Align Left' },
                            { Icon: AlignCenter, cmd: 'justifyCenter', title: 'Align Center' },
                            { Icon: AlignRight,  cmd: 'justifyRight',  title: 'Align Right' },
                        ] as const).map(({ Icon, cmd, title }) => (
                            <button key={cmd} onMouseDown={e => { e.preventDefault(); exec(cmd) }} title={title}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                    </div>

                    {/* ── Editor ── */}
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck
                        className={`flex-1 overflow-y-auto outline-none text-[14px] leading-relaxed bg-white dark:bg-[#1e2130] text-gray-900 dark:text-gray-100 ${
                            isMobile ? 'p-4' : 'p-8'
                        } empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 dark:empty:before:text-gray-600`}
                        data-placeholder="Start typing your document…"
                    />

                    {/* ── Status bar ── */}
                    <div className="flex items-center justify-between px-4 py-1 bg-[#e8e6e2] dark:bg-[#2a2d3a] border-t border-black/10 dark:border-white/10 flex-shrink-0">
                        <span className={`text-[11px] transition-colors duration-300 ${
                            saveStatus === 'saved'
                                ? 'text-green-600 dark:text-green-400 font-medium'
                                : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            {saveStatus === 'saved'
                                ? '✓ Saved — icon added to desktop'
                                : currentDocId
                                    ? 'Ctrl+S to save'
                                    : 'Ctrl+S · Save to Desktop creates a file icon'}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">{filename}</span>
                    </div>

                    {/* ── Resize handles (desktop floating only) ── */}
                    {isFloating && (
                        <>
                            <div onPointerDown={e => startResize(e, { right: true })}
                                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize z-20" />
                            <div onPointerDown={e => startResize(e, { bottom: true })}
                                className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize z-20" />
                            <div onPointerDown={e => startResize(e, { right: true, bottom: true })}
                                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20 flex items-end justify-end p-0.5">
                                <svg viewBox="0 0 8 8" className="w-2.5 h-2.5 text-gray-400 dark:text-gray-600 opacity-60">
                                    <line x1="2" y1="8" x2="8" y2="2" stroke="currentColor" strokeWidth="1.5" />
                                    <line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
