"use client"

import { useState, useEffect, useCallback } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Plus, Clock, MessageSquare, Paperclip, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useAuth } from '../context/AuthContext'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskBoardData {
  columns: {
    [key: string]: {
      id: string;
      title: string;
      taskIds: string[];
    };
  };
  tasks: {
    [key: string]: {
      id: string;
      title: string;
      description: string;
      priority: string;
      dueDate: string;
      comments: number;
      attachments: number;
    };
  };
  columnOrder: string[];
}

const TaskBoard = () => {
  const { callBackend } = useAuth();
  const [boardData, setBoardData] = useState<TaskBoardData | null>(null);
  const [originalBoardData, setOriginalBoardData] = useState<TaskBoardData | null>(null);
  const [taskDisplayNumbers, setTaskDisplayNumbers] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "TODO"
  });
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get the current date dynamically in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  const fetchBoardData = async () => {
    try {
      const data = await callBackend<TaskBoardData>('taskboard');
      console.log('Fetched boardData:', data);
      setBoardData(data);
      setOriginalBoardData(data);

      // Generate display numbers for tasks
      const taskIds = Object.keys(data.tasks);
      const displayNumbers: { [key: string]: number } = {};
      taskIds.forEach((taskId, index) => {
        displayNumbers[taskId] = index + 1;
      });
      setTaskDisplayNumbers(displayNumbers);

      setIsLoading(false);
    } catch (err: any) {
      setError('Failed to load task board');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = async (result: any) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    if (!boardData) return;

    const sourceColumn = boardData.columns[source.droppableId];
    const destColumn = boardData.columns[destination.droppableId];

    if (!sourceColumn || !destColumn) {
      console.error('Source or destination column not found:', { sourceColumn, destColumn });
      setError('Invalid column data');
      return;
    }

    // Update local state
    let newState: TaskBoardData;
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      newState = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      };
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);
      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      };

      const destTaskIds = Array.from(destColumn.taskIds);
      destTaskIds.splice(destination.index, 0, draggableId);
      const newDestColumn = {
        ...destColumn,
        taskIds: destTaskIds,
      };

      newState = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [newSourceColumn.id]: newSourceColumn,
          [newDestColumn.id]: newDestColumn,
        },
      };
    }

    setBoardData(newState);

    // Sync with backend
    try {
      const statusMap: { [key: string]: string } = {
        "column-1": "TODO",
        "column-2": "IN_PROGRESS",
        "column-3": "REVIEW",
        "column-4": "DONE"
      };
      await callBackend<void>(`taskboard/${draggableId}/status`, 'PATCH', { status: statusMap[destination.droppableId] });
    } catch (err) {
      setError('Failed to update task status');
      if (originalBoardData) {
        setBoardData(originalBoardData);
      }
    }
  };

  const validateTaskInput = (task: typeof newTask): string | null => {
    if (!task.title.trim()) {
      return "Title is required";
    }
    if (!task.dueDate) {
      return "Due date is required";
    }
    // Validate due date is not in the past using the current date
    const dueDate = new Date(task.dueDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to midnight for date-only comparison
    if (dueDate < currentDate) {
      return "Due date cannot be in the past";
    }
    return null;
  };

  const handleAddTask = async () => {
    // Validate input
    const validationError = validateTaskInput(newTask);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Prepare the payload explicitly
    const payload = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      status: newTask.status
    };

    try {
      console.log('Creating task with payload:', payload);
      await callBackend<void>('taskboard', 'POST', payload);
      setIsDialogOpen(false);
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "", status: "TODO" });
      fetchBoardData();
    } catch (err: any) {
      setError('Failed to create task: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEditTask = async () => {
    if (!editingTask) return;

    // Validate input
    const validationError = validateTaskInput(editingTask);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await callBackend<void>(`taskboard/${editingTask.id}`, 'PUT', {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        status: editingTask.status,
      });
      setIsEditDialogOpen(false);
      setEditingTask(null);
      fetchBoardData();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await callBackend<void>(`taskboard/${taskId}`, 'DELETE');
      fetchBoardData();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-priority-high";
      case "medium":
        return "bg-priority-medium";
      case "low":
        return "bg-priority-low";
      default:
        return "bg-muted";
    }
  };

  const shouldShowTask = useCallback((taskId: string) => {
    if (!boardData?.tasks[taskId]) return false;
    if (filterPriority === "all" || isDragging) return true;
    return boardData.tasks[taskId].priority === filterPriority;
  }, [filterPriority, isDragging, boardData]);

  const getFilteredTaskCount = useCallback((taskIds: string[]) => {
    return taskIds.filter(taskId => shouldShowTask(taskId)).length;
  }, [shouldShowTask]);

  if (isLoading) {
    return <div className="p-4">Loading task board...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">{error}</div>;
  }

  if (!boardData) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className="p-6 h-full bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Board</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={setFilterPriority} defaultValue="all">
            <SelectTrigger className="w-[120px] border-border text-foreground">
              <SelectValue placeholder="Filter" className="text-foreground" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border text-foreground">
              <SelectItem value="all" className="text-foreground hover:bg-muted">All Priorities</SelectItem>
              <SelectItem value="high" className="text-foreground hover:bg-muted">High</SelectItem>
              <SelectItem value="medium" className="text-foreground hover:bg-muted">Medium</SelectItem>
              <SelectItem value="low" className="text-foreground hover:bg-muted">Low</SelectItem>
            </SelectContent>
          </Select>
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus size={16} className="mr-1" /> Add Task
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
                <Dialog.Title className="text-lg font-medium text-foreground">Add New Task</Dialog.Title>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title" className="text-muted-foreground">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                      className="border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-muted-foreground">Description</Label>
                    <Input
                      id="description"
                      value={newTask.description}
                      onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                      className="border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority" className="text-muted-foreground">Priority</Label>
                    <Select
                      onValueChange={value => setNewTask({ ...newTask, priority: value })}
                      defaultValue="medium"
                    >
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="high" className="text-foreground hover:bg-muted px-3 py-1">High</SelectItem>
                        <SelectItem value="medium" className="text-foreground hover:bg-muted px-3 py-1">Medium</SelectItem>
                        <SelectItem value="low" className="text-foreground hover:bg-muted px-3 py-1">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate" className="text-muted-foreground">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                      min={getCurrentDate()}
                      className="border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-muted-foreground">Status</Label>
                    <Select
                      onValueChange={value => setNewTask({ ...newTask, status: value })}
                      defaultValue="TODO"
                    >
                      <SelectTrigger className="border-border text-foreground">
                        <SelectValue className="text-foreground" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border text-foreground">
                        <SelectItem value="TODO" className="text-foreground hover:bg-muted px-3 py-1">To Do</SelectItem>
                        <SelectItem value="IN_PROGRESS" className="text-foreground hover:bg-muted px-3 py-1">In Progress</SelectItem>
                        <SelectItem value="REVIEW" className="text-foreground hover:bg-muted px-3 py-1">Review</SelectItem>
                        <SelectItem value="DONE" className="text-foreground hover:bg-muted px-3 py-1">Done</SelectItem>
                      </SelectContent>
                    </Select>
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

      <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
            <Dialog.Title className="text-lg font-medium text-foreground">Edit Task</Dialog.Title>
            {editingTask && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="edit-title" className="text-muted-foreground">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingTask.title}
                    onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description" className="text-muted-foreground">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingTask.description}
                    onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                    className="border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-priority" className="text-muted-foreground">Priority</Label>
                  <Select
                    onValueChange={value => setEditingTask({ ...editingTask, priority: value })}
                    defaultValue={editingTask.priority}
                  >
                    <SelectTrigger className="border-border text-foreground">
                      <SelectValue className="text-foreground" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border text-foreground">
                      <SelectItem value="high" className="text-foreground hover:bg-muted px-3 py-1">High</SelectItem>
                      <SelectItem value="medium" className="text-foreground hover:bg-muted px-3 py-1">Medium</SelectItem>
                      <SelectItem value="low" className="text-foreground hover:bg-muted px-3 py-1">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-dueDate" className="text-muted-foreground">Due Date</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editingTask.dueDate}
                    onChange={e => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    min={getCurrentDate()}
                    className="border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status" className="text-muted-foreground">Status</Label>
                  <Select
                    onValueChange={value => setEditingTask({ ...editingTask, status: value })}
                    defaultValue={editingTask.status}
                  >
                    <SelectTrigger className="border-border text-foreground">
                      <SelectValue className="text-foreground" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border text-foreground">
                      <SelectItem value="TODO" className="text-foreground hover:bg-muted px-3 py-1">To Do</SelectItem>
                      <SelectItem value="IN_PROGRESS" className="text-foreground hover:bg-muted px-3 py-1">In Progress</SelectItem>
                      <SelectItem value="REVIEW" className="text-foreground hover:bg-muted px-3 py-1">Review</SelectItem>
                      <SelectItem value="DONE" className="text-foreground hover:bg-muted px-3 py-1">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <Dialog.Close asChild>
                <Button variant="outline" className="border-border text-foreground hover:bg-muted">Cancel</Button>
              </Dialog.Close>
              <Button onClick={handleEditTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100%-80px)]">
          {boardData.columnOrder.map((columnId, index) => {
            const column = boardData.columns[columnId];
            if (!column) {
              console.error(`Column ${columnId} not found in boardData.columns`);
              return null;
            }
            const tasks = column.taskIds
              .map(taskId => {
                if (!boardData.tasks[taskId]) {
                  console.warn(`Task ${taskId} not found in boardData.tasks`);
                  return undefined;
                }
                return boardData.tasks[taskId];
              })
              .filter(task => task !== undefined);

            console.log(`Tasks in ${column.id}:`, tasks);

            return (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-foreground">{column.title}</h3>
                  <Badge variant="outline" className="bg-muted text-foreground">
                    {getFilteredTaskCount(column.taskIds)}
                  </Badge>
                </div>

                <Droppable
                  droppableId={column.id}
                  isDropDisabled={false}
                  isCombineEnabled={false}
                  ignoreContainerClipping={false}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 rounded-lg overflow-y-auto ${
                        snapshot.isDraggingOver ? "bg-muted" : "bg-background"
                      } border border-border`}
                    >
                      {tasks.map((task, index) => (
                        <div
                          key={task.id}
                          className={shouldShowTask(task.id) ? "block" : "hidden"}
                        >
                          <Draggable draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 shadow-sm bg-background border-border ${
                                  snapshot.isDragging ? "shadow-md" : ""
                                }`}
                              >
                                <CardHeader className="p-3 pb-0">
                                  <div className="flex justify-between items-start">
                                    <div className="flex gap-2 items-center">
                                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                      <CardTitle className="text-sm font-medium text-foreground">{task.title}</CardTitle>
                                    </div>
                                    <DropdownMenu.Root>
                                      <DropdownMenu.Trigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:bg-muted">
                                          <MoreHorizontal size={14} />
                                        </Button>
                                      </DropdownMenu.Trigger>
                                      <DropdownMenu.Portal>
                                        <DropdownMenu.Content className="bg-background border border-border rounded-md shadow-lg p-1">
                                          <DropdownMenu.Item
                                            className="flex items-center gap-2 px-3 py-1 text-sm text-foreground hover:bg-muted cursor-pointer rounded-sm"
                                            onSelect={() => {
                                              setEditingTask({
                                                id: task.id,
                                                title: task.title,
                                                description: task.description,
                                                priority: task.priority,
                                                dueDate: task.dueDate,
                                                status: column.id === "column-1" ? "TODO" : column.id === "column-2" ? "IN_PROGRESS" : column.id === "column-3" ? "REVIEW" : "DONE",
                                              });
                                              setIsEditDialogOpen(true);
                                            }}
                                          >
                                            <Edit size={14} />
                                            Edit Task
                                          </DropdownMenu.Item>
                                          <DropdownMenu.Item
                                            className="flex items-center gap-2 px-3 py-1 text-sm text-destructive hover:bg-muted cursor-pointer rounded-sm"
                                            onSelect={() => handleDeleteTask(task.id)}
                                          >
                                            <Trash size={14} />
                                            Delete Task
                                          </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                      </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-2">
                                  <CardDescription className="text-xs text-muted-foreground">{task.description}</CardDescription>
                                </CardContent>
                                <CardFooter className="p-3 pt-0 flex justify-between items-center">
                                  <div className="flex items-center gap-3 text-muted-foreground">
                                    {task.comments > 0 && (
                                      <div className="flex items-center gap-1 text-xs">
                                        <MessageSquare size={12} />
                                        <span>{task.comments}</span>
                                      </div>
                                    )}
                                    {task.attachments > 0 && (
                                      <div className="flex items-center gap-1 text-xs">
                                        <Paperclip size={12} />
                                        <span>{task.attachments}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock size={12} className="mr-1" />
                                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                                      <AvatarFallback className="text-[10px] bg-muted text-foreground">
                                        {taskDisplayNumbers[task.id] ? `T${taskDisplayNumbers[task.id]}` : task.id.split("-")[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                </CardFooter>
                              </Card>
                            )}
                          </Draggable>
                        </div>
                      ))}
                      {provided.placeholder}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground text-sm h-auto py-2 hover:bg-muted"
                        onClick={() => {
                          setNewTask({ ...newTask, status: column.id === "column-1" ? "TODO" : column.id === "column-2" ? "IN_PROGRESS" : column.id === "column-3" ? "REVIEW" : "DONE" });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Plus size={14} className="mr-1" /> Add a card
                      </Button>
                    </div>
                  )}
                </Droppable>
              </motion.div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;