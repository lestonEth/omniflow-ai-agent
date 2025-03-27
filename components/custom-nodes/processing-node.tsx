import { Handle, Position } from "@xyflow/react"
import type React from "react"
import NodeControls from "./node-controls"
import NodeOutputDisplay from "../node-output-display"
import { Cpu, Bot } from "lucide-react"
import { AIServiceFactory } from "@/lib/services/ai-service"

interface ProcessingNodeProps {
  data: any
  isConnectable: boolean
  selected: boolean
  id: string
}

// Explicitly define as React FC
const ProcessingNode: React.FC<ProcessingNodeProps> = ({ data, isConnectable, selected, id }) => {
  // Check if this is a Text Processor node and determine if API is connected
  const isTextProcessor = data.name === "Text Processor"
  const model = isTextProcessor ? data.inputs?.find((input: any) => input.key === "model")?.value || "gemini-pro" : ""

  // Determine which service provider to use based on the model
  let serviceProvider = "simulation"
  if (model.toLowerCase().includes("gpt")) {
    serviceProvider = "openai"
  } else if (model.toLowerCase().includes("gemini")) {
    serviceProvider = "gemini"
  } else if (model.toLowerCase().includes("claude")) {
    serviceProvider = "anthropic"
  }

  // Check if the service is configured
  const service = AIServiceFactory.getService(serviceProvider)
  const isApiConnected = service && service.isConfigured()

  return (
    <div
      className={`p-3 rounded-md border-2 ${selected ? "border-blue-500" : "border-blue-200"} ${
        data.isActive === false ? "opacity-50" : ""
      } bg-blue-50 shadow-sm w-48 relative`}
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

      {/* API connection indicator for Text Processor */}
      {isTextProcessor && (
        <div className="absolute top-1 left-1 flex items-center text-xs">
          {isApiConnected ? (
            <div className="flex items-center text-green-600">
              <Bot className="h-3 w-3 mr-1" />
              <span className="text-[10px]">API Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-blue-600">
              <Cpu className="h-3 w-3 mr-1" />
              <span className="text-[10px]">Simulation</span>
            </div>
          )}
        </div>
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
        <NodeOutputDisplay nodeType="processing" nodeName={data.name} outputData={data.outputData} />
      )}

      {/* Show execution status indicator if available */}
      {data.executionStatus && (
        <div
          className={`absolute top-0 left-0 w-2 h-2 rounded-full m-1 ${
            data.executionStatus === "success"
              ? "bg-green-500"
              : data.executionStatus === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
          }`}
        />
      )}

      {/* Show processing indicator when node is playing but no output yet */}
      {data.isPlaying && !data.outputData && (
        <div className="mt-2 p-2 bg-gray-50 border rounded-md animate-pulse">
          <div className="text-xs text-gray-500">Processing...</div>
        </div>
      )}
    </div>
  )
}

export default ProcessingNode

