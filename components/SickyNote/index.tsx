"use client";

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function StickyNote() {
    const [isOpen, setIsOpen] = useState(false)

    // Helper component to render a checkbox item
    const Task = ({ checked, children }: { checked?: boolean, children: React.ReactNode }) => (
        <div className="flex items-start gap-2 min-h-[28px] leading-[28px]">
            <input 
                type="checkbox" 
                checked={checked} 
                readOnly
                className="mt-[7px] accent-gray-800 cursor-default w-3.5 h-3.5"
            />
            <span className={checked ? 'line-through text-gray-500' : 'text-gray-800'}>
                {children}
            </span>
        </div>
    )

    // Helper component to render a simple strikethrough line
    const Strikethrough = ({ children }: { children: React.ReactNode }) => (
        <div className="min-h-[28px] leading-[28px]">
            <s className="opacity-50">{children}</s>
        </div>
    )

    return (
        <motion.div
            initial={{ x: 300 }}
            animate={{ x: isOpen ? 0 : 300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-24 right-0 z-40 flex drop-shadow-2xl"
        >
            {/* RETRO WINDOWS 95 PIXEL BUTTON */}
            {/* <button
                onClick={() => setIsOpen(!isOpen)}
                // Changed background to #d4d0c8 (Classic Windows 9x Beige)
                className="absolute -left-10 top-4 w-10 h-10 bg-[#d4d0c8] text-black border-[3px] border-t-white border-l-white border-b-[#808080] border-r-[#808080] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
                aria-label="Toggle Sticky Note"
            >
                <span className="font-mono text-xl font-bold leading-none mt-[-2px] pointer-events-none select-none">
                    {isOpen ? '>' : '<'}
                </span>
            </button> */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                // Removed the retro borders and background, made it transparent with a scale effect on hover/click
                className="absolute -left-12 top-4 w-12 h-12 bg-[#f5efe0] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 drop-shadow-md"
                aria-label="Toggle Sticky Note"
>               
                <img 
                    src="https://res.cloudinary.com/dmukukwp6/image/upload/post_it_classic_c0c129d5b5.png" 
                    alt="Toggle Sticky Note"
                    // If the sticky note is open, this slightly rotates the icon to give visual feedback
                    className={`w-full h-full object-contain pointer-events-none transition-transform duration-300 ${isOpen ? '-rotate-12' : 'rotate-0'}`}
                    draggable={false}
                />
            </button>

            {/* Retro Lined Paper Body */}
            <div 
                className="w-[300px] h-[400px] relative border-y border-l border-black/20 overflow-hidden"
                style={{
                    backgroundColor: '#fef3c7',
                    backgroundImage: `
                        linear-gradient(#ef4444 1px, transparent 1px), 
                        repeating-linear-gradient(transparent, transparent 27px, #93c5fd 27px, #93c5fd 28px)
                    `,
                    backgroundSize: '100% 100%, 100% 28px',
                    backgroundPosition: '36px 0, 0 32px'
                }}
            >
                {/* STATIC VIEW MODE */}
                <div className="w-full h-full text-[15px] font-mono text-gray-800 pl-[45px] pr-4 pt-[35px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    
                    <div className="min-h-[28px] leading-[28px]">📌 Current Focus & To-Dos</div>
                    <div className="min-h-[28px] leading-[28px]"><br/></div>
                    
                    <div className="min-h-[28px] leading-[28px]">Infrastructure</div>
                    <Task>Containerize Next.js portfolio.</Task>
                    <Task>Optimize Portainer stack & monitor Jellyfin instance.</Task>
                    <div className="min-h-[28px] leading-[28px]"><br/></div>
                    
                    <div className="min-h-[28px] leading-[28px]">Active Development</div>
                    <Task checked>Refine Python ModelRouter script for dynamic LLM routing.</Task>
                    <Task checked>Streamline CareStack database onboarding workflows.</Task>
                    <Task>Manage repository hosting for Wahn Design freelance projects.</Task>
                    <div className="min-h-[28px] leading-[28px]"><br/></div>
                    
                    <Strikethrough>Old deleted task example</Strikethrough>

                </div>
            </div>
        </motion.div>
    )
}