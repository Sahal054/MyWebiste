"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import {
    Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight,
    ChevronDown, Undo, Redo,
    X, Minus, Maximize2,
} from 'lucide-react'
import { useApp } from '../../context/App'

const DEFAULT_CONTENT = `<h1 style="font-size:1.75rem;font-weight:800;margin:0 0 4px">Your Name</h1>
<p style="margin:0 0 16px;opacity:.75"><strong>Full-Stack Developer</strong>&nbsp;·&nbsp;your@email.com&nbsp;·&nbsp;<a href="https://github.com" style="color:#2563eb;text-decoration:underline">github.com/yourusername</a></p>
<hr style="margin:14px 0;border:none;border-top:2px solid currentColor;opacity:.2"/>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">About</h2>
<p style="margin:0 0 12px">A brief description of who you are, what you build, and why you love it. This document is fully editable — click anywhere and start typing!</p>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">Experience</h2>
<p style="margin:0"><strong>Company Name</strong>&nbsp;&mdash;&nbsp;Senior Engineer&nbsp;&nbsp;<span style="opacity:.5;font-size:.85em">2022 – present</span></p>
<ul style="margin:6px 0 12px 20px;padding:0;line-height:1.7">
  <li>Shipped X feature used by N users</li>
  <li>Reduced build time by 40% through pipeline optimisation</li>
</ul>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">Skills</h2>
<p style="margin:0 0 12px">TypeScript&nbsp;·&nbsp;React&nbsp;·&nbsp;Next.js&nbsp;·&nbsp;Node.js&nbsp;·&nbsp;Docker&nbsp;·&nbsp;PostgreSQL&nbsp;·&nbsp;Tailwind CSS</p>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">Education</h2>
<p style="margin:0"><strong>Your University</strong>&nbsp;·&nbsp;B.Sc. Computer Science&nbsp;·&nbsp;2021</p>`

const MIN_W = 480
const MIN_H = 320
const STORAGE_KEY = 'doc-resume-content'

export default function DocumentWindow() {
    const { isDocOpen, setDocOpen, isDocMinimized, setDocMinimized } = useApp()
    const dragControls = useDragControls()
    const editorRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)
    const [filename, setFilename] = useState('resume.mdx')
    const [editingFilename, setEditingFilename] = useState(false)
    const [isMaximized, setIsMaximized] = useState(false)
    const [size, setSize] = useState({ w: 800, h: 560 })
    const [isMobile, setIsMobile] = useState(false)
    const [saveIndicator, setSaveIndicator] = useState(false)
    const initializedRef = useRef(false)
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const indicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Detect mobile and respond to viewport changes
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // Load saved content or fall back to default template
    // Reset the flag when the window closes so it reloads fresh from storage next time
    useEffect(() => {
        if (!isDocOpen) {
            initializedRef.current = false
            return
        }
        if (editorRef.current && !initializedRef.current) {
            const saved = localStorage.getItem(STORAGE_KEY)
            editorRef.current.innerHTML = saved ||DEFAULT_CONTENT //  use editorRef.current.innerHTML = saved || DEFAULT_CONTENT  to load the changes made to resume
            initializedRef.current = true
        }
    }, [isDocOpen])

    // Ctrl+S / Cmd+S → immediate save
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                if (editorRef.current) {
                    localStorage.setItem(STORAGE_KEY, editorRef.current.innerHTML)
                    setSaveIndicator(true)
                    if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current)
                    indicatorTimerRef.current = setTimeout(() => setSaveIndicator(false), 1500)
                }
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    // Debounced save whenever the user types
    const onEditorInput = useCallback(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        saveTimerRef.current = setTimeout(() => {
            if (editorRef.current) {
                localStorage.setItem(STORAGE_KEY, editorRef.current.innerHTML)
                setSaveIndicator(true)
                if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current)
                indicatorTimerRef.current = setTimeout(() => setSaveIndicator(false), 1500)
            }
        }, 600)
    }, [])

    // ── Resize logic ────────────────────────────────────────────────────────
    const startResize = useCallback((
        e: React.PointerEvent,
        edges: { right?: boolean; bottom?: boolean }
    ) => {
        e.preventDefault()
        e.stopPropagation()
        const startX = e.clientX
        const startY = e.clientY
        const startW = size.w
        const startH = size.h

        const onMove = (ev: PointerEvent) => {
            setSize(prev => ({
                w: edges.right  ? Math.max(MIN_W, startW + ev.clientX - startX) : prev.w,
                h: edges.bottom ? Math.max(MIN_H, startH + ev.clientY - startY) : prev.h,
            }))
        }
        const onUp = () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
    }, [size])

    const exec = (cmd: string, value?: string) => {
        document.execCommand(cmd, false, value)
        editorRef.current?.focus()
    }

    const isVisible = isDocOpen && !isDocMinimized
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
                    className={`fixed z-50 flex flex-col overflow-hidden select-none ${
                        isMobile ? 'rounded-none' : 'rounded-xl'
                    }`}
                    style={
                        isMobile
                            ? { inset: 0 }
                            : isMaximized
                                ? { inset: '1rem' }
                                : { top: '6vh', left: `calc(50% - ${size.w / 2}px)`, width: size.w, height: size.h }
                    }
                >
                    {/* Outer border — always visible against any background */}
                    <div className="absolute inset-0 rounded-xl border-2 border-black/60 dark:border-white/20 pointer-events-none z-10" />
                    {/* Drop shadow */}
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
                            {/* Red — Close */}
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setDocOpen(false)}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-70"
                                aria-label="Close"
                            >
                                <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000] transition-opacity" strokeWidth={3} />
                            </button>
                            {/* Yellow — Minimize */}
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setDocMinimized(true)}
                                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#e0a21c] flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-70"
                                aria-label="Minimize"
                            >
                                <Minus className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#5a3800] transition-opacity" strokeWidth={3} />
                            </button>
                            {/* Green — Fullscreen */}
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setIsMaximized(m => !m)}
                                className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aaa2f] flex items-center justify-center transition-opacity hover:opacity-90 active:opacity-70"
                                aria-label="Fullscreen"
                            >
                                <Maximize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#003d00] transition-opacity" strokeWidth={3} />
                            </button>
                        </div>

                        {/* Filename */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 text-[13px] font-semibold text-gray-700 dark:text-gray-200">
                            {editingFilename ? (
                                <input
                                    autoFocus
                                    value={filename}
                                    onChange={e => setFilename(e.target.value)}
                                    onBlur={() => setEditingFilename(false)}
                                    onKeyDown={e => e.key === 'Enter' && setEditingFilename(false)}
                                    onPointerDown={e => e.stopPropagation()}
                                    className="bg-transparent border-b border-current outline-none w-36 text-center"
                                />
                            ) : (
                                <button
                                    onPointerDown={e => e.stopPropagation()}
                                    onClick={() => setEditingFilename(true)}
                                    className="flex items-center gap-0.5 hover:opacity-60 transition-opacity"
                                >
                                    {filename}
                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Toolbar ── */}
                    <div className="flex items-center gap-0.5 px-2 py-1 bg-white dark:bg-[#1e2130] border-b border-gray-200 dark:border-white/10 flex-shrink-0 flex-wrap">
                        {[
                            { Icon: Undo,       cmd: 'undo',          title: 'Undo' },
                            { Icon: Redo,       cmd: 'redo',          title: 'Redo' },
                        ].map(({ Icon, cmd, title }) => (
                            <button key={cmd} onMouseDown={e => { e.preventDefault(); exec(cmd) }} title={title}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}

                        <div className="w-px h-4 bg-gray-200 dark:bg-white/15 mx-0.5 flex-shrink-0" />

                        {[
                            { Icon: Bold,        cmd: 'bold',          title: 'Bold' },
                            { Icon: Italic,      cmd: 'italic',        title: 'Italic' },
                            { Icon: Underline,   cmd: 'underline',     title: 'Underline' },
                        ].map(({ Icon, cmd, title }) => (
                            <button key={cmd} onMouseDown={e => { e.preventDefault(); exec(cmd) }} title={title}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}

                        <div className="w-px h-4 bg-gray-200 dark:bg-white/15 mx-0.5 flex-shrink-0" />

                        {[
                            { Icon: AlignLeft,   cmd: 'justifyLeft',   title: 'Left' },
                            { Icon: AlignCenter, cmd: 'justifyCenter', title: 'Center' },
                            { Icon: AlignRight,  cmd: 'justifyRight',  title: 'Right' },
                        ].map(({ Icon, cmd, title }) => (
                            <button key={cmd} onMouseDown={e => { e.preventDefault(); exec(cmd) }} title={title}
                                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}

                        <div className="w-px h-4 bg-gray-200 dark:bg-white/15 mx-0.5 flex-shrink-0" />

                        <select onMouseDown={e => e.stopPropagation()} onChange={e => exec('formatBlock', e.target.value)} defaultValue="p"
                            className="text-xs border border-gray-200 dark:border-white/20 rounded px-1.5 py-0.5 bg-white dark:bg-[#1e2130] text-gray-700 dark:text-gray-300 outline-none cursor-pointer">
                            <option value="p">Paragraph</option>
                            <option value="h1">Heading 1</option>
                            <option value="h2">Heading 2</option>
                            <option value="h3">Heading 3</option>
                        </select>

                        <select onMouseDown={e => e.stopPropagation()} onChange={e => exec('fontSize', e.target.value)} defaultValue="3"
                            className="text-xs border border-gray-200 dark:border-white/20 rounded px-1.5 py-0.5 bg-white dark:bg-[#1e2130] text-gray-700 dark:text-gray-300 outline-none cursor-pointer">
                            <option value="1">8pt</option>
                            <option value="2">10pt</option>
                            <option value="3">12pt</option>
                            <option value="4">14pt</option>
                            <option value="5">18pt</option>
                            <option value="6">24pt</option>
                        </select>
                    </div>

                    {/* ── Editor content ── */}
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck
                        onInput={onEditorInput}
                        className={`flex-1 overflow-y-auto outline-none text-[14px] leading-relaxed bg-white dark:bg-[#1e2130] text-gray-900 dark:text-gray-100 [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h2]:text-gray-800 dark:[&_h2]:text-gray-200 [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_hr]:border-gray-200 dark:[&_hr]:border-gray-600 ${
                            isMobile ? 'p-4' : 'p-8'
                        }`}
                    />

                    {/* ── Status bar ── */}
                    <div className="flex items-center justify-between px-4 py-1 bg-[#e8e6e2] dark:bg-[#2a2d3a] border-t border-black/10 dark:border-white/10 flex-shrink-0">
                        <span className={`text-[11px] transition-colors duration-300 ${
                            saveIndicator ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            {saveIndicator ? '✓ Saved' : 'Click any text to edit'}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">{filename}</span>
                    </div>

                    {/* ── Resize handles (desktop only) ── */}
                    {isFloating && (
                        <>
                            {/* Right edge */}
                            <div
                                className="absolute right-0 top-8 bottom-0 w-1.5 cursor-ew-resize z-20"
                                onPointerDown={e => startResize(e, { right: true })}
                            />
                            {/* Bottom edge */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-1.5 cursor-ns-resize z-20"
                                onPointerDown={e => startResize(e, { bottom: true })}
                            />
                            {/* Bottom-right corner */}
                            <div
                                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-30 flex items-end justify-end pr-1 pb-1"
                                onPointerDown={e => startResize(e, { right: true, bottom: true })}
                            >
                                <svg width="8" height="8" viewBox="0 0 8 8" className="text-gray-400 dark:text-gray-500">
                                    <path d="M1 7 L7 1 M4 7 L7 4 M7 7 L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
