"use client";

import React from 'react'

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'underline' | 'underlineOnHover'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface OSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    children?: React.ReactNode
    icon?: React.ReactNode
    hover?: string
    className?: string
}

const sizeClasses: Record<ButtonSize, string> = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-base',
}

const variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-accent hover:bg-accent/80 text-primary border border-border',
    primary: 'bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_#111]',
    secondary: 'bg-white hover:bg-gray-50 text-primary border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    underline: 'text-primary underline bg-transparent',
    underlineOnHover: 'text-primary hover:underline bg-transparent',
}

export default function OSButton({
    variant = 'default',
    size = 'md',
    children,
    icon,
    className = '',
    ...props
}: OSButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {icon}
            {children}
        </button>
    )
}
