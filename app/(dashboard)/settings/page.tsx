import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Manage your account details and preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="Jimleston Osoi" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="jimleston@example.com" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>

                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                            <CardDescription>Customize the look and feel of the application</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="dark-mode">Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                                </div>
                                <Switch id="dark-mode" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="compact-view">Compact View</Label>
                                    <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                                </div>
                                <Switch id="compact-view" />
                            </div>

                            <div className="space-y-2">
                                <Label>Theme Color</Label>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="w-8 h-8 rounded-full bg-blue-500 p-0" />
                                    <Button variant="outline" className="w-8 h-8 rounded-full bg-green-500 p-0" />
                                    <Button variant="outline" className="w-8 h-8 rounded-full bg-purple-500 p-0" />
                                    <Button variant="outline" className="w-8 h-8 rounded-full bg-red-500 p-0" />
                                    <Button variant="outline" className="w-8 h-8 rounded-full bg-orange-500 p-0" />
                                </div>
                            </div>

                            <Button>Save Preferences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Manage how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <Switch id="email-notifications" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="push-notifications">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                                </div>
                                <Switch id="push-notifications" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="flow-completion">Flow Completion Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when a flow completes</p>
                                </div>
                                <Switch id="flow-completion" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="flow-error">Flow Error Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when a flow encounters an error</p>
                                </div>
                                <Switch id="flow-error" defaultChecked />
                            </div>

                            <Button>Save Notification Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

