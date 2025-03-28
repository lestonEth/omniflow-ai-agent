import { useCallback, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { AIServiceFactory } from "@/lib/services/ai-service"
import { GeminiService } from "@/lib/services/gemini-service"

export const useApiKeyManager = () => {
    const { toast } = useToast()

    const handleSaveApiKey = useCallback((provider: string, apiKey: string) => {
        sessionStorage.setItem(`${ provider.toLowerCase() }_api_key`, apiKey)

        if (provider === "gemini") {
            const geminiService = new GeminiService(apiKey)
            AIServiceFactory.registerService("gemini", geminiService)

            toast({
                title: "Gemini API Key Configured",
                description: "The Text Processor node will now use the real Gemini API.",
            })
        }
    }, [toast])

    useEffect(() => {
        const envGeminiKey = process.env.GEMINI_API_KEY
        const localGeminiKey = sessionStorage.getItem("gemini_api_key")

        if (envGeminiKey) {
            const geminiService = new GeminiService(envGeminiKey)
            AIServiceFactory.registerService("gemini", geminiService)

            toast({
                title: "Gemini API Connected",
                description: "Using API key from environment variables.",
            })
        } else if (localGeminiKey) {
            const geminiService = new GeminiService(localGeminiKey)
            AIServiceFactory.registerService("gemini", geminiService)

            toast({
                title: "Gemini API Connected",
                description: "Using saved API key.",
            })
        } else {
            toast({
                title: "Using Simulation Mode",
                description: "Configure API keys to use real AI models.",
                duration: 5000,
            })
        }
    }, [toast])

    return { handleSaveApiKey }
}