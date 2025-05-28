"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Calendar, Filter, Palette } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useAuth } from '../context/AuthContext'
import * as Dialog from '@radix-ui/react-dialog'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TimelineData {
  projects: {
    id: string;
    name: string;
    color: string;
    tasks: {
      id: string;
      name: string;
      startDay: string;
      duration: number;
      completed: boolean;
    }[];
  }[];
  upcomingMilestones: {
    name: string;
    project: string;
    date: string;
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
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    projectId: "",
    startDay: "",
    duration: 1,
  });
  const [filters, setFilters] = useState({
    status: "ALL",
    priority: "ALL",
  });
  const [newProjectColor, setNewProjectColor] = useState("");

  const fetchTimelineData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "ALL") params.append("status", filters.status);
      if (filters.priority && filters.priority !== "ALL") params.append("priority", filters.priority);
      const data = await callBackend<TimelineData>(`timeline?${params.toString()}`);
      setTimelineData(data);
      setIsLoading(false);
    } catch (err: any) {
      setError('Failed to load timeline data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, [filters]);

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

    const taskEnd = new Date(taskStart);
    taskEnd.setDate(taskStart.getDate() + taskDuration - 1);
    if (taskStart > rangeEnd || taskEnd < rangeStart) {
      return { left: -1, width: 0 };
    }

    const totalDaysInView = days.length;
    const effectiveStart = taskStart < rangeStart ? rangeStart : taskStart;
    const effectiveEnd = taskEnd > rangeEnd ? rangeEnd : taskEnd;

    const daysFromRangeStart = Math.round((effectiveStart.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
    const effectiveDuration = Math.round((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const left = (daysFromRangeStart / totalDaysInView) * 100;
    const width = (effectiveDuration / totalDaysInView) * 100;

    return { left, width };
  };

  const groupTasksByStartDay = (tasks: TimelineData["projects"][0]["tasks"]) => {
    const grouped: { [key: string]: typeof tasks } = {};
    tasks.forEach((task) => {
      const startDay = task.startDay;
      if (!grouped[startDay]) {
        grouped[startDay] = [];
      }
      grouped[startDay].push(task);
    });
    return grouped;
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.projectId || !newTask.startDay || newTask.duration < 1) {
      setError("Title, project, start date, and duration (at least 1 day) are required");
      return;
    }

    try {
      await callBackend<void>('timeline/task', 'POST', {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        projectId: newTask.projectId,
        startDay: newTask.startDay,
        duration: newTask.duration,
      });
      setIsAddTaskDialogOpen(false);
      setNewTask({ title: "", description: "", priority: "MEDIUM", projectId: "", startDay: "", duration: 1 });
      fetchTimelineData();
    } catch (err: any) {
      setError('Failed to add task: ' + (err.message || 'Unknown error'));
    }
  };

  const handleApplyFilters = () => {
    setIsFilterDialogOpen(false);
    fetchTimelineData();
  };

  const handleUpdateProjectColor = async () => {
    if (!selectedProject || !newProjectColor) {
      setError("Project and color are required");
      return;
    }

    try {
      await callBackend<void>('timeline/project/color', 'POST', {
        projectId: selectedProject.id,
        color: newProjectColor,
      });
      setIsEditProjectDialogOpen(false);
      setNewProjectColor("");
      setSelectedProject(null);
      fetchTimelineData();
    } catch (err: any) {
      setError('Failed to update project color: ' + (err.message || 'Unknown error'));
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
          <Dialog.Root open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <Dialog.Trigger asChild>
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                <Filter size={14} className="mr-1" /> Filter
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
                <Dialog.Title className="text-lg font-medium text-foreground">Filter Tasks</Dialog.Title>
                <Dialog.Description className="text-muted-foreground mt-2">
                  Filter tasks by status and priority.
                </Dialog.Description>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="statusFilter" className="text-muted-foreground">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters({ ...filters, status: value })}
                    >
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue placeholder="Select status" className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="TODO">To Do</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="REVIEW">Review</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priorityFilter" className="text-muted-foreground">Priority</Label>
                    <Select
                      value={filters.priority}
                      onValueChange={(value) => setFilters({ ...filters, priority: value })}
                    >
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue placeholder="Select priority" className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Dialog.Close asChild>
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted">Cancel</Button>
                  </Dialog.Close>
                  <Button onClick={handleApplyFilters} className="bg-primary hover:bg-primary/90 text-primary-foreground">Apply</Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Dialog.Root open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
            <Dialog.Trigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus size={14} className="mr-1" /> Add Task
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
                <Dialog.Title className="text-lg font-medium text-foreground">Add New Task</Dialog.Title>
                <Dialog.Description className="text-muted-foreground mt-2">
                  Create a new task by filling in the details below.
                </Dialog.Description>
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
                    <Label htmlFor="description" className="text-muted-foreground">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority" className="text-muted-foreground">Difficulty (Priority)</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue placeholder="Select priority" className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
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
              {timelineData.projects.length === 0 ? (
                <p className="text-muted-foreground text-center">No projects available.</p>
              ) : (
                timelineData.projects.map((project, projectIndex) => {
                  const groupedTasks = groupTasksByStartDay(project.tasks);
                  const maxOverlaps = Object.values(groupedTasks).reduce((max, group) => Math.max(max, group.length), 0);
                  const rowHeight = maxOverlaps * 48;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: projectIndex * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${project.color} mr-2`}></div>
                          <h3 className="font-medium text-sm text-foreground">{project.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProject({ id: project.id, name: project.name });
                            setNewProjectColor(project.color);
                            setIsEditProjectDialogOpen(true);
                          }}
                          className="text-muted-foreground hover:bg-muted"
                        >
                          <Palette size={14} className="mr-1" /> Edit Color
                        </Button>
                      </div>
                      <div className="relative bg-muted rounded-md" style={{ height: `${rowHeight}px`, minHeight: '48px' }}>
                        {Object.entries(groupedTasks).flatMap(([startDay, tasks]) =>
                          tasks.map((task, taskIndex) => {
                            const { left, width } = calculateTaskPosition(task.startDay, task.duration);
                            if (left < 0 || width <= 0) return null;

                            return (
                              <div
                                key={task.id}
                                className={`absolute h-10 rounded-md ${project.color} bg-opacity-20 border-l-4 ${project.color} flex items-center px-2`}
                                style={{
                                  left: `${left}%`,
                                  width: `${width}%`,
                                  top: `${taskIndex * 48}px`,
                                }}
                              >
                                <span className="text-xs font-medium text-foreground truncate">{task.name}</span>
                              </div>
                            );
                          })
                        )}
                        {project.tasks.length === 0 && (
                          <p className="text-muted-foreground text-center pt-4">No tasks in this range.</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
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

      <Dialog.Root open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
            <Dialog.Title className="text-lg font-medium text-foreground">Edit Project Color</Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-2">
              Set a custom color for the project.
            </Dialog.Description>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="projectName" className="text-muted-foreground">Project</Label>
                <Input
                  id="projectName"
                  value={selectedProject?.name || ""}
                  disabled
                  className="border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="color" className="text-muted-foreground">Color Class (e.g., bg-blue-500)</Label>
                <Input
                  id="color"
                  value={newProjectColor}
                  onChange={(e) => setNewProjectColor(e.target.value)}
                  placeholder="e.g., bg-blue-500"
                  className="border-border text-foreground"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Dialog.Close asChild>
                <Button variant="outline" className="border-border text-foreground hover:bg-muted">Cancel</Button>
              </Dialog.Close>
              <Button onClick={handleUpdateProjectColor} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Timeline;