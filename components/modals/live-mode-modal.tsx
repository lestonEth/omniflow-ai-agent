"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, Rocket, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { liveModeManager } from "@/lib/deployment/live-mode-manager"

interface LiveModeModalProps {
    isOpen: boolean
    onClose: () => void
    flowId: string
    nodes: any[]
}

const LiveModeModal: React.FC<LiveModeModalProps> = ({ isOpen, onClose, flowId, nodes }) => {
    const [isEnabling, setIsEnabling] = useState(false)
    const [status, setStatus] = useState<null | { success: boolean; message: string }>(null)
    const [activeTab, setActiveTab] = useState("overview")

    // Extract relevant nodes
    const telegramNodes = nodes.filter((node) => node.type === "telegram" || node.data.name === "Telegram Bot")
    const walletNodes = nodes.filter((node) => node.type === "crypto_wallet" || node.data.name === "Crypto Wallet")
    const tradeNodes = nodes.filter((node) => node.type === "crypto_trade" || node.data.name === "Crypto Trade")

    // Node configuration states
    const [enabledNodes, setEnabledNodes] = useState<Record<string, boolean>>({})
    const [riskLevels, setRiskLevels] = useState<Record<string, "low" | "medium" | "high">>({})

    // Initialize node states
    useState(() => {
        const initialEnabledNodes: Record<string, boolean> = {}
        const initialRiskLevels: Record<string, "low" | "medium" | "high"> = {}

        // Enable all Telegram nodes by default
        telegramNodes.forEach((node) => {
            initialEnabledNodes[node.id] = true
        })

        // Enable wallet nodes that have configuration
        walletNodes.forEach((node) => {
            const hasWalletAddress = node.data.inputs?.some((input: any) => input.key === "walletAddress" && input.value)
            initialEnabledNodes[node.id] = hasWalletAddress
        })

        // Set low risk level for all trade nodes by default
        tradeNodes.forEach((node) => {
            initialRiskLevels[node.id] = "low"
            initialEnabledNodes[node.id] = true
        })

        setEnabledNodes(initialEnabledNodes)
        setRiskLevels(initialRiskLevels)
    }, [telegramNodes, walletNodes, tradeNodes])

    const toggleNodeEnabled = (nodeId: string) => {
        setEnabledNodes((prev) => ({
            ...prev,
            [nodeId]: !prev[nodeId],
        }))
    }

    const setNodeRiskLevel = (nodeId: string, level: "low" | "medium" | "high") => {
        setRiskLevels((prev) => ({
            ...prev,
            [nodeId]: level,
        }))
    }

    const handleEnableLiveMode = async () => {
        setIsEnabling(true)
        setStatus(null)

        try {
            // Prepare configuration
            const config = {
                flowId,
                telegramNodes: telegramNodes
                    .filter((node) => enabledNodes[node.id])
                    .map((node) => ({
                        nodeId: node.id,
                        botToken: node.data.inputs?.find((input: any) => input.key === "botToken")?.value || "",
                        chatId: node.data.inputs?.find((input: any) => input.key === "chatId")?.value || "",
                    })),
                walletNodes: walletNodes
                    .filter((node) => enabledNodes[node.id])
                    .map((node) => ({
                        nodeId: node.id,
                        walletAddress: node.data.inputs?.find((input: any) => input.key === "walletAddress")?.value || "",
                        network: node.data.inputs?.find((input: any) => input.key === "network")?.value || "Ethereum",
                    })),
                tradeNodes: tradeNodes
                    .filter((node) => enabledNodes[node.id])
                    .map((node) => ({
                        nodeId: node.id,
                        maxAmount: 0.1, // Default max amount
                        riskLevel: riskLevels[node.id] || "low",
                    })),
            }

            // Enable live mode
            const result = await liveModeManager.enableLiveMode(config)

            if (result) {
                setStatus({
                    success: true,
                    message: "Live mode enabled successfully! Your bot is now running in production.",
                })

                // Update all enabled nodes to live mode
                // In a real implementation, you would update the nodes in the flow
            } else {
                throw new Error("Failed to enable live mode")
            }
        } catch (error: any) {
            setStatus({
                success: false,
                message: `Error enabling live mode: ${ error.message }`,
            })
        } finally {
            setIsEnabling(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-red-500" />
                        Enable Live Mode
                    </DialogTitle>
                    <DialogDescription>
                        Switch from simulation to live mode. This will connect your bot to real services and execute real
                        transactions.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="telegram">Telegram</TabsTrigger>
                        <TabsTrigger value="trading">Trading</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="space-y-4">
                            <div className="p-3 border rounded-md bg-yellow-50 border-yellow-200">
                                <h3 className="text-sm font-medium flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-yellow-600" />
                                    Live Mode Warning
                                </h3>
                                <p className="text-xs mt-1 text-yellow-700">
                                    Enabling live mode will connect your bot to real services and execute real transactions. Make sure you
                                    have thoroughly tested your flow in simulation mode before enabling live mode.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Flow Summary</h3>
                                <ul className="text-xs space-y-1">
                                    <li>• {telegramNodes.length} Telegram nodes</li>
                                    <li>• {walletNodes.length} Wallet nodes</li>
                                    <li>• {tradeNodes.length} Trading nodes</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Live Mode Requirements</h3>
                                <ul className="text-xs space-y-1">
                                    <li
                                        className={`flex items-center gap-1 ${ telegramNodes.length > 0 ? "text-green-600" : "text-red-600" }`}
                                    >
                                        {telegramNodes.length > 0 ? (
                                            <CheckCircle2 className="h-3 w-3" />
                                        ) : (
                                            <AlertCircle className="h-3 w-3" />
                                        )}
                                        At least one Telegram node
                                    </li>
                                    <li
                                        className={`flex items-center gap-1 ${ walletNodes.some((node) =>
                                            node.data.inputs?.some((input: any) => input.key === "walletAddress" && input.value),
                                        )
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {walletNodes.some((node) =>
                                            node.data.inputs?.some((input: any) => input.key === "walletAddress" && input.value),
                                        ) ? (
                                            <CheckCircle2 className="h-3 w-3" />
                                        ) : (
                                            <AlertCircle className="h-3 w-3" />
                                        )}
                                        At least one configured wallet
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="telegram">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Telegram Nodes</h3>
                            {telegramNodes.length === 0 ? (
                                <p className="text-xs text-gray-500">No Telegram nodes found in this flow.</p>
                            ) : (
                                <div className="space-y-2">
                                    {telegramNodes.map((node) => (
                                        <div key={node.id} className="p-2 border rounded-md">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium">{node.data.name}</span>
                                                <Switch
                                                    checked={enabledNodes[node.id] || false}
                                                    onCheckedChange={() => toggleNodeEnabled(node.id)}
                                                />
                                            </div>
                                            {enabledNodes[node.id] && (
                                                <div className="mt-2 text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Bot Token:</span>
                                                        <span>
                                                            {node.data.inputs?.find((input: any) => input.key === "botToken")?.value
                                                                ? "✓ Configured"
                                                                : "❌ Missing"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Chat ID:</span>
                                                        <span>
                                                            {node.data.inputs?.find((input: any) => input.key === "chatId")?.value
                                                                ? "✓ Configured"
                                                                : "❌ Missing"}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="trading">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Trading Nodes</h3>
                            {tradeNodes.length === 0 ? (
                                <p className="text-xs text-gray-500">No trading nodes found in this flow.</p>
                            ) : (
                                <div className="space-y-2">
                                    {tradeNodes.map((node) => (
                                        <div key={node.id} className="p-2 border rounded-md">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium">{node.data.name}</span>
                                                <Switch
                                                    checked={enabledNodes[node.id] || false}
                                                    onCheckedChange={() => toggleNodeEnabled(node.id)}
                                                />
                                            </div>
                                            {enabledNodes[node.id] && (
                                                <div className="mt-2 text-xs">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-500">Risk Level:</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                className={`px-2 py-0.5 rounded text-[10px] ${ riskLevels[node.id] === "low" ? "bg-green-100 text-green-700" : "bg-gray-100"
                                                                    }`}
                                                                onClick={() => setNodeRiskLevel(node.id, "low")}
                                                            >
                                                                Low
                                                            </button>
                                                            <button
                                                                className={`px-2 py-0.5 rounded text-[10px] ${ riskLevels[node.id] === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100"
                                                                    }`}
                                                                onClick={() => setNodeRiskLevel(node.id, "medium")}
                                                            >
                                                                Medium
                                                            </button>
                                                            <button
                                                                className={`px-2 py-0.5 rounded text-[10px] ${ riskLevels[node.id] === "high" ? "bg-red-100 text-red-700" : "bg-gray-100"
                                                                    }`}
                                                                onClick={() => setNodeRiskLevel(node.id, "high")}
                                                            >
                                                                High
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="p-3 border rounded-md bg-blue-50 border-blue-200">
                                <h3 className="text-sm font-medium flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    Risk Levels
                                </h3>
                                <p className="text-xs mt-1 text-blue-700">
                                    <strong>Low:</strong> Max 0.1 ETH per trade, max 3 trades per day
                                    <br />
                                    <strong>Medium:</strong> Max 0.5 ETH per trade, max 10 trades per day
                                    <br />
                                    <strong>High:</strong> Max 1.0 ETH per trade, max 20 trades per day
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {status && (
                    <div
                        className={`p-3 rounded-md ${ status.success ? "bg-green-50 border-green-200 border" : "bg-red-50 border-red-200 border"
                            } flex items-start gap-2 mt-4`}
                    >
                        {status.success ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        <p className="text-sm">{status.message}</p>
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEnableLiveMode}
                        disabled={isEnabling}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {isEnabling ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Enabling...
                            </>
                        ) : (
                            <>
                                <Rocket className="h-4 w-4 mr-2" />
                                Enable Live Mode
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LiveModeModal

