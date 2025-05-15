"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, Star, MoreHorizontal, Trash2, Edit, Filter, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const TodoList = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [newTask, setNewTask] = useState("")

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Research competitors",
      completed: false,
      priority: "high",
      dueDate: "2023-06-15",
      category: "work",
    },
    {
      id: 2,
      title: "Create wireframes for homepage",
      completed: false,
      priority: "medium",
      dueDate: "2023-06-18",
      category: "work",
    },
    {
      id: 3,
      title: "Schedule team meeting",
      completed: true,
      priority: "medium",
      dueDate: "2023-06-10",
      category: "work",
    },
    {
      id: 4,
      title: "Buy groceries",
      completed: false,
      priority: "low",
      dueDate: "2023-06-14",
      category: "personal",
    },
    {
      id: 5,
      title: "Gym workout",
      completed: false,
      priority: "medium",
      dueDate: "2023-06-13",
      category: "personal",
    },
    {
      id: 6,
      title: "Read chapter 5 of design book",
      completed: false,
      priority: "low",
      dueDate: "2023-06-20",
      category: "learning",
    },
  ])

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTaskObj = {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: "medium",
        dueDate: "",
        category: activeTab === "all" ? "work" : activeTab,
      }
      setTasks([...tasks, newTaskObj])
      setNewTask("")
    }
  }

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-rose-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-emerald-500"
      default:
        return "text-slate-500"
    }
  }

  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.category === activeTab)

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">To-Do List</h1>
          <p className="text-slate-500">Manage your personal and work tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown size={14} className="mr-1" /> Sort
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-80px)]">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="work">Work</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="learning">Learning</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask()
                    }
                  }}
                />
                <Button onClick={addTask} className="bg-teal-600 hover:bg-teal-700">
                  <Plus size={16} />
                </Button>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {sortedTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No tasks found. Add a new task to get started!</p>
                  </div>
                ) : (
                  sortedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        task.completed ? "bg-slate-50 text-slate-400" : "bg-white"
                      } border border-slate-200 hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className={task.completed ? "opacity-50" : ""}
                        />
                        <div className={task.completed ? "line-through" : ""}>
                          <p className="text-sm font-medium">{task.title}</p>
                          {task.dueDate && (
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                              <Calendar size={12} className="mr-1" />
                              {new Date(task.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star
                          size={16}
                          className={`${getPriorityColor(task.priority)} ${
                            task.priority === "high" ? "fill-current" : "fill-none"
                          }`}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit size={14} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-rose-500"
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash2 size={14} /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Task Summary</CardTitle>
              <CardDescription>Overview of your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Task Status</h3>
                  <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-teal-500 h-full"
                      style={{ width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>{tasks.filter((t) => t.completed).length} completed</span>
                    <span>{tasks.filter((t) => !t.completed).length} remaining</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {["work", "personal", "learning"].map((category) => {
                      const count = tasks.filter((t) => t.category === category).length
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                category === "work"
                                  ? "bg-teal-500"
                                  : category === "personal"
                                    ? "bg-purple-500"
                                    : "bg-sky-500"
                              }`}
                            ></div>
                            <span className="text-sm capitalize">{category}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Priority</h3>
                  <div className="space-y-2">
                    {["high", "medium", "low"].map((priority) => {
                      const count = tasks.filter((t) => t.priority === priority).length
                      return (
                        <div key={priority} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Star size={14} className={getPriorityColor(priority)} />
                            <span className="text-sm capitalize">{priority}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Upcoming</h3>
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => !t.completed && t.dueDate)
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .slice(0, 3)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50"
                        >
                          <span className="text-sm truncate max-w-[180px]">{task.title}</span>
                          <div className="text-xs text-slate-500">
                            {new Date(task.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TodoList
