"use client"

import { useState } from "react"
import { X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { GeminiService } from "@/lib/services/gemini-service"

interface ApiKeyModalProps {
  onClose: () => void
  onSave: (provider: string, apiKey: string) => void
}

export default function ApiKeyModal({ onClose, onSave }: ApiKeyModalProps) {
  const [activeTab, setActiveTab] = useState("gemini")
  const [geminiKey, setGeminiKey] = useState("")
  const [openaiKey, setOpenaiKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<null | { success: boolean; message: string }>(null)
  const { toast } = useToast()

  const handleSave = () => {
    let key = ""

    switch (activeTab) {
      case "gemini":
        key = geminiKey
        break
      case "openai":
        key = openaiKey
        break
      case "anthropic":
        key = anthropicKey
        break
    }

    if (!key) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key before saving.",
        variant: "destructive",
      })
      return
    }

    // Save the API key
    onSave(activeTab, key)

    toast({
      title: "API Key Saved",
      description: `Your ${activeTab.toUpperCase()} API key has been saved.`,
    })

    onClose()
  }

  const testConnection = async () => {
    setTestingConnection(true)
    setConnectionStatus(null)

    try {
      if (activeTab === "gemini") {
        if (!geminiKey) {
          throw new Error("Please enter a Gemini API key first")
        }

        // Create a temporary service with the provided key
        const tempService = new GeminiService(geminiKey)

        // Test with a simple prompt
        const result = await tempService.generateText(
          "Hello, this is a test connection. Please respond with a short confirmation.",
        )

        if (result && result.text) {
          setConnectionStatus({
            success: true,
            message: "Connection successful! Gemini API is working.",
          })
        } else {
          throw new Error("Received an invalid response from the API")
        }
      } else {
        // For other providers that aren't implemented yet
        setConnectionStatus({
          success: false,
          message: `Testing ${activeTab} connections is not implemented yet.`,
        })
      }
    } catch (error: any) {
      setConnectionStatus({
        success: false,
        message: `Connection failed: ${error.message}`,
      })
    } finally {
      setTestingConnection(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium text-lg">Configure AI API Keys</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="gemini" value={activeTab} onValueChange={setActiveTab} className="p-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          </TabsList>

          <TabsContent value="gemini" className="space-y-4">
            <div>
              <Label htmlFor="gemini-key">Gemini API Key</Label>
              <Input
                id="gemini-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value)
                  setConnectionStatus(null)
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from the{" "}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Google AI Studio
                </a>
                .
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={testConnection} disabled={testingConnection || !geminiKey}>
                {testingConnection ? "Testing..." : "Test Connection"}
              </Button>
            </div>

            {connectionStatus && (
              <div
                className={`p-3 rounded-md ${connectionStatus.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border flex items-start gap-2`}
              >
                {connectionStatus.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div className="text-sm">{connectionStatus.message}</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="openai" className="space-y-4">
            <div>
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                placeholder="Enter your OpenAI API key"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from the{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  OpenAI dashboard
                </a>
                .
              </p>
            </div>
            <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
              <p className="text-sm">OpenAI integration coming soon!</p>
            </div>
          </TabsContent>

          <TabsContent value="anthropic" className="space-y-4">
            <div>
              <Label htmlFor="anthropic-key">Anthropic API Key</Label>
              <Input
                id="anthropic-key"
                type="password"
                placeholder="Enter your Anthropic API key"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from the{" "}
                <a
                  href="https://console.anthropic.com/account/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Anthropic console
                </a>
                .
              </p>
            </div>
            <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
              <p className="text-sm">Anthropic integration coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end p-4 border-t gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save API Key</Button>
        </div>
      </div>
    </div>
  )
}

