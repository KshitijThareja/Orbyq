"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Palette, Shield, Database, Cloud, HelpCircle, Save } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="flex flex-col items-start h-auto bg-transparent space-y-1">
                <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:bg-slate-100">
                  <User size={16} className="mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start data-[state=active]:bg-slate-100">
                  <Bell size={16} className="mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="w-full justify-start data-[state=active]:bg-slate-100">
                  <Palette size={16} className="mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="privacy" className="w-full justify-start data-[state=active]:bg-slate-100">
                  <Shield size={16} className="mr-2" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="data" className="w-full justify-start data-[state=active]:bg-slate-100">
                  <Database size={16} className="mr-2" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="sync" className="w-full justify-start data-[state=active]:bg-slate-100">
                  <Cloud size={16} className="mr-2" />
                  Sync
                </TabsTrigger>
                <TabsTrigger value="help" className="w-full justify-start data-[state=active]:bg-slate-100">
                  <HelpCircle size={16} className="mr-2" />
                  Help & Support
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile" className="m-0">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                    <Button variant="outline" size="sm" className="text-slate-500">
                      Remove
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Alex Lee" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="alex@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="alexlee" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Product Designer" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] rounded-md border border-slate-200 p-2 text-sm"
                    defaultValue="Product designer with 5+ years of experience in creating user-centered digital products."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Save size={16} className="mr-2" /> Save Changes
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  {[
                    { id: "email-tasks", label: "Task reminders" },
                    { id: "email-updates", label: "Project updates" },
                    { id: "email-newsletter", label: "Newsletter" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <Label htmlFor={item.id} className="cursor-pointer">
                        {item.label}
                      </Label>
                      <Switch id={item.id} defaultChecked={item.id !== "email-newsletter"} />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Desktop Notifications</h3>
                  {[
                    { id: "desktop-tasks", label: "Task due dates" },
                    { id: "desktop-mentions", label: "Mentions" },
                    { id: "desktop-reminders", label: "Custom reminders" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <Label htmlFor={item.id} className="cursor-pointer">
                        {item.label}
                      </Label>
                      <Switch id={item.id} defaultChecked />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quiet-from">Quiet hours start</Label>
                      <Select defaultValue="22:00">
                        <SelectTrigger id="quiet-from">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20:00">8:00 PM</SelectItem>
                          <SelectItem value="21:00">9:00 PM</SelectItem>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                          <SelectItem value="23:00">11:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet-to">Quiet hours end</Label>
                      <Select defaultValue="07:00">
                        <SelectTrigger id="quiet-to">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Save size={16} className="mr-2" /> Save Changes
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="appearance" className="m-0">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", label: "Light" },
                      { id: "dark", label: "Dark" },
                      { id: "system", label: "System" },
                    ].map((theme) => (
                      <div
                        key={theme.id}
                        className={`border rounded-md p-4 cursor-pointer hover:border-teal-500 transition-colors ${theme.id === "light" ? "border-teal-500 bg-slate-50" : ""
                          }`}
                      >
                        <div
                          className={`w-full h-12 rounded mb-2 ${theme.id === "light"
                              ? "bg-white border border-slate-200"
                              : theme.id === "dark"
                                ? "bg-slate-800"
                                : "bg-gradient-to-r from-white to-slate-800"
                            }`}
                        ></div>
                        <p className="text-sm text-center">{theme.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Color Scheme</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { id: "teal", color: "bg-teal-500" },
                      { id: "purple", color: "bg-purple-500" },
                      { id: "sky", color: "bg-sky-500" },
                      { id: "slate", color: "bg-slate-500" },
                    ].map((scheme) => (
                      <div
                        key={scheme.id}
                        className={`border rounded-md p-2 cursor-pointer hover:border-teal-500 transition-colors ${scheme.id === "teal" ? "border-teal-500" : ""
                          }`}
                      >
                        <div className={`w-full h-8 rounded mb-2 ${scheme.color}`}></div>
                        <p className="text-xs text-center capitalize">{scheme.id}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Interface Density</h3>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="density" className="min-w-[80px]">
                      Density
                    </Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger id="density">
                        <SelectValue placeholder="Select density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Font Size</h3>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="font-size" className="min-w-[80px]">
                      Size
                    </Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Save size={16} className="mr-2" /> Save Changes
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="privacy" className="m-0">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Account Security</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="2fa" className="cursor-pointer">
                        Two-factor authentication
                      </Label>
                      <Switch id="2fa" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Add an extra layer of security to your account by requiring a verification code in addition to your
                      password.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Data Privacy</h3>
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
                        <Label htmlFor={item.id} className="cursor-pointer">
                          {item.label}
                        </Label>
                        <Switch id={item.id} defaultChecked />
                      </div>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Data Retention</h3>
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Keep history for</Label>
                    <Select defaultValue="forever">
                      <SelectTrigger id="data-retention">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 days</SelectItem>
                        <SelectItem value="90days">90 days</SelectItem>
                        <SelectItem value="1year">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Save size={16} className="mr-2" /> Save Changes
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="data" className="m-0">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Export Data</h3>
                  <p className="text-sm text-slate-500">
                    Export all your data in a portable format. This includes tasks, projects, notes, and settings.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline">Export as JSON</Button>
                    <Button variant="outline">Export as CSV</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Import Data</h3>
                  <p className="text-sm text-slate-500">Import data from other applications or previous exports.</p>
                  <Button variant="outline">Import Data</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-rose-500">Danger Zone</h3>
                  <div className="space-y-4 rounded-md border border-rose-200 p-4 bg-rose-50">
                    <div>
                      <h4 className="text-sm font-medium">Clear All Data</h4>
                      <p className="text-xs text-slate-500 mb-2">
                        This will permanently delete all your tasks, projects, and settings. This action cannot be undone.
                      </p>
                      <Button variant="outline" className="text-rose-500 border-rose-200 hover:bg-rose-100">
                        Clear All Data
                      </Button>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Delete Account</h4>
                      <p className="text-xs text-slate-500 mb-2">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="outline" className="text-rose-500 border-rose-200 hover:bg-rose-100">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="sync" className="m-0">
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>Manage how your data syncs across devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Cloud Sync</h3>
                    <p className="text-xs text-slate-500">Sync your data across all your devices</p>
                  </div>
                  <Switch id="cloud-sync" defaultChecked />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Sync Frequency</h3>
                  <div className="space-y-2">
                    <Select defaultValue="realtime">
                      <SelectTrigger id="sync-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="manual">Manual only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Sync Options</h3>
                  {[
                    { id: "sync-wifi", label: "Only sync on Wi-Fi" },
                    { id: "sync-background", label: "Sync in background" },
                    { id: "sync-startup", label: "Sync on startup" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <Label htmlFor={item.id} className="cursor-pointer">
                        {item.label}
                      </Label>
                      <Switch id={item.id} defaultChecked={item.id !== "sync-wifi"} />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Connected Devices</h3>
                  <div className="space-y-2">
                    {[
                      { name: "MacBook Pro", lastSync: "2 minutes ago", active: true },
                      { name: "iPhone 13", lastSync: "15 minutes ago", active: true },
                      { name: "iPad Air", lastSync: "2 days ago", active: false },
                    ].map((device, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${device.active ? "bg-emerald-500" : "bg-slate-300"}`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium">{device.name}</p>
                            <p className="text-xs text-slate-500">Last sync: {device.lastSync}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-500">
                          Disconnect
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Save size={16} className="mr-2" /> Save Changes
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="help" className="m-0">
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>Get help and learn more about the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Documentation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Getting Started", description: "Learn the basics of using the application" },
                      { title: "Task Management", description: "How to create and manage tasks effectively" },
                      { title: "Projects", description: "Working with projects and timelines" },
                      { title: "Creative Space", description: "Using the canvas and creative tools" },
                    ].map((doc, i) => (
                      <Card key={i} className="cursor-pointer hover:shadow-sm transition-shadow">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <CardDescription>{doc.description}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Frequently Asked Questions</h3>
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
                      <div key={i} className="p-3 rounded-md bg-slate-50">
                        <h4 className="text-sm font-medium mb-1">{faq.question}</h4>
                        <p className="text-xs text-slate-500">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contact Support</h3>
                  <p className="text-sm text-slate-500">Need more help? Our support team is ready to assist you.</p>
                  <Button variant="outline">Contact Support</Button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default Settings
