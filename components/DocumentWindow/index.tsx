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

const DEFAULT_CONTENT = `<h1 style="font-size:1.75rem;font-weight:800;margin:0 0 4px;text-align:center">SAHAL M</h1>
<p style="margin:0 0 16px;text-align:center;font-size:0.9rem">
  Kollam, Kerala&nbsp;·&nbsp;+91 8848307694&nbsp;·&nbsp;sahalmsachu@gmail.com<br/>
  <a href="https://linkedin.com/in/Sahal054" style="color:#2563eb;text-decoration:underline">linkedin.com/in/Sahal054</a>&nbsp;·&nbsp;<a href="https://github.com/Sahal054" style="color:#2563eb;text-decoration:underline">github.com/Sahal054</a>
</p>
<hr style="margin:14px 0;border:none;border-top:2px solid currentColor;opacity:.2"/>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">Education</h2>
<p style="margin:0"><strong>TKM COLLEGE OF ENGINEERING</strong> <span style="float:right;opacity:.75;font-size:.9em">Nov 2021 – April 2025</span></p>
<p style="margin:0"><em>Bachelor of Technology in Computer Science and Engineering</em> <span style="float:right;opacity:.75;font-size:.9em">Kollam, Kerala</span></p>
<p style="margin:4px 0 12px;font-size:0.9rem"><strong>Relevant Coursework:</strong> DBMS, Software Engineering, Operating Systems, Algorithms, Artificial Intelligence, Data Structures</p>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">Work Experience</h2>

<p style="margin:0"><strong>CARESTACK</strong> <span style="float:right;opacity:.75;font-size:.9em">November 2025 – Present</span></p>
<p style="margin:0"><em>Analyst 1 - Product Operations</em> <span style="float:right;opacity:.75;font-size:.9em">Thiruvananthapuram, Kerala</span></p>
<ul style="margin:6px 0 16px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li>Developed two .NET migration tools utilizing the Lead Tools library in Microsoft Visual Studio to facilitate high-fidelity conversion of proprietary dental formats (.tig, auto) to standard PNGs via byte processing, ensuring 100% data integrity during transitions.</li>
  <li>Streamlined onboarding for 30+ enterprise clients by architecting complex SQL workflows for the validation, mapping, and cleansing of patient records into the proprietary PMS, demonstrating strong database fundamentals and secure coding practices.</li>
</ul>

<p style="margin:0"><strong>WAHN DESIGN | wahndesign.com</strong> <span style="float:right;opacity:.75;font-size:.9em">Oct 2025 – Present</span></p>
<p style="margin:0"><em>Freelance Web Developer</em> <span style="float:right;opacity:.75;font-size:.9em">Kollam, Kerala</span></p>
<ul style="margin:6px 0 16px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li>Focused on Web Design & UI/UX by prototyping applications quickly and creating responsive and interactive designs tailored for diverse clients (4 international, 2 domestic) generating 100,000+ in revenue.</li>
  <li>Managed the full SDLC for high-performance websites, from UI design to back-end integration and cloud deployment.</li>
</ul>

<p style="margin:0"><strong>GENPRO RESEARCH (Acquired clinical research technology firm)</strong> <span style="float:right;opacity:.75;font-size:.9em">May 2023 – Aug 2023</span></p>
<p style="margin:0"><em>Backend Developer Intern</em> <span style="float:right;opacity:.75;font-size:.9em">Thiruvananthapuram, Kerala</span></p>
<ul style="margin:6px 0 16px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li>Engineered 'envstore,' a FastAPI and Docker-based tool deployed on Linux environments, generating innovative solutions to improve environment management and reduce setup cycles.</li>
</ul>

<p style="margin:0"><strong>TATA ELXSI</strong> <span style="float:right;opacity:.75;font-size:.9em">July 2024 – Aug 2024</span></p>
<p style="margin:0"><em>Corporate Quality Intern</em> <span style="float:right;opacity:.75;font-size:.9em">Thiruvananthapuram, Kerala</span></p>
<ul style="margin:6px 0 16px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li>Built a QA dashboard via Microsoft Power Apps for real-time analytics, tracking 15+ key SDLC metrics for 50+ developers.</li>
</ul>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">University Projects</h2>

<p style="margin:0"><strong>LITTLE LEMON RESTAURANT BOOKING SYSTEM</strong> <span style="float:right;opacity:.75;font-size:.9em">Aug 2025</span></p>
<ul style="margin:6px 0 12px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li>Build a Django/Python/SQL application handling concurrent users with &lt;200ms response times and 98.5% automated test coverage.</li>
</ul>

<p style="margin:0"><strong>PRIVACY-PRESERVING BIOMETRIC IDENTIFICATION (Industrial Project)</strong> <span style="float:right;opacity:.75;font-size:.9em">Jan 2024</span></p>
<ul style="margin:6px 0 12px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li>Architected a secure matching system using Gabor filters and Fully Homomorphic Encryption (FHE) to secure 640-dimensional feature vectors.</li>
</ul>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">Activities</h2>

<p style="margin:0"><strong>Fashion Club TKMCE</strong> <span style="float:right;opacity:.75;font-size:.9em">Aug 2023 – May 2025</span></p>
<p style="margin:0"><em>Founder & President</em> <span style="float:right;opacity:.75;font-size:.9em">Kollam, Kerala</span></p>
<ul style="margin:6px 0 12px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li>Established the campus's first fashion organization, raising ₹60,000 in corporate sponsorships and directing 3+ major campus-wide events.</li>
</ul>

<p style="margin:0"><strong>IEDC TKMCE (Innovation and Entrepreneurship Development Cell)</strong> <span style="float:right;opacity:.75;font-size:.9em">July 2022 – May 2024</span></p>
<p style="margin:0"><em>Coordinator</em> <span style="float:right;opacity:.75;font-size:.9em">Kollam, Kerala</span></p>
<ul style="margin:6px 0 12px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li>Led three national-level hackathons with 1,000+ registrations and secured ₹100,000+ in corporate funding to support student-led startups.</li>
</ul>

<h2 style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:20px 0 6px">Additional</h2>
<ul style="margin:6px 0 12px 20px;padding:0;line-height:1.6;font-size:0.9rem">
  <li><strong>Technical Skills:</strong> Python, .NET, C#, SQL (PostgreSQL, MySQL), JavaScript, Django, FastAPI, Docker, Git, React, HTML, CSS, Linux</li>
  <li><strong>AI/ML Techniques:</strong> RAG, Vector Embeddings, LLMs, Gemini API, AI/ML Productivity Tools</li>
  <li><strong>Certifications & Training:</strong> CompTIA Learning Linux Command Line (2025), Meta Back-End Developer (2025)</li>
  <li><strong>Awards:</strong> First Prize, ACM Inter-Collegiate Coding Competition (2023); Honorable Mention, National Model United Nations (2024)</li>
</ul>`

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
            editorRef.current.innerHTML = DEFAULT_CONTENT //  use editorRef.current.innerHTML = saved || DEFAULT_CONTENT  to load the changes made to resume
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
