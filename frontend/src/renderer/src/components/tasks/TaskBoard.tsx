"use client"

import type React from "react"

import { useState } from "react"
import { MoreHorizontal, Calendar, PlusCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  priority: "Low" | "Medium" | "High"
  dueDate?: string
  tags?: string[]
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "task-1",
          title: "Research competitor features",
          description: "Analyze top 5 competitors and document their key features",
          priority: "Medium",
          dueDate: "May 20",
          tags: ["Research", "Marketing"],
        },
        {
          id: "task-2",
          title: "Create wireframes for dashboard",
          description: "Design initial wireframes for the main dashboard view",
          priority: "High",
          dueDate: "May 18",
          tags: ["Design", "UI/UX"],
        },
        {
          id: "task-3",
          title: "Set up development environment",
          priority: "Low",
          tags: ["Development", "Setup"],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        {
          id: "task-4",
          title: "Implement authentication system",
          description: "Create login, registration and password reset flows",
          priority: "High",
          dueDate: "May 16",
          tags: ["Development", "Security"],
        },
        {
          id: "task-5",
          title: "Design system documentation",
          description: "Document color system, typography and component usage",
          priority: "Medium",
          dueDate: "May 19",
          tags: ["Documentation", "Design"],
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      tasks: [
        {
          id: "task-6",
          title: "Review API documentation",
          description: "Ensure all endpoints are properly documented",
          priority: "Medium",
          dueDate: "May 15",
          tags: ["Documentation", "API"],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "task-7",
          title: "Project kickoff meeting",
          description: "Initial team meeting to align on project goals",
          priority: "High",
          dueDate: "May 10",
          tags: ["Meeting", "Planning"],
        },
        {
          id: "task-8",
          title: "Create project repository",
          description: "Set up Git repository and initial project structure",
          priority: "Medium",
          tags: ["Setup", "Development"],
        },
      ],
    },
  ])

  // This would be implemented with a proper drag and drop library in a real app
  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColumnId: string) => {
    e.dataTransfer.setData("taskId", taskId)
    e.dataTransfer.setData("sourceColumnId", sourceColumnId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId")

    if (sourceColumnId === targetColumnId) return

    const newColumns = [...columns]
    const sourceColumn = newColumns.find((col) => col.id === sourceColumnId)
    const targetColumn = newColumns.find((col) => col.id === targetColumnId)

    if (!sourceColumn || !targetColumn) return

    const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) return

    const [task] = sourceColumn.tasks.splice(taskIndex, 1)
    targetColumn.tasks.push(task)

    setColumns(newColumns)
  }

  const getPriorityBadge = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "High":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {priority}
          </span>
        )
      case "Medium":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            {priority}
          </span>
        )
      case "Low":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {priority}
          </span>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div key={column.id} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, column.id)} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{column.title}</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300">
              {column.tasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-md hover:shadow-lg transition-all cursor-grab active:cursor-grabbing border border-slate-200 dark:border-slate-700"
              >
                <div className="flex flex-row items-start justify-between pb-2">
                  <h4 className="text-sm font-medium">{task.title}</h4>
                  <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  {task.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{task.description}</p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-2">
                    {task.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      {task.dueDate && (
                        <div className="flex items-center mr-2">
                          <Calendar className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-500 dark:text-gray-400">{task.dueDate}</span>
                        </div>
                      )}
                    </div>

                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </div>
            ))}

            {column.tasks.length === 0 && (
              <div className="h-24 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                No tasks
              </div>
            )}

            <button className="w-full flex items-center justify-start px-3 py-2 text-gray-500 dark:text-gray-400 text-sm hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <PlusCircle className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskBoard
