"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, Clock, ListTodo, Lightbulb, Kanban } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

const Dashboard = () => {
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-background">
      <motion.div className="flex flex-col gap-6" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold text-foreground">{greeting}, Alex</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your workspace</p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-background border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">12/20</span>
                <ListTodo className="text-category-work dark:text-white" size={24} />
              </div>
              <Progress value={60} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">4</span>
                <Kanban className="text-category-personal dark:text-white" size={24} />
              </div>
              <div className="flex gap-2 mt-2">
                <div className="h-2 rounded-full bg-muted flex-1">
                  <div className="h-2 rounded-full bg-category-personal w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">7</span>
                <Lightbulb className="text-priority-medium" size={24} />
              </div>
              <div className="text-xs text-muted-foreground mt-2">3 new since yesterday</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Projects</CardTitle>
              <CardDescription className="text-muted-foreground">Your active and recent projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Website Redesign", progress: 75, color: "bg-category-work" },
                  { name: "Mobile App Development", progress: 40, color: "bg-category-personal" },
                  { name: "Marketing Campaign", progress: 90, color: "bg-category-learning" },
                ].map((project, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm text-foreground">{project.name}</span>
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Upcoming</CardTitle>
              <CardDescription className="text-muted-foreground">Tasks due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Design Review", time: "Today, 2:00 PM", icon: Clock },
                  { title: "Client Meeting", time: "Tomorrow, 10:00 AM", icon: Calendar },
                  { title: "Project Deadline", time: "Friday, 5:00 PM", icon: CheckCircle2 },
                ].map((task, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
                    <task.icon size={16} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Your recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { text: 'You completed task "Update documentation"', time: "2 hours ago" },
                  { text: "You added a new idea to Creative Space", time: "Yesterday" },
                  { text: "You updated the project timeline", time: "2 days ago" },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                    <div>
                      <p className="text-sm text-foreground">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Productivity</CardTitle>
              <CardDescription className="text-muted-foreground">Weekly task completion</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <div className="w-full h-full flex items-end justify-between gap-2 px-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                  const height = [60, 45, 75, 50, 65, 30, 20][i]
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-8 bg-muted rounded-t-md relative group" style={{ height: `${height}%` }}>
                        <div className="absolute inset-0 bg-primary opacity-60 rounded-t-md"></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity">
                          {height / 10} tasks
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard