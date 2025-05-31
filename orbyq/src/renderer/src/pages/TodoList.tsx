"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, Star, MoreHorizontal, Trash2, Edit, Filter, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import * as Dialog from "@radix-ui/react-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Loader from "@/components/Loader"

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  dueDate: string;
  category: string;
}

interface PaginatedTodos {
  todos: Todo[];
  totalPages: number;
  totalElements: number;
}

const TodoList = () => {
  const { callBackend } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [displayedTasks, setDisplayedTasks] = useState<Todo[]>([]);
  const [allTasks, setAllTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Todo | null>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    completed: "ALL",
    priority: "ALL",
    category: "ALL",
  });

  // Sort state
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<string>("desc");

  const fetchTodos = async (page: number, reset: boolean = false) => {
    if (reset) setIsFiltering(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", pageSize.toString());
      params.append("sortBy", sortBy);
      params.append("sortDirection", sortDirection);

      if (filters.completed !== "ALL") {
        params.append("completed", (filters.completed === "COMPLETED").toString());
      }
      if (filters.priority !== "ALL") {
        params.append("priority", filters.priority.toLowerCase());
      }
      if (filters.category !== "ALL") {
        params.append("category", filters.category.toLowerCase());
      }

      const data = await callBackend<PaginatedTodos>(`todos?${params.toString()}`, "GET");
      const newTasks = reset ? data.todos : [...tasks, ...data.todos];
      setTasks(newTasks);
      setAllTasks(newTasks);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load to-do items. Please try again.");
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    fetchTodos(0, true);
  }, [filters, sortBy, sortDirection]);

  useEffect(() => {
    const filtered = activeTab === "all" ? tasks : tasks.filter((task) => task.category.toLowerCase() === activeTab);
    setDisplayedTasks(filtered);
  }, [tasks, activeTab]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchTodos(nextPage);
  };

  const addTask = async () => {
    if (newTask.trim() === "") {
      setErrorMessage("Task title cannot be empty.");
      return;
    }

    try {
      const category = activeTab === "all" ? "work" : activeTab;
      await callBackend<void>("todos", "POST", {
        title: newTask,
        priority: "medium",
        dueDate: "",
        category: category,
      });
      setNewTask("");
      setCurrentPage(0);
      fetchTodos(0, true);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Failed to add to-do item.");
    }
  };

  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    try {
      await callBackend<void>(`todos/${id}/complete`, "PUT", { completed: !completed });
      setCurrentPage(0);
      fetchTodos(0, true);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Failed to update to-do item.");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await callBackend<void>(`todos/${id}`, "DELETE");
      setCurrentPage(0);
      fetchTodos(0, true);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Failed to delete to-do item.");
    }
  };

  const openEditDialog = (task: Todo) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleEditTask = async () => {
    if (!editingTask) return;

    if (editingTask.title.trim() === "") {
      setErrorMessage("Task title cannot be empty.");
      return;
    }

    try {
      await callBackend<void>(`todos/${editingTask.id}`, "PUT", {
        title: editingTask.title,
        priority: editingTask.priority.toLowerCase(),
        dueDate: editingTask.dueDate,
        category: editingTask.category.toLowerCase(),
      });
      setIsEditDialogOpen(false);
      setEditingTask(null);
      setCurrentPage(0);
      fetchTodos(0, true);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Failed to update to-do item.");
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    fetchTodos(0, true);
    setIsFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      completed: "ALL",
      priority: "ALL",
      category: "ALL",
    });
    setCurrentPage(0);
    fetchTodos(0, true);
    setIsFilterDialogOpen(false);
  };

  const handleApplySort = () => {
    setCurrentPage(0);
    fetchTodos(0, true);
    setIsSortDialogOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-priority-high";
      case "medium":
        return "text-priority-medium";
      case "low":
        return "text-priority-low";
      default:
        return "text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "work":
        return "bg-category-work";
      case "personal":
        return "bg-category-personal";
      case "learning":
        return "bg-category-learning";
      default:
        return "bg-muted";
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader size="md" text="Loading your to-do list..." />
      </div>
    );
  }

  return (
    <div className="p-6 h-full bg-background">
      {errorMessage && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {errorMessage}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setErrorMessage(null);
              fetchTodos(0, true);
            }}
            className="ml-2"
          >
            Retry
          </Button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">To-Do List</h1>
          <p className="text-muted-foreground">Manage your personal and work tasks</p>
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
                <Dialog.Title className="text-lg font-medium text-foreground">Filter To-Do Items</Dialog.Title>
                <Dialog.Description className="text-muted-foreground mt-2">
                  Filter tasks by status, priority, and category.
                </Dialog.Description>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="filterCompleted" className="text-muted-foreground">Status</Label>
                    <Select
                      value={filters.completed}
                      onValueChange={(value) => setFilters({ ...filters, completed: value })}
                    >
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue placeholder="Select status" className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="filterPriority" className="text-muted-foreground">Priority</Label>
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
                  <div>
                    <Label htmlFor="filterCategory" className="text-muted-foreground">Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue placeholder="Select category" className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="WORK">Work</SelectItem>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="LEARNING">Learning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Apply
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Dialog.Root open={isSortDialogOpen} onOpenChange={setIsSortDialogOpen}>
            <Dialog.Trigger asChild>
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                <ArrowUpDown size={14} className="mr-1" /> Sort
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
                <Dialog.Title className="text-lg font-medium text-foreground">Sort To-Do Items</Dialog.Title>
                <Dialog.Description className="text-muted-foreground mt-2">
                  Sort tasks by different criteria.
                </Dialog.Description>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="sortBy" className="text-muted-foreground">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue placeholder="Select sort field" className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="createdAt">Created Date</SelectItem>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sortDirection" className="text-muted-foreground">Direction</Label>
                    <Select value={sortDirection} onValueChange={setSortDirection}>
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue placeholder="Select direction" className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Dialog.Close asChild>
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted">Cancel</Button>
                  </Dialog.Close>
                  <Button onClick={handleApplySort} className="bg-primary hover:bg-primary/90 text-primary-foreground">Apply</Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
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
                      addTask();
                    }
                  }}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={addTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus size={16} />
                </Button>
              </div>

              <div className="relative">
                {isFiltering && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                    <Loader size="sm" text="Applying filters..." />
                  </div>
                )}
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {isLoading && tasks.length > 0 && (
                    <div className="text-center py-4">
                      <Loader size="sm" text="Loading more tasks..." />
                    </div>
                  )}
                  {displayedTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No tasks found. Add a new task to get started!</p>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {displayedTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={`flex items-center justify-between p-3 rounded-md ${
                            task.completed ? "bg-muted text-muted-foreground" : "bg-background"
                          } border border-border hover:shadow-sm transition-shadow`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
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
                                task.priority.toLowerCase() === "high" ? "fill-current" : "fill-none"
                              }`}
                            />
                            <Badge className={getCategoryColor(task.category)}>
                              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background border-border">
                                <DropdownMenuItem
                                  className="flex items-center gap-2 text-foreground hover:bg-muted"
                                  onClick={() => openEditDialog(task)}
                                >
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
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {currentPage < totalPages - 1 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={isLoading || isFiltering}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    {isLoading ? <Loader size="sm" /> : "Load More"}
                  </Button>
                </div>
              )}
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Showing {displayedTasks.length} of {totalElements} tasks
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
                      style={{
                        width: `${(allTasks.filter((t) => t.completed).length / (allTasks.length || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{allTasks.filter((t) => t.completed).length} completed</span>
                    <span>{allTasks.filter((t) => !t.completed).length} remaining</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Categories</h3>
                  <div className="space-y-2">
                    {["work", "personal", "learning"].map((category) => {
                      const count = allTasks.filter((t) => t.category.toLowerCase() === category).length;
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(category)}`}></div>
                            <span className="text-sm text-foreground capitalize">{category}</span>
                          </div>
                          <Badge variant="outline" className="bg-muted text-foreground">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Priority</h3>
                  <div className="space-y-2">
                    {["high", "medium", "low"].map((priority) => {
                      const count = allTasks.filter((t) => t.priority.toLowerCase() === priority).length;
                      return (
                        <div key={priority} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Star size={14} className={getPriorityColor(priority)} />
                            <span className="text-sm text-foreground capitalize">{priority}</span>
                          </div>
                          <Badge variant="outline" className="bg-muted text-foreground">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Upcoming</h3>
                  <div className="space-y-2">
                    {allTasks
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

      <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
            <Dialog.Title className="text-lg font-medium text-foreground">Edit To-Do Item</Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-2">
              Update the details of your to-do item.
            </Dialog.Description>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title" className="text-muted-foreground">Title</Label>
                <Input
                  id="title"
                  value={editingTask?.title || ""}
                  onChange={(e) => setEditingTask(editingTask ? { ...editingTask, title: e.target.value } : null)}
                  className="border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="priority" className="text-muted-foreground">Priority</Label>
                <Select
                  value={editingTask?.priority || "medium"}
                  onValueChange={(value) => setEditingTask(editingTask ? { ...editingTask, priority: value } : null)}
                >
                  <SelectTrigger className="border-border text-foreground">
                    <SelectValue placeholder="Select priority" className="text-foreground" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border text-foreground">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate" className="text-muted-foreground">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editingTask?.dueDate || ""}
                  onChange={(e) => setEditingTask(editingTask ? { ...editingTask, dueDate: e.target.value } : null)}
                  className="border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-muted-foreground">Category</Label>
                <Select
                  value={editingTask?.category || "work"}
                  onValueChange={(value) => setEditingTask(editingTask ? { ...editingTask, category: value } : null)}
                >
                  <SelectTrigger className="border-border text-foreground">
                    <SelectValue placeholder="Select category" className="text-foreground" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border text-foreground">
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Dialog.Close asChild>
                <Button variant="outline" className="border-border text-foreground hover:bg-muted">Cancel</Button>
              </Dialog.Close>
              <Button onClick={handleEditTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default TodoList;