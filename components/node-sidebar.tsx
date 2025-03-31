"use client"

import { useState, useEffect } from "react"
import type { Node } from "@xyflow/react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useFlow } from "@/contexts/FlowContext"

interface NodeSidebarProps {
    node: Node
    onClose: () => void
    updateNodeData: (nodeId: string, data: any) => void
}

export default function NodeSidebar({ node, onClose, updateNodeData }: NodeSidebarProps) {
    const [nodeData, setNodeData] = useState<any>(node.data)
    const { cascadeNodeExecution } = useFlow()

    useEffect(() => {
        setNodeData(node.data)
    }, [node])

    const handleInputChange = (key: string, value: any) => {
        const updatedData = { ...nodeData }

        // Find the input in the inputs array and update its value
        if (updatedData.inputs) {
            const inputIndex = updatedData.inputs.findIndex((input: any) => input.key === key)
            if (inputIndex !== -1) {
                updatedData.inputs[inputIndex].value = value
            }
        }

        setNodeData(updatedData)
        updateNodeData(node.id, updatedData)

        // If the node is currently playing, trigger a cascade update
        if (node.data.isPlaying) {
            // Use setTimeout to ensure the node update is processed first
            setTimeout(() => {
                cascadeNodeExecution(node.id)
            }, 0)
        }
    }

    const renderInputField = (input: any) => {
        switch (input.type) {
            case "string":
                return (
                    <Input
                        id={input.key}
                        value={input.value || ""}
                        placeholder={input.placeholder || ""}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                    />
                )
            case "number":
                return (
                    <Input
                        id={input.key}
                        type="number"
                        value={input.value || ""}
                        placeholder={input.placeholder || ""}
                        onChange={(e) => handleInputChange(input.key, Number.parseFloat(e.target.value))}
                    />
                )
            case "boolean":
                return (
                    <Switch
                        id={input.key}
                        checked={input.value || false}
                        onCheckedChange={(checked) => handleInputChange(input.key, checked)}
                    />
                )
            case "select":
                return (
                    <Select value={input.value || ""} onValueChange={(value) => handleInputChange(input.key, value)}>
                        <SelectTrigger>
                            <SelectValue placeholder={input.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent>
                            {input.options?.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            case "object":
                return (
                    <Textarea
                        id={input.key}
                        value={typeof input.value === "object" ? JSON.stringify(input.value, null, 2) : input.value || ""}
                        placeholder={input.placeholder || ""}
                        onChange={(e) => {
                            try {
                                const value = JSON.parse(e.target.value)
                                handleInputChange(input.key, value)
                            } catch {
                                handleInputChange(input.key, e.target.value)
                            }
                        }}
                        className="min-h-[100px]"
                    />
                )
            default:
                return (
                    <Input
                        id={input.key}
                        value={input.value || ""}
                        placeholder={input.placeholder || ""}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                    />
                )
        }
    }

    return (
        <div className="w-80 h-full border-l bg-white p-4 overflow-y-auto pb-20">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">{nodeData.name}</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <p className="text-sm text-gray-500 mb-4">{nodeData.description}</p>

            <Separator className="my-4" />

            <div className="space-y-4">
                <h4 className="font-medium">Inputs</h4>
                {nodeData.inputs?.map((input: any) => (
                    <div key={input.key} className="space-y-2">
                        <Label htmlFor={input.key}>{input.label}</Label>
                        {renderInputField(input)}
                        {input.description && <p className="text-xs text-gray-500">{input.description}</p>}
                    </div>
                ))}
            </div>

            {nodeData.outputs && nodeData.outputs.length > 0 && (
                <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                        <h4 className="font-medium">Outputs</h4>
                        {nodeData.outputs.map((output: any) => (
                            <div key={output.key} className="p-2 border rounded-md bg-gray-50">
                                <div className="font-medium text-sm">{output.label}</div>
                                <div className="text-xs text-gray-500">Type: {output.type}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {nodeData.meta && Object.keys(nodeData.meta).length > 0 && (
                <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                        <h4 className="font-medium">Configuration</h4>
                        {Object.entries(nodeData.meta).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex items-center justify-between">
                                <Label htmlFor={key} className="text-sm">
                                    {key}
                                </Label>
                                <Switch
                                    id={key}
                                    checked={value}
                                    onCheckedChange={(checked) => {
                                        const updatedData = { ...nodeData }
                                        updatedData.meta[key] = checked
                                        setNodeData(updatedData)
                                        updateNodeData(node.id, updatedData)
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Add Wallet Info Section for Crypto Wallet nodes */}
            {nodeData.name === "Crypto Wallet" && nodeData.outputData?.connected && (
                <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                        <h4 className="font-medium">Wallet Information</h4>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <span className="text-sm px-2 py-0.5 rounded bg-green-100 text-green-700">Connected</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Network:</span>
                                    <span className="text-sm">{nodeData.outputData?.walletInfo?.network || "Ethereum"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Address:</span>
                                    <span className="text-xs font-mono mt-1 break-all">
                                        {nodeData.outputData?.walletInfo?.address || "Not connected"}
                                    </span>
                                </div>
                                {nodeData.outputData?.balance && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Balance:</span>
                                        <span className="text-sm">
                                            {nodeData.outputData.balance} {nodeData.outputData?.walletInfo?.currency || "ETH"}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Connection Type:</span>
                                    <span className="text-sm">{nodeData.outputData?.walletInfo?.connectionType || "Unknown"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {nodeData.name === "Trading Bot" && nodeData.outputData?.recommendation && (
                <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                        <h4 className="font-medium">Trading Bot Analysis</h4>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Recommendation:</span>
                                    <span
                                        className={`text-sm px-2 py-0.5 rounded ${ nodeData.outputData.recommendation.action === "buy"
                                            ? "bg-green-100 text-green-700"
                                            : nodeData.outputData.recommendation.action === "sell"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {nodeData.outputData.recommendation.action === "buy"
                                            ? "Buy"
                                            : nodeData.outputData.recommendation.action === "sell"
                                                ? "Sell"
                                                : "Hold"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Token:</span>
                                    <span className="text-sm">{nodeData.outputData.recommendation.token}</span>
                                </div>
                                {nodeData.outputData.recommendation.amount && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Amount:</span>
                                        <span className="text-sm">{nodeData.outputData.recommendation.amount}</span>
                                    </div>
                                )}
                                {nodeData.outputData.recommendation.price && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Price:</span>
                                        <span className="text-sm">${nodeData.outputData.recommendation.price.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="text-xs mt-2 text-gray-600">{nodeData.outputData.recommendation.reason}</div>
                            </div>

                            {nodeData.outputData.performance && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="text-sm font-medium mb-2">Performance Metrics</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex justify-between">
                                            <span className="text-xs">Win Rate:</span>
                                            <span
                                                className={`text-xs ${ Number.parseFloat(nodeData.outputData.performance.winRate) > 50
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                {nodeData.outputData.performance.winRate}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs">Profit:</span>
                                            <span
                                                className={`text-xs ${ Number.parseFloat(nodeData.outputData.performance.profit) > 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                {Number.parseFloat(nodeData.outputData.performance.profit) > 0 ? "+" : ""}
                                                {nodeData.outputData.performance.profit}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Add Crypto Trade Section for Crypto Trade nodes */}
            {nodeData.name === "Crypto Trade" && nodeData.outputData?.status && (
                <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                        <h4 className="font-medium">Trade Information</h4>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <span
                                        className={`text-sm px-2 py-0.5 rounded ${ nodeData.outputData.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : nodeData.outputData.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {nodeData.outputData.status.charAt(0).toUpperCase() + nodeData.outputData.status.slice(1)}
                                    </span>
                                </div>

                                {nodeData.outputData.details && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Action:</span>
                                            <span className="text-sm">{nodeData.outputData.details.action}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Token:</span>
                                            <span className="text-sm">{nodeData.outputData.details.token}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Amount:</span>
                                            <span className="text-sm">{nodeData.outputData.details.amount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Price:</span>
                                            <span className="text-sm">${nodeData.outputData.details.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Total:</span>
                                            <span className="text-sm">${nodeData.outputData.details.total.toFixed(2)}</span>
                                        </div>
                                    </>
                                )}

                                {nodeData.outputData.transactionId && (
                                    <div className="text-xs mt-2 font-mono break-all">
                                        <span className="font-medium">TX ID:</span> {nodeData.outputData.transactionId}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

