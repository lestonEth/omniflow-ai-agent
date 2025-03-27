/**
 * Base AI Service Interface
 * This defines the common interface that all AI model services should implement
 */
export interface AIServiceOptions {
  apiKey?: string
  model?: string
  maxTokens?: number
  temperature?: number
  timeout?: number
}

export interface AIServiceResponse {
  text: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  status: number
  created: number
}

export interface AIService {
  generateText(prompt: string, options?: AIServiceOptions): Promise<AIServiceResponse>
  isConfigured(): boolean
  getDefaultModel(): string
  getAvailableModels(): string[]
}

/**
 * AI Service Factory
 * This factory creates and returns the appropriate AI service based on the provider
 */
export class AIServiceFactory {
  private static services: Record<string, AIService> = {}

  static registerService(provider: string, service: AIService): void {
    this.services[provider.toLowerCase()] = service
  }

  static getService(provider: string): AIService | null {
    const service = this.services[provider.toLowerCase()]
    return service || null
  }

  static getAvailableProviders(): string[] {
    return Object.keys(this.services)
  }
}

/**
 * Simulation AI Service
 * This is a fallback service that simulates AI responses when no real service is available
 */
export class SimulationAIService implements AIService {
  private models = ["gpt-4-simulation", "gemini-pro-simulation", "claude-3-simulation"]

  constructor(private defaultModel = "gemini-pro-simulation") {}

  isConfigured(): boolean {
    return true // Simulation is always configured
  }

  getDefaultModel(): string {
    return this.defaultModel
  }

  getAvailableModels(): string[] {
    return this.models
  }

  async generateText(prompt: string, options?: AIServiceOptions): Promise<AIServiceResponse> {
    // Simulate processing delay based on prompt length
    const processingTime = Math.min(2000, 500 + prompt.length * 5)
    await new Promise((resolve) => setTimeout(resolve, processingTime))

    const model = options?.model || this.defaultModel
    const temperature = options?.temperature || 0.7

    // Generate a simulated response based on the model and prompt
    const response = this.generateSimulatedResponse(model, prompt)

    // Calculate token usage (simplified simulation)
    const promptTokens = prompt.split(/\s+/).length
    const responseTokens = response.split(/\s+/).length

    return {
      text: response,
      model: model,
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: responseTokens,
        total_tokens: promptTokens + responseTokens,
      },
      status: 200,
      created: Date.now(),
    }
  }

  private generateSimulatedResponse(model: string, prompt: string): string {
    if (!prompt || prompt.trim() === "") {
      return `${model} requires a non-empty prompt to generate a response.`
    }

    // Generate different responses based on the model and prompt content
    if (model.includes("gemini")) {
      if (prompt.includes("?")) {
        return `Gemini Pro analysis: Based on your question "${prompt}", I would suggest exploring multiple perspectives. The answer depends on several factors including context, timing, and specific requirements.`
      } else {
        return `Gemini Pro generated content based on: "${prompt}"\n\nThe provided input appears to be a statement or instruction. I've analyzed this and can provide additional context or elaboration if needed.`
      }
    } else if (model.includes("gpt")) {
      if (prompt.toLowerCase().includes("how")) {
        return `GPT-4 response: To address "${prompt}", I recommend the following step-by-step approach:\n\n1. First, assess your current situation\n2. Identify key objectives\n3. Develop a strategic plan\n4. Implement with careful monitoring\n5. Evaluate results and adjust as needed`
      } else {
        return `GPT-4 analysis: "${prompt}"\n\nThis is an interesting topic that can be examined from multiple angles. Let me provide a comprehensive overview with key considerations and potential implications.`
      }
    } else if (model.includes("claude")) {
      return `Claude's thoughtful response to "${prompt}":\n\nI've carefully considered your input and would like to offer a nuanced perspective. This topic involves several interconnected elements that benefit from a holistic analysis.`
    } else {
      return `AI model ${model} processed: "${prompt}"\n\nThis is a simulated response for demonstration purposes.`
    }
  }
}

// Register the simulation service as a fallback
AIServiceFactory.registerService("simulation", new SimulationAIService())

// Export a helper function to get the best available service
export function getBestAvailableAIService(preferredProvider?: string): AIService {
  if (preferredProvider) {
    const service = AIServiceFactory.getService(preferredProvider)
    if (service && service.isConfigured()) {
      return service
    }
  }

  // Try to find any configured service
  const providers = AIServiceFactory.getAvailableProviders()
  for (const provider of providers) {
    if (provider === "simulation") continue // Skip simulation in the first pass

    const service = AIServiceFactory.getService(provider)
    if (service && service.isConfigured()) {
      return service
    }
  }

  // Fall back to simulation if no real service is configured
  return AIServiceFactory.getService("simulation")!
}

