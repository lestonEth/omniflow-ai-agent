// Export all simulation functions and utilities
import type { Edge, Node } from "@xyflow/react"

// Helper function to generate a timestamp for console logs
export const timestamp = () => `[${ new Date().toLocaleTimeString() }]`

export const enhancedLog = (message: string, details?: any) => {
    const timestamp = `[${ new Date().toLocaleTimeString() }]`
    console.log(`${ timestamp } 🔍 ${ message }`)
    if (details) {
        console.log(JSON.stringify(details, null, 2))
    }
}

// Simulate execution of a node based on its type and inputs
export async function simulateNode(node: any, nodes: any[], edges: any[]) {
    const { type, id, data } = node
    const consoleOutput = [...(data.consoleOutput || [])]
    let outputData: any = {}

    enhancedLog(`🚀 Starting Node Execution`, {
        nodeId: id,
        nodeType: type,
        nodeName: data.name,
    })

    try {
        // Get input values from connected nodes
        const inputValues = getInputValues(id, nodes, edges)
        consoleOutput.push(`${ timestamp() } Received inputs: ${ JSON.stringify(inputValues) }`)

        // Process based on node type
        switch (type) {
            case "input":
                if (data.name === "WhatsApp Input") {
                    const { simulateWhatsAppInput } = await import("./whatsapp-node-simulator")
                    outputData = simulateWhatsAppInput(data)
                } else {
                    const { simulateInputNode } = await import("./input-node-simulator")
                    outputData = simulateInputNode(data)
                }
                break
            case "processing":
                const { simulateProcessingNode } = await import("./processing-node-simulator")
                outputData = await simulateProcessingNode(data, inputValues, consoleOutput)
                break
            case "action":
                const { simulateActionNode } = await import("./action-node-simulator")
                outputData = await simulateActionNode(data, inputValues)
                break
            case "condition":
                const { simulateConditionNode } = await import("./condition-node-simulator")
                outputData = simulateConditionNode(data, inputValues)
                break
            case "output":
                if (data.name === "WhatsApp Output") {
                    const { simulateWhatsAppOutput } = await import("./whatsapp-node-simulator")
                    outputData = await simulateWhatsAppOutput(data, inputValues, consoleOutput)
                } else {
                    const { simulateOutputNode } = await import("./output-node-simulator")
                    outputData = simulateOutputNode(data, inputValues)
                }
                break
            default:
                consoleOutput.push(`${ timestamp() } Unknown node type: ${ type }`)
        }

        // Log successful execution
        consoleOutput.push(`${ timestamp() } Execution completed successfully`)
        consoleOutput.push(`${ timestamp() } Output: ${ JSON.stringify(outputData) }`)

        return {
            consoleOutput,
            outputData,
            executionStatus: "success",
        }
    } catch (error: any) {
        // Log error
        consoleOutput.push(`${ timestamp() } Error: ${ error.message }`)
        return {
            consoleOutput,
            outputData: null,
            executionStatus: "error",
        }
    }
}

// Get input values from connected nodes
export function getInputValues(nodeId: string, nodes: any[], edges: any[]) {
    const inputValues: Record<string, any> = {}

    // Find all edges that connect to this node
    const incomingEdges = edges.filter((edge) => edge.target === nodeId)

    // Process each incoming edge
    incomingEdges.forEach((edge) => {
        // Find the source node
        const sourceNode = nodes.find((node) => node.id === edge.source)

        if (sourceNode && sourceNode.data.outputData) {
            // Get the specific output from the source node based on the sourceHandle
            const outputValue = edge.sourceHandle
                ? sourceNode.data.outputData[edge.sourceHandle]
                : Object.values(sourceNode.data.outputData)[0] // Default to first output if handle not specified

            if (outputValue !== undefined) {
                // Map to the target input handle
                inputValues[edge.targetHandle || "default"] = outputValue
            }
        }
    })

    // Also include any input values directly set on the node
    const nodeWithInputs = nodes.find((node) => node.id === nodeId)
    if (nodeWithInputs && nodeWithInputs.data.inputs) {
        nodeWithInputs.data.inputs.forEach((input: any) => {
            // Only use the node's input value if not already set by a connection
            if (input.key && input.value !== undefined && inputValues[input.key] === undefined) {
                inputValues[input.key] = input.value
            }
        })
    }

    return inputValues
}

// Propagate output data to connected nodes
export function propagateOutputToConnectedNodes(nodeId: string, outputData: any, nodes: Node[], edges: Edge[]) {
    // Find all edges that start from this node
    const outgoingEdges = edges.filter((edge) => edge.source === nodeId)
    const updatedNodeIds: string[] = []

    // For each outgoing edge, update the target node's input
    outgoingEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target)
        if (targetNode && edge.sourceHandle && edge.targetHandle) {
            // Get the output data from the source node
            const outputValue = outputData[edge.sourceHandle]

            if (outputValue !== undefined) {
                // Find the input in the target node that corresponds to the target handle
                const targetInputs = [...((targetNode.data.inputs as any) || [])]
                const inputIndex = targetInputs.findIndex((input) => input.key === edge.targetHandle)

                if (inputIndex !== -1) {
                    // Update the input value
                    targetInputs[inputIndex] = {
                        ...targetInputs[inputIndex],
                        value: outputValue,
                    }

                    // Update the target node's data
                    targetNode.data = {
                        ...targetNode.data,
                        inputs: targetInputs,
                    }

                    // Add the target node ID to the list of updated nodes
                    updatedNodeIds.push(targetNode.id)
                }
            }
        }
    })

    return updatedNodeIds
}

export * from "./action-node-simulator"
export * from "./condition-node-simulator"
export * from "./input-node-simulator"
export * from "./output-node-simulator"
export * from "./processing-node-simulator"
