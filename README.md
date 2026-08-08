# Portfolio Desktop OS

A recruiter-facing portfolio built as a desktop operating system simulation. The goal is to show product thinking, UI architecture, persistence strategy, drag-and-drop interactions, and backend integration in one polished experience.

## Overview

This repo is not a standard brochure site. It is an interactive desktop shell with windows, a dock, folders, trash, certifications, media viewers, a contact surface, and a persistent sticky note widget. The project is designed to make technical depth obvious to a recruiter or an automated repo scanner within a few seconds.

### What this demonstrates

- Multi-window client state management.
- Clear client/server separation with App Router API routes.
- Browser persistence using `localStorage` and IndexedDB.
- Drag-and-drop UX with trash, folder, and window interactions.
- Recruiter-friendly certificate browsing through a dedicated folder.
- A contact workflow that forwards submissions to Discord.

## Architecture

The application is organized into a few explicit layers:

1. `app/page.tsx` is the root shell that mounts the desktop, all windows, and the minimized taskbar.
2. `context/App.tsx` is the shared state and persistence layer.
3. `components/Desktop/` owns the desktop canvas, dock, drag/drop, launcher actions, wallpaper, and file creation flows.
4. `components/*Window` components each own their own surface and behavior.
5. `app/api/*` handles server-side integrations like contact forwarding and certifications data.

```mermaid
flowchart TD
	A[app/page.tsx] --> B[Desktop shell]
	A --> C[Window components]
	A --> D[Minimized taskbar]

	B --> E[context/App.tsx]
	C --> E
	D --> E

	E --> F[(localStorage)]
	E --> G[(IndexedDB)]
	E --> H[/api/contact]
	E --> I[/api/certifications]

	H --> J[Discord webhook]
	I --> K[Hardcoded certification records]
```

## Key Systems

### Desktop Shell

- Draggable desktop icons.
- A Mac-style dock.
- Wallpaper presets with persistence.
- A sticky note widget that stays on the desktop and autosaves.

### Window Manager

- Independent windows for resume, editor, projects, folders, trash, media, PDF certificates, and contact.
- Minimize, maximize, close, and taskbar restore behavior.
- Separate handling for media and PDF content.

### Content Model

- Resume and user-created docs are stored in `localStorage`.
- Uploaded images and videos are stored in IndexedDB to avoid quota issues.
- Certification PDFs are exposed from a backend route and surfaced inside a dedicated folder.
- Contact submissions are forwarded through an API route to a Discord webhook.

### Recruiter-Facing Certifications

The certifications folder is intentionally first-class:

- It appears by default on the desktop.
- It opens in a dedicated folder window.
- Certificates can be PDFs.
- PDFs can be opened in their own viewer.
- The folder acts as a curated evidence set for a recruiter.

### Contact Flow

The contact window contains:

- an optional email field,
- a required message field,
- direct mail and LinkedIn links,
- a submit action that posts to `/api/contact`,
- server-side forwarding to Discord via webhook embed.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Radix UI
- Lottie React
- next-cloudinary

## Project Structure

- `app/` - app shell and API routes.
- `components/Desktop/` - desktop canvas, dock, media storage, drag/drop, and launcher logic.
- `components/` - windows and reusable app surfaces.
- `context/App.tsx` - global state, persistence, and window orchestration.
- `lib/` - shared data such as certifications.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Local Setup

1. Install dependencies.
2. Run `npm run dev`.
3. Open `http://localhost:3000`.
4. Add your actual Discord webhook URL in `app/api/contact/route.ts`.
5. Replace the placeholder certification PDF records in `lib/certifications.ts` with your real certificate links.
6. Optionally update the fallback `.mov` URL in `context/App.tsx` and `components/Desktop/index.tsx` if you want custom starter media.

## Persistence Strategy

- `localStorage` stores UI preferences, document metadata, folders, trash state, and the sticky note text.
- IndexedDB stores uploaded media blobs.
- `/api/certifications` provides the certificate list for the recruiter-facing folder.
- `/api/contact` forwards the contact form to Discord.

## Why This Repo Is Worth Hiring For

This project shows more than UI polish.

- It demonstrates state modeling for a multi-surface desktop app.
- It separates client state, browser persistence, and server integrations cleanly.
- It uses a realistic information architecture for public-facing portfolio content.
- It treats recruiter needs as a product requirement by making certifications easy to find and inspect.

## Notes

- The webhook URL is intentionally left as a placeholder so you can configure it per environment.
- Certification PDFs are hardcoded by design so recruiters see a stable, curated set.
- The repository is structured to be easy to scan by both humans and bots.

## Deployment

Run a production build before deployment:

```bash
npm run build
```

Then deploy the Next.js app as usual. Make sure the contact webhook and any remote asset URLs are configured for production.
