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
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -left-12 top-4 w-12 h-12 bg-[#f5efe0] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 drop-shadow-md"
                aria-label="Toggle Sticky Note"
            >               
                <img 
                    src="https://res.cloudinary.com/dmukukwp6/image/upload/post_it_classic_c0c129d5b5.png" 
                    alt="Toggle Sticky Note"
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
                    
                    <div className="min-h-[28px] leading-[28px] font-bold">📌 Current Focus</div>
                    <div className="min-h-[28px] leading-[28px]"><br/></div>
                    
                    <div className="min-h-[28px] leading-[28px] font-bold text-gray-600">Active Development</div>
                    <Task>Build a custom AI Transformer model from scratch (focusing on self-attention mechanisms).</Task>
                    <Task>Architect a high-performance ETL data pipeline API using Python.</Task>
                    <Task checked>Daily LeetCode grind (optimizing algorithmic efficiency).</Task>
                    <Task>A Functional Terminal Emulator for this Website.</Task>
                    
                    <div className="min-h-[28px] leading-[28px]"><br/></div>
                    
                    <div className="min-h-[28px] leading-[28px] font-bold text-gray-600">Completed</div>
                    <Strikethrough>Build interactive desktop OS portfolio using Next.js.</Strikethrough>
                    <Strikethrough>Containerize portfolio with Docker.</Strikethrough>
                    <Strikethrough>Deploy Next.js stack to home server network.</Strikethrough>

                </div>
            </div>
        </motion.div>
    )
}