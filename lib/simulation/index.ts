// Add crypto node simulators to the simulation logic
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
                const { simulateInputNode } = await import("@/lib/simulation/input-node-simulator")
                outputData = simulateInputNode(data)
                break
            case "processing":
                if (data.name === "Text Processor") {
                    const { simulateProcessingNode } = await import("@/lib/simulation/processing-node-simulator")
                    outputData = await simulateProcessingNode(data, inputValues, consoleOutput)
                } else if (data.name === "Data Transformer") {
                    const { simulateProcessingNode } = await import("@/lib/simulation/processing-node-simulator")
                    outputData = await simulateProcessingNode(data, inputValues, consoleOutput)
                } else if (data.name === "Crypto Wallet") {
                    const { simulateCryptoWallet } = await import("@/lib/simulation/crypto-node-simulator")
                    outputData = simulateCryptoWallet(data)
                } else if (data.name === "Trading Bot") {
                    const { simulateTradingBot } = await import("@/lib/simulation/crypto-node-simulator")
                    outputData = simulateTradingBot(data, inputValues)
                } else {
                    const { simulateProcessingNode } = await import("@/lib/simulation/processing-node-simulator")
                    outputData = await simulateProcessingNode(data, inputValues, consoleOutput)
                }
                break
            case "action":
                if (data.name === "Crypto Trade") {
                    const { simulateCryptoTrade } = await import("@/lib/simulation/crypto-node-simulator")
                    outputData = simulateCryptoTrade(data, inputValues)
                } else {
                    const { simulateActionNode } = await import("@/lib/simulation/action-node-simulator")
                    outputData = await simulateActionNode(data, inputValues)
                }
                break
            case "condition":
                const { simulateConditionNode } = await import("./condition-node-simulator")
                outputData = simulateConditionNode(data, inputValues)
                break
            case "output":
                const { simulateOutputNode } = await import("@/lib/simulation//output-node-simulator")
                outputData = simulateOutputNode(data, inputValues)
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

        if (sourceNode) {
            // Get the specific output from the source node based on the sourceHandle
            let outputValue

            // Check if the source node has outputData
            if (sourceNode.data.outputData) {
                // Try to get the specific output value using the sourceHandle
                if (edge.sourceHandle && sourceNode.data.outputData[edge.sourceHandle] !== undefined) {
                    outputValue = sourceNode.data.outputData[edge.sourceHandle]
                }
                // If no specific handle or value not found, try to get the first output
                else if (Object.keys(sourceNode.data.outputData).length > 0) {
                    // Get the first non-internal output (not starting with _)
                    const firstOutputKey = Object.keys(sourceNode.data.outputData).find((key) => !key.startsWith("_"))

                    if (firstOutputKey) {
                        outputValue = sourceNode.data.outputData[firstOutputKey]
                    }
                }
            }

            // If we found a value and have a target handle, assign it
            if (outputValue !== undefined && edge.targetHandle) {
                inputValues[edge.targetHandle] = outputValue

                // Log successful connection for debugging
                console.log(
                    `Connected: ${ sourceNode.id } (${ edge.sourceHandle || "default" }) -> ${ nodeId } (${ edge.targetHandle })`,
                )
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

// Improve propagation of output data to connected nodes
export function propagateOutputToConnectedNodes(nodeId: string, outputData: any, nodes: Node[], edges: Edge[]) {
    // Find all edges that start from this node
    const outgoingEdges = edges.filter((edge) => edge.source === nodeId)
    const updatedNodeIds: string[] = []

    // For each outgoing edge, update the target node's input
    outgoingEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target)

        if (targetNode) {
            // Get the output data from the source node
            let outputValue

            // Try to get the specific output value using the sourceHandle
            if (edge.sourceHandle && outputData[edge.sourceHandle] !== undefined) {
                outputValue = outputData[edge.sourceHandle]
            }
            // If no specific handle or value not found, try to get the first output
            else if (Object.keys(outputData).length > 0) {
                // Get the first non-internal output (not starting with _)
                const firstOutputKey = Object.keys(outputData).find((key) => !key.startsWith("_"))

                if (firstOutputKey) {
                    outputValue = outputData[firstOutputKey]
                }
            }

            // If we found a value and have a target handle, update the target node
            if (outputValue !== undefined && edge.targetHandle) {
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

                    // Log successful propagation for debugging
                    console.log(
                        `Propagated: ${ nodeId } (${ edge.sourceHandle || "default" }) -> ${ targetNode.id } (${ edge.targetHandle })`,
                    )
                }
            }
        }
    })

    return updatedNodeIds
}

export * from "@/lib/simulation/action-node-simulator"
export * from "@/lib/simulation/condition-node-simulator"
export * from "@/lib/simulation/input-node-simulator"
export * from "@/lib/simulation/output-node-simulator"
export * from "@/lib/simulation/processing-node-simulator"
export * from "@/lib/simulation/crypto-node-simulator"

