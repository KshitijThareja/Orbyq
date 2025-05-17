"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Palette, Shield, Database, Cloud, HelpCircle, Save, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/ThemeProvider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "data", label: "Data", icon: Database },
    { id: "sync", label: "Sync", icon: Cloud },
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

const ProfileSettings = () => {
  const [success, setSuccess] = useState(false)
  
  const handleSave = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
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
            <AvatarFallback className="bg-muted text-foreground text-lg">AL</AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted relative overflow-hidden"
            >
              <label htmlFor="avatar-upload" className="absolute inset-0 cursor-pointer" aria-label="Change profile picture"></label>
              <input 
                id="avatar-upload" 
                type="file" 
                className="sr-only" 
                accept="image/*"
                aria-label="Upload profile picture"
              />
              Change
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-muted"
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
              defaultValue="Alex Lee"
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
              defaultValue="alex@example.com"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              aria-describedby="email-description"
            />
            <p id="email-description" className="text-xs text-muted-foreground">This email is used for notifications and login</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">Username</Label>
            <Input
              id="username"
              defaultValue="alexlee"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              aria-describedby="username-description"
            />
            <p id="username-description" className="text-xs text-muted-foreground">Your unique username for the platform</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground">Role</Label>
            <Input
              id="role"
              defaultValue="Product Designer"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              aria-describedby="role-description"
            />
            <p id="role-description" className="text-xs text-muted-foreground">Your professional role or title</p>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-foreground">Bio</Label>
          <textarea
            id="bio"
            className="w-full min-h-[120px] rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground resize-y"
            defaultValue="Product designer with 5+ years of experience in creating user-centered digital products."
            aria-describedby="bio-description"
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

const NotificationSettings = () => {
  const [success, setSuccess] = useState(false)
  
  const handleSave = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }
  
  const NotificationGroup = ({ title, items }) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="space-y-3 pl-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between group">
            <div className="space-y-0.5">
              <Label htmlFor={item.id} className="cursor-pointer text-foreground group-hover:text-foreground transition-colors">
                {item.label}
              </Label>
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
            <Switch 
              id={item.id} 
              defaultChecked={item.defaultChecked} 
              aria-label={`Toggle ${item.label}`} 
              className="border border-border  border-accent-foreground data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        ))}
      </div>
    </div>
  )
  
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Notification Settings</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationGroup 
          title="Email Notifications" 
          items={[
            { id: "email-tasks", label: "Task reminders", defaultChecked: true,
              description: "Receive emails about upcoming task deadlines" },
            { id: "email-updates", label: "Project updates", defaultChecked: true,
              description: "Get notified when team members make changes to shared projects" },
            { id: "email-newsletter", label: "Newsletter", defaultChecked: false,
              description: "Receive our monthly newsletter with tips and updates" },
          ]} 
        />

        <Separator className="bg-border" />

        <NotificationGroup 
          title="Desktop Notifications" 
          items={[
            { id: "desktop-tasks", label: "Task due dates", defaultChecked: true },
            { id: "desktop-mentions", label: "Mentions", defaultChecked: true },
            { id: "desktop-reminders", label: "Custom reminders", defaultChecked: true },
          ]} 
        />

        <Separator className="bg-border" />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Notification Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiet-from" className="text-foreground">Quiet hours start</Label>
              <Select defaultValue="22:00">
                <SelectTrigger
                  id="quiet-from"
                  className="border-border bg-background text-foreground"
                  aria-label="Select quiet hours start time"
                >
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border text-foreground">
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                  <SelectItem value="21:00">9:00 PM</SelectItem>
                  <SelectItem value="22:00">10:00 PM</SelectItem>
                  <SelectItem value="23:00">11:00 PM</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                We won't send notifications during quiet hours
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiet-to" className="text-foreground">Quiet hours end</Label>
              <Select defaultValue="07:00">
                <SelectTrigger
                  id="quiet-to"
                  className="border-border bg-background text-foreground"
                  aria-label="Select quiet hours end time"
                >
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border text-foreground">
                  <SelectItem value="06:00">6:00 AM</SelectItem>
                  <SelectItem value="07:00">7:00 AM</SelectItem>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Normal notification delivery resumes after this time
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className={`flex items-center text-sm gap-2 ${success ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <Check size={16} className="text-green-500" />
          <span className="text-green-500">Notification preferences updated</span>
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

const AppearanceSettings = () => {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme()
  const [isDensityOpen, setIsDensityOpen] = useState(false)
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const handleSave = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
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
            <div className="grounds-full bg-red-400 mr-1"></div>
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
      {colorScheme === id && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center rounded-full">
          <Check size={12} />
        </div>
      )}
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

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Interface Density</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Density information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Choose how compact you want the interface to be. More compact layouts show more content but with less spacing.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="density" className="min-w-[80px] text-foreground">
              Density
            </Label>
            <Select 
              defaultValue="comfortable" 
              onOpenChange={setIsDensityOpen}
            >
              <SelectTrigger
                id="density"
                className={`border-border bg-background text-foreground transition-all ${isDensityOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                aria-label="Select interface density"
              >
                <SelectValue placeholder="Select density" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground pl-[calc(80px+0.5rem)]">
            Affects spacing and sizes of elements throughout the interface
          </p>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Font Size</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Font size information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Adjust text size across the application for better readability.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="font-size" className="min-w-[80px] text-foreground">
              Size
            </Label>
            <Select 
              defaultValue="medium"
              onOpenChange={setIsFontSizeOpen}
            >
              <SelectTrigger
                id="font-size"
                className={`border-border bg-background text-foreground transition-all ${isFontSizeOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                aria-label="Select font size"
              >
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground pl-[calc(80px+0.5rem)]">
            Affects text size throughout the application
          </p>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Motion & Animations</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Motion information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Control interface animations. Reducing motion can help with motion sensitivity.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between pl-1">
            <Label htmlFor="reduce-motion" className="cursor-pointer text-foreground">
              Reduce motion
              <p className="text-xs text-muted-foreground">
                Minimize animations throughout the interface
              </p>
            </Label>
            <Switch 
              id="reduce-motion" 
              aria-label="Toggle reduced motion" 
              className="border border-border data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
            />
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

const PrivacySettings = () => {
  const [success, setSuccess] = useState(false)
  const [isRetentionOpen, setIsRetentionOpen] = useState(false)

  const handleSave = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Privacy Settings</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your privacy and security preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Account Security</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Account security information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Enable two-factor authentication for enhanced account security.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2 pl-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa" className="cursor-pointer text-foreground">
                Two-factor authentication
              </Label>
              <Switch 
                id="2fa" 
                aria-label="Toggle two-factor authentication" 
                className="border border-border data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account by requiring a verification code in addition to your password.
            </p>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Data Privacy</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Data privacy information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Control how your data is used to improve the application.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-3 pl-1">
            {[
              {
                id: "usage-data",
                label: "Share usage data",
                description: "Help us improve by sharing anonymous usage data.",
              },
              {
                id: "crash-reports",
                label: "Send crash reports",
                description: "Automatically send crash reports to help us fix issues.",
              },
            ].map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={item.id} className="cursor-pointer text-foreground">
                    {item.label}
                  </Label>
                  <Switch 
                    id={item.id} 
                    defaultChecked 
                    aria-label={`Toggle ${item.label}`} 
                    className="border border-border data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Data Retention</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Data retention information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Choose how long your data is stored in the application.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            <Label htmlFor="data-retention" className="text-foreground">Keep history for</Label>
            <Select defaultValue="forever" onOpenChange={setIsRetentionOpen}>
              <SelectTrigger
                id="data-retention"
                className={`border-border bg-background text-foreground transition-all ${isRetentionOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                aria-label="Select data retention period"
              >
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="30days">30 days</SelectItem>
                <SelectItem value="90days">90 days</SelectItem>
                <SelectItem value="1year">1 year</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Data older than the selected period will be automatically deleted
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className={`flex items-center text-sm gap-2 ${success ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <Check size={16} className="text-green-500" />
          <span className="text-green-500">Privacy settings updated</span>
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

const DataSettings = () => {
  const [success, setSuccess] = useState(false)

  const handleSave = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Data Management</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your data and exports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Export Data</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Export data information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Export your data in portable formats for backup or transfer.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Export all your data in a portable format. This includes tasks, projects, notes, and settings.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
              aria-label="Export data as JSON"
            >
              Export as JSON
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
              aria-label="Export data as CSV"
            >
              Export as CSV
            </Button>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Import Data</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Import data information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Import data from other applications or previous exports.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Import data from other applications or previous exports.
          </p>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
            aria-label="Import data"
          >
            Import Data
          </Button>
        </div>

        <Separator className="bg-border" />

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
          <div className="space-y-4 rounded-md border border-destructive  p-4 bg-destructive/5">
            <div>
              <h4 className="text-sm font-medium text-foreground">Clear All Data</h4>
              <p className="text-xs text-muted-foreground mb-2">
                This will permanently delete all your tasks, projects, and settings. This action cannot be undone.
              </p>
              <Button
                variant="outline"
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
                aria-label="Clear all data"
              >
                Clear All Data
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground">Delete Account</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="outline"
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
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
          <span className="text-green-500">Data settings updated</span>
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

const SyncSettings = () => {
  const [success, setSuccess] = useState(false)
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false)

  const handleSave = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Sync Settings</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage how your data syncs across devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Cloud Sync</h3>
              <p className="text-xs text-muted-foreground">Sync your data across all your devices</p>
            </div>
            <Switch 
              id="cloud-sync" 
              defaultChecked 
              aria-label="Toggle cloud sync" 
              className="border border-border data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Sync Frequency</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Sync frequency information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Choose how often your data syncs with the cloud.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            <Select defaultValue="realtime" onOpenChange={setIsFrequencyOpen}>
              <SelectTrigger
                id="sync-frequency"
                className={`border-border bg-background text-foreground transition-all ${isFrequencyOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                aria-label="Select sync frequency"
              >
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="manual">Manual only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Real-time sync ensures your data is always up-to-date
            </p>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Sync Options</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Sync options information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Customize how and when syncing occurs.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-3 pl-1">
            {[
              { id: "sync-wifi", label: "Only sync on Wi-Fi", defaultChecked: false },
              { id: "sync-background", label: "Sync in background", defaultChecked: true },
              { id: "sync-startup", label: "Sync on startup", defaultChecked: true },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <Label htmlFor={item.id} className="cursor-pointer text-foreground">
                  {item.label}
                </Label>
                <Switch 
                  id={item.id} 
                  defaultChecked={item.defaultChecked} 
                  aria-label={`Toggle ${item.label}`} 
                  className="border border-border data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Connected Devices</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Connected devices information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>View and manage devices connected to your account.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            {[
              { name: "MacBook Pro", lastSync: "2 minutes ago", active: true },
              { name: "iPhone 13", lastSync: "15 minutes ago", active: true },
              { name: "iPad Air", lastSync: "2 days ago", active: false },
            ].map((device, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${device.active ? "bg-priority-low" : "bg-muted"}`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{device.name}</p>
                    <p className="text-xs text-muted-foreground">Last sync: {device.lastSync}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:bg-muted"
                  aria-label={`Disconnect ${device.name}`}
                >
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className={`flex items-center text-sm gap-2 ${success ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <Check size={16} className="text-green-500" />
          <span className="text-green-500">Sync settings updated</span>
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
                <TooltipContent className="max-w-xs">
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
                    // Simulate click action (e.g., navigate to documentation)
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
            <h3 className="text-sm font-medium text-foreground">Frequently Asked Questions</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="FAQ information">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Find answers to common questions about the application.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            {[
              {
                question: "How do I sync across devices?",
                answer: "Enable cloud sync in the Sync settings tab.",
              },
              {
                question: "Can I export my data?",
                answer: "Yes, you can export your data in JSON or CSV format from the Data tab.",
              },
              {
                question: "Is my data secure?",
                answer: "Yes, we use end-to-end encryption to protect your data.",
              },
            ].map((faq, i) => (
              <div key={i} className="p-3 rounded-md bg-muted">
                <h4 className="text-sm font-medium text-foreground mb-1">{faq.question}</h4>
                <p className="text-xs text-muted-foreground">{faq.answer}</p>
              </div>
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
                <TooltipContent className="max-w-xs">
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
          >
            Contact Support
          </Button>
        </div>
      </CardContent>
    </>
  )
}

// Main settings component
const Settings = () => {
  const [activeTab, setActiveTab] = useState("appearance")
  
  return (
    <SettingsLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <Card className="lg:col-span-3 bg-background border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile" className="m-0 outline-none focus-visible:ring-0">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="notifications" className="m-0 outline-none focus-visible:ring-0">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="appearance" className="m-0 outline-none focus-visible:ring-0">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="privacy" className="m-0 outline-none focus-visible:ring-0">
              <PrivacySettings />
            </TabsContent>
            <TabsContent value="data" className="m-0 outline-none focus-visible:ring-0">
              <DataSettings />
            </TabsContent>
            <TabsContent value="sync" className="m-0 outline-none focus-visible:ring-0">
              <SyncSettings />
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