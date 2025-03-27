import { type AIService, type AIServiceOptions, type AIServiceResponse, AIServiceFactory } from "./ai-service"

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string
      }[]
    }
    finishReason: string
    safetyRatings: any[]
  }[]
  promptFeedback?: any
  usage?: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
  }
}

export class GeminiService implements AIService {
  private apiKey: string | null = null
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta"
  private defaultModel = "gemini-2.0-flash"
  private availableModels = ["gemini-2.0-flash", "gemini-pro-vision", "gemini-ultra"]

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey
    } else {
      // Try to get API key from environment or localStorage
      this.apiKey =
        (typeof process !== "undefined" && process.env.GEMINI_API_KEY) ||
        (typeof localStorage !== "undefined" ? localStorage.getItem("gemini_api_key") : null)
    }

    // Log API key status (without revealing the key)
    if (this.apiKey) {
      console.log("Gemini API key is configured")
    } else {
      console.log("Gemini API key is not configured")
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  getDefaultModel(): string {
    return this.defaultModel
  }

  getAvailableModels(): string[] {
    return this.availableModels
  }

  async generateText(prompt: string, options?: AIServiceOptions): Promise<AIServiceResponse> {
    if (!this.isConfigured()) {
      throw new Error("Gemini API key is not configured")
    }

    const model = options?.model || this.defaultModel
    const temperature = options?.temperature || 0.7
    const maxTokens = options?.maxTokens || 1024
    const timeout = options?.timeout || 30000 // 30 seconds default timeout

    try {
      const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }

      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`)
      }

      const data = (await response.json()) as GeminiResponse

      // Extract the generated text
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      // Calculate token usage
      const usage = data.usage || {
        promptTokenCount: prompt.split(/\s+/).length, // Fallback estimation
        candidatesTokenCount: generatedText.split(/\s+/).length, // Fallback estimation
        totalTokenCount: prompt.split(/\s+/).length + generatedText.split(/\s+/).length, // Fallback estimation
      }

      return {
        text: generatedText,
        model: model,
        usage: {
          prompt_tokens: usage.promptTokenCount,
          completion_tokens: usage.candidatesTokenCount,
          total_tokens: usage.totalTokenCount,
        },
        status: response.status,
        created: Date.now(),
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error(`Gemini API request timed out after ${timeout}ms`)
      }
      throw error
    }
  }
}

// Register the Gemini service with the factory
const geminiService = new GeminiService()
AIServiceFactory.registerService("gemini", geminiService)

