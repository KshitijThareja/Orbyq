"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Calendar, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const Timeline = () => {
  const [view, setView] = useState("week")
  const [currentDate, setCurrentDate] = useState(new Date())

  // Generate days for the timeline
  const getDays = (): Date[] => {
    const days: Date[] = []
    const startDate = new Date(currentDate)

    // Set to beginning of week (Sunday)
    startDate.setDate(currentDate.getDate() - currentDate.getDay())

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }

    return days
  }

  const days: Date[] = getDays()

  // Sample project data
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      color: "bg-teal-500",
      tasks: [
        {
          id: 1,
          name: "Research",
          startDay: 0,
          duration: 2,
          completed: true,
        },
        {
          id: 2,
          name: "Wireframes",
          startDay: 2,
          duration: 2,
          completed: false,
        },
        {
          id: 3,
          name: "Design",
          startDay: 4,
          duration: 3,
          completed: false,
        },
      ],
    },
    {
      id: 2,
      name: "Mobile App Development",
      color: "bg-purple-500",
      tasks: [
        {
          id: 4,
          name: "Planning",
          startDay: 1,
          duration: 1,
          completed: true,
        },
        {
          id: 5,
          name: "UI Design",
          startDay: 3,
          duration: 3,
          completed: false,
        },
      ],
    },
    {
      id: 3,
      name: "Marketing Campaign",
      color: "bg-sky-500",
      tasks: [
        {
          id: 6,
          name: "Content Creation",
          startDay: 0,
          duration: 3,
          completed: false,
        },
        {
          id: 7,
          name: "Social Media",
          startDay: 4,
          duration: 2,
          completed: false,
        },
      ],
    },
  ]

  const navigateTimeline = (direction) => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + direction)
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + 7 * direction)
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + direction)
    }
    setCurrentDate(newDate)
  }

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    const start = days[0].toLocaleDateString("en-US", options)
    const end = days[6].toLocaleDateString("en-US", options)
    return `${start} - ${end}`
  }

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Timeline</h1>
          <p className="text-slate-500">Project schedule and milestones</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1" /> Filter
          </Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Plus size={14} className="mr-1" /> Add Task
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => navigateTimeline(-1)}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="font-medium">{formatDateRange()}</span>
                <Button variant="ghost" size="icon" onClick={() => navigateTimeline(1)}>
                  <ChevronRight size={16} />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Calendar size={14} className="mr-1" /> Today
              </Button>
            </div>
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            {/* Timeline header */}
            <div className="grid grid-cols-7 mb-4">
              {days.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString()
                return (
                  <div key={index} className="text-center">
                    <div className="text-xs text-slate-500 uppercase">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className={`text-sm font-medium mt-1 ${isToday ? "text-teal-600" : ""}`}>{day.getDate()}</div>
                  </div>
                )
              })}
            </div>

            {/* Timeline content */}
            <div className="space-y-6">
              {projects.map((project, projectIndex) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: projectIndex * 0.1 }}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${project.color} mr-2`}></div>
                    <h3 className="font-medium text-sm">{project.name}</h3>
                  </div>
                  <div className="relative h-12 bg-slate-50 rounded-md">
                    {project.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`absolute top-1 h-10 rounded-md ${project.color} bg-opacity-20 border-l-4 ${project.color} flex items-center px-2`}
                        style={{
                          left: `${(task.startDay / 7) * 100}%`,
                          width: `${(task.duration / 7) * 100}%`,
                        }}
                      >
                        <span className="text-xs font-medium truncate">{task.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
            <CardDescription>Important project deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Design Approval", project: "Website Redesign", date: "Jun 18, 2023" },
                { name: "Beta Launch", project: "Mobile App", date: "Jun 25, 2023" },
                { name: "Campaign Kickoff", project: "Marketing", date: "Jul 1, 2023" },
              ].map((milestone, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-sm">{milestone.name}</p>
                    <p className="text-xs text-slate-500">{milestone.project}</p>
                  </div>
                  <Badge variant="outline">{milestone.date}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Overall progress of active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => {
                const completedTasks = project.tasks.filter((t) => t.completed).length
                const progress = (completedTasks / project.tasks.length) * 100

                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{project.name}</span>
                      <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${project.color}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Timeline
