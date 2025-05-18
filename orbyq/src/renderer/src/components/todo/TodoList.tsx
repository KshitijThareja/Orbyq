"use client"

import { useState } from "react"
import { PlusCircle, Calendar, Clock, Tag, MoreHorizontal } from "lucide-react"

interface TodoItem {
  id: string
  title: string
  completed: boolean
  priority: "Low" | "Medium" | "High"
  dueDate?: string
  category?: string
}

function TodoList() {
  const [newTask, setNewTask] = useState("")
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: "todo-1",
      title: "Review project requirements",
      completed: true,
      priority: "High",
      dueDate: "Today",
      category: "Work",
    },
    {
      id: "todo-2",
      title: "Create wireframes for dashboard",
      completed: false,
      priority: "High",
      dueDate: "Today",
      category: "Design",
    },
    {
      id: "todo-3",
      title: "Research competitor features",
      completed: false,
      priority: "Medium",
      dueDate: "Tomorrow",
      category: "Research",
    },
    {
      id: "todo-4",
      title: "Update project documentation",
      completed: false,
      priority: "Medium",
      dueDate: "May 16",
      category: "Documentation",
    },
    {
      id: "todo-5",
      title: "Prepare presentation for stakeholders",
      completed: false,
      priority: "High",
      dueDate: "May 18",
      category: "Work",
    },
    {
      id: "todo-6",
      title: "Buy groceries",
      completed: false,
      priority: "Low",
      category: "Personal",
    },
  ])

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const handleAddTodo = () => {
    if (!newTask.trim()) return

    const newTodoItem: TodoItem = {
      id: `todo-${Date.now()}`,
      title: newTask,
      completed: false,
      priority: "Medium",
    }

    setTodos([...todos, newTodoItem])
    setNewTask("")
  }

  const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "High":
        return "text-red-500 dark:text-red-400"
      case "Medium":
        return "text-purple-500 dark:text-purple-400"
      case "Low":
        return "text-blue-500 dark:text-blue-400"
      default:
        return ""
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
      <div className="pb-3">
        <div className="flex items-center space-x-2">
          <input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
              todo.completed ? "bg-gray-100 dark:bg-slate-700/50" : "hover:bg-blue-50 dark:hover:bg-slate-700/30"
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${todo.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
                {todo.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                {todo.category && (
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                    <span>{todo.category}</span>
                  </div>
                )}
                {todo.dueDate && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                    <span>{todo.dueDate}</span>
                  </div>
                )}
                <div className={`flex items-center ${getPriorityColor(todo.priority)}`}>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{todo.priority} Priority</span>
                </div>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        ))}

        {todos.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>No tasks yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoList
