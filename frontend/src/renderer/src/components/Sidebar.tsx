"use client"

import { useState, Dispatch, SetStateAction } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  Palette,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SidebarProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(!open)

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Kanban, label: "Task Board", path: "/tasks" },
    { icon: Calendar, label: "Timeline", path: "/timeline" },
    { icon: Palette, label: "Creative Space", path: "/creative" },
    { icon: CheckSquare, label: "To-Do List", path: "/todo" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <motion.aside
      className={cn(
        "h-screen bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-200">
        {!collapsed && (
          <div className="flex items-center">
            <div className="relative h-10 w-10 mr-3">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
            <motion.h1
              className="text-xl font-semibold text-slate-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Orbyq
            </motion.h1>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => {
          setCollapsed(!collapsed)
          setOpen(!collapsed) // Sync with parent state
        }} className="ml-auto">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-slate-200/50",
                  isActive ? "bg-slate-200/70 text-slate-900" : "text-slate-600",
                  collapsed && "justify-center",
                )
              }
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200">
        <Button className={cn("w-full bg-teal-600 hover:bg-teal-700 text-white", collapsed && "p-2")}>
          <PlusCircle size={18} className="mr-2" />
          {!collapsed && "New Project"}
        </Button>
      </div>
    </motion.aside>
  )
}

export default Sidebar