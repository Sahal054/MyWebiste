"use client";

import React, { useEffect, useState } from 'react'
import { X, Cpu, HardDrive } from 'lucide-react'
import { useApp } from '../../context/App'
import { motion, AnimatePresence } from 'framer-motion'

interface ServerStats {
    memory: {
        total: string
        used: string
        free: string
        percent: string
    }
    cpu: {
        model: string
        cores: number
        loadAvg1m: string
        loadAvg5m: string
        usagePercent: string
    }
    uptime: number
    hostname: string
    platform: string
}

function formatUptime(seconds: number) {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (d > 0) return `${d}d ${h}h ${m}m`
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
}

function UsageBar({ percent, color }: { percent: number; color: string }) {
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 border border-black/10 dark:border-white/10 overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
            />
        </div>
    )
}

export default function ServerStatsPanel() {
    const { isNotificationsOpen, setNotificationsOpen } = useApp()
    const [stats, setStats] = useState<ServerStats | null>(null)
    const [error, setError] = useState(false)
    const [tick, setTick] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    useEffect(() => {
        if (!isNotificationsOpen) return

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/server-stats')
                if (!res.ok) throw new Error('Non-200')
                setStats(await res.json())
                setError(false)
            } catch {
                setError(true)
            }
        }

        fetchStats()
        const interval = setInterval(() => {
            fetchStats()
            setTick(t => t + 1)
        }, 3000)
        return () => clearInterval(interval)
    }, [isNotificationsOpen])

    const cpuPercent = stats ? parseFloat(stats.cpu.usagePercent) : 0
    const ramPercent = stats ? parseFloat(stats.memory.percent) : 0

    return (
        <AnimatePresence>
            {isNotificationsOpen && (
                

                
                // <motion.div
                //     initial={isMobile ? { y: 80, opacity: 0 } : { x: '100%', opacity: 0 }}
                //     animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
                //     exit={isMobile ? { y: 80, opacity: 0 } : { x: '100%', opacity: 0 }}
                //     transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                //     // FIXED: Added text-gray-900 dark:text-gray-100 right here!
                //     className={`fixed z-50 flex flex-col bg-white dark:bg-[#1d1f27] text-gray-900 dark:text-gray-100 border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden ${
                //         isMobile
                //             ? 'bottom-20 left-4 right-4'
                //             : 'top-4 right-4 w-72'
                //     }`}
                // >




                <motion.div

                        drag={!isMobile} 
                        dragMomentum={false}
                        // 2. CHANGE ANIMATION TO DROP DOWN INSTEAD OF SLIDE FROM RIGHT
                        initial={isMobile ? { y: 80, opacity: 0 } : { y: -20, opacity: 0 }}
                        animate={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                        exit={isMobile ? { y: 80, opacity: 0 } : { y: -20, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed z-50 flex flex-col bg-white dark:bg-[#1d1f27] text-gray-900 dark:text-gray-100 border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden ${
                            isMobile
                                ? 'bottom-20 left-4 right-4'
                                // 3. SHIFT IT 340px FROM THE RIGHT EDGE TO CLEAR THE STICKY NOTE
                                : 'top-4 right-[340px] w-72 cursor-grab active:cursor-grabbing' 
                        }`}
                            >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4" strokeWidth={1.5} />
                            <span className="font-bold text-xs uppercase tracking-widest">Server Stats</span>
                        </div>
                        <button
                            onClick={() => setNotificationsOpen(false)}
                            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col gap-5">
                        {error && (
                            <p className="text-xs text-red-500 text-center py-2">
                                Could not reach <code className="bg-red-50 px-1 rounded">/api/server-stats</code>
                            </p>
                        )}

                        {!stats && !error && (
                            <div className="flex items-center justify-center py-6">
                                <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
                            </div>
                        )}

                        {stats && (
                            <>
                                {/* CPU */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Cpu className="w-3 h-3" /> CPU
                                        </span>
                                        <span className="text-xs font-mono font-bold">
                                            {stats.cpu.usagePercent}%
                                        </span>
                                    </div>
                                    <UsageBar
                                        percent={cpuPercent}
                                        color={cpuPercent > 80 ? 'bg-red-500' : cpuPercent > 50 ? 'bg-yellow-400' : 'bg-green-500'}
                                    />
                                    <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                        <span>{stats.cpu.cores} cores</span>
                                        <span>load avg {stats.cpu.loadAvg1m} / {stats.cpu.loadAvg5m}</span>
                                    </div>
                                </div>

                                {/* RAM */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <HardDrive className="w-3 h-3" /> RAM
                                        </span>
                                        <span className="text-xs font-mono font-bold">
                                            {stats.memory.used} / {stats.memory.total} GB
                                        </span>
                                    </div>
                                    <UsageBar
                                        percent={ramPercent}
                                        color={ramPercent > 85 ? 'bg-red-500' : ramPercent > 65 ? 'bg-yellow-400' : 'bg-blue-500'}
                                    />
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                        {stats.memory.percent}% used · {stats.memory.free} GB free
                                    </p>
                                </div>

                                {/* System */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 grid grid-cols-2 gap-y-1.5 text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">Host</span>
                                    <span className="font-mono text-right truncate">{stats.hostname}</span>
                                    <span className="text-gray-500 dark:text-gray-400">Platform</span>
                                    <span className="font-mono text-right">{stats.platform}</span>
                                    <span className="text-gray-500 dark:text-gray-400">Uptime</span>
                                    <span className="font-mono text-right">{formatUptime(stats.uptime)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-3 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                        <span className="text-[11px] text-gray-400">Live · refreshes every 3s</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}