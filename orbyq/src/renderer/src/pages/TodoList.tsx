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
        return "text-priority-high"
      case "medium":
        return "text-priority-medium"
      case "low":
        return "text-priority-low"
      default:
        return "text-muted-foreground"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-category-work"
      case "personal":
        return "bg-category-personal"
      case "learning":
        return "bg-category-learning"
      default:
        return "bg-muted"
    }
  }

  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.category === activeTab)

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="p-6 h-full bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">To-Do List</h1>
          <p className="text-muted-foreground">Manage your personal and work tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
            <Filter size={14} className="mr-1" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
            <ArrowUpDown size={14} className="mr-1" /> Sort
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-80px)]">
        <div className="lg:col-span-2">
          <Card className="h-full bg-background border-border">
            <CardHeader className="pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="tabs-list">
                  <TabsTrigger value="all" className="tabs-trigger text-foreground">All</TabsTrigger>
                  <TabsTrigger value="work" className="tabs-trigger text-foreground">Work</TabsTrigger>
                  <TabsTrigger value="personal" className="tabs-trigger text-foreground">Personal</TabsTrigger>
                  <TabsTrigger value="learning" className="tabs-trigger text-foreground">Learning</TabsTrigger>
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
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={addTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus size={16} />
                </Button>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {sortedTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
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
                        task.completed ? "bg-muted text-muted-foreground" : "bg-background"
                      } border border-border hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className={task.completed ? "opacity-50 checkbox" : "checkbox"}
                        />
                        <div className={task.completed ? "line-through" : ""}>
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          {task.dueDate && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border-border">
                            <DropdownMenuItem className="flex items-center gap-2 text-foreground hover:bg-muted">
                              <Edit size={14} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-destructive hover:bg-muted"
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
          <Card className="h-full bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Task Summary</CardTitle>
              <CardDescription className="text-muted-foreground">Overview of your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Task Status</h3>
                  <div className="bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{tasks.filter((t) => t.completed).length} completed</span>
                    <span>{tasks.filter((t) => !t.completed).length} remaining</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Categories</h3>
                  <div className="space-y-2">
                    {["work", "personal", "learning"].map((category) => {
                      const count = tasks.filter((t) => t.category === category).length
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(category)}`}></div>
                            <span className="text-sm text-foreground capitalize">{category}</span>
                          </div>
                          <Badge variant="outline" className="bg-muted text-foreground">{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Priority</h3>
                  <div className="space-y-2">
                    {["high", "medium", "low"].map((priority) => {
                      const count = tasks.filter((t) => t.priority === priority).length
                      return (
                        <div key={priority} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Star size={14} className={getPriorityColor(priority)} />
                            <span className="text-sm text-foreground capitalize">{priority}</span>
                          </div>
                          <Badge variant="outline" className="bg-muted text-foreground">{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Upcoming</h3>
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => !t.completed && t.dueDate)
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .slice(0, 3)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex justify-between items-center p-2 rounded-md hover:bg-muted"
                        >
                          <span className="text-sm text-foreground truncate max-w-[180px]">{task.title}</span>
                          <div className="text-xs text-muted-foreground">
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