"use client";

import React from 'react'
import Lottie from 'lottie-react'
import { hourglassAnimation, hourglassAnimationWhite } from './lottieAnimations'

interface HourglassSpinnerProps {
    size?: number
    useWhite?: boolean
    className?: string
}

export default function HourglassSpinner({ 
    size = 40, 
    useWhite = false,
    className = ""
}: HourglassSpinnerProps) {
    const animationData = useWhite ? hourglassAnimationWhite : hourglassAnimation

    return (
        <div 
            style={{ width: size, height: size }} 
            className={`flex items-center justify-center ${className}`}
        >
            {/* Prevent rendering crash if lottie JSON is missing */}
            {animationData ? (
                <Lottie animationData={animationData} loop={true} />
            ) : (
                <div className="w-full h-full border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
        </div>
    )
}