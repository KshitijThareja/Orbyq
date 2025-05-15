import { CheckCircle, Clock, MoreHorizontal } from "lucide-react"

interface Task {
  id: number
  title: string
  project: string
  dueDate: string
  priority: "High" | "Medium" | "Low"
  status: "Completed" | "In Progress" | "Not Started"
}

function RecentTasks() {
  const tasks: Task[] = [
    {
      id: 1,
      title: "Update project documentation",
      project: "Orbyq",
      dueDate: "Today",
      priority: "High",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Design user dashboard wireframes",
      project: "Orbyq",
      dueDate: "Tomorrow",
      priority: "Medium",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Research competitor features",
      project: "Market Analysis",
      dueDate: "May 16",
      priority: "Low",
      status: "Completed",
    },
    {
      id: 4,
      title: "Prepare presentation for stakeholders",
      project: "Orbyq",
      dueDate: "May 18",
      priority: "High",
      status: "Not Started",
    },
  ]

  const getPriorityBadge = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {priority}
          </span>
        )
      case "Medium":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            {priority}
          </span>
        )
      case "Low":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {priority}
          </span>
        )
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <h3 className="text-lg font-semibold">Recent Tasks</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your latest tasks and their status</p>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-4 mt-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 last:border-0 last:pb-0"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {task.status === "Completed" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-500" />
                )}
                <p className="font-medium">{task.title}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{task.project}</span>
                <span>•</span>
                <span>Due {task.dueDate}</span>
              </div>
            </div>
            {getPriorityBadge(task.priority)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTasks
