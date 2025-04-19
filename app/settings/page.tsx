"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Bell, Palette, Database, HelpCircle, ArrowLeft, Moon, Sun, ImageIcon, Edit } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function SettingsPage() {
  const { user, logout, updateUser, updateUserPreferences } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")
  const [theme, setTheme] = useState("light")
  const [showCountryFlag, setShowCountryFlag] = useState(user?.preferences?.displaySettings?.showCountryFlag ?? true)

  // Update showCountryFlag when user changes
  useEffect(() => {
    setShowCountryFlag(user?.preferences?.displaySettings?.showCountryFlag ?? true)
  }, [user])

  const handleBack = () => {
    router.back()
  }

  const handleToggleCountryFlag = async () => {
    const newValue = !showCountryFlag
    setShowCountryFlag(newValue)

    // Update user preferences
    if (user) {
      await updateUserPreferences({
        displaySettings: {
          ...user.preferences?.displaySettings,
          showCountryFlag: newValue,
        },
      })
    }
  }

  return (
    <div className="container max-w-4xl px-4 py-6 pb-20">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-3">
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "account" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("account")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <Button
                  variant={activeTab === "privacy" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("privacy")}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Privacy
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "preferences" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("preferences")}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  App Preferences
                </Button>
                <Button
                  variant={activeTab === "data" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("data")}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Data Management
                </Button>
                <Button
                  variant={activeTab === "support" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("support")}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Support & Info
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden">
          <Tabs defaultValue="account" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Account Settings */}
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <div className="relative">
                    <Image
                      src={user?.avatar || "/placeholder.svg?height=100&width=100&text=AM"}
                      alt="Profile picture"
                      width={100}
                      height={100}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <div className="flex items-center space-x-2">
                        <Input id="displayName" defaultValue={user?.name || "Alex Morgan"} />
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        defaultValue="Food enthusiast | Travel lover | Always looking for the next great experience"
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="email" type="email" defaultValue={user?.email || "alex.morgan@example.com"} />
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="phoneNumber" type="tel" defaultValue={user?.phoneNumber || "+1-555-123-4567"} />
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    {user?.countryFlag && (
                      <div className="flex items-center mt-1">
                        <span className="text-xl mr-2">{user.countryFlag}</span>
                        <span className="text-sm text-muted-foreground">{user.language}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="password" type="password" defaultValue="••••••••" />
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-lg font-medium">Connected Accounts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-xs text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Twitter</p>
                          <p className="text-xs text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your content and how your data is used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <Select defaultValue="public">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Country Flag Display</Label>
                      <p className="text-sm text-muted-foreground">Show your country flag on your profile</p>
                    </div>
                    <Switch checked={showCountryFlag} onCheckedChange={handleToggleCountryFlag} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Recommendation Visibility</Label>
                      <p className="text-sm text-muted-foreground">Who can see your recommendations</p>
                    </div>
                    <Select defaultValue="everyone">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Only Me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Comment Permissions</Label>
                      <p className="text-sm text-muted-foreground">Who can comment on your posts</p>
                    </div>
                    <Select defaultValue="everyone">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Location Sharing</Label>
                      <p className="text-sm text-muted-foreground">Control when your location is shared</p>
                    </div>
                    <Select defaultValue="while-using">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Always</SelectItem>
                        <SelectItem value="while-using">While Using</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">New Comments</Label>
                      <p className="text-sm text-muted-foreground">When someone comments on your recommendations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Reactions</Label>
                      <p className="text-sm text-muted-foreground">When someone reacts to your recommendations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">New Followers</Label>
                      <p className="text-sm text-muted-foreground">When someone follows you</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mentions</Label>
                      <p className="text-sm text-muted-foreground">When someone mentions or tags you</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Nearby Recommendations</Label>
                      <p className="text-sm text-muted-foreground">Alerts about recommendations near you</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary of popular recommendations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Quiet Hours</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Quiet Hours</Label>
                      <p className="text-sm text-muted-foreground">Pause notifications during specific hours</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Select defaultValue="22:00">
                        <SelectTrigger id="startTime">
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
                      <Label htmlFor="endTime">End Time</Label>
                      <Select defaultValue="07:00">
                        <SelectTrigger id="endTime">
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
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* App Preferences */}
          {activeTab === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>Customize your app experience and content preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display Options</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Theme</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred app theme</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                        className="w-24"
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                        className="w-24"
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Country Flag Display</Label>
                      <p className="text-sm text-muted-foreground">Show your country flag on your profile</p>
                    </div>
                    <Switch checked={showCountryFlag} onCheckedChange={handleToggleCountryFlag} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* Data Management */}
          {activeTab === "data" && (
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your app data, storage, and account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">App Data</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Clear Cache</Label>
                      <p className="text-sm text-muted-foreground">Clear temporary app data (0.8 GB)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Clear
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Download My Data</Label>
                      <p className="text-sm text-muted-foreground">Get a copy of all your data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Delete My Account</Label>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Reduce Data Usage</Label>
                      <p className="text-sm text-muted-foreground">Use less data when browsing</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Storage Management</h3>

                  <div className="space-y-2">
                    <Label className="text-base">Storage Used</Label>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[35%] rounded-full bg-primary"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.8 GB used</span>
                      <span>2.3 GB available</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Clear Temporary Files</Label>
                      <p className="text-sm text-muted-foreground">Remove cached images and files</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Clear
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Media Auto-Download</Label>
                      <p className="text-sm text-muted-foreground">When to automatically download media</p>
                    </div>
                    <Select defaultValue="wifi">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on">Always On</SelectItem>
                        <SelectItem value="wifi">WiFi Only</SelectItem>
                        <SelectItem value="off">Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {/* Support & Information */}
          {activeTab === "support" && (
            <Card>
              <CardHeader>
                <CardTitle>Support & Information</CardTitle>
                <CardDescription>Get help, learn about the app, and access legal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Help & Support</h3>

                  <div className="rounded-lg border p-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="faq-1">
                        <AccordionTrigger>How do I create a recommendation?</AccordionTrigger>
                        <AccordionContent>
                          To create a recommendation, tap the "Record" button in the navigation bar at the bottom of the
                          screen. You can then record your voice recommendation, add photos, and provide location
                          details before publishing.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq-2">
                        <AccordionTrigger>How do I follow other users?</AccordionTrigger>
                        <AccordionContent>
                          You can follow other users by visiting their profile and tapping the "Follow" button. You'll
                          then see their recommendations in your feed.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faq-3">
                        <AccordionTrigger>How do location-based recommendations work?</AccordionTrigger>
                        <AccordionContent>
                          Murmur uses your device's location (with your permission) to show you recommendations near
                          you. You can adjust the distance range in your settings.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Contact Support</Label>
                      <p className="text-sm text-muted-foreground">Get help with any issues</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Report a Problem</Label>
                      <p className="text-sm text-muted-foreground">Let us know about any issues</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Report
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Suggest a Feature</Label>
                      <p className="text-sm text-muted-foreground">Share your ideas for improving Murmur</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Suggest
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Legal & About</h3>

                  <div className="space-y-2">
                    <Button variant="link" className="h-auto p-0 text-base font-normal justify-start">
                      Terms of Service
                    </Button>
                    <Button variant="link" className="h-auto p-0 text-base font-normal justify-start">
                      Privacy Policy
                    </Button>
                    <Button variant="link" className="h-auto p-0 text-base font-normal justify-start">
                      Community Guidelines
                    </Button>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Murmur</h4>
                        <p className="text-sm text-muted-foreground">Version 1.0.0 (Build 42)</p>
                      </div>
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Emoticon-lzH7iAcdCUbnTF94t2ErOuKWmJJ19s.png"
                        alt="Murmur Logo"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  </div>

                  <Button variant="link" className="h-auto p-0 text-base font-normal justify-start">
                    Third-Party Licenses
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Log Out
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
