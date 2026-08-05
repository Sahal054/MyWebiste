"use client";

import React from 'react'
import {
    FileText,
    FilePlus,
    FolderGit2,
    Briefcase,
    Table,
    Mail,
    MessageSquareText,
    MonitorPlay,
    UserCircle,
    ListTree,
    BookOpen,
    GraduationCap,
    Trash2,
    HelpCircle
} from 'lucide-react'

// Represents an interactive desktop application or link
export interface AppItem {
    label: string
    Icon: React.ReactNode
    url?: string
    onClick?: () => void
    source?: string
}

export interface AppIconProps {
    name: string
    className?: string
}

export interface AppItem {
    label: string
    Icon: React.ReactNode
    url?: string
    onClick?: () => void
    source?: string
    id?: string //  Used to identify which file to delete
    isDeletable?: boolean //  Prevents dragging core apps to the trash
}

export const AppIcon = ({ name, className = "w-12 h-12 text-primary" }: AppIconProps) => {
    // Applying a uniform style and stroke width to all desktop icons
    const iconProps = { className, strokeWidth: 1.5 }
    const lowerName = name.toLowerCase()

    if (lowerName.endsWith('.mdx')) {
        return <FileText {...iconProps} /> // Use the standard document icon
    }

    

    // Maps the legacy string names used in Desktop/index.tsx to Lucide React icons
    switch (name.toLowerCase()) {
        case 'new doc':
        case 'newdoc':
            return <FilePlus {...iconProps} />
        case 'doc': 
        case 'resume':
            return <FileText {...iconProps} /> // Resume / Home
        case 'notebook': 
            return <FolderGit2 {...iconProps} /> // Projects
        case 'pricing': 
            return <Briefcase {...iconProps} /> // Services
        case 'spreadsheet': 
            return <Table {...iconProps} /> // Experience
        case 'envelope': 
            return <Mail {...iconProps} /> // Contact
        case 'forums': 
            return <MessageSquareText {...iconProps} /> // Ask AI
        case 'switch': 
            return <MonitorPlay {...iconProps} /> // Website mode switch
        case 'posthog': 
            return <UserCircle {...iconProps} /> // Replaced PostHog mascot with generic User for "About Me"
        case 'invite': 
            return <ListTree {...iconProps} /> // Changelog
        case 'handbook': 
            return <BookOpen {...iconProps} /> // Handbook
        case 'typewriter': 
            return <GraduationCap {...iconProps} /> // Careers
        case 'trash': 
            return <Trash2 {...iconProps} /> // Trash
        default: 
            return <HelpCircle {...iconProps} /> // Fallback icon
    }
}