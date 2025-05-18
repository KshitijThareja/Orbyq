import { CheckCircle2, Clock, ListTodo, Target } from "lucide-react"

function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Tasks Completed</h3>
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">+2 from yesterday</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">In Progress</h3>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">3 due today</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Upcoming</h3>
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
            <ListTodo className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">5 this week</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Goals</h3>
          <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full">
            <Target className="h-4 w-4 text-teal-500 dark:text-teal-400" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">3/5</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">60% completed</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
