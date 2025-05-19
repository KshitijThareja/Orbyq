"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Plus, Clock, MessageSquare, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

const initialData = {
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["task-5", "task-6"],
    },
    "column-3": {
      id: "column-3",
      title: "Review",
      taskIds: ["task-7"],
    },
    "column-4": {
      id: "column-4",
      title: "Done",
      taskIds: ["task-8", "task-9"],
    },
  },
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Research competitors",
      description: "Analyze top 5 competitors in the market",
      priority: "medium",
      dueDate: "2023-06-15",
      comments: 2,
      attachments: 1,
    },
    "task-2": {
      id: "task-2",
      title: "Create wireframes",
      description: "Design initial wireframes for the dashboard",
      priority: "high",
      dueDate: "2023-06-18",
      comments: 5,
      attachments: 3,
    },
    "task-3": {
      id: "task-3",
      title: "User interviews",
      description: "Conduct interviews with 10 potential users",
      priority: "high",
      dueDate: "2023-06-20",
      comments: 0,
      attachments: 0,
    },
    "task-4": {
      id: "task-4",
      title: "Define MVP features",
      description: "Create a list of features for the MVP",
      priority: "medium",
      dueDate: "2023-06-22",
      comments: 3,
      attachments: 2,
    },
    "task-5": {
      id: "task-5",
      title: "Design system setup",
      description: "Create color palette, typography, and components",
      priority: "medium",
      dueDate: "2023-06-25",
      comments: 1,
      attachments: 4,
    },
    "task-6": {
      id: "task-6",
      title: "Homepage prototype",
      description: "Create interactive prototype for the homepage",
      priority: "high",
      dueDate: "2023-06-28",
      comments: 7,
      attachments: 2,
    },
    "task-7": {
      id: "task-7",
      title: "User flow diagrams",
      description: "Create user flow diagrams for main features",
      priority: "low",
      dueDate: "2023-07-01",
      comments: 2,
      attachments: 1,
    },
    "task-8": {
      id: "task-8",
      title: "Competitive analysis",
      description: "Complete analysis of top competitors",
      priority: "medium",
      dueDate: "2023-06-10",
      comments: 4,
      attachments: 3,
    },
    "task-9": {
      id: "task-9",
      title: "User personas",
      description: "Create 3-5 user personas for the product",
      priority: "medium",
      dueDate: "2023-06-12",
      comments: 2,
      attachments: 5,
    },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4"],
}

const TaskBoard = () => {
  const [boardData, setBoardData] = useState(initialData)

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const sourceColumn = boardData.columns[source.droppableId]
    const destColumn = boardData.columns[destination.droppableId]

    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      }

      const newState = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      }

      setBoardData(newState)
      return
    }

    const sourceTaskIds = Array.from(sourceColumn.taskIds)
    sourceTaskIds.splice(source.index, 1)
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    }

    const destTaskIds = Array.from(destColumn.taskIds)
    destTaskIds.splice(destination.index, 0, draggableId)
    const newDestColumn = {
      ...destColumn,
      taskIds: destTaskIds,
    }

    const newState = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      },
    }

    setBoardData(newState)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-priority-high"
      case "medium":
        return "bg-priority-medium"
      case "low":
        return "bg-priority-low"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="p-6 h-full bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Board</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
            Filter
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus size={16} className="mr-1" /> Add Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100%-80px)]">
          {boardData.columnOrder.map((columnId, index) => {
            const column = boardData.columns[columnId]
            const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId])

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
                    {column.taskIds.length}
                  </Badge>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 rounded-lg overflow-y-auto ${
                        snapshot.isDraggingOver ? "bg-muted" : "bg-background"
                      } border border-border`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
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
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:bg-muted">
                                    <MoreHorizontal size={14} />
                                  </Button>
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
                                    {task.dueDate.split("-")[1]}/{task.dueDate.split("-")[2]}
                                  </div>
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                                    <AvatarFallback className="text-[10px] bg-muted text-foreground">{task.id.split("-")[1]}</AvatarFallback>
                                  </Avatar>
                                </div>
                              </CardFooter>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-auto py-2 hover:bg-muted">
                        <Plus size={14} className="mr-1" /> Add a card
                      </Button>
                    </div>
                  )}
                </Droppable>
              </motion.div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}

export default TaskBoard