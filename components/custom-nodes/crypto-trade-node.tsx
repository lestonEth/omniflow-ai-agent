import { Handle, Position } from "@xyflow/react"
import type React from "react"
import NodeControls from "./node-controls"
import { TrendingUp, ArrowUpDown, ArrowDownRight, ArrowUpRight } from "lucide-react"

interface CryptoTradeNodeProps {
    data: any
    isConnectable: boolean
    selected: boolean
    id: string
}

const CryptoTradeNode: React.FC<CryptoTradeNodeProps> = ({ data, isConnectable, selected, id }) => {
    // Get trade action
    const action = data.inputs?.find((input: any) => input.key === "action")?.value || "Buy"

    // Get icon based on action
    const ActionIcon = action === "Buy" ? ArrowUpRight : action === "Sell" ? ArrowDownRight : ArrowUpDown

    return (
        <div
            className={`p-3 rounded-md border-2 ${ selected ? "border-blue-500" : "border-green-200" } ${ data.isActive === false ? "opacity-50" : ""
                } ${ data.isPlaying ? "animate-pulse shadow-lg shadow-green-200" : "" } bg-green-50 shadow-sm w-48 relative`}
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
                <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4" />
                </div>
            </div>

            {/* Action indicator */}
            <div className="absolute top-1 right-8 flex items-center text-xs">
                <div
                    className={`flex items-center ${ action === "Buy" ? "text-green-600" : action === "Sell" ? "text-red-600" : "text-blue-600"
                        }`}
                >
                    <ActionIcon className="h-3 w-3 mr-1" />
                    <span className="text-[10px]">{action}</span>
                </div>
            </div>

            <div className="font-medium text-sm mt-6">{data.name}</div>
            <div className="text-xs text-gray-500 mb-2">{data.description}</div>

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
                        <span>Transaction Status</span>
                        <span
                            className={`text-xs px-1.5 py-0.5 rounded ${ data.outputData.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : data.outputData.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {data.outputData.status === "completed"
                                ? "Completed"
                                : data.outputData.status === "pending"
                                    ? "Pending"
                                    : "Failed"}
                        </span>
                    </div>
                    <div className="text-sm font-medium">
                        {action} {data.outputData.details?.amount || "0"} {data.outputData.details?.token || "ETH"}
                    </div>
                    {data.outputData.details?.price && (
                        <div className="text-xs text-gray-500 mt-1">Price: ${data.outputData.details.price}</div>
                    )}
                    {data.outputData.transactionId && (
                        <div className="text-xs text-gray-500 mt-1">TX: {formatTxId(data.outputData.transactionId)}</div>
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
        </div>
    )
}

// Helper function to format transaction ID
function formatTxId(txId: string): string {
    if (!txId) return ""
    return `${ txId.substring(0, 8) }...${ txId.substring(txId.length - 6) }`
}

export default CryptoTradeNode

