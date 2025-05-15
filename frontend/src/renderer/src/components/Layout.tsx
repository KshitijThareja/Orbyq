"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { cn } from "../utils/cn"

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <Sidebar open={sidebarOpen} setOpen={toggleSidebar} />
      <main
        className={cn("flex-1 overflow-auto transition-all duration-300 ease-in-out", sidebarOpen ? "ml-64" : "ml-0")}
      >
        <div className="min-h-screen p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
