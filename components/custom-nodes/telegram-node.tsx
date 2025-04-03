"use client"

import { Handle, Position } from "@xyflow/react"
import type React from "react"
import { useState, useEffect } from "react"
import NodeControls from "./node-controls"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import TelegramConfigModal from "../modals/telegram-config-modal"

interface TelegramNodeProps {
    data: any
    isConnectable: boolean
    selected: boolean
    id: string
}

const TelegramNode: React.FC<TelegramNodeProps> = ({ data, isConnectable, selected, id }) => {
    // State for config modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLiveMode, setIsLiveMode] = useState(false)

    // Determine connection status
    const isConnected = data.outputData?.connected || false
    const botToken = data.inputs?.find((input: any) => input.key === "botToken")?.value || ""
    const chatId = data.inputs?.find((input: any) => input.key === "chatId")?.value || ""

    // Check if live mode is enabled in node data
    useEffect(() => {
        if (data.meta?.liveMode !== undefined) {
            setIsLiveMode(data.meta.liveMode)
        }
    }, [data.meta?.liveMode])

    // Handle successful configuration
    const handleTelegramConfigured = (config: any) => {
        if (data.onUpdateNodeData) {
            // Create output data structure
            const outputData = {
                connected: true,
                telegramInfo: {
                    botToken: config.botToken,
                    chatId: config.chatId,
                    botName: config.botName || "Trading Bot",
                    lastUpdated: new Date().toISOString(),
                },
            }

            // Update node data with configuration
            data.onUpdateNodeData(id, {
                ...data,
                outputData,
                inputs: data.inputs?.map((input: any) => {
                    if (input.key === "botToken") {
                        return {
                            ...input,
                            value: config.botToken || input.value,
                        }
                    }
                    if (input.key === "chatId") {
                        return {
                            ...input,
                            value: config.chatId || input.value,
                        }
                    }
                    if (input.key === "botName") {
                        return {
                            ...input,
                            value: config.botName || input.value,
                        }
                    }
                    return input
                }),
            })

            // Add console message
            const consoleOutput = [...(data.consoleOutput || [])]
            consoleOutput.push(
                `[${ new Date().toLocaleTimeString() }] Telegram bot configured: ${ config.botName || "Trading Bot" }`,
            )

            data.onUpdateNodeData(id, {
                ...data,
                consoleOutput,
            })
        }
    }

    // Toggle live mode
    const toggleLiveMode = () => {
        const newLiveMode = !isLiveMode
        setIsLiveMode(newLiveMode)

        if (data.onUpdateNodeData) {
            // Update node meta data
            const meta = { ...(data.meta || {}), liveMode: newLiveMode }

            // Add console message
            const consoleOutput = [...(data.consoleOutput || [])]
            consoleOutput.push(
                `[${ new Date().toLocaleTimeString() }] ${ newLiveMode ? "LIVE MODE ENABLED" : "Switched to simulation mode" }`,
            )

            data.onUpdateNodeData(id, {
                ...data,
                meta,
                consoleOutput,
            })
        }
    }

    return (
        <div
            className={`p-3 rounded-md border-2 ${ selected ? "border-blue-500" : "border-cyan-200" } ${ data.isActive === false ? "opacity-50" : ""
                } ${ data.isPlaying ? "animate-pulse shadow-lg shadow-cyan-200" : "" } bg-cyan-50 shadow-sm w-48 relative`}
        >
            <NodeControls
                nodeId={id}
                isPlaying={data.isPlaying || false}
                isActive={data.isActive !== false}
                onPlayPause={data.onPlayPause}
                onToggleActive={data.onToggleActive}
                onOpenConsole={data.onOpenConsole}
                onDeleteNode={data.onDeleteNode}
            />

            {/* Node Icon */}
            <div className="absolute top-1 left-1 flex items-center text-xs">
                <div className="flex items-center text-cyan-600">
                    <MessageCircle className="h-4 w-4" />
                </div>
            </div>

            <div className="font-medium text-sm mt-6">{data.name}</div>
            <div className="text-xs text-gray-500 mb-2">{data.description}</div>

            {/* Live Mode Toggle */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="live-mode" className="text-xs">
                        Live Mode
                    </Label>
                    <Switch
                        id="live-mode"
                        checked={isLiveMode}
                        onCheckedChange={toggleLiveMode}
                        className={isLiveMode ? "bg-red-500" : ""}
                    />
                </div>
                {isLiveMode && (
                    <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full animate-pulse">LIVE</span>
                )}
            </div>

            {/* Connection Status */}
            {isConnected ? (
                <div className="text-xs mb-2 px-2 py-1 bg-green-100 text-green-700 rounded flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Telegram connected
                </div>
            ) : (
                <div className="text-xs mb-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                    Not connected
                </div>
            )}

            {/* Connection Button */}
            {!isConnected && (
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-7 flex items-center gap-1"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Send className="h-3 w-3" />
                    Configure Telegram
                </Button>
            )}

            {/* Input Handles */}
            {data.inputs?.map((input: any, index: number) => (
                <Handle
                    key={input.key}
                    type="target"
                    position={Position.Left}
                    id={input.key}
                    style={{ top: 40 + index * 10, background: "#555" }}
                    isConnectable={isConnectable}
                />
            ))}

            {/* Output Handles */}
            {data.outputs?.map((output: any, index: number) => (
                <Handle
                    key={output.key}
                    type="source"
                    position={Position.Right}
                    id={output.key}
                    style={{ top: 40 + index * 10, background: "#555" }}
                    isConnectable={isConnectable}
                />
            ))}

            {/* Display output data when the node is playing */}
            {data.isPlaying && data.outputData && (
                <div className="mt-2 p-2 bg-gray-50 border rounded-md">
                    <div className="text-xs text-gray-500 mb-1 flex items-center justify-between">
                        <span>Telegram Bot</span>
                        <span
                            className={`text-xs px-1.5 py-0.5 rounded ${ isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                        >
                            {isConnected ? (isLiveMode ? "LIVE" : "Connected") : "Disconnected"}
                        </span>
                    </div>
                    {isConnected && (
                        <>
                            <div className="text-sm font-medium">{data.outputData.telegramInfo?.botName || "Trading Bot"}</div>
                            {data.outputData.lastMessage && (
                                <div className="text-xs text-gray-500 mt-1">
                                    <div className="font-medium">Last Message:</div>
                                    <div className="whitespace-pre-wrap break-words">{data.outputData.lastMessage.text}</div>
                                </div>
                            )}
                            {data.outputData.messagesSent && (
                                <div className="text-xs text-gray-500 mt-1">Messages Sent: {data.outputData.messagesSent}</div>
                            )}
                            {data.outputData.receivedMessage && (
                                <div className="text-xs text-gray-500 mt-1">
                                    <div className="font-medium">Received Message:</div>
                                    <div className="whitespace-pre-wrap break-words">{data.outputData.receivedMessage.text}</div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Show execution status indicator if available */}
            {data.executionStatus && (
                <div
                    className={`absolute top-0 left-0 w-2 h-2 rounded-full m-1 ${ data.executionStatus === "success"
                        ? "bg-green-500"
                        : data.executionStatus === "error"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                />
            )}

            {/* Telegram Configuration Modal */}
            {isModalOpen && (
                <TelegramConfigModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleTelegramConfigured}
                    initialData={{
                        botToken,
                        chatId,
                        botName: data.inputs?.find((input: any) => input.key === "botName")?.value || "Trading Bot",
                    }}
                />
            )}
        </div>
    )
}

export default TelegramNode

