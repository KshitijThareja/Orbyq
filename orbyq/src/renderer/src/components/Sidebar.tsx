import { memo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  Palette,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = memo(({ open, setOpen }: SidebarProps) => {
  const { isAuthenticated, logout, callBackend } = useAuth();
  const navigate = useNavigate();
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    color: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Kanban, label: 'Task Board', path: '/tasks' },
    { icon: Calendar, label: 'Timeline', path: '/timeline' },
    { icon: Palette, label: 'Creative Space', path: '/creative' },
    { icon: CheckSquare, label: 'To-Do List', path: '/todo' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateProject = async () => {
    if (!newProject.name) {
      setError("Project name is required");
      return;
    }

    try {
      await callBackend<void>('timeline/project', 'POST', {
        name: newProject.name,
        color: newProject.color || null, // Send null if no color is provided
      });
      setIsNewProjectDialogOpen(false);
      setNewProject({ name: "", color: "" });
      setError(null);
      // Optionally navigate to the timeline to see the new project
      navigate('/timeline');
    } catch (err: any) {
      setError('Failed to create project: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <motion.aside
      key="sidebar"
      className={cn(
        'h-screen bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out',
        open ? 'w-64' : 'w-16'
      )}
      animate={{ width: open ? 256 : 64 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        {open && (
          <div className="flex items-center">
            <div className="relative h-10 w-10 mr-3">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
            <motion.h1
              className="text-xl font-semibold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Orbyq
            </motion.h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="ml-auto text-foreground hover:bg-muted"
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  'hover:bg-muted',
                  isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
                  !open && 'justify-center'
                )
              }
            >
              <item.icon size={20} />
              {open && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Dialog.Root open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <Dialog.Trigger asChild>
            <Button
              className={cn(
                'w-full bg-primary hover:bg-primary/90 text-primary-foreground',
                !open && 'p-2'
              )}
            >
              <PlusCircle size={18} />
              {open && <span className="ml-2">New Project</span>}
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg border border-border w-full max-w-md">
              <Dialog.Title className="text-lg font-medium text-foreground">Create New Project</Dialog.Title>
              <Dialog.Description className="text-muted-foreground mt-2">
                Enter the details to create a new project.
              </Dialog.Description>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="projectName" className="text-muted-foreground">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="border-border text-foreground"
                    placeholder="e.g., My New Project"
                  />
                </div>
                <div>
                  <Label htmlFor="projectColor" className="text-muted-foreground">Color (Optional, e.g., bg-blue-500)</Label>
                  <Input
                    id="projectColor"
                    value={newProject.color}
                    onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                    className="border-border text-foreground"
                    placeholder="e.g., bg-blue-500"
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Dialog.Close asChild>
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted">Cancel</Button>
                </Dialog.Close>
                <Button onClick={handleCreateProject} className="bg-primary hover:bg-primary/90 text-primary-foreground">Create</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Button
          variant="destructive"
          className={cn(
            'w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground',
            !open && 'p-2'
          )}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </motion.aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;