"use client";

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Maximize2, Minus, Mail, Link2, Send } from 'lucide-react'
import { useApp } from '../../context/App'

const CONTACT_EMAIL = 'you@example.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/your-linkedin-handle/'
const MIN_W = 420
const MIN_H = 300

export default function ContactWindow() {
    // 1. Pull in the new minimize states
    const { isContactOpen, setContactOpen, isContactMinimized, setContactMinimized } = useApp()
    const dragControls = useDragControls()
    const [isMaximized, setIsMaximized] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    
    // Resize state (starts at 640x560)
    const [size, setSize] = useState({ w: 640, h: 560 })

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const close = () => {
        setContactOpen(false)
        setIsMaximized(false)
        setContactMinimized(false)
    }

    // 2. Add the resizing logic (identical to DocEditorWindow)
    const startResize = useCallback((
        e: React.PointerEvent,
        edges: { right?: boolean; bottom?: boolean }
    ) => {
        e.preventDefault()
        e.stopPropagation()
        const sx = e.clientX, sy = e.clientY
        const sw = size.w, sh = size.h
        const onMove = (ev: PointerEvent) => setSize(prev => ({
            w: edges.right ? Math.max(MIN_W, sw + ev.clientX - sx) : prev.w,
            h: edges.bottom ? Math.max(MIN_H, sh + ev.clientY - sy) : prev.h,
        }))
        const onUp = () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
    }, [size])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setSuccessMessage(null)
        setErrorMessage(null)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim() || undefined,
                    message: message.trim(),
                }),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                throw new Error(data?.error ?? 'Failed to send message')
            }

            setSuccessMessage('Thanks for the message. I received it.')
            setEmail('')
            setMessage('')
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    // 3. Only visible if open AND not minimized
    const isVisible = isContactOpen && !isContactMinimized
    const isFloating = !isMobile && !isMaximized

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    drag={isFloating}
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className={`fixed z-[47] flex flex-col overflow-hidden select-none ${isMobile ? 'rounded-none' : 'rounded-xl'}`}
                    style={
                        isMobile 
                            ? { inset: 0 } 
                            : isMaximized 
                                ? { inset: '1rem' } 
                                : { top: '12vh', left: '50%', transform: 'translateX(-50%)', width: size.w, height: size.h }
                    }
                >
                    <div className="absolute inset-0 rounded-xl border-2 border-black/60 dark:border-white/20 pointer-events-none z-10" />
                    <div className="absolute inset-0 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] pointer-events-none" />

                    <div
                        className={`relative flex items-center justify-between px-3 h-9 bg-[#e8e6e2] dark:bg-[#2a2d3a] border-b border-black/20 dark:border-white/10 flex-shrink-0 ${isFloating ? 'cursor-grab active:cursor-grabbing' : ''}`}
                        onPointerDown={isFloating ? e => dragControls.start(e) : undefined}
                    >
                        <div className="flex items-center gap-1.5 group/lights">
                            {/* RED: Close */}
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={close}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:opacity-90"
                            >
                                <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000]" strokeWidth={3} />
                            </button>
                            {/* YELLOW: Minimize */}
                            <button 
                                onPointerDown={e => e.stopPropagation()} 
                                onClick={() => setContactMinimized(true)}
                                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#e0a21c] flex items-center justify-center hover:opacity-90 active:opacity-70" 
                                aria-label="Minimize"
                            >
                                <Minus className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#5a3800]" strokeWidth={3} />
                            </button>
                            {/* GREEN: Maximize */}
                            <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => setIsMaximized(m => !m)}
                                className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aaa2f] flex items-center justify-center hover:opacity-90"
                            >
                                <Maximize2 className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 text-[#003d00]" strokeWidth={3} />
                            </button>
                        </div>
                        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-gray-700 dark:text-gray-200">
                            Contact
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1e2130] p-5">
                        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] h-full">
                            <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4 flex flex-col gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Get in touch</p>
                                    <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">Email and LinkedIn</h2>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Use the links below to reach out directly, or leave a quick review about this page.
                                    </p>
                                </div>

                                <div className="grid gap-3">
                                    <a
                                        href={`mailto:${CONTACT_EMAIL}`}
                                        className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1b1e2a] px-4 py-3 hover:border-gray-400 dark:hover:border-white/25 transition-colors"
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                            <Mail className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Email</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{CONTACT_EMAIL}</p>
                                        </div>
                                    </a>

                                    <a
                                        href={LINKEDIN_URL}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1b1e2a] px-4 py-3 hover:border-gray-400 dark:hover:border-white/25 transition-colors"
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                            <Link2 className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">LinkedIn</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Open my LinkedIn profile</p>
                                        </div>
                                    </a>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4 flex flex-col">
                                <div className="mb-4">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Leave a review</p>
                                    <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">Share feedback</h2>
                                </div>

                                <form className="flex flex-col gap-3 flex-1" onSubmit={handleSubmit}>
                                    <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Email
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Optional"
                                            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1b1e2a] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-black dark:focus:border-white"
                                        />
                                    </label>

                                    <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Message
                                        <textarea
                                            required
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            placeholder="Leave a review about the page or share a message."
                                            className="min-h-[120px] flex-1 resize-none rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1b1e2a] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-black dark:focus:border-white"
                                        />
                                    </label>

                                    {successMessage && (
                                        <p className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-300">
                                            {successMessage}
                                        </p>
                                    )}
                                    {errorMessage && (
                                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                                            {errorMessage}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="inline-flex mt-auto items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
                                    >
                                        <Send className="h-4 w-4" />
                                        {isLoading ? 'Sending...' : 'Send message'}
                                    </button>
                                </form>
                            </section>
                        </div>
                    </div>

                    {/* 4. Add the Resize Handles for Desktop */}
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