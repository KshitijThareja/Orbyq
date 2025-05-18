import { CalendarPlus, FileEdit, ListPlus, PlusCircle } from "lucide-react"

function QuickActions() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
      <div>
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Frequently used actions</p>
      </div>
      <div className="space-y-3 mt-4">
        <button className="w-full flex items-center justify-start px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
          <ListPlus className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
          Create New Task
        </button>
        <button className="w-full flex items-center justify-start px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
          <CalendarPlus className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
          Schedule Event
        </button>
        <button className="w-full flex items-center justify-start px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
          <FileEdit className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
          New Note
        </button>
        <button className="w-full flex items-center justify-start px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
          <PlusCircle className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
          Start New Project
        </button>
      </div>
    </div>
  )
}

export default QuickActions
