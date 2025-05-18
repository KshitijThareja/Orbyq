import { Clock, Edit, MoreHorizontal, PlusCircle } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  color?: string
}

function CreativeSpace() {
  const notes: Note[] = [
    {
      id: "note-1",
      title: "Project Ideas",
      content:
        "Create a local-first productivity app that combines project management with creative freedom. Key features: task boards, timeline visualization, and AI assistance.",
      createdAt: "May 10, 2025",
      updatedAt: "May 12, 2025",
      tags: ["Ideas", "Projects"],
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: "note-2",
      title: "UI Design Inspiration",
      content:
        "Clean, minimal interfaces with subtle animations. Use whitespace effectively. Color scheme: soft blues, greens, and neutral tones. Typography: sans-serif for headers, slightly larger line height for readability.",
      createdAt: "May 11, 2025",
      updatedAt: "May 11, 2025",
      tags: ["Design", "UI/UX"],
      color: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      id: "note-3",
      title: "Meeting Notes - Team Sync",
      content:
        "Discussed project timeline and key milestones. Action items: Research competitor features, create initial wireframes, set up development environment. Next meeting: May 17.",
      createdAt: "May 12, 2025",
      updatedAt: "May 12, 2025",
      tags: ["Meetings", "Notes"],
      color: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      id: "note-4",
      title: "Research Findings",
      content:
        "Key insights from user interviews: Users want flexibility in organization, seamless transitions between planning and doing, and minimal friction for capturing ideas. Pain points: too many separate tools, context switching.",
      createdAt: "May 13, 2025",
      updatedAt: "May 14, 2025",
      tags: ["Research", "Users"],
      color: "bg-cyan-50 dark:bg-cyan-900/20",
    },
    {
      id: "note-5",
      title: "Technical Architecture",
      content:
        "Local-first architecture with optional sync. Frontend: React with state management. Backend: Spring Boot with embedded database. Consider offline capabilities and end-to-end encryption for data security.",
      createdAt: "May 14, 2025",
      updatedAt: "May 14, 2025",
      tags: ["Technical", "Architecture"],
      color: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      id: "note-6",
      title: "Marketing Strategy",
      content:
        "Target audience: knowledge workers, freelancers, and creative professionals. Key messaging: 'Your personal workspace, your way.' Distribution channels: Product Hunt, relevant communities, content marketing.",
      createdAt: "May 14, 2025",
      updatedAt: "May 14, 2025",
      tags: ["Marketing", "Strategy"],
      color: "bg-violet-50 dark:bg-violet-900/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700 ${note.color || "bg-white dark:bg-slate-800"}`}
        >
          <div className="pb-2">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="pb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">{note.content}</p>
          </div>
          <div className="flex flex-col items-start pt-0">
            <div className="flex flex-wrap gap-1 mb-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center w-full text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                <span>Updated {note.updatedAt}</span>
              </div>
              <button className="px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center">
                <Edit className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 text-center hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
        <div className="rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-3 mb-3">
          <PlusCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-medium mb-1">Create New Note</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Capture your ideas, thoughts, and inspirations</p>
      </div>
    </div>
  )
}

export default CreativeSpace
