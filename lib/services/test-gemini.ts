import { GeminiService } from "./gemini-service"

const geminiService = new GeminiService("YOUR_API_KEY_HERE") // Replace with your actual API key

async function testGemini() {
  if (!geminiService.isConfigured()) {
    console.error("Gemini API key is not configured")
    return
  }

  console.log("Testing GeminiService...")

  try {
    const response = await geminiService.generateText("Tell me a fun fact about space in 3 sentences")

    console.log("Generated Text:", response.text)
    console.log("Model Used:", response.model)
    console.log("Token Usage:", response.usage)
  } catch (error: any) {
    console.error("Error:", error.message)
  }
}

testGemini()

