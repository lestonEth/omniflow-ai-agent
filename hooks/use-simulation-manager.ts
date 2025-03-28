"use client"

import { useState, useCallback, useEffect } from "react"
import { useFlow } from "@/contexts/FlowContext"
import { useSimulation } from "@/contexts/SimulationContext"

export const useSimulationLogic = () => {
    const { nodes, edges, cascadeNodeExecution } = useFlow()
    const { isSimulating, simulationSpeed } = useSimulation()
    const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null)
    const [currentlyExecutingNode, setCurrentlyExecutingNode] = useState<string | null>(null)

    const runSimulation = useCallback(async () => {
        const nodesByType = {
            input: nodes.filter((n) => n.type === "input" && n.data.isActive && n.data.isPlaying),
            processing: nodes.filter((n) => n.type === "processing" && n.data.isActive && n.data.isPlaying),
            action: nodes.filter((n) => n.type === "action" && n.data.isActive && n.data.isPlaying),
            condition: nodes.filter((n) => n.type === "condition" && n.data.isActive && n.data.isPlaying),
            output: nodes.filter((n) => n.type === "output" && n.data.isActive && n.data.isPlaying),
        }

        const processingOrder = ["input", "processing", "action", "condition", "output"]

        for (const nodeType of processingOrder) {
            for (const node of nodesByType[nodeType as keyof typeof nodesByType]) {
                try {
                    // Set the currently executing node to highlight it
                    setCurrentlyExecutingNode(node.id)

                    // Add a small delay to make the execution flow visible
                    await new Promise((resolve) => setTimeout(resolve, 300))

                    // Use cascadeNodeExecution to trigger updates to downstream nodes
                    await cascadeNodeExecution(node.id)

                    // Add a small delay after execution to make the flow visible
                    await new Promise((resolve) => setTimeout(resolve, 300))
                } catch (error) {
                    console.error(`Simulation error for node ${ node.id }: `, error)
                } finally {
                    // Clear the currently executing node
                    setCurrentlyExecutingNode(null)
                }
            }
        }
    }, [nodes, cascadeNodeExecution])

    useEffect(() => {
        if (isSimulating) {
            // Initial simulation
            runSimulation()

            // Set up interval
            const interval = setInterval(runSimulation, simulationSpeed)
            setSimulationInterval(interval)

            return () => {
                if (interval) clearInterval(interval)
            }
        } else {
            // Stop simulation
            if (simulationInterval) {
                clearInterval(simulationInterval)
                setSimulationInterval(null)
            }

            // Clear any executing node highlight
            setCurrentlyExecutingNode(null)
        }
    }, [isSimulating, simulationSpeed, runSimulation])

    return { runSimulation, currentlyExecutingNode }
}

