import Desktop from '../components/Desktop' // Adjust path if needed
import NotificationsPanel from '../components/NotificationsPanel' // Adjust path if needed

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 
        The top-level Desktop component. 
        It handles its own layout, icons, drag constraints, and the Dock.
      */}
      <Desktop />

      {/* 
        Global overlays and panels.
        Controlled by the AppProvider context state.
      */}
      <NotificationsPanel />
      
      {/* If you have a Taskbar, StartMenu, or WindowManager component, they would go here too */}
    </main>
  )
}