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
        </div>
    )
}

