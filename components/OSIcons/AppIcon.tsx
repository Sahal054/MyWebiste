"use client";

import React from 'react'
import {
    FileText,
    FilePlus,
    FolderGit2,
    FolderOpen,
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
    HelpCircle,
    Film,
    Server,
    Image as ImageIcon,
} from 'lucide-react'

// Represents an interactive desktop application or link
export interface AppItem {
    label: string;
    Icon: React.ReactNode;
    url?: string;
    onClick?: () => void;
    source?: string;
    
    // Properties for drag-and-drop / trash
    id?: string; 
    isDeletable?: boolean; 
    
    // Property for custom Cloudinary images
    iconUrl?: string; 
}

export interface AppIconProps {
    name: string
    className?: string
    iconUrl?: string
}



export const AppIcon = ({ name, className = "w-12 h-12 text-primary", iconUrl }: AppIconProps) => {
    if (iconUrl) {
        return <img src={iconUrl} alt={name} className={`${className} object-contain`} draggable={false} />
    }

    // Applying a uniform style and stroke width to all desktop icons
    const iconProps = { className, strokeWidth: 1.5 }
    const lowerName = name.toLowerCase()

    if (lowerName.endsWith('.mdx')) {
        return <FileText {...iconProps} />
    }
    if (lowerName.endsWith('.mov') || lowerName.endsWith('.mp4') || lowerName.endsWith('.avi') || lowerName.endsWith('.webm')) {
        return <Film {...iconProps} />
    }
    if (lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.gif') || lowerName.endsWith('.webp')) {
        return <ImageIcon {...iconProps} />
    }
    if (lowerName.endsWith('.pdf') || lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
        return <FileText {...iconProps} />
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
            return <FolderGit2 {...iconProps} />
        case 'projects':
        case 'folder':
            return <FolderOpen {...iconProps} />
        case 'server stats':
            return <Server {...iconProps} />
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
          //  return <HelpCircle {...iconProps} /> // Fallback icon
          return (
                <img 
                    src="https://res.cloudinary.com/dmukukwp6/image/upload/folder_classic_d2fdf96f82.png" 
                    alt={name} 
                    className={`${className} object-contain`} 
                    draggable={false} 
                />
            )
    }
}