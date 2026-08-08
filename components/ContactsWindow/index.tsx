"use client";

import React, { useState } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Maximize2, Mail, Link2, Send } from 'lucide-react'
import { useApp } from '../../context/App'

const CONTACT_EMAIL = 'you@example.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/your-linkedin-handle/'

export default function ContactWindow() {
    const { isContactOpen, setContactOpen } = useApp()
    const dragControls = useDragControls()
    const [isMaximized, setIsMaximized] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const W = 640, H = 560

    const close = () => {
        setContactOpen(false)
        setIsMaximized(false)
    }

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

    return (
        <AnimatePresence>
            {isContactOpen && (
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
                    style={isMaximized ? { inset: '1rem' } : { top: '12vh', left: '50%', transform: 'translateX(-50%)', width: W, height: H }}
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
                                onClick={close}
                                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:opacity-90"
                            >
                                <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 text-[#4d0000]" strokeWidth={3} />
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

                            <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
                                <div className="mb-4">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Leave a review</p>
                                    <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">Share feedback</h2>
                                </div>

                                <form className="flex h-full flex-col gap-3" onSubmit={handleSubmit}>
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
                                            className="min-h-40 flex-1 resize-none rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1b1e2a] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-black dark:focus:border-white"
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
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
                                    >
                                        <Send className="h-4 w-4" />
                                        {isLoading ? 'Sending...' : 'Send message'}
                                    </button>
                                </form>
                            </section>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
