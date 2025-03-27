"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  Panel,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { Button } from "@/components/ui/button"
import { Play, Pause, Plus, Save, Upload, Key, MessageSquare } from "lucide-react"
import NodeLibrary from "@/components/node-library"
import NodeSidebar from "@/components/node-sidebar"
import NodeConsoleModal from "@/components/node-console-modal"
import ApiKeyModal from "@/components/api-key-modal"
import { nodeTypes } from "@/lib/node-types"
import { initialNodes } from "@/lib/initial-data"
import { simulateNode } from "@/lib/node-simulator"
import { useToast } from "@/components/ui/use-toast"
import { GeminiService } from "@/lib/services/gemini-service"
import { AIServiceFactory } from "@/lib/services/ai-service"
import WhatsAppConfigModal from "@/components/whatsapp-config-modal"

export default function FlowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [consoleNode, setConsoleNode] = useState<Node | null>(null)
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)
  const { toast } = useToast()

  // Simulation interval reference
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type || !reactFlowBounds || !reactFlowInstance) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const nodeData = JSON.parse(event.dataTransfer.getData("application/nodeData"))

      // Add node control handlers and state
      const enhancedNodeData = {
        ...nodeData,
        isActive: true,
        isPlaying: false,
        consoleOutput: [],
        outputData: null,
        executionStatus: null,
        onPlayPause: handleNodePlayPause,
        onToggleActive: handleNodeToggleActive,
        onOpenConsole: handleOpenNodeConsole,
        onDeleteNode: handleDeleteNode,
      }

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: enhancedNodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  // Run simulation for all active nodes
  const runSimulation = useCallback(async () => {
    // Process nodes in topological order (inputs first, then processing, then outputs)
    const nodesByType = {
      input: nodes.filter((n) => n.type === "input" && n.data.isActive && n.data.isPlaying),
      processing: nodes.filter((n) => n.type === "processing" && n.data.isActive && n.data.isPlaying),
      action: nodes.filter((n) => n.type === "action" && n.data.isActive && n.data.isPlaying),
      condition: nodes.filter((n) => n.type === "condition" && n.data.isActive && n.data.isPlaying),
      output: nodes.filter((n) => n.type === "output" && n.data.isActive && n.data.isPlaying),
    }

    // Process in order: input -> processing/action/condition -> output
    const processingOrder = ["input", "processing", "action", "condition", "output"]

    for (const nodeType of processingOrder) {
      for (const node of nodesByType[nodeType as keyof typeof nodesByType]) {
        try {
          // Simulate node execution
          const result = await simulateNode(node, nodes, edges)

          // Update node with simulation results
          setNodes((nds) =>
            nds.map((n) => {
              if (n.id === node.id) {
                return {
                  ...n,
                  data: {
                    ...n.data,
                    consoleOutput: result.consoleOutput,
                    outputData: result.outputData,
                    executionStatus: result.executionStatus,
                  },
                }
              }
              return n
            }),
          )
        } catch (error) {
          console.error(`Error simulating node ${node.id}:`, error)
        }
      }
    }
  }, [nodes, edges, setNodes])

  // Toggle global simulation
  const toggleSimulation = useCallback(() => {
    const newSimulatingState = !isSimulating
    setIsSimulating(newSimulatingState)

    if (newSimulatingState) {
      // Start simulation for all active nodes
      setNodes((nds) =>
        nds.map((node) => {
          if (node.data.isActive) {
            return {
              ...node,
              data: {
                ...node.data,
                isPlaying: true,
                consoleOutput: [
                  ...(node.data.consoleOutput || []),
                  `[${new Date().toLocaleTimeString()}] Simulation started`,
                ],
              },
            }
          }
          return node
        }),
      )

      // Run initial simulation
      runSimulation()

      // Set up interval for continuous simulation
      simulationIntervalRef.current = setInterval(() => {
        runSimulation()
      }, 3000) // Run simulation every 3 seconds
    } else {
      // Stop simulation for all nodes
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isPlaying: false,
            consoleOutput: [
              ...(node.data.consoleOutput || []),
              `[${new Date().toLocaleTimeString()}] Simulation stopped`,
            ],
          },
        })),
      )

      // Clear simulation interval
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current)
        simulationIntervalRef.current = null
      }
    }
  }, [isSimulating, setNodes, runSimulation])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current)
      }
    }
  }, [])

  const saveFlow = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject()
      localStorage.setItem("ai-flow", JSON.stringify(flow))
      toast({
        title: "Flow saved",
        description: "Your flow has been saved successfully.",
      })
    }
  }, [reactFlowInstance, toast])

  const loadFlow = useCallback(() => {
    const savedFlow = localStorage.getItem("ai-flow")
    if (savedFlow) {
      const flow = JSON.parse(savedFlow)

      // Add node control handlers to loaded nodes
      const nodesWithHandlers = flow.nodes.map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          onPlayPause: handleNodePlayPause,
          onToggleActive: handleNodeToggleActive,
          onOpenConsole: handleOpenNodeConsole,
          onDeleteNode: handleDeleteNode,
          consoleOutput: node.data.consoleOutput || [],
          isActive: node.data.isActive !== false,
          isPlaying: node.data.isPlaying || false,
          outputData: node.data.outputData || null,
          executionStatus: node.data.executionStatus || null,
        },
      }))

      setNodes(nodesWithHandlers || [])
      setEdges(flow.edges || [])
      toast({
        title: "Flow loaded",
        description: "Your flow has been loaded successfully.",
      })
    }
  }, [setNodes, setEdges, toast])

  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, ...newData },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  // Node control handlers
  const handleNodePlayPause = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const isPlaying = !node.data.isPlaying

            // Add a console message when play/pause state changes
            const consoleOutput = [
              ...(node.data.consoleOutput || []),
              `[${new Date().toLocaleTimeString()}] Node ${isPlaying ? "started" : "paused"}`,
            ]

            // If starting to play, run simulation for this node
            if (isPlaying) {
              // We'll run the simulation in the next tick
              setTimeout(async () => {
                try {
                  const result = await simulateNode({ ...node, data: { ...node.data, isPlaying: true } }, nodes, edges)

                  updateNodeData(nodeId, {
                    consoleOutput: result.consoleOutput,
                    outputData: result.outputData,
                    executionStatus: result.executionStatus,
                  })
                } catch (error) {
                  console.error(`Error simulating node ${nodeId}:`, error)
                }
              }, 0)
            }

            return {
              ...node,
              data: {
                ...node.data,
                isPlaying,
                consoleOutput,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes, nodes, edges, updateNodeData],
  )

  const handleNodeToggleActive = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const isActive = node.data.isActive === false

            // Add a console message when active state changes
            const consoleOutput = [
              ...(node.data.consoleOutput || []),
              `[${new Date().toLocaleTimeString()}] Node ${isActive ? "activated" : "deactivated"}`,
            ]

            return {
              ...node,
              data: {
                ...node.data,
                isActive,
                isPlaying: isActive ? node.data.isPlaying : false, // Stop playing if deactivated
                consoleOutput,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  const handleOpenNodeConsole = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        setConsoleNode(node)
      }
    },
    [nodes],
  )

  // Delete node handler
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      // First, close the sidebar if the deleted node is selected
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode(null)
      }

      // Close console modal if open for this node
      if (consoleNode && consoleNode.id === nodeId) {
        setConsoleNode(null)
      }

      // Remove all edges connected to this node
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))

      // Remove the node
      setNodes((nds) => nds.filter((n) => n.id !== nodeId))

      // Show toast notification
      toast({
        title: "Node deleted",
        description: "The node has been removed from the flow.",
      })
    },
    [setNodes, setEdges, selectedNode, consoleNode, toast],
  )

  // Handle API key saving
  const handleSaveApiKey = useCallback(
    (provider: string, apiKey: string) => {
      // Store API key in localStorage
      localStorage.setItem(`${provider.toLowerCase()}_api_key`, apiKey)

      // If it's Gemini, update the service
      if (provider === "gemini") {
        const geminiService = new GeminiService(apiKey)
        AIServiceFactory.registerService("gemini", geminiService)

        toast({
          title: "Gemini API Key Configured",
          description: "The Text Processor node will now use the real Gemini API.",
        })
      }
    },
    [toast],
  )

  // Add a useEffect to check for API keys on component mount
  useEffect(() => {
    // Check if Gemini API key is available from environment variables
    const envGeminiKey = process.env.GEMINI_API_KEY

    if (envGeminiKey) {
      // If environment variable is available, register the service
      const geminiService = new GeminiService(envGeminiKey)
      AIServiceFactory.registerService("gemini", geminiService)

      toast({
        title: "Gemini API Connected",
        description: "Using Gemini API key from environment variables.",
      })
    } else {
      // Check localStorage as fallback
      const localGeminiKey = localStorage.getItem("gemini_api_key")

      if (localGeminiKey) {
        const geminiService = new GeminiService(localGeminiKey)
        AIServiceFactory.registerService("gemini", geminiService)
      } else {
        toast({
          title: "Using Simulation Mode",
          description: "Configure API keys to use real AI models.",
          duration: 5000,
        })
      }
    }
  }, [toast])

  const handleSaveWhatsAppConfig = useCallback(
    (config: { accessToken: string; phoneNumberId: string; webhookVerifyToken: string }) => {
      // Store WhatsApp config in localStorage
      localStorage.setItem("whatsapp_access_token", config.accessToken)
      localStorage.setItem("whatsapp_phone_number_id", config.phoneNumberId)
      localStorage.setItem("whatsapp_webhook_verify_token", config.webhookVerifyToken)

      toast({
        title: "WhatsApp Configuration Saved",
        description: "Your WhatsApp Business API configuration has been saved.",
      })
    },
    [toast],
  )

  return (
    <div className="flex h-screen w-full">
      <ReactFlowProvider>
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
            <Panel position="top-right" className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSimulation}
                className={isSimulating ? "bg-red-100" : ""}
              >
                {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsLibraryOpen(!isLibraryOpen)}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={saveFlow}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={loadFlow}>
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsApiKeyModalOpen(true)}>
                <Key className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsWhatsAppModalOpen(true)}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </Panel>
            {isLibraryOpen && (
              <Panel position="top-left" className="bg-white p-4 rounded-md shadow-md">
                <NodeLibrary onClose={() => setIsLibraryOpen(false)} />
              </Panel>
            )}
          </ReactFlow>
        </div>
        {selectedNode && (
          <NodeSidebar node={selectedNode} onClose={() => setSelectedNode(null)} updateNodeData={updateNodeData} />
        )}
        {consoleNode && (
          <NodeConsoleModal
            nodeId={consoleNode.id}
            nodeName={consoleNode.data.name as string}
            consoleOutput={(consoleNode.data.consoleOutput as string[]) || []}
            onClose={() => setConsoleNode(null)}
          />
        )}
        {isApiKeyModalOpen && <ApiKeyModal onClose={() => setIsApiKeyModalOpen(false)} onSave={handleSaveApiKey} />}
        {isWhatsAppModalOpen && (
          <WhatsAppConfigModal onClose={() => setIsWhatsAppModalOpen(false)} onSave={handleSaveWhatsAppConfig} />
        )}
      </ReactFlowProvider>
    </div>
  )
}

