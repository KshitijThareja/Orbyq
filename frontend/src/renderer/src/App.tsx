import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "./components/ThemeProvider"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import TaskBoard from "./pages/TaskBoard"
import Timeline from "./pages/Timeline"
import CreativeSpace from "./pages/CreativeSpace"
import TodoList from "./pages/TodoList"
import Settings from "./pages/Settings"
import "./assets/index.css"

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <div className="flex h-screen bg-background">
          <Sidebar open={true} setOpen={() => {}} />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskBoard />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/creative" element={<CreativeSpace />} />
              <Route path="/todo" element={<TodoList />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}

export default App
