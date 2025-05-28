import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/ThemeProvider";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TaskBoard from "./pages/TaskBoard";
import Timeline from "./pages/Timeline";
import CreativeSpace from "./pages/CreativeSpace";
import TodoList from "./pages/TodoList";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import "./assets/index.css";
import { JSX, useEffect, useCallback, useState } from "react";
import Loader from "./components/Loader";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isValidating } = useAuth();
  const location = useLocation();

  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader size="md" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isValidating } = useAuth();

  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader size="md" text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PrivateLayout() {
  const [open, setOpenState] = useState(true);
  const setOpen = useCallback((newOpen: boolean) => {
    setOpenState(newOpen);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={open} setOpen={setOpen} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const { isAuthenticated, isValidating } = useAuth();

  useEffect(() => {
    window.electron.ipcRenderer.on("backend-error", (_event: any, error: string) => {
      console.error("Backend error:", error);
      alert("Failed to connect to backend. Please try again.");
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners("backend-error");
    };
  }, []);

  if (isValidating) {
    return (
      <ThemeProvider defaultTheme="light">
        <div className="flex items-center justify-center h-screen bg-background">
          <Loader size="md" text="Loading..." />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route element={<ProtectedRoute><PrivateLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/creative" element={<CreativeSpace />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;