interface Project {
  id: number
  name: string
  progress: number
  tasks: {
    completed: number
    total: number
  }
}

function ProjectProgress() {
  const projects: Project[] = [
    {
      id: 1,
      name: "Website Redesign",
      progress: 75,
      tasks: { completed: 15, total: 20 },
    },
    {
      id: 2,
      name: "Mobile App Development",
      progress: 45,
      tasks: { completed: 9, total: 20 },
    },
    {
      id: 3,
      name: "Marketing Campaign",
      progress: 30,
      tasks: { completed: 6, total: 20 },
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
      <div>
        <h3 className="text-lg font-semibold">Project Progress</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track your active projects</p>
      </div>
      <div className="space-y-6 mt-4">
        {projects.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex justify-between">
              <h4 className="font-medium">{project.name}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">{project.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {project.tasks.completed} of {project.tasks.total} tasks completed
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectProgress
