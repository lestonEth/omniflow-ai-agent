"use client"

import type React from "react"
import { useState } from "react"
import { X, Layers3, FileInput, Workflow, FileOutput, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { nodeDefinitions } from "@/lib/node-definitions"
import { motion, AnimatePresence } from "framer-motion"

interface NodeLibraryProps {
  onClose: () => void
}

export default function NodeLibrary({ onClose }: NodeLibraryProps) {
  const [activeTab, setActiveTab] = useState("all")

  const categories = [
    { id: "all", label: "All", icon: Layers3 },
    { id: "input", label: "Input", icon: FileInput },
    { id: "processing", label: "Processing", icon: Workflow },
    { id: "output", label: "Output", icon: FileOutput },
    { id: "condition", label: "Logic", icon: ArrowLeftRight },
  ]

  const filteredNodes =
    activeTab === "all" ? nodeDefinitions : nodeDefinitions.filter((node) => node.category === activeTab)

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.setData("application/nodeData", JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <Layers3 className="w-5 h-5 text-blue-500" />
          Node Library
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full p-1 bg-gray-100 h-auto flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-1 text-xs p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-300 ease-in-out flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="p-3 space-y-2 max-h-[400px] overflow-y-auto"
          >
            <AnimatePresence>
              {filteredNodes.map((node, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 border rounded-lg cursor-grab bg-white hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 group glass-card"
                  draggable
                  onDragStart={(event: any) => onDragStart(event, node.type, node)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                        {node.name}
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                        {node.description}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div whileHover={{ rotate: 90 }} className="bg-blue-50 text-blue-600 rounded-full p-1">
                        <Layers3 className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

