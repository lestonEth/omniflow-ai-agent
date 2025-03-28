import FlowBuilder from "@/components/flow-builder"
import { FlowProvider } from "@/contexts"
import { SimulationProvider } from "@/contexts"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <FlowProvider>
                <SimulationProvider>
                    <FlowBuilder />
                </SimulationProvider>
            </FlowProvider>
        </main>
    )
}

