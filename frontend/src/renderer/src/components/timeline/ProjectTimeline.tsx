interface TimelineEvent {
  id: string
  title: string
  project: string
  startDate: string
  endDate: string
  type: "milestone" | "task" | "meeting"
  status: "completed" | "in-progress" | "upcoming"
}

function ProjectTimeline() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const events: TimelineEvent[] = [
    {
      id: "event-1",
      title: "Project Kickoff",
      project: "Orbyq",
      startDate: "May 5",
      endDate: "May 5",
      type: "milestone",
      status: "completed",
    },
    {
      id: "event-2",
      title: "Research Phase",
      project: "Orbyq",
      startDate: "May 6",
      endDate: "May 12",
      type: "task",
      status: "completed",
    },
    {
      id: "event-3",
      title: "Design Sprint",
      project: "Orbyq",
      startDate: "May 13",
      endDate: "May 19",
      type: "task",
      status: "in-progress",
    },
    {
      id: "event-4",
      title: "Stakeholder Review",
      project: "Orbyq",
      startDate: "May 20",
      endDate: "May 20",
      type: "meeting",
      status: "upcoming",
    },
    {
      id: "event-5",
      title: "Development Phase 1",
      project: "Orbyq",
      startDate: "May 21",
      endDate: "May 31",
      type: "task",
      status: "upcoming",
    },
    {
      id: "event-6",
      title: "Marketing Planning",
      project: "Marketing Campaign",
      startDate: "May 15",
      endDate: "May 22",
      type: "task",
      status: "in-progress",
    },
  ]

  // Helper function to determine event position
  const getEventPosition = (event: TimelineEvent) => {
    const startDay = Number.parseInt(event.startDate.split(" ")[1])
    const endDay = Number.parseInt(event.endDate.split(" ")[1])

    return {
      gridColumnStart: startDay,
      gridColumnEnd: endDay + 1,
    }
  }

  // Helper function to determine event color
  const getEventColor = (event: TimelineEvent) => {
    if (event.status === "completed")
      return "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
    if (event.status === "in-progress")
      return "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
    return "bg-gray-100 border-gray-300 text-gray-800 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"
  }

  // Helper function to determine event type icon
  const getEventTypeIcon = (type: TimelineEvent["type"]) => {
    if (type === "milestone") return "◆"
    if (type === "meeting") return "●"
    return ""
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
      <div className="p-4 pb-0">
        <div className="grid grid-cols-31 gap-0">
          {days.map((day) => (
            <div
              key={day}
              className={`text-center text-xs py-2 font-medium ${day === 14 ? "text-blue-600 dark:text-blue-400" : ""}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="grid grid-cols-31 gap-0 border-t border-slate-200 dark:border-slate-700">
          {days.map((day) => (
            <div
              key={day}
              className={`border-r border-slate-100 dark:border-slate-700 h-8 ${
                day === 14 ? "bg-blue-50 dark:bg-blue-900/10" : ""
              } ${[6, 7, 13, 14, 20, 21, 27, 28].includes(day) ? "bg-gray-50 dark:bg-slate-700/30" : ""}`}
            />
          ))}
        </div>

        <div className="relative mt-4 space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative">
              <div className="flex items-center mb-1">
                <span className="font-medium text-sm">{event.project}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                  {event.type}
                </span>
              </div>

              <div className="grid grid-cols-31 gap-0 h-10 relative">
                {days.map((day) => (
                  <div
                    key={day}
                    className={`border-r border-slate-100 dark:border-slate-700 ${
                      day === 14 ? "bg-blue-50 dark:bg-blue-900/10" : ""
                    } ${[6, 7, 13, 14, 20, 21, 27, 28].includes(day) ? "bg-gray-50 dark:bg-slate-700/30" : ""}`}
                  />
                ))}

                <div
                  className={`absolute top-1 h-8 rounded-lg border ${getEventColor(event)} px-2 flex items-center text-xs font-medium`}
                  style={{
                    ...getEventPosition(event),
                    zIndex: 10,
                  }}
                >
                  {getEventTypeIcon(event.type)} <span className="ml-1 truncate">{event.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectTimeline
