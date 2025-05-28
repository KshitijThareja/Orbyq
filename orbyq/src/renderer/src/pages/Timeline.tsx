"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Calendar, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useAuth } from '../context/AuthContext'
import * as Dialog from '@radix-ui/react-dialog'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimelineData {
  projects: {
    id: string;
    name: string;
    color: string;
    tasks: {
      id: string;
      name: string;
      startDay: string; // ISO date string
      duration: number;
      completed: boolean;
    }[];
  }[];
  upcomingMilestones: {
    name: string;
    project: string;
    date: string; // ISO date string
  }[];
  projectProgress: { [key: string]: number };
}

const Timeline = () => {
  const { callBackend } = useAuth();
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    projectId: "",
    startDay: "",
    duration: 1,
  });

  const fetchTimelineData = async () => {
    try {
      const data = await callBackend<TimelineData>('timeline');
      setTimelineData(data);
      setIsLoading(false);
    } catch (err: any) {
      setError('Failed to load timeline data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const getDateRange = () => {
    const startDate = new Date(currentDate);
    let endDate = new Date(currentDate);
    let numDays = 7;

    if (view === "day") {
      numDays = 1;
      endDate = new Date(startDate);
    } else if (view === "week") {
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (view === "month") {
      startDate.setDate(1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      numDays = endDate.getDate();
    }

    const days: Date[] = [];
    for (let i = 0; i < numDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return { days, startDate, endDate };
  };

  const { days, startDate, endDate } = getDateRange();

  const navigateTimeline = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + direction);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + 7 * direction);
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const start = startDate.toLocaleDateString("en-US", options);
    const end = endDate.toLocaleDateString("en-US", options);
    return view === "day" ? start : `${start} - ${end}`;
  };

  const calculateTaskPosition = (taskStartDay: string, taskDuration: number) => {
    const taskStart = new Date(taskStartDay);
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);

    // If the task starts after the range ends or ends before the range starts, don't display it
    const taskEnd = new Date(taskStart);
    taskEnd.setDate(taskStart.getDate() + taskDuration - 1);
    if (taskStart > rangeEnd || taskEnd < rangeStart) {
      return { left: -1, width: 0 }; // Out of range
    }

    // Calculate the number of days in the current view
    const totalDaysInView = days.length;

    // Adjust start and end to fit within the range
    const effectiveStart = taskStart < rangeStart ? rangeStart : taskStart;
    const effectiveEnd = taskEnd > rangeEnd ? rangeEnd : taskEnd;

    // Calculate position and width as percentages
    const daysFromRangeStart = Math.round((effectiveStart.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
    const effectiveDuration = Math.round((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const left = (daysFromRangeStart / totalDaysInView) * 100;
    const width = (effectiveDuration / totalDaysInView) * 100;

    return { left, width };
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.projectId || !newTask.startDay || newTask.duration < 1) {
      setError("All fields are required, and duration must be at least 1 day");
      return;
    }

    try {
      await callBackend<void>('timeline/task', 'POST', {
        title: newTask.title,
        projectId: newTask.projectId,
        startDay: newTask.startDay,
        duration: newTask.duration,
      });
      setIsDialogOpen(false);
      setNewTask({ title: "", projectId: "", startDay: "", duration: 1 });
      fetchTimelineData();
    } catch (err: any) {
      setError('Failed to add task: ' + (err.message || 'Unknown error'));
    }
  };

  const formatMilestoneDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (isLoading) {
    return <div className="p-4">Loading timeline...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">{error}</div>;
  }

  if (!timelineData) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className="p-6 h-full bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timeline</h1>
          <p className="text-muted-foreground">Project schedule and milestones</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
            <Filter size={14} className="mr-1" /> Filter
          </Button>
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus size={14} className="mr-1" /> Add Task
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
                <Dialog.Title className="text-lg font-medium text-foreground">Add New Task</Dialog.Title>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title" className="text-muted-foreground">Task Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project" className="text-muted-foreground">Project</Label>
                    <Select
                      onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}
                      value={newTask.projectId}
                    >
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue placeholder="Select a project" className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        {timelineData.projects.map((project) => (
                          <SelectItem key={project.id} value={project.id} className="text-foreground hover:bg-muted px-3 py-1">
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="startDay" className="text-muted-foreground">Start Date</Label>
                    <Input
                      id="startDay"
                      type="date"
                      value={newTask.startDay}
                      onChange={(e) => setNewTask({ ...newTask, startDay: e.target.value })}
                      className="border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-muted-foreground">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) || 1 })}
                      className="border-border text-foreground"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Dialog.Close asChild>
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted">Cancel</Button>
                  </Dialog.Close>
                  <Button onClick={handleAddTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Task</Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <Card className="mb-6 bg-background border-border">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted" onClick={() => navigateTimeline(-1)}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="font-medium text-foreground">{formatDateRange()}</span>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted" onClick={() => navigateTimeline(1)}>
                  <ChevronRight size={16} />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted mr-3" onClick={goToToday}>
                <Calendar size={14} className="mr-1" /> Today
              </Button>
            </div>
            <Select value={view} onValueChange={(value: "day" | "week" | "month") => setView(value)}>
              <SelectTrigger className="w-[120px] border-border bg-background text-foreground">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <div className={`grid grid-cols-${days.length} mb-4`} style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
              {days.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground uppercase">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className={`text-sm font-medium mt-1 ${isToday ? "text-primary" : "text-foreground"}`}>{day.getDate()}</div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-6">
              {timelineData.projects.map((project, projectIndex) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: projectIndex * 0.1 }}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${project.color} mr-2`}></div>
                    <h3 className="font-medium text-sm text-foreground">{project.name}</h3>
                  </div>
                  <div className="relative h-12 bg-muted rounded-md">
                    {project.tasks.map((task) => {
                      const { left, width } = calculateTaskPosition(task.startDay, task.duration);
                      if (left < 0 || width <= 0) return null; // Skip tasks outside the current range

                      return (
                        <div
                          key={task.id}
                          className={`absolute top-1 h-10 rounded-md ${project.color} bg-opacity-20 border-l-4 ${project.color} flex items-center px-2`}
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                          }}
                        >
                          <span className="text-xs font-medium text-foreground truncate">{task.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Milestones</CardTitle>
            <CardDescription className="text-muted-foreground">Important project deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineData.upcomingMilestones.length === 0 ? (
                <p className="text-muted-foreground">No upcoming milestones.</p>
              ) : (
                timelineData.upcomingMilestones.map((milestone, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div>
                      <p className="font-medium text-sm text-foreground">{milestone.name}</p>
                      <p className="text-xs text-muted-foreground">{milestone.project}</p>
                    </div>
                    <Badge variant="outline" className="bg-muted text-foreground">{formatMilestoneDate(milestone.date)}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Project Status</CardTitle>
            <CardDescription className="text-muted-foreground">Overall progress of active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineData.projects.map((project) => {
                const progress = timelineData.projectProgress[project.id] || 0;

                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{project.name}</span>
                      <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${project.color}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timeline;