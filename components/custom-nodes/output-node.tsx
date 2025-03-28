import { Handle, Position } from "@xyflow/react"
import type React from "react"
import NodeControls from "./node-controls"
import NodeOutputDisplay from "../node-output-display"

interface OutputNodeProps {
  data: any
  isConnectable: boolean
  selected: boolean
  id: string
}

// Explicitly define as React FC
const OutputNode: React.FC<OutputNodeProps> = ({ data, isConnectable, selected, id }) => {
  return (
    <div
      className={`p-3 rounded-md border-2 ${ selected ? "border-blue-500" : "border-purple-200" } ${ data.isActive === false ? "opacity-50" : ""
        } ${ data.isPlaying ? "animate-pulse shadow-lg shadow-purple-200" : "" } bg-purple-50 shadow-sm w-48 relative`}
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
          className={data.isPlaying ? "animate-ping" : ""}
        />
      ))}

      {/* Display output data when the node is playing */}
      {data.isPlaying && data.outputData && (
        <NodeOutputDisplay nodeType="output" nodeName={data.name} outputData={data.outputData} />
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

export default OutputNode

