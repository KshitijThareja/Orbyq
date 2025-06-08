"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/ThemeProvider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { User, Palette, Database, HelpCircle, Save, Check, ArrowRight, BookOpen, Mail, Clock, ExternalLink } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'

const SettingsLayout = ({ children }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full bg-background">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and application settings</p>
      </div>
      {children}
    </div>
  )
}

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data", icon: Database },
    { id: "help", label: "Help & Support", icon: HelpCircle },
  ]

  return (
    <Card className="lg:col-span-1 border-border h-fit">
      <CardContent className="p-3">
        <nav aria-label="Settings navigation">
          <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="h-full mt-6">
            <TabsList className="flex flex-col items-start h-auto tabs-list space-y-1 w-full">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="w-full justify-start py-2.5 px-3 rounded-md tabs-trigger text-foreground transition-colors"
                    aria-label={`${item.label} settings tab`}
                  >
                    <Icon size={18} className="mr-2 text-foreground" aria-hidden="true" />
                    <span>{item.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </nav>
      </CardContent>
    </Card>
  )
}

const ProfileSettings = ({ user, setUser, setError }) => {
  const { callBackend } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    try {
      const updates = { name, email, bio }
      await callBackend("user/profile", "PUT", updates)
      setUser({ ...user, name, email, bio })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setError(null)
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message || "Failed to update profile"
          : "Failed to update profile"
      )
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Profile Settings</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your personal information and account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Avatar className="w-20 h-20 border-2 border-muted">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
            <AvatarFallback className="bg-muted text-foreground text-lg">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted relative overflow-hidden"
              disabled
            >
              Change
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-muted"
              disabled
            >
              Remove
            </Button>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              aria-describedby="name-description"
            />
            <p id="name-description" className="text-xs text-muted-foreground">Your full name as it will appear on your profile</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              aria-describedby="email-description"
            />
            <p id="email-description" className="text-xs text-muted-foreground">This email is used for login</p>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-foreground">Bio</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full min-h-[120px] rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground resize-y"
            aria-describedby="bio-description"
            maxLength={200}
          />
          <p id="bio-description" className="text-xs text-muted-foreground">Write a short bio about yourself (max 200 characters)</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className={`flex items-center text-sm gap-2 ${success ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <Check size={16} className="text-green-500" />
          <span className="text-green-500">Changes saved successfully</span>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground" 
          onClick={handleSave}
        >
          <Save size={16} className="mr-2" /> Save Changes
        </Button>
      </CardFooter>
    </>
  )
}

const AppearanceSettings = ({ setError }) => {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme()
  const [success, setSuccess] = useState(false)

  const handleSave = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    setError(null)
  }

  const ThemeOption = ({ id, label }) => (
    <div
      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
        theme === id 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      }`}
      onClick={() => setTheme(id as "light" | "dark" | "system")}
      role="radio"
      aria-checked={theme === id}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setTheme(id as "light" | "dark" | "system")
          e.preventDefault()
        }
      }}
    >
      <div
        className={`w-full h-20 rounded mb-3 border ${
          id === "light"
            ? "bg-white border-slate-200"
            : id === "dark"
            ? "bg-slate-950 border-slate-800"
            : "bg-gradient-to-r from-white to-slate-950 border-slate-300"
        }`}
      >
        {id === "light" && (
          <div className="flex p-2">
            <div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
        )}
        {id === "dark" && (
          <div className="flex p-2">
            <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-600 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
          </div>
        )}
        {id === "system" && (
          <div className="flex p-2">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        )}
      </div>
      <p className="text-sm text-center font-medium text-foreground">{label}</p>
      {theme === id && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center rounded-full">
          <Check size={12} />
        </div>
      )}
    </div>
  )

  const ColorSchemeOption = ({ id, color, label }) => (
    <div
      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
        colorScheme === id 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      }`}
      onClick={() => setColorScheme(id as "teal" | "purple" | "sky" | "slate")}
      role="radio"
      aria-checked={colorScheme === id}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setColorScheme(id as "teal" | "purple" | "sky" | "slate")
          e.preventDefault()
        }
      }}
    >
      <div className={`w-full h-12 rounded-md mb-2 ${color}`}></div>
      <p className="text-xs text-center font-medium text-foreground capitalize">{label}</p>
    </div>
  )

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Appearance Settings</CardTitle>
        <CardDescription className="text-muted-foreground">
          Customize the look and feel of the application to your preference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Theme</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Theme information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Choose light for bright interfaces, dark for reduced eye strain in low light, or system to match your device settings.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Select theme">
            <ThemeOption id="light" label="Light" />
            <ThemeOption id="dark" label="Dark" />
            <ThemeOption id="system" label="System" />
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Color Scheme</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Color scheme information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select an accent color to personalize the application's appearance.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="radiogroup" aria-label="Select color scheme">
            <ColorSchemeOption id="teal" color="bg-teal-500" label="Teal" />
            <ColorSchemeOption id="purple" color="bg-purple-500" label="Purple" />
            <ColorSchemeOption id="sky" color="bg-sky-500" label="Sky" />
            <ColorSchemeOption id="slate" color="bg-slate-500" label="Slate" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className={`flex items-center text-sm gap-2 ${success ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <Check size={16} className="text-green-500" />
          <span className="text-green-500">Appearance settings updated</span>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleSave}
        >
          <Save size={16} className="mr-2" /> Save Changes
        </Button>
      </CardFooter>
    </>
  )
}

const DataSettings = ({ setError }) => {
  const { callBackend, logout } = useAuth()
  const [success, setSuccess] = useState(false)

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return
    try {
      await callBackend("user/delete", "DELETE")
      setSuccess(true)
      setTimeout(() => {
        logout()
      }, 2000)
      setError(null)
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message || "Failed to delete account"
          : "Failed to delete account"
      )
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Data Management</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your account data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Danger zone information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Actions in this section are permanent and cannot be undone.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-4 rounded-md border border-destructive p-4 bg-destructive/5">
            <div>
              <h4 className="text-sm font-medium text-foreground">Delete Account</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="outline"
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
                onClick={handleDeleteAccount}
                aria-label="Delete account"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className={`flex items-center text-sm gap-2 ${success ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <Check size={16} className="text-green-500" />
          <span className="text-green-500">Account deleted</span>
        </div>
      </CardFooter>
    </>
  )
}

const HelpSettings = () => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

  const documentationContent = {
    "Getting Started": {
      title: "Getting Started Guide",
      description: "Learn the basics of using the application",
      content: [
        {
          title: "Welcome to Orbyq",
          text: "Orbyq is your all-in-one workspace for managing tasks, projects, and creative ideas. This guide will help you get started with the basic features."
        },
        {
          title: "Setting Up Your Account",
          text: "1. Create your profile\n2. Set your preferences\n3. Customize your workspace theme\n4. Connect your integrations"
        },
        {
          title: "Navigation",
          text: "Learn how to navigate through different sections:\n- Dashboard: Your central hub\n- Projects: Manage your work\n- Tasks: Track your to-dos\n- Creative Space: Express your ideas"
        }
      ]
    },
    "Task Management": {
      title: "Task Management Guide",
      description: "How to create and manage tasks effectively",
      content: [
        {
          title: "Creating Tasks",
          text: "Learn how to create tasks with:\n- Titles and descriptions\n- Due dates and priorities\n- Labels and categories\n- Assignees and collaborators"
        },
        {
          title: "Organizing Tasks",
          text: "Effective ways to organize your tasks:\n- Using lists and boards\n- Setting priorities\n- Grouping related tasks\n- Using filters and search"
        },
        {
          title: "Task Tracking",
          text: "Track your progress with:\n- Status updates\n- Progress indicators\n- Time tracking\n- Completion reports"
        }
      ]
    },
    "Projects": {
      title: "Projects Guide",
      description: "Working with projects and timelines",
      content: [
        {
          title: "Project Creation",
          text: "Start your project with:\n- Project templates\n- Team setup\n- Timeline planning\n- Resource allocation"
        },
        {
          title: "Project Management",
          text: "Manage your projects effectively:\n- Track milestones\n- Monitor progress\n- Manage team workload\n- Generate reports"
        },
        {
          title: "Collaboration",
          text: "Work together seamlessly:\n- Share project updates\n- Communicate with team\n- Manage permissions\n- Track contributions"
        }
      ]
    },
    "Creative Space": {
      title: "Creative Space Guide",
      description: "Using the canvas and creative tools",
      content: [
        {
          title: "Canvas Basics",
          text: "Get started with the canvas:\n- Creating new canvases\n- Adding elements\n- Using the toolbar\n- Saving your work"
        },
        {
          title: "Working with Elements",
          text: "Learn about different elements:\n- Text elements\n- Images and media\n- Shapes and drawings\n- Notes and annotations"
        },
        {
          title: "Organization",
          text: "Keep your ideas organized:\n- Using layers\n- Grouping elements\n- Creating sections\n- Adding links"
        }
      ]
    }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, y: -20 }
  }

  const sectionVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, x: 20 }
  }

  return (
    <>
      <CardHeader className="pb-4 bg-muted/30 rounded-t-lg border-b border-border">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-xl text-foreground">Help & Support</CardTitle>
        </motion.div>
        <CardDescription className="text-muted-foreground">
          Get help and learn more about the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <AnimatePresence mode="wait">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between bg-muted/20 p-4 rounded-lg border border-border/50"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Documentation
                </h3>
                <p className="text-xs text-muted-foreground">Browse through our comprehensive guides and tutorials</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" aria-label="Documentation information">
                      <HelpCircle size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-foreground bg-background/95 backdrop-blur-sm border-primary/20">
                    <p>Access guides and tutorials to make the most of the application.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {Object.entries(documentationContent).map(([key, doc], i) => (
                  <motion.div
                    key={key}
                    custom={i}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={cardVariants}
                    className="relative"
                  >
                    <Card
                      className="cursor-pointer transition-all bg-background border-border/50 group relative overflow-hidden hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] hover:border-primary/30"
                      onClick={() => setSelectedDoc(key)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedDoc(key)
                        }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -right-20 -top-20 h-40 w-40 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-inner">
                              <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-sm text-foreground group-hover:text-primary transition-colors">{doc.title}</CardTitle>
                          </div>
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">{doc.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </AnimatePresence>

        <Dialog open={selectedDoc !== null} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="max-w-3xl bg-background/95 backdrop-blur-sm border-primary/20">
            <DialogHeader className="space-y-4">
              <DialogTitle className="flex items-center gap-3 text-foreground">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documentation</p>
                  <h2 className="text-xl font-semibold">{selectedDoc && documentationContent[selectedDoc].title}</h2>
                </div>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground border-l-2 border-primary/20 pl-4">
                {selectedDoc && documentationContent[selectedDoc].description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <AnimatePresence>
                {selectedDoc && documentationContent[selectedDoc].content.map((section, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={sectionVariants}
                  >
                    <div className="space-y-3 p-5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors hover:shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
                          <span className="text-sm font-semibold text-primary">{(index + 1).toString().padStart(2, '0')}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                      </div>
                      <div className="ml-[3.25rem]">
                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{section.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </DialogContent>
        </Dialog>

        <Separator className="bg-border" />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between bg-muted/20 p-4 rounded-lg border border-border/50">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Contact Support
                </h3>
                <p className="text-xs text-muted-foreground">Get personalized help from our support team</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" aria-label="Contact support information">
                      <HelpCircle size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-foreground bg-background/95 backdrop-blur-sm border-primary/20">
                    <p>Reach out to our support team for personalized assistance.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Card className="border-border/50 bg-gradient-to-br from-background to-muted overflow-hidden relative hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] hover:border-primary/30 transition-all">
              <div className="absolute inset-0 bg-grid-primary/5" />
              <CardContent className="p-6 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shadow-inner">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Average response time: 24 hours</p>
                    </div>
                    <p className="text-sm text-foreground">Need more help? Our support team is ready to assist you.</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-primary/20 bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/80 min-w-[160px] justify-center group hover:border-primary/40"
                    aria-label="Contact support"
                    onClick={() => window.location.href = "mailto:support@example.com"}
                  >
                    <Mail className="h-4 w-4 mr-2 text-primary group-hover:animate-bounce" />
                    Contact Support
                    <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </>
  )
}

const Settings = () => {
  const { callBackend } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await callBackend("user/me", "GET")
        //@ts-ignore
        setUser(data)
        setError(null)
      } catch (err) {
        setError(
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message || "Failed to load user details"
          : "Failed to load user details"
      )
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserDetails()
  }, [callBackend])

  if (isLoading) {
    return (
      <SettingsLayout>
        <div className="flex items-center justify-center h-[calc(100%-80px)]">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </SettingsLayout>
    )
  }

  return (
    <SettingsLayout>
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-2"
          >
            Dismiss
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <Card className="lg:col-span-3 bg-background border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile" className="m-0 outline-none focus-visible:ring-0">
              <ProfileSettings user={user} setUser={setUser} setError={setError} />
            </TabsContent>
            <TabsContent value="appearance" className="m-0 outline-none focus-visible:ring-0">
              <AppearanceSettings setError={setError} />
            </TabsContent>
            <TabsContent value="data" className="m-0 outline-none focus-visible:ring-0">
              <DataSettings setError={setError} />
            </TabsContent>
            <TabsContent value="help" className="m-0 outline-none focus-visible:ring-0">
              <HelpSettings />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </SettingsLayout>
  )
}

export default Settings