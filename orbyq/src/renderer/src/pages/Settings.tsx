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
import { User, Palette, Database, HelpCircle, Save, Check } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

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
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Help & Support</CardTitle>
        <CardDescription className="text-muted-foreground">
          Get help and learn more about the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Documentation</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Documentation information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-foreground bg-background">
                  <p>Access guides and tutorials to make the most of the application.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Getting Started", description: "Learn the basics of using the application" },
              { title: "Task Management", description: "How to create and manage tasks effectively" },
              { title: "Projects", description: "Working with projects and timelines" },
              { title: "Creative Space", description: "Using the canvas and creative tools" },
            ].map((doc, i) => (
              <Card
                key={i}
                className="cursor-pointer hover:shadow-sm transition-shadow bg-background border-border"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                  }
                }}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm text-foreground">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-muted-foreground">{doc.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Contact Support</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Contact support information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-foreground bg-background">
                  <p>Reach out to our support team for personalized assistance.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Need more help? Our support team is ready to assist you.
          </p>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
            aria-label="Contact support"
            onClick={() => window.location.href = "mailto:support@example.com"}
          >
            Contact Support
          </Button>
        </div>
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