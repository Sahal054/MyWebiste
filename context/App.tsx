"use client";

import React, { createContext, useContext, useState, useEffect } from 'react'
import { deleteMediaFile, clearMediaFiles } from '../components/Desktop/mediaStorage'
import { CERTIFICATION_RECORDS } from '../lib/certifications'

export interface UserFolder {
    id: string
    name: string
    items: string[]
    trashed?: boolean
}

export interface SavedDoc {
    id: string
    filename: string
    content: string
    createdAt: number
    trashed?: boolean
    mediaStorageKey?: string
    mediaMimeType?: string
}

interface AppContextValue {
    isNotificationsOpen: boolean
    setNotificationsOpen: (open: boolean) => void
    websiteMode: boolean
    compact: boolean
    darkMode: boolean
    toggleDarkMode: () => void
    wallpaper: string | null
    setWallpaper: (url: string | null) => void
    // Trash
    clearAllDocs: () => void
    deleteDoc: (id: string) => void
    moveToTrash: (id: string) => void
    restoreDoc: (id: string) => void
    emptyTrash: () => void
    isTrashOpen: boolean
    setTrashOpen: (open: boolean) => void
    isTrashMinimized: boolean
    setTrashMinimized: (min: boolean) => void
    isHoveringTrash: boolean
    setIsHoveringTrash: (val: boolean) => void
    // Projects folder
    isProjectsOpen: boolean
    setProjectsOpen: (open: boolean) => void
    isProjectsMinimized: boolean
    setProjectsMinimized: (open: boolean) => void
    projectFolderItems: string[]
    addToProjectFolder: (id: string) => void
    removeFromProjectFolder: (id: string) => void
    // Resume window (pre-populated personal resume)
    isDocOpen: boolean
    setDocOpen: (open: boolean) => void
    isDocMinimized: boolean
    setDocMinimized: (min: boolean) => void
    // New-doc / saved-doc editor window
    isNewDocOpen: boolean
    setNewDocOpen: (open: boolean) => void
    isNewDocMinimized: boolean
    setNewDocMinimized: (min: boolean) => void
    openSavedDocId: string | null
    setOpenSavedDocId: (id: string | null) => void
    // User-created documents
    savedDocs: SavedDoc[]
    addSavedDoc: (filename: string, content: string) => SavedDoc
    addMediaDoc: (filename: string, storageKey: string, mimeType: string) => SavedDoc
    updateSavedDoc: (id: string, content: string) => void
    // User-created folders
    userFolders: UserFolder[]
    createFolder: (name: string) => UserFolder
    addDocToFolder: (folderId: string, docId: string) => void
    removeDocFromFolder: (folderId: string, docId: string) => void
    deleteFolder: (folderId: string) => void
    restoreFolder: (folderId: string) => void
    deleteFolderPermanently: (folderId: string) => void
    certificationDocs: SavedDoc[]
    addDocToCertifications: (docId: string) => void
    removeDocFromCertifications: (docId: string) => void
    isFolderWindowOpen: boolean
    setFolderWindowOpen: (open: boolean) => void
    isFolderWindowMinimized: boolean
    setFolderWindowMinimized: (min: boolean) => void
    activeFolderWindowId: string | null
    setActiveFolderWindowId: (id: string | null) => void
    isMediaWindowOpen: boolean
    setMediaWindowOpen: (open: boolean) => void
    isMediaWindowMinimized: boolean
    setMediaWindowMinimized: (min: boolean) => void
    activeMediaDocId: string | null
    setActiveMediaDocId: (id: string | null) => void
    pdfWindows: PdfWindowState[]
    openPdfWindow: (docId: string) => string
    closePdfWindow: (windowId: string) => void
    minimizePdfWindow: (windowId: string, minimized: boolean) => void
    restorePdfWindow: (windowId: string) => void
    // Contact window
    isContactOpen: boolean
    setContactOpen: (open: boolean) => void
    isContactMinimized: boolean;
    setContactMinimized: (minimized: boolean) => void;
}

export interface PdfWindowState {
    windowId: string
    docId: string
    minimized: boolean
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const SANDY_CREAM_URL = 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1784807608/BgImageLight_xrzkez.png'
const FOLDERS_KEY = 'user-folders'
const DOCS_KEY = 'user-docs'
const DEFAULT_MOV_URL = 'https://res.cloudinary.com/dyyfvzis2/video/upload/v1786567457/vlipsy-south-park-briefcases-explode-7hp31LuO_aojxz3.mp4'
// FIX: Corrected "cloudinarsy" to "cloudinary"
const DEFAULT_IMG_URL = 'https://res.cloudinary.com/dyyfvzis2/image/upload/v1786567626/G2wT8rBXsAANZ6u_rvnn6w.jpg'
const ABOUT_DOC_FILENAME = 'about-me.mdx'
const ABOUT_CONTENT_VERSION = '3'
const ABOUT_CONTENT_VERSION_KEY = 'about-content-version'
const ABOUT_CONTENT_BASELINE_KEY = 'about-content-baseline'

const WELCOME_CONTENT = `
<div style="font-family: sans-serif; max-width: 650px; line-height: 1.6;">
    <h1 style="font-size: 26px; font-weight: bold; margin-bottom: 12px;">👋 Hello there, Welcome to my Desktop OS</h1>
    <p style="margin-bottom: 24px; font-size: 15px;">
     Inspired by the macOS desktop experience, I built this fully interactive desktop environment from scratch using Next.js, React, and Framer Motion. The idea was to experiment with client-side state management, browser persistence, and building a UI that behaves like a real desktop.
    </p>
    <h3 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid rgba(150,150,150,0.3); padding-bottom: 8px; margin-bottom: 16px;">✨ Things you can do right now:</h3>
       <p style="margin-bottom: 8px; font-size: 15px;"><b>📁 File System & Drag-and-Drop</b></p>
         <ul style="margin-bottom: 24px; padding-left: 20px; font-size: 14px; color: opacity-80;">
                <li style="margin-bottom: 8px;"><b>Create & Edit:</b> Click "New Doc" in the dock to open the text editor. Your text auto-saves directly to your browser's <code>localStorage</code>.</li>
                <li style="margin-bottom: 8px;"><b>Folders:</b> Right-click the desktop background to create new folders. You can physically drag and drop any document or media file straight into a folder window to organize your desktop.</li>
                <li style="margin-bottom: 8px;"><b>The Trash Can:</b> Done with a file? Drag and drop it directly onto the Trash icon (either on the desktop or the dock). It has real collision detection. You can even drag entire folders containing files into the trash to delete them all at once.</li>
        </ul>

     <p style="margin-bottom: 8px; font-size: 15px;"><b>🖼️ Media Handling (IndexedDB)</b></p>
         <ul style="margin-bottom: 24px; padding-left: 20px; font-size: 14px; color: opacity-80;">
             <li style="margin-bottom: 8px;"><b>Upload Your Own:</b> Right-click the desktop and select "Add Media From Device". You can upload local images, <code>.mp4</code> or <code>.mov</code> videos, and <code>.pdf</code> files. They will generate an icon on the desktop and open in dedicated media viewers.</li>
                      </ul>
    <ul style="margin-bottom: 32px; padding-left: 20px; font-size: 15px; color: opacity-90; line-height: 1.7;">
        <li style="margin-bottom: 8px;"><b>📂 Explore my Projects:</b> Open the Projects folder to dive into my recent work.</li>
        <li style="margin-bottom: 8px;"><b>📌 Check my current focus:</b> Glance at the retro Sticky Note in the corner to see exactly what I'm actively working on or learning today.</li>
        <li style="margin-bottom: 8px;"><b>📜 View my Certifications:</b> Open the desktop folder to browse my credentials inside a custom-built PDF viewer.</li>
        <li style="margin-bottom: 8px;"><b>📊 View live Server Stats:</b> This entire website is actually being hosted on my personal home laptop server! Click the "Server Stats" icon to see live metrics on how the hardware is holding up.</li>
        <li style="margin-bottom: 8px;"><b>✉️ Leave a Review:</b> Open the Envelope app in the dock to send me a message, ask a question, or leave a review about the site.</li>
    </ul>
    <h3 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid rgba(150,150,150,0.3); padding-bottom: 8px; margin-bottom: 16px;">🛠️ What's happening under the hood?</h3>
    <p style="margin-bottom: 16px; font-size: 15px;">
        <b>Heavy Media Processing:</b> If you upload a video or PNG, standard local storage would crash immediately. To fix this, I made a pipeline using your browser's <code>IndexedDB</code>. It securely processes and stores heavy media blobs entirely on the client side, keeping the whole OS fast.
    </p>
    <p style="margin-bottom: 16px; font-size: 15px;">
        <b>State Physics & Persistence:</b> The drag-and-drop mechanics, window z-indexing, and collision detection (like throwing a folder into the trash) are all managed through complex React state. Plus, whether you write a custom markdown doc or change the wallpaper, it instantly persists to <code>localStorage</code>.
    </p>
    <p style="margin-bottom: 16px; font-size: 15px;">
        <b>Serverless APIs & Hardware:</b> When you submit a review via the Envelope, it hits a Next.js serverless route that triggers a Discord webhook, pinging my phone instantly. All of this is being served and routed directly from my home lab setup.
    </p>
    <p style="font-style: italic; color: #777; margin-top: 32px; font-size: 15px; text-align: center;">
        Go ahead and make yourself at home. Upload a video, change the theme, or just drag this exact file into the trash. Have fun exploring!
    </p>
</div>
`


const ABOUT_CONTENT = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 0 auto; line-height: 1.7; padding-bottom: 24px;">

    <!-- Top System Header -->
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px dashed rgba(150,150,150,.3);">
        <span style="font-family: monospace; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; opacity: .6;">
            ~/about-sahal/readme.md
        </span>
        <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 4px 10px; border-radius: 999px; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.35);">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: #22c55e; display: inline-block;"></span>
            Bangalore, IN · Assistant System Engineer @ TCS
        </span>
    </div>

    <!-- Hero Section with Avatar & Animated Wave GIF -->
    <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 22px;">
        <img 
            src="https://github.com/Sahal054.png" 
            alt="Sahal M" 
            style="width: 84px; height: 84px; border-radius: 20px; object-fit: cover; border: 2px solid rgba(150,150,150,.3); box-shadow: 0 8px 20px rgba(0,0,0,.12);"
        />
        <div style="flex: 1; min-width: 220px;">
            <h1 style="font-size: 28px; line-height: 1.2; font-weight: 800; margin: 0 0 8px; display: flex; align-items: center; gap: 8px;">
                Hey, I'm Sahal M.
                <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif" alt="wave" style="width: 28px; height: 28px;" />
            </h1>
            <p style="font-size: 15px; margin: 0; opacity: .85;">
                Software engineer who loves figuring out how things work under the hood, building reliable backend systems, and occasionally over-engineering side projects—like turning a portfolio into a full desktop OS—just for the fun of it.
            </p>
        </div>
    </div>

    <!-- Quick Highlights / Bento Strip -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 10px; margin: 20px 0 24px;">
        <div style="padding: 12px; border-radius: 12px; background: rgba(150,150,150,.07); border: 1px solid rgba(150,150,150,.2);">
            <div style="font-size: 18px; font-weight: 800;">Backend & Cloud</div>
            <div style="font-size: 12px; opacity: .7;">APIs, Databases & Infra</div>
        </div>
        <div style="padding: 12px; border-radius: 12px; background: rgba(150,150,150,.07); border: 1px solid rgba(150,150,150,.2);">
            <div style="font-size: 18px; font-weight: 800;">30+ Clients</div>
            <div style="font-size: 12px; opacity: .7;">Enterprise Data Migrated</div>
        </div>
        <div style="padding: 12px; border-radius: 12px; background: rgba(150,150,150,.07); border: 1px solid rgba(150,150,150,.2);">
            <div style="font-size: 18px; font-weight: 800;">6+ Web Apps</div>
            <div style="font-size: 12px; opacity: .7;">Shipped Globally</div>
        </div>
        <div style="padding: 12px; border-radius: 12px; background: rgba(150,150,150,.07); border: 1px solid rgba(150,150,150,.2);">
            <div style="font-size: 18px; font-weight: 800;">5x Certified</div>
            <div style="font-size: 12px; opacity: .7;">AWS · Claude · SAP · Meta</div>
        </div>
    </div>

    <p style="font-size: 15px; margin: 0 0 16px; opacity: .9;">
        Most of my work lives where clean backend architecture meets thoughtful user experience. Whether I'm writing byte-level file converters in <b>C#/.NET</b>, spinning up <b>Python/FastAPI</b> services in <b>Docker</b>, designing <b>SQL</b> pipelines, or building interactive interfaces with <b>Next.js</b> and <b>TypeScript</b>, I care deeply about shipping software that feels fast and dependable.
    </p>

    <!-- Tech Stack Pills -->
    <div style="display: flex; flex-wrap: wrap; gap: 7px; margin: 16px 0 28px;">
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">Python</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">FastAPI & Django</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">C# / .NET</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">Java</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">PostgreSQL / MySQL</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">React & Next.js</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">TypeScript</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">Docker & Linux</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">AWS</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">SAP CPI & Fiori</span>
        <span style="font-size: 12px; font-weight: 600; padding: 5px 11px; background: rgba(150,150,150,.08); border: 1px solid rgba(150,150,150,.28); border-radius: 20px;">LLMs & RAG</span>
    </div>

    <!-- Journey Timeline -->
    <h2 style="font-size: 18px; font-weight: 700; border-bottom: 1px solid rgba(150,150,150,.25); padding-bottom: 8px; margin: 30px 0 18px; display: flex; align-items: center; gap: 8px;">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif" alt="rocket" style="width: 20px; height: 20px;" />
        The journey so far
    </h2>

    <div style="border-left: 2px solid rgba(150,150,150,.3); margin-left: 8px; padding-left: 18px; font-size: 14px;">

        <div style="margin-bottom: 18px; position: relative;">
            <div style="font-weight: 700; font-size: 15px;">Tata Consultancy Services (TCS) <span style="font-weight: 400; font-size: 12px; opacity: .65;">· Assistant System Engineer</span></div>
            <p style="margin: 4px 0 0; opacity: .85;">
                Currently based in Bangalore, diving deep into enterprise architecture, Java, SQL, SAP Cloud Platform Integration (SAP CPI), and SAP Fiori while continuing to build and self-host personal projects on the side.
            </p>
        </div>

        <div style="margin-bottom: 18px; position: relative;">
            <div style="font-weight: 700; font-size: 15px;">CareStack <span style="font-weight: 400; font-size: 12px; opacity: .65;">· Analyst 1 – Product Operations</span></div>
            <p style="margin: 4px 0 0; opacity: .85;">
                Built two C#/.NET migration tools using the Lead Tools library to convert proprietary dental imaging formats (.tig, auto) into standard PNGs via byte-level processing with 100% data integrity. Architected SQL validation and cleansing workflows to onboard 30+ enterprise healthcare practices.
            </p>
        </div>

        <div style="margin-bottom: 18px; position: relative;">
            <div style="font-weight: 700; font-size: 15px;">Wahn Design <span style="font-weight: 400; font-size: 12px; opacity: .65;">· Freelance Full-Stack Developer</span></div>
            <p style="margin: 4px 0 0; opacity: .85;">
                Took six web applications from initial wireframe to production deployment for four international and two domestic clients, managing the entire lifecycle and generating ₹100,000+ in revenue.
            </p>
        </div>

        <div style="margin-bottom: 6px; position: relative;">
            <div style="font-weight: 700; font-size: 15px;">Early Engineering & CS Roots <span style="font-weight: 400; font-size: 12px; opacity: .65;">· Tata Elxsi · Genpro Research · TKMCE</span></div>
            <p style="margin: 4px 0 0; opacity: .85;">
                Earned my B.Tech in Computer Science from <b>TKM College of Engineering</b>. Along the way, I interned at <b>Tata Elxsi</b> (building real-time SDLC quality dashboards for 50+ developers) and <b>Genpro Research</b> (engineering <i>envstore</i>, a Dockerized Python/FastAPI tool on Linux to cut environment setup times).
            </p>
        </div>

    </div>

    <!-- Projects Bento Grid (No external links, encourages OS exploration) -->
    <h2 style="font-size: 18px; font-weight: 700; border-bottom: 1px solid rgba(150,150,150,.25); padding-bottom: 8px; margin: 32px 0 16px; display: flex; align-items: center; gap: 8px;">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2699_fe0f/512.gif" alt="gear" style="width: 20px; height: 20px;" />
        Things I've built
    </h2>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; font-size: 14px;">

        <div style="padding: 14px; border: 1px solid rgba(150,150,150,.25); background: rgba(150,150,150,.04); border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <p style="font-weight: 700; margin: 0 0 6px; font-size: 15px;">✈️ Travelling Salesman</p>
                <p style="margin: 0 0 10px; opacity: .8; font-size: 13.5px;">
                    A travel discovery engine that pinpoints real-world locations from videos and social media posts using the Gemini API, Python, FastAPI, PostgreSQL, and Docker.
                </p>
            </div>
            <span style="font-size: 11.5px; opacity: .65; font-family: monospace;">📂 Check Desktop → Projects</span>
        </div>

        <div style="padding: 14px; border: 1px solid rgba(150,150,150,.25); background: rgba(150,150,150,.04); border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <p style="font-weight: 700; margin: 0 0 6px; font-size: 15px;">🖥️ This Interactive OS</p>
                <p style="margin: 0 0 10px; opacity: .8; font-size: 13.5px;">
                    A custom browser-based desktop environment built with Next.js, TypeScript, Tailwind CSS, and Framer Motion—containerized with Docker and self-hosted on my Linux server.
                </p>
            </div>
            <span style="font-size: 11.5px; opacity: .65; font-family: monospace;">✨ You're inside it right now</span>
        </div>

        <div style="padding: 14px; border: 1px solid rgba(150,150,150,.25); background: rgba(150,150,150,.04); border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <p style="font-weight: 700; margin: 0 0 6px; font-size: 15px;">🍋 Little Lemon Booking</p>
                <p style="margin: 0 0 10px; opacity: .8; font-size: 13.5px;">
                    High-concurrency restaurant reservation backend built with Django and SQL, engineered for sub-200ms response times and backed by 98.5% automated test coverage.
                </p>
            </div>
            <span style="font-size: 11.5px; opacity: .65; font-family: monospace;">📂 Check Desktop → Projects</span>
        </div>

        <div style="padding: 14px; border: 1px solid rgba(150,150,150,.25); background: rgba(150,150,150,.04); border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <p style="font-weight: 700; margin: 0 0 6px; font-size: 15px;">🔐 Encrypted Image Processing</p>
                <p style="margin: 0 0 10px; opacity: .8; font-size: 13.5px;">
                    Privacy-preserving biometric and image filtering pipeline using Gabor filters and Fully Homomorphic Encryption (FHE) to compute directly on encrypted data.
                </p>
            </div>
            <span style="font-size: 11.5px; opacity: .65; font-family: monospace;">📂 Check Desktop → Projects</span>
        </div>

    </div>

    <!-- Certifications & Learning Callout -->
    <h2 style="font-size: 18px; font-weight: 700; border-bottom: 1px solid rgba(150,150,150,.25); padding-bottom: 8px; margin: 32px 0 14px; display: flex; align-items: center; gap: 8px;">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2728/512.gif" alt="sparkles" style="width: 20px; height: 20px;" />
        What I'm exploring lately
    </h2>

    <p style="font-size: 14px; margin: 0 0 14px; opacity: .9;">
        Lately, I've been spending my evenings experimenting with cloud-native architectures, enterprise integrations, agentic AI workflows (RAG and LLM tool routing), and tinkering with my Linux home server.
    </p>

    <div style="padding: 14px 16px; margin: 14px 0 20px; border-left: 3px solid #6366f1; background: rgba(99, 102, 241, 0.08); border-radius: 0 10px 10px 0;">
        <p style="font-size: 13px; font-weight: 700; margin: 0 0 8px; text-transform: uppercase; letter-spacing: .06em; opacity: .9;">
            Verified Milestones (View PDFs in the Certifications Folder)
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12.5px;">
            <span style="padding: 4px 9px; border-radius: 6px; background: rgba(150,150,150,.12);">🏅 AWS Certified Developer – Associate</span>
            <span style="padding: 4px 9px; border-radius: 6px; background: rgba(150,150,150,.12);">🤖 Anthropic Claude Certified Developer</span>
            <span style="padding: 4px 9px; border-radius: 6px; background: rgba(150,150,150,.12);">🔗 SAP Certified – Integration Developer</span>
            <span style="padding: 4px 9px; border-radius: 6px; background: rgba(150,150,150,.12);">⚙️ Meta Back-End Developer</span>
            <span style="padding: 4px 9px; border-radius: 6px; background: rgba(150,150,150,.12);">🐧 CompTIA Linux Command Line</span>
        </div>
    </div>

    <!-- Human / Outside the Code Section -->
    <h2 style="font-size: 18px; font-weight: 700; border-bottom: 1px solid rgba(150,150,150,.25); padding-bottom: 8px; margin: 32px 0 14px; display: flex; align-items: center; gap: 8px;">
        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2615/512.gif" alt="coffee" style="width: 20px; height: 20px;" />
        Outside the terminal
    </h2>

    <p style="font-size: 14px; margin: 0 0 16px; opacity: .88;">
        I don't just sit in front of a code editor 24/7. In college, I founded and served as President of the <b>TKMCE Fashion Club</b>—building the campus's first fashion organization from scratch, raising ₹60,000+ in sponsorships, and directing major campus shows. I also served as Coordinator for <b>IEDC TKMCE</b>, spearheading three national-level hackathons with 1,000+ participants and securing ₹1,00,000+ in funding for student startups. Both experiences taught me how to lead teams, pitch ideas, and get chaotic projects across the finish line.
    </p>

    <!-- Interactive OS Guide (Replaces broken links) -->
    <div style="margin-top: 28px; padding: 16px; border-radius: 12px; border: 1px solid rgba(150,150,150,.25); background: rgba(150,150,150,.05);">
        <p style="font-size: 14px; font-weight: 700; margin: 0 0 10px;">
            🧭 Make yourself at home—here's how to explore this OS:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; font-size: 13px; opacity: .85;">
            <div>📁 <b>Projects Folder:</b> Deep-dive into my builds</div>
            <div>📜 <b>Certifications:</b> Inspect my verified badges</div>
            <div>📄 <b>Resume.pdf:</b> View or edit my full CV</div>
            <div>🎨 <b>Wallpaper / Trash:</b> Customize or drag icons</div>
        </div>
    </div>

    <p style="font-size: 13px; font-style: italic; opacity: .6; margin: 26px 0 0; text-align: center;">
        Thanks for stopping by. Feel free to drag windows around, open folders, and test the limits. (Just don't delete system32.)
    </p>

</div>
`


export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isNotificationsOpen, setNotificationsOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [wallpaper, setWallpaperState] = useState<string | null>(null)
    const [isDocOpen, setDocOpen] = useState(false)
    const [isDocMinimized, setDocMinimized] = useState(false)
    const [isNewDocOpen, setNewDocOpen] = useState(false)
    const [isNewDocMinimized, setNewDocMinimized] = useState(false)
    const [openSavedDocId, setOpenSavedDocId] = useState<string | null>(null)
    const [savedDocs, setSavedDocs] = useState<SavedDoc[]>([])
    const [isProjectsOpen, setProjectsOpen] = useState(false)
    const [isProjectsMinimized, setProjectsMinimized] = useState(false)
    const [isContactOpen, setContactOpen] = useState(false)
    const [isTrashOpen, setTrashOpen] = useState(false)
    const [isTrashMinimized, setTrashMinimized] = useState(false)
    const [isHoveringTrash, setIsHoveringTrash] = useState(false)
    const [projectFolderItems, setProjectFolderItems] = useState<string[]>([])
    const [userFolders, setUserFolders] = useState<UserFolder[]>([])
    const [certificationDocs, setCertificationDocs] = useState<SavedDoc[]>(
        CERTIFICATION_RECORDS.map(record => ({
            id: record.id,
            filename: record.filename,
            content: record.url,
            createdAt: record.createdAt,
        }))
    )
    const [isFolderWindowOpen, setFolderWindowOpen] = useState(false)
    const [isFolderWindowMinimized, setFolderWindowMinimized] = useState(false)
    const [activeFolderWindowId, setActiveFolderWindowId] = useState<string | null>(null)
    const [isMediaWindowOpen, setMediaWindowOpen] = useState(false)
    const [isMediaWindowMinimized, setMediaWindowMinimized] = useState(false)
    const [activeMediaDocId, setActiveMediaDocId] = useState<string | null>(null)
    const [pdfWindows, setPdfWindows] = useState<PdfWindowState[]>([])
    const [isContactMinimized, setContactMinimized] = useState(false);


    useEffect(() => {
        const savedDark = localStorage.getItem('darkMode') === 'true'
        const savedWallpaper = localStorage.getItem('wallpaper')
        setDarkMode(savedDark)
        setWallpaperState(savedWallpaper ?? SANDY_CREAM_URL)
        try {
            const raw = localStorage.getItem(DOCS_KEY)
            if (raw) {
                const parsedDocs = JSON.parse(raw) as SavedDoc[]
                const aboutDocIndex = parsedDocs.findIndex(doc => doc.filename === ABOUT_DOC_FILENAME)
                const aboutContentVersion = localStorage.getItem(ABOUT_CONTENT_VERSION_KEY)
                const aboutContentBaseline = localStorage.getItem(ABOUT_CONTENT_BASELINE_KEY)
                const canUpdateAboutContent = aboutDocIndex !== -1 &&
                    aboutContentBaseline !== null &&
                    parsedDocs[aboutDocIndex].content === aboutContentBaseline &&
                    parsedDocs[aboutDocIndex].content !== ABOUT_CONTENT
                const shouldUpdateAbout = aboutContentVersion !== ABOUT_CONTENT_VERSION && canUpdateAboutContent
                const shouldAddMissingAbout = aboutDocIndex === -1 && aboutContentVersion === null
                const docs = shouldAddMissingAbout
                    ? [
                        ...parsedDocs,
                        {
                            id: `doc-about-${Date.now()}`,
                            filename: ABOUT_DOC_FILENAME,
                            content: ABOUT_CONTENT,
                            createdAt: Date.now(),
                        },
                    ]
                    : shouldUpdateAbout
                        ? parsedDocs.map((doc, index) => index === aboutDocIndex
                            ? { ...doc, content: ABOUT_CONTENT }
                            : doc)
                        : parsedDocs
                const aboutDocAfterMigration = docs.find(doc => doc.filename === ABOUT_DOC_FILENAME)
                const nextAboutBaseline = aboutDocAfterMigration?.content ?? ABOUT_CONTENT
                setSavedDocs(docs)
                localStorage.setItem(DOCS_KEY, JSON.stringify(docs))
                localStorage.setItem(ABOUT_CONTENT_VERSION_KEY, ABOUT_CONTENT_VERSION)
                localStorage.setItem(ABOUT_CONTENT_BASELINE_KEY, nextAboutBaseline)
            } else {
                // New visitors start with a small set of portfolio documents.
                const homeDoc: SavedDoc = {
                    id: `doc-home-${Date.now()}`,
                    filename: 'home.mdx',
                    content: WELCOME_CONTENT,
                    createdAt: Date.now(),
                }
                const movDoc: SavedDoc = {
                    id: `doc-mov-${Date.now()}`,
                    filename: 'demo.mov',
                    content: DEFAULT_MOV_URL,
                    createdAt: Date.now(),
                }
                const imgDoc: SavedDoc = {
                    id: `doc-img-${Date.now()}`,
                    filename: 'painting.jpg',
                    content: DEFAULT_IMG_URL,
                    createdAt: Date.now(),
                }
                const aboutDoc: SavedDoc = {
                    id: `doc-about-${Date.now()}`,
                    filename: ABOUT_DOC_FILENAME,
                    content: ABOUT_CONTENT,
                    createdAt: Date.now(),
                }

                const initialDocs = [imgDoc, movDoc, aboutDoc, homeDoc]
                setSavedDocs(initialDocs)
                localStorage.setItem(DOCS_KEY, JSON.stringify(initialDocs))
                localStorage.setItem(ABOUT_CONTENT_VERSION_KEY, ABOUT_CONTENT_VERSION)
                localStorage.setItem(ABOUT_CONTENT_BASELINE_KEY, ABOUT_CONTENT)
            }

            const pf = localStorage.getItem('project-folder')
            if (pf) setProjectFolderItems(JSON.parse(pf))
            const uf = localStorage.getItem(FOLDERS_KEY)
            if (uf) setUserFolders(JSON.parse(uf))
        } catch {}  
        void fetch('/api/certifications')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (!data?.docs) return
                setCertificationDocs(data.docs.map((doc: typeof CERTIFICATION_RECORDS[number]) => ({
                    id: doc.id,
                    filename: doc.filename,
                    content: doc.url,
                    createdAt: doc.createdAt,
                })))
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        const html = document.documentElement
        if (darkMode) html.classList.add('dark')
        else html.classList.remove('dark')
        localStorage.setItem('darkMode', String(darkMode))
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode(prev => !prev)

    const setWallpaper = (url: string | null) => {
        setWallpaperState(url)
        if (url) localStorage.setItem('wallpaper', url)
        else localStorage.removeItem('wallpaper')
    }

    const addSavedDoc = (filename: string, content: string): SavedDoc => {
        const doc: SavedDoc = {
            id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            filename: filename.includes('.') ? filename : `${filename}.mdx`,
            content,
            createdAt: Date.now(),
        }
        setSavedDocs(prev => {
            const updated = [doc, ...prev]
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
        return doc
    }

    const addMediaDoc = (filename: string, storageKey: string, mimeType: string): SavedDoc => {
        const doc: SavedDoc = {
            id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            filename,
            content: '',
            createdAt: Date.now(),
            mediaStorageKey: storageKey,
            mediaMimeType: mimeType,
        }
        setSavedDocs(prev => {
            const updated = [doc, ...prev]
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
        return doc
    }

    const clearAllDocs = () => {
        setSavedDocs(prev => {
            prev.forEach(doc => {
                if (doc.mediaStorageKey) void deleteMediaFile(doc.mediaStorageKey)
            })
            return []
        })
        localStorage.removeItem(DOCS_KEY)
        void clearMediaFiles()
    }

    const updateFolderTrashState = (folderId: string, trashed: boolean) => {
        setUserFolders(prev => {
            const folder = prev.find(f => f.id === folderId)
            if (!folder) return prev
            const updated = prev.map(f => f.id === folderId ? { ...f, trashed } : f)
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))

            setSavedDocs(docs => {
                const updatedDocs = docs.map(d => folder.items.includes(d.id) ? { ...d, trashed } : d)
                localStorage.setItem(DOCS_KEY, JSON.stringify(updatedDocs))
                return updatedDocs
            })
            return updated
        })
    }

    const moveToTrash = (id: string) => {
        setSavedDocs(prev => {
            const updated = prev.map(d => d.id === id ? { ...d, trashed: true } : d)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
        setUserFolders(prev => {
            const updated = prev.map(folder => folder.id === id ? { ...folder, trashed: true } : folder)
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const restoreDoc = (id: string) => {
        setSavedDocs(prev => {
            const updated = prev.map(d => d.id === id ? { ...d, trashed: false } : d)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const emptyTrash = () => {
        setSavedDocs(prev => {
            const updated = prev.filter(d => !d.trashed)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
        setUserFolders(prev => {
            const updated = prev.filter(f => !f.trashed)
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const addToProjectFolder = (id: string) => {
        setProjectFolderItems(prev => {
            if (prev.includes(id)) return prev
            const updated = [...prev, id]
            localStorage.setItem('project-folder', JSON.stringify(updated))
            return updated
        })
    }

    const removeFromProjectFolder = (id: string) => {
        setProjectFolderItems(prev => {
            const updated = prev.filter(i => i !== id)
            localStorage.setItem('project-folder', JSON.stringify(updated))
            return updated
        })
    }

    const createFolder = (name: string): UserFolder => {
        const folder: UserFolder = { id: `folder-${Date.now()}`, name, items: [] }
        setUserFolders(prev => {
            const updated = [...prev, folder]
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
        return folder
    }

    const addDocToFolder = (folderId: string, docId: string) => {
        setUserFolders(prev => {
            const updated = prev.map(f =>
                f.id === folderId && !f.items.includes(docId)
                    ? { ...f, items: [...f.items, docId] }
                    : f
            )
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const removeDocFromFolder = (folderId: string, docId: string) => {
        setUserFolders(prev => {
            const updated = prev.map(f =>
                f.id === folderId ? { ...f, items: f.items.filter(i => i !== docId) } : f
            )
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const deleteFolder = (folderId: string) => {
        updateFolderTrashState(folderId, true)
    }

    const restoreFolder = (folderId: string) => {
        updateFolderTrashState(folderId, false)
    }

    const deleteFolderPermanently = (folderId: string) => {
        const folder = userFolders.find(f => f.id === folderId)
        if (!folder) return

        setUserFolders(prev => {
            const updated = prev.filter(f => f.id !== folderId)
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated))
            return updated
        })

        setSavedDocs(prev => {
            const updated = prev.filter(d => !folder.items.includes(d.id))
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const addDocToCertifications = (docId: string) => {
        setSavedDocs(prev => {
            const target = prev.find(doc => doc.id === docId)
            if (!target) return prev
            setCertificationDocs(current => {
                if (current.some(doc => doc.id === docId)) return current
                const updatedCerts = [...current, target]
                return updatedCerts
            })
            const updated = prev.filter(doc => doc.id !== docId)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const removeDocFromCertifications = (docId: string) => {
        setCertificationDocs(prev => {
            const target = prev.find(doc => doc.id === docId)
            if (!target) return prev
            const updated = prev.filter(doc => doc.id !== docId)
            return updated
        })
        setSavedDocs(prev => {
            const target = certificationDocs.find(doc => doc.id === docId)
            if (!target) return prev
            if (prev.some(doc => doc.id === docId)) return prev
            const updated = [target, ...prev]
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const openPdfWindow = (docId: string) => {
        const windowId = `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        setPdfWindows(prev => [...prev, { windowId, docId, minimized: false }])
        return windowId
    }

    const closePdfWindow = (windowId: string) => {
        setPdfWindows(prev => prev.filter(window => window.windowId !== windowId))
    }

    const minimizePdfWindow = (windowId: string, minimized: boolean) => {
        setPdfWindows(prev => prev.map(window => window.windowId === windowId ? { ...window, minimized } : window))
    }

    const restorePdfWindow = (windowId: string) => {
        minimizePdfWindow(windowId, false)
    }

    const deleteDoc = (id: string) => {
        setSavedDocs(prev => {
            const target = prev.find(d => d.id === id)
            if (target?.mediaStorageKey) void deleteMediaFile(target.mediaStorageKey)
            const updated = prev.filter(d => d.id !== id)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }
    const updateSavedDoc = (id: string, content: string) => {
        setSavedDocs(prev => {
            const updated = prev.map(d => d.id === id ? { ...d, content } : d)
            localStorage.setItem(DOCS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    return (
        <AppContext.Provider
            value={{
                isNotificationsOpen,
                setNotificationsOpen,
                websiteMode: false,
                compact: false,
                darkMode,
                toggleDarkMode,
                wallpaper,
                setWallpaper,
                isDocOpen,
                setDocOpen,
                isDocMinimized,
                setDocMinimized,
                isNewDocOpen,
                setNewDocOpen,
                isNewDocMinimized,
                setNewDocMinimized,
                openSavedDocId,
                setOpenSavedDocId,
                savedDocs,
                addSavedDoc,
                addMediaDoc,
                updateSavedDoc,
                isProjectsOpen,
                setProjectsOpen,
                isProjectsMinimized,
                setProjectsMinimized,
                isContactOpen,
                setContactOpen,
                clearAllDocs,
                deleteDoc,
                moveToTrash,
                restoreDoc,
                emptyTrash,
                isHoveringTrash,
                setIsHoveringTrash,
                isTrashOpen,
                setTrashOpen,
                isTrashMinimized,
                setTrashMinimized,
                projectFolderItems,
                addToProjectFolder,
                removeFromProjectFolder,
                userFolders,
                createFolder,
                addDocToFolder,
                removeDocFromFolder,
                deleteFolder,
                restoreFolder,
                deleteFolderPermanently,
                certificationDocs,
                addDocToCertifications,
                removeDocFromCertifications,
                isFolderWindowOpen,
                setFolderWindowOpen,
                isFolderWindowMinimized,
                setFolderWindowMinimized,
                activeFolderWindowId,
                setActiveFolderWindowId,
                isMediaWindowOpen,
                setMediaWindowOpen,
                isMediaWindowMinimized,
                setMediaWindowMinimized,
                activeMediaDocId,
                setActiveMediaDocId,
                pdfWindows,
                openPdfWindow,
                closePdfWindow,
                minimizePdfWindow,
                restorePdfWindow,
                isContactMinimized,
                setContactMinimized,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp(): AppContextValue {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
    return ctx
}
