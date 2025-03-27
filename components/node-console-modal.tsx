"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NodeConsoleModalProps {
  nodeId: string
  nodeName: string
  consoleOutput: string[]
  onClose: () => void
}

export default function NodeConsoleModal({ nodeId, nodeName, consoleOutput, onClose }: NodeConsoleModalProps) {
  console.log("NodeConsoleModalProps", nodeId, nodeName, consoleOutput, onClose)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium">Console: {nodeName}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-80 p-4">
          {consoleOutput.length === 0 ? (
            <div className="text-sm text-gray-500 italic">No console output yet.</div>
          ) : (
            <div className="space-y-2">
              {consoleOutput.map((message, index) => (
                <div key={index} className="text-sm font-mono p-1 border-l-2 border-gray-300 pl-2">
                  {message}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-end p-4 border-t">
          <Button variant="outline" size="sm" onClick={() => onClose()}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

