import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart, Activity, Users, ArrowUpRight, Bot, Layers } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button>Create New Flow</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Flows</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">+1 from last week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">+189 from last week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">+3 from last week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Execution Activity</CardTitle>
                        <CardDescription>Flow executions over the past 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                        <LineChart className="h-60 w-60 text-muted-foreground/50" />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Flow Distribution</CardTitle>
                            <CardDescription>By category</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px] flex items-center justify-center">
                            <PieChart className="h-40 w-40 text-muted-foreground/50" />
                        </CardContent>
                    </Card>

                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Top Flows</CardTitle>
                            <CardDescription>By execution count</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px] flex items-center justify-center">
                            <BarChart className="h-40 w-40 text-muted-foreground/50" />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Flows</CardTitle>
                        <CardDescription>Recently created or modified</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {["Customer Support Bot", "Data Analysis Pipeline", "Email Automation", "Social Media Poster"].map(
                                (flow, i) => (
                                    <li key={i} className="flex items-center justify-between">
                                        <span className="font-medium">{flow}</span>
                                        <Button variant="ghost" size="sm">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ),
                            )}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button variant="outline" className="justify-start">
                            Create New Flow
                        </Button>
                        <Button variant="outline" className="justify-start">
                            Import Template
                        </Button>
                        <Link href="/bot" className="w-full">
                            <Button variant="outline" className="justify-start w-full">
                                Open Bot Interface
                            </Button>
                        </Link>
                        <Button variant="outline" className="justify-start">
                            View Analytics
                        </Button>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription>Current system metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm">API Health</span>
                                    <span className="text-sm font-medium text-green-500">Operational</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm">Database</span>
                                    <span className="text-sm font-medium text-green-500">Operational</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm">AI Services</span>
                                    <span className="text-sm font-medium text-green-500">Operational</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm">Storage</span>
                                    <span className="text-sm font-medium">68% Used</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

