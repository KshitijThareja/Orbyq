"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, Clock, ListTodo, Lightbulb, Kanban } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { useAuth } from '../context/AuthContext'

interface DashboardSummary {
  userName: string;
  taskCount: number;
  taskProgress: number;
  projectCount: number;
  projectProgress: number;
  ideaCount: number;
  newIdeasSinceYesterday: number;
  recentProjectActivities: { action: string; details: string; createdAt: string }[];
  recentActivities: { action: string; details: string; createdAt: string }[];
  upcomingTasks: { title: string; time: string; icon: string }[];
  weeklyProductivity: { day: string; taskCount: number }[];
}

const Dashboard = () => {
  const { callBackend } = useAuth();
  //@ts-ignore
  const [greeting, setGreeting] = useState(() => {
    // Adjust for IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60; // IST is UTC+5:30
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (istOffset * 60000));
    const hour = istTime.getHours(); // Use IST hour

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const data = await callBackend<DashboardSummary>('dashboard');
      setDashboardData(data);
      setIsLoading(false);
    } catch (err: any) {
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case "Clock":
        return <Clock size={16} className="text-muted-foreground" />;
      case "Calendar":
        return <Calendar size={16} className="text-muted-foreground" />;
      case "CheckCircle2":
        return <CheckCircle2 size={16} className="text-muted-foreground" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-background">
      <motion.div className="flex flex-col gap-6" variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{greeting}, {dashboardData.userName}!</h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your workspace</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-background border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">{dashboardData.taskCount}</span>
                <ListTodo className="text-category-work dark:text-white" size={24} />
              </div>
              <Progress value={dashboardData.taskProgress} className="h-2 mt-2 bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">{dashboardData.taskProgress.toFixed(1)}% Complete</p>
            </CardContent>
          </Card>

          <Card className="bg-background border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">{dashboardData.projectCount}</span>
                <Kanban className="text-category-personal dark:text-white" size={24} />
              </div>
              <Progress value={dashboardData.projectProgress} className="h-2 mt-2 bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">{dashboardData.projectProgress.toFixed(1)}% Complete</p>
            </CardContent>
          </Card>

          <Card className="bg-background border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">{dashboardData.ideaCount}</span>
                <Lightbulb className="text-priority-medium" size={24} />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {dashboardData.newIdeasSinceYesterday} new since yesterday
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Projects</CardTitle>
              <CardDescription className="text-muted-foreground">Your recent project updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentProjectActivities.length === 0 ? (
                  <p className="text-muted-foreground">No recent project activities.</p>
                ) : (
                  dashboardData.recentProjectActivities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-muted transition-colors rounded-md p-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                      <div>
                        <p className="text-sm text-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Upcoming Tasks</CardTitle>
              <CardDescription className="text-muted-foreground">Tasks due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.upcomingTasks.length === 0 ? (
                  <p className="text-muted-foreground">No upcoming tasks.</p>
                ) : (
                  dashboardData.upcomingTasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                      {getIconComponent(task.icon)}
                      <div>
                        <p className="font-medium text-sm text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Your recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivities.length === 0 ? (
                  <p className="text-muted-foreground">No recent activities.</p>
                ) : (
                  dashboardData.recentActivities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-muted transition-colors rounded-md p-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                      <div>
                        <p className="text-sm text-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Weekly Productivity</CardTitle>
              <CardDescription className="text-muted-foreground">Tasks completed this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-2 px-4">
                {dashboardData.weeklyProductivity.map((day, i) => {
                  const maxHeight = 150; // Max height in pixels
                  const height = Math.min(day.taskCount * 20, maxHeight); // Scale height based on task count
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 relative group">
                      <div
                        className="w-full bg-muted rounded-t-md relative"
                        style={{ height: `${height}px` }}
                      >
                        <div className="absolute inset-0 bg-primary opacity-60 rounded-t-md transition-opacity group-hover:opacity-80"></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background text-foreground text-xs py-1 px-2 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.taskCount} {day.taskCount === 1 ? "task" : "tasks"}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;