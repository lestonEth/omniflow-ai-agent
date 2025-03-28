"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronUp, ChevronDown, XCircle, Terminal, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFlow } from "@/contexts/FlowContext"
import { useSimulation } from "@/contexts/SimulationContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface LogEntry {
    timestamp: string
    message: string
    type: "info" | "error" | "success" | "warning"
    nodeId?: string
    nodeName?: string
}

export default function FlowConsole() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeTab, setActiveTab] = useState("all")
    const [logs, setLogs] = useState<LogEntry[]>([])
    const { nodes } = useFlow()
    const { isSimulating } = useSimulation()
    const { toast } = useToast()
    const scrollRef = useRef<HTMLDivElement>(null)

    // Collect logs from all nodes
    useEffect(() => {
        const allLogs: LogEntry[] = []

        nodes.forEach((node) => {
            if (node.data.consoleOutput && Array.isArray(node.data.consoleOutput)) {
                node.data.consoleOutput.forEach((logMessage: string) => {
                    // Parse the timestamp from the log message if it exists
                    const timestampMatch = logMessage.match(/\[(.*?)\]/)
                    const timestamp = timestampMatch ? timestampMatch[1] : new Date().toLocaleTimeString()

                    // Determine log type based on content
                    let type: "info" | "error" | "success" | "warning" = "info"
                    if (logMessage.toLowerCase().includes("error")) type = "error"
                    else if (logMessage.toLowerCase().includes("success")) type = "success"
                    else if (logMessage.toLowerCase().includes("warning")) type = "warning"

                    // Clean the message by removing the timestamp prefix if it exists
                    const message = timestampMatch ? logMessage.replace(timestampMatch[0], "").trim() : logMessage

                    allLogs.push({
                        timestamp,
                        message,
                        type,
                        nodeId: node.id,
                        nodeName: node.data.name as any
                    })
                })
            }
        })

        // Sort logs by timestamp (newest first)
        allLogs.sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })

        setLogs(allLogs)
    }, [nodes])

    // Auto-scroll to bottom when new logs are added
    useEffect(() => {
        if (scrollRef.current && isExpanded) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs, isExpanded])

    // Auto-expand console when simulation starts
    useEffect(() => {
        if (isSimulating && !isExpanded) {
            setIsExpanded(true)
        }
    }, [isSimulating])

    const clearLogs = () => {
        setLogs([])
    }

    const copyLogs = () => {
        const logText = logs
            .map((log) => `[${ log.timestamp }] ${ log.nodeName ? `[${ log.nodeName }] ` : "" }${ log.message }`)
            .join("\n")

        navigator.clipboard.writeText(logText)
        toast({
            title: "Logs copied",
            description: "Console logs have been copied to clipboard",
        })
    }

    const downloadLogs = () => {
        const logText = logs
            .map((log) => `[${ log.timestamp }] ${ log.nodeName ? `[${ log.nodeName }] ` : "" }${ log.message }`)
            .join("\n")

        const blob = new Blob([logText], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `omniflow-logs-${ new Date().toISOString().slice(0, 10) }.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // Filter logs based on active tab
    const filteredLogs = activeTab === "all" ? logs : logs.filter((log) => log.type === activeTab)

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-10 ${ isExpanded ? "h-64" : "h-10" }`}
        >
            <div className="flex items-center justify-between px-4 h-10 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <Terminal className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Flow Console</span>
                    <span className="ml-2 text-xs text-gray-500">
                        {logs.length} {logs.length === 1 ? "entry" : "entries"}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    {isExpanded && (
                        <>
                            <Button variant="ghost" size="icon" onClick={clearLogs} title="Clear console">
                                <XCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={copyLogs} title="Copy logs">
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={downloadLogs} title="Download logs">
                                <Download className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? "Collapse console" : "Expand console"}
                    >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="h-[calc(100%-2.5rem)]">
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="h-full">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <TabsList className="px-4">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="info">Info</TabsTrigger>
                                <TabsTrigger value="success">Success</TabsTrigger>
                                <TabsTrigger value="warning">Warning</TabsTrigger>
                                <TabsTrigger value="error">Error</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value={activeTab} className="h-[calc(100%-2.5rem)] p-0 m-0">
                            <ScrollArea className="h-full p-4" ref={scrollRef}>
                                {filteredLogs.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-sm italic">
                                        No logs to display
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredLogs.map((log, index) => (
                                            <div
                                                key={index}
                                                className={`text-sm font-mono p-1 border-l-2 pl-2 ${ log.type === "error"
                                                    ? "border-red-500 text-red-600 dark:text-red-400"
                                                    : log.type === "success"
                                                        ? "border-green-500 text-green-600 dark:text-green-400"
                                                        : log.type === "warning"
                                                            ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                                                            : "border-gray-300 text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                <span className="text-gray-500 dark:text-gray-400">[{log.timestamp}]</span>
                                                {log.nodeName && (
                                                    <span className="text-blue-500 dark:text-blue-400 ml-1">[{log.nodeName}]</span>
                                                )}
                                                <span className="ml-1">{log.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    )
}

