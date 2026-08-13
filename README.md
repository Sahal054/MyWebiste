# Web OS Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

### A portfolio designed like a desktop operating system.

I wanted to build something more interactive than a traditional scrolling portfolio.

So I built a browser-based desktop environment where projects, certifications, media, and personal information live inside an interactive OS-style interface.

The interesting part isn't just the UI — it's the architecture behind it.

---

## What You Can Do

- Interact with a desktop-style environment
-  Open folders and applications
-  Move, minimize, maximize, and restore windows
-  Use a persistent sticky note
-  Create and manage files within the browser
-  View images and videos
-  Open certifications through a custom PDF viewer
-  Send messages through the contact application
-  Interact with the trash and file system
-  Persist application state across sessions

---

# System Architecture

The application is structured around a small set of clearly separated layers.

```text
                         ┌─────────────────────┐
                         │     app/page.tsx    │
                         │      App Shell      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Desktop Engine    │
                         │ components/Desktop  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Global State     │
                         │   context/App.tsx   │
                         └──────┬───────┬──────┘
                                │       │
                 ┌──────────────┘       └──────────────┐
                 ▼                                     ▼
        ┌─────────────────┐                   ┌─────────────────┐
        │ Window System   │                   │ Persistence     │
        │ components/*   │                   │ localStorage    │
        │                 │                   │ IndexedDB       │
        └────────┬────────┘                   └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   API Layer     │
        │   app/api/*     │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ External        │
        │ Integrations    │
        │ Discord Webhook │
        └─────────────────┘
```

### Architecture Layers

#### 1. App Shell

`app/page.tsx`

The entry point of the application.

Responsible for mounting the desktop environment, window layer, and taskbar.

---

#### 2. Global State

`context/App.tsx`

Acts as the shared state layer for the desktop.

It manages things such as:

- Open windows
- Window state
- Desktop data
- User preferences
- File and folder state
- Persistence

The goal is to keep state that needs to be shared out of individual UI components.

---

#### 3. Desktop Engine

`components/Desktop/`

Responsible for the behavior of the desktop itself.

This includes:

- Desktop icons
- Drag and drop
- Launching applications
- File interactions
- Desktop layout
- Window interactions

---

#### 4. Window System

`components/*Window`

Each application is isolated into its own window component.

Examples include:

- Code Editor
- File Explorer
- Media Viewer
- PDF Viewer
- Sticky Notes
- Trash

This keeps individual application logic separate while allowing the global window manager to control their lifecycle.

---

#### 5. API Layer

`app/api/*`

Server-side routes handle functionality that should not run directly in the browser.

For example:

```text
Contact Form
     │
     ▼
/api/contact
     │
     ▼
Discord Webhook
```

This keeps the webhook integration away from the client-side application.

---

# 💾 Browser Persistence

One of the design decisions I focused on was choosing the right storage mechanism for different types of data.

### localStorage

Used for lightweight persistent data:

- UI preferences
- Wallpaper state
- Folder metadata
- Document information
- Sticky notes

### IndexedDB

Used for heavier browser-side data:

- Images
- Videos
- Uploaded media blobs

The idea is simple:

```text
Lightweight data  → localStorage
Heavy media       → IndexedDB
```

This avoids putting large media objects into localStorage while keeping frequently accessed application state simple.

---

#  Window Management

The desktop uses a shared window management system rather than treating each application as an isolated page.

The window manager handles:

- Opening windows
- Closing windows
- Minimize / restore
- Maximize
- Active window tracking
- Z-index / focus management
- Taskbar state
- Window positioning

Conceptually:

```text
                Window Manager
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
   Code Editor    File Explorer   Media Viewer
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                 Shared State
```

This allows multiple applications to behave consistently without duplicating window-management logic.

---

# Key Engineering Decisions

### Client / Server Separation

Interactive desktop functionality runs on the client while server-side integrations are handled through Next.js API routes.

### Component Isolation

Individual applications are separated into their own components instead of placing the entire desktop inside one large component.

### Centralized State

State that affects multiple parts of the application is managed centrally rather than being duplicated across components.

### Storage by Data Type

Different browser storage technologies are used depending on the size and purpose of the data.

### Extendable Architecture

New applications can be added as independent window components without having to redesign the entire desktop.

---

#  Tech Stack

### Framework & Language

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### Styling

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### UI & Animation

![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge)
![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?style=for-the-badge)
![Lottie](https://img.shields.io/badge/Lottie-00DDB3?style=for-the-badge)

### Media

![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

#  Project Structure

```text
.
├── app/
│   ├── api/
│   │   ├── contact/
│   │   └── certifications/
│   │
│   └── page.tsx
│
├── components/
│   ├── Desktop/
│   ├── *Window/
│   └── ...
│
├── context/
│   └── App.tsx
│
├── lib/
│   └── certifications.ts
│
└── public/
```

The structure keeps application logic, shared state, server-side routes, and UI surfaces separated.

---

# Running Locally

Clone the repository:

```bash
git clone https://github.com/Sahal054/MyWebiste.git
cd MyWebiste
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

#  Production Build

```bash
npm run build
npm run start
```

---

#  Configuration

Before deploying, configure:

### Contact API

Set the Discord webhook through an environment variable rather than committing it to the repository.

### Certifications

Update:

```text
lib/certifications.ts
```

with the certification records you want to display.

---

#Screenshots

### Desktop

<img width="1920" height="927" alt="image" src="https://github.com/user-attachments/assets/d652e94c-765b-483e-add4-335dd42b1685" />


### Window Management

<img width="1920" height="927" alt="image" src="https://github.com/user-attachments/assets/3a6066ae-650f-483f-9d41-2d6ddcf240b4" />



### File Explorer / Applications

<img width="1920" height="927" alt="image" src="https://github.com/user-attachments/assets/45e6f11c-1a39-4454-9d78-0981625d30d6" />


---

# 👨‍💻 About Me

I'm Sahal, a Software Engineer interested in backend systems, APIs, automation, and building reliable software.

I enjoy learning by building things — especially projects where I have to figure out the architecture rather than simply follow a tutorial.

📧 **Email:** sahalmsachu@gmail.com  
💼 **LinkedIn:** https://linkedin.com/in/Sahal054  
💻 **GitHub:** https://github.com/Sahal054
