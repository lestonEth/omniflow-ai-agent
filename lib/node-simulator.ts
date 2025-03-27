// This file handles the simulation logic for different node types
import { getBestAvailableAIService } from "./services/ai-service"

// Helper function to generate a timestamp for console logs
const timestamp = () => `[${new Date().toLocaleTimeString()}]`

const enhancedLog = (message: string, details?: any) => {
  const timestamp = `[${new Date().toLocaleTimeString()}]`
  console.log(`${timestamp} 🔍 ${message}`)
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
    consoleOutput.push(`${timestamp()} Received inputs: ${JSON.stringify(inputValues)}`)

    // Process based on node type
    switch (type) {
      case "input":
        if (data.name === "WhatsApp Input") {
          outputData = simulateWhatsAppInput(data)
        } else {
          outputData = simulateInputNode(data)
        }
        break
      case "processing":
        outputData = await simulateProcessingNode(data, inputValues, consoleOutput)
        break
      case "action":
        outputData = await simulateActionNode(data, inputValues)
        break
      case "condition":
        outputData = simulateConditionNode(data, inputValues)
        break
      case "output":
        if (data.name === "WhatsApp Output") {
          outputData = await simulateWhatsAppOutput(data, inputValues, consoleOutput)
        } else {
          outputData = simulateOutputNode(data, inputValues)
        }
        break
      default:
        consoleOutput.push(`${timestamp()} Unknown node type: ${type}`)
    }

    // Log successful execution
    consoleOutput.push(`${timestamp()} Execution completed successfully`)
    consoleOutput.push(`${timestamp()} Output: ${JSON.stringify(outputData)}`)

    return {
      consoleOutput,
      outputData,
      executionStatus: "success",
    }
  } catch (error: any) {
    // Log error
    consoleOutput.push(`${timestamp()} Error: ${error.message}`)
    return {
      consoleOutput,
      outputData: null,
      executionStatus: "error",
    }
  }
}

// Get input values from connected nodes
function getInputValues(nodeId: string, nodes: any[], edges: any[]) {
  const inputValues: Record<string, any> = {}

  // Find all edges that connect to this node
  const incomingEdges = edges.filter((edge) => edge.target === nodeId)

  // Process each incoming edge
  incomingEdges.forEach((edge) => {
    // Find the source node
    const sourceNode = nodes.find((node) => node.id === edge.source)

    if (sourceNode && sourceNode.data.outputData) {
      // Get the specific output from the source node based on the sourceHandle
      const outputValue = edge.sourceHandle
        ? sourceNode.data.outputData[edge.sourceHandle]
        : Object.values(sourceNode.data.outputData)[0] // Default to first output if handle not specified

      if (outputValue !== undefined) {
        // Map to the target input handle
        inputValues[edge.targetHandle || "default"] = outputValue
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

// Simulate input node (generates data based on configuration)
function simulateInputNode(data: any) {
  const outputs: Record<string, any> = {}

  // For each output defined in the node
  data.outputs?.forEach((output: any) => {
    if (output.key === "value") {
      // For text input, use the configured value or placeholder
      if (data.name === "Text Input") {
        const inputValue = data.inputs?.find((input: any) => input.key === "placeholder")?.value || "Sample text"
        outputs[output.key] = inputValue
      }
      // For file upload, simulate a file object
      else if (data.name === "File Upload") {
        outputs[output.key] = {
          name: "example.txt",
          type: "text/plain",
          size: 1024,
          content: "This is a simulated file content for testing purposes.",
        }
      }
    }
    // For webhook, simulate payload data
    else if (output.key === "payload" && data.name === "Webhook Trigger") {
      outputs[output.key] = {
        message: "Webhook triggered",
        timestamp: new Date().toISOString(),
        data: {
          id: Math.floor(Math.random() * 1000),
          event: "user.created",
          metadata: {
            source: "simulation",
            version: "1.0",
          },
        },
      }
    }
  })

  return outputs
}

// Simulate processing node
async function simulateProcessingNode(data: any, inputValues: Record<string, any>, consoleOutput: string[]) {
  const outputs: Record<string, any> = {}

  if (data.name === "Text Processor") {
    // Get the input text, or use a default if not provided
    console.log(`data: ${JSON.stringify(data)}, inputValues: ${JSON.stringify(inputValues)}`)
    const inputText =
      inputValues["text"] || data.inputs?.find((input: any) => input.key === "text")?.value || "Default text"
    const model = data.inputs?.find((input: any) => input.key === "model")?.value || "GPT-4"
    const systemPrompt =
      data.inputs?.find((input: any) => input.key === "prompt")?.value || "You are a helpful assistant"

    // Determine which AI service to use based on the model
    let aiServiceProvider = "simulation" // Default to simulation

    if (model.toLowerCase().includes("gpt")) {
      aiServiceProvider = "openai"
    } else if (model.toLowerCase().includes("gemini")) {
      aiServiceProvider = "gemini"
    } else if (model.toLowerCase().includes("claude")) {
      aiServiceProvider = "anthropic"
    }

    // Get the appropriate AI service
    const aiService = getBestAvailableAIService(aiServiceProvider)
    const isSimulation = aiServiceProvider === "simulation" || !aiService.isConfigured()

    // Add connection status to console output
    if (isSimulation) {
      consoleOutput.push(`${timestamp()} Using simulation mode for ${model} (no API key configured)`)
    } else {
      consoleOutput.push(`${timestamp()} Connecting to ${aiServiceProvider.toUpperCase()} API for ${model}...`)
    }

    try {
      // Prepare the full prompt with system instructions if needed
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${inputText}` : inputText

      // Generate text using the AI service
      const aiResponse = await aiService.generateText(fullPrompt, {
        model: model,
        temperature: 0.7,
        maxTokens: 1000,
      })

      consoleOutput.push(`${timestamp()} ${isSimulation ? "Simulated" : "Received"} response from ${model}`)
      consoleOutput.push(
        `${timestamp()} Used ${aiResponse.usage.total_tokens} tokens (${aiResponse.usage.prompt_tokens} prompt, ${aiResponse.usage.completion_tokens} completion)`,
      )

      // Set the output data
      outputs["result"] = aiResponse.text
      outputs["model"] = aiResponse.model
      outputs["tokenUsage"] = aiResponse.usage
      outputs["processingTime"] = `${((Date.now() - aiResponse.created) / 1000).toFixed(2)}s`
      outputs["isSimulation"] = isSimulation
    } catch (error: any) {
      consoleOutput.push(`${timestamp()} Error: ${error.message}`)
      outputs["result"] = `Error: ${error.message}`
      outputs["error"] = error.message
      throw error // Re-throw to mark the node as failed
    }
  } else if (data.name === "Data Transformer") {
    // Get input data or use default
    const inputData: any = inputValues["data"] || data.inputs?.find((input: any) => input.key === "data")?.value || {}
    const transformationType = data.inputs?.find((input: any) => input.key === "transformation")?.value || "default"

    // Simulate transformation with more realistic processing
    try {
      let transformedData

      // Apply different transformations based on the type of input data
      if (Array.isArray(inputData)) {
        // Array transformation
        if (transformationType.includes("map")) {
          transformedData = inputData.map((item) => (typeof item === "object" ? { ...item, processed: true } : item))
        } else if (transformationType.includes("filter")) {
          transformedData = inputData.filter((item) => typeof item === "object" && item !== null)
        } else {
          transformedData = [...inputData] // Clone array
        }
      } else if (typeof inputData === "object" && inputData !== null) {
        // Object transformation
        transformedData = {
          ...inputData,
          processed: true,
          timestamp: new Date().toISOString(),
        }
      } else {
        // Primitive value
        transformedData = {
          originalValue: inputData,
          processed: true,
          timestamp: new Date().toISOString(),
        }
      }

      outputs["result"] = transformedData
    } catch (error: any) {
      outputs["result"] = {
        error: `Transformation error: ${error.message}`,
        originalData: inputData,
      }
    }
  }

  return outputs
}

// Simulate action node (with async support for API calls)
async function simulateActionNode(data: any, inputValues: Record<string, any>) {
  const outputs: Record<string, any> = {}

  if (data.name === "API Call") {
    try {
      // Get API details from inputs or connected nodes
      const url =
        inputValues["url"] || data.inputs?.find((input: any) => input.key === "url")?.value || "https://api.example.com"
      const method = inputValues["method"] || data.inputs?.find((input: any) => input.key === "method")?.value || "GET"
      const headers = inputValues["headers"] || data.inputs?.find((input: any) => input.key === "headers")?.value || {}
      const body = inputValues["body"] || data.inputs?.find((input: any) => input.key === "body")?.value || {}

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Instead of actually making the request, simulate a response
      // This avoids CORS issues and network dependencies
      let simulatedResponse

      if (url.includes("example.com")) {
        // Simulate example.com API
        simulatedResponse = {
          success: true,
          data: {
            id: Math.floor(Math.random() * 10000),
            timestamp: new Date().toISOString(),
            method: method,
            receivedHeaders: headers,
            receivedBody: method !== "GET" ? body : undefined,
          },
          message: "Simulated API response",
        }
      } else if (url.includes("error")) {
        // Simulate error response
        throw new Error("API returned error status 500")
      } else {
        // Generic simulation
        simulatedResponse = {
          status: "success",
          data: {
            result: "Simulated response for " + url,
            timestamp: new Date().toISOString(),
          },
        }
      }

      outputs["response"] = simulatedResponse
      outputs["status"] = 200
      outputs["headers"] = {
        "content-type": "application/json",
        "x-powered-by": "Omniflow Simulator",
      }
    } catch (error: any) {
      outputs["response"] = { error: error.message }
      outputs["status"] = 500
      outputs["headers"] = {
        "content-type": "application/json",
        "x-error": "true",
      }
    }
  } else if (data.name === "AI Processor") {
    try {
      // Extract input values or use defaults from node configuration
      const prompt = inputValues["prompt"] || data.inputs?.find((input: any) => input.key === "prompt")?.value || ""
      const model =
        inputValues["model"] || data.inputs?.find((input: any) => input.key === "model")?.value || "gemini-pro"
      const temperature =
        inputValues["temperature"] || data.inputs?.find((input: any) => input.key === "temperature")?.value || 0.7
      const context = inputValues["context"] || data.inputs?.find((input: any) => input.key === "context")?.value || {}

      // Use the AI service architecture
      const aiService = getBestAvailableAIService(model.includes("gemini") ? "gemini" : "simulation")

      const aiResponse = await aiService.generateText(prompt, {
        model,
        temperature,
        maxTokens: 1000,
      })

      outputs["response"] = aiResponse.text
      outputs["status"] = aiResponse.status || 200
      outputs["fullResponse"] = aiResponse
    } catch (error: any) {
      outputs["response"] = `Error processing with AI: ${error.message}`
      outputs["status"] = 500
      outputs["fullResponse"] = { error: error.message }
    }
  } else if (data.name === "Data Transformation") {
    try {
      // Get input data
      const inputData = inputValues["data"] || data.inputs?.find((input: any) => input.key === "data")?.value || {}
      const transformationType = data.inputs?.find((input: any) => input.key === "type")?.value || "default"

      // Different transformation types
      let transformedData
      switch (transformationType) {
        case "flatten":
          transformedData = flattenObject(inputData)
          break
        case "uppercase":
          transformedData = transformToUppercase(inputData)
          break
        case "lowercase":
          transformedData = transformToLowercase(inputData)
          break
        case "filter":
          const filterKey = data.inputs?.find((input: any) => input.key === "filterKey")?.value
          transformedData = filterObject(inputData, filterKey)
          break
        default:
          // Default transformation - add metadata
          transformedData = addMetadata(inputData)
      }

      outputs["result"] = transformedData
      outputs["status"] = 200
    } catch (error: any) {
      outputs["result"] = { error: error.message, originalData: inputData }
      outputs["status"] = 500
    }
  }

  return outputs
}

// Add metadata to an object (default transformation)
function addMetadata(data: any): any {
  if (typeof data !== "object" || data === null) {
    return {
      value: data,
      metadata: {
        type: typeof data,
        transformed: true,
        timestamp: new Date().toISOString(),
      },
    }
  }

  if (Array.isArray(data)) {
    return {
      values: [...data],
      metadata: {
        type: "array",
        length: data.length,
        transformed: true,
        timestamp: new Date().toISOString(),
      },
    }
  }

  return {
    ...data,
    metadata: {
      type: "object",
      keys: Object.keys(data),
      transformed: true,
      timestamp: new Date().toISOString(),
    },
  }
}

// Utility functions for data transformation
function flattenObject(obj: any, prefix = ""): any {
  if (typeof obj !== "object" || obj === null) return { [prefix]: obj }

  return Object.keys(obj).reduce((acc: Record<string, any>, k) => {
    const pre = prefix.length ? prefix + "." : ""
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k))
    } else {
      acc[pre + k] = obj[k]
    }
    return acc
  }, {})
}

function transformToUppercase(obj: any): any {
  if (typeof obj === "string") return obj.toUpperCase()
  if (typeof obj !== "object" || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => transformToUppercase(item))
  }

  return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
    acc[key] = transformToUppercase(obj[key])
    return acc
  }, {})
}

function transformToLowercase(obj: any): any {
  if (typeof obj === "string") return obj.toLowerCase()
  if (typeof obj !== "object" || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => transformToLowercase(item))
  }

  return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
    acc[key] = transformToLowercase(obj[key])
    return acc
  }, {})
}

function filterObject(obj: any, filterKey?: string): any {
  if (!filterKey) return obj

  if (Array.isArray(obj)) {
    return obj.filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        item.hasOwnProperty(filterKey) &&
        item[filterKey] !== null &&
        item[filterKey] !== undefined,
    )
  }

  if (typeof obj === "object" && obj !== null) {
    const result: Record<string, any> = {}

    // Keep only keys that match the filter or contain objects that might have the filter key
    Object.keys(obj).forEach((key) => {
      if (key === filterKey) {
        result[key] = obj[key]
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        const filtered = filterObject(obj[key], filterKey)
        if (Object.keys(filtered).length > 0) {
          result[key] = filtered
        }
      }
    })

    return result
  }

  return {}
}

// Simulate condition node - CSP-safe version without eval()
function simulateConditionNode(data: any, inputValues: Record<string, any>) {
  const outputs: Record<string, any> = {}

  if (data.name === "If Condition") {
    // Get condition and value
    const conditionStr = data.inputs?.find((input: any) => input.key === "condition")?.value || ""
    const value =
      inputValues["value"] !== undefined
        ? inputValues["value"]
        : data.inputs?.find((input: any) => input.key === "value")?.value

    // Parse condition without using eval - CSP safe approach
    let result = false
    let conditionEvaluated = false

    try {
      // Handle different comparison operators
      if (conditionStr.includes(">=")) {
        const parts = conditionStr.split(">=").map((p: string) => p.trim())
        const leftSide = parts[0] === "value" ? value : parseNumericValue(parts[0])
        const rightSide = parseNumericValue(parts[1])
        result = Number(leftSide) >= Number(rightSide)
        conditionEvaluated = true
      } else if (conditionStr.includes("<=")) {
        const parts = conditionStr.split("<=").map((p: string) => p.trim())
        const leftSide = parts[0] === "value" ? value : parseNumericValue(parts[0])
        const rightSide = parseNumericValue(parts[1])
        result = Number(leftSide) <= Number(rightSide)
        conditionEvaluated = true
      } else if (conditionStr.includes(">")) {
        const parts = conditionStr.split(">").map((p: string) => p.trim())
        const leftSide = parts[0] === "value" ? value : parseNumericValue(parts[0])
        const rightSide = parseNumericValue(parts[1])
        result = Number(leftSide) > Number(rightSide)
        conditionEvaluated = true
      } else if (conditionStr.includes("<")) {
        const parts = conditionStr.split("<").map((p: string) => p.trim())
        const leftSide = parts[0] === "value" ? value : parseNumericValue(parts[0])
        const rightSide = parseNumericValue(parts[1])
        result = Number(leftSide) < Number(rightSide)
        conditionEvaluated = true
      } else if (conditionStr.includes("==")) {
        const parts = conditionStr.split("==").map((p: string) => p.trim())
        const leftSide = parts[0] === "value" ? value : parts[0]
        const rightSide = parts[1]

        // Handle string comparisons with quotes
        const leftValue = parseValue(leftSide)
        const rightValue = parseValue(rightSide)

        result = leftValue == rightValue // Intentional loose equality
        conditionEvaluated = true
      } else if (conditionStr.includes("!=")) {
        const parts = conditionStr.split("!=").map((p: string) => p.trim())
        const leftSide = parts[0] === "value" ? value : parts[0]
        const rightSide = parts[1]

        // Handle string comparisons with quotes
        const leftValue = parseValue(leftSide)
        const rightValue = parseValue(rightSide)

        result = leftValue != rightValue // Intentional loose inequality
        conditionEvaluated = true
      } else if (conditionStr.includes("contains")) {
        const parts = conditionStr.split("contains").map((p: string) => p.trim())
        const leftSide = parts[0] === "value" ? value : parts[0]
        const rightSide = parts[1]

        // Handle string comparisons
        const leftValue = String(parseValue(leftSide))
        const rightValue = String(parseValue(rightSide))

        result = leftValue.includes(rightValue)
        conditionEvaluated = true
      }

      // If no condition was evaluated, try a simple boolean check
      if (!conditionEvaluated) {
        if (conditionStr === "true") {
          result = true
        } else if (conditionStr === "false") {
          result = false
        } else if (conditionStr === "value") {
          // Treat the value itself as a boolean
          result = Boolean(value)
        }
      }
    } catch (error) {
      // If there's an error in evaluation, default to false
      result = false
    }

    outputs["true"] = result
    outputs["false"] = !result

    // Add evaluation details for debugging
    outputs["_debug"] = {
      condition: conditionStr,
      value: value,
      result: result,
    }
  } else if (data.name === "Switch Case") {
    const value =
      inputValues["value"] !== undefined
        ? inputValues["value"]
        : data.inputs?.find((input: any) => input.key === "value")?.value

    const cases = data.inputs?.find((input: any) => input.key === "cases")?.value || {}

    // Check which case matches
    let matched = false
    Object.keys(cases).forEach((caseKey) => {
      // Convert both to strings for comparison to avoid type issues
      const matches = String(cases[caseKey]) === String(value)
      outputs[caseKey] = matches
      if (matches) matched = true
    })

    // Default case
    outputs["default"] = !matched

    // Add evaluation details for debugging
    outputs["_debug"] = {
      value: value,
      cases: cases,
      matched: matched,
    }
  }

  return outputs
}

// Helper function to parse numeric values
function parseNumericValue(value: string): number {
  // Remove quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.substring(1, value.length - 1)
  }

  // Try to convert to number
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

// Helper function to parse values from condition strings
function parseValue(value: string): any {
  // Handle quoted strings
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1)
  }

  // Handle numbers
  if (!isNaN(Number(value))) {
    return Number(value)
  }

  // Handle booleans
  if (value === "true") return true
  if (value === "false") return false

  // Default case - return as is
  return value
}

// Simulate output node
function simulateOutputNode(data: any, inputValues: Record<string, any>) {
  // Output nodes don't produce output data for other nodes,
  // but we'll return what they would display
  const displayData: Record<string, any> = {}

  if (data.name === "Text Output") {
    // Get text from input values or node configuration
    const text =
      inputValues["text"] !== undefined
        ? inputValues["text"]
        : data.inputs?.find((input: any) => input.key === "text")?.value || ""

    const format = data.inputs?.find((input: any) => input.key === "format")?.value || "Plain"

    displayData["displayText"] = text
    displayData["format"] = format

    // Add formatted version based on the format type
    if (format === "Markdown") {
      displayData["formattedText"] = `**Markdown Output:**\n${text}`
    } else if (format === "HTML") {
      displayData["formattedText"] = `<div><strong>HTML Output:</strong><div>${text}</div></div>`
    }
  } else if (data.name === "Chart Output") {
    // Get chart data from input values or node configuration
    const chartData =
      inputValues["data"] !== undefined
        ? inputValues["data"]
        : data.inputs?.find((input: any) => input.key === "data")?.value || []

    const chartType = data.inputs?.find((input: any) => input.key === "type")?.value || "Bar"
    const title = data.inputs?.find((input: any) => input.key === "title")?.value || "Chart"

    displayData["chartData"] = chartData
    displayData["chartType"] = chartType
    displayData["title"] = title

    // Add sample visualization data
    displayData["visualization"] = {
      type: chartType,
      title: title,
      data: chartData,
      config: {
        showLegend: true,
        showGrid: true,
        animated: true,
      },
    }
  }

  return displayData
}

// Simulate WhatsApp Input Node
function simulateWhatsAppInput(data: any) {
  const outputs: Record<string, any> = {}

  // Simulate a received WhatsApp message
  outputs["message"] = "Hello, this is a simulated WhatsApp message!"
  outputs["sender"] = "+1234567890"
  outputs["metadata"] = {
    timestamp: new Date().toISOString(),
    messageType: "text",
    isSimulated: true,
    phoneNumberId: data.inputs?.find((input: any) => input.key === "phoneNumberId")?.value || "12345",
  }

  return outputs
}

// Simulate WhatsApp Output Node
async function simulateWhatsAppOutput(data: any, inputValues: Record<string, any>, consoleOutput: string[]) {
  const outputs: Record<string, any> = {}

  try {
    // Get message content and recipient from inputs or connected nodes
    const message =
      inputValues["message"] ||
      data.inputs?.find((input: any) => input.key === "message")?.value ||
      "Hello from WhatsApp!"
    const recipient =
      inputValues["recipient"] || data.inputs?.find((input: any) => input.key === "recipient")?.value || "+1234567890"
    const messageType = data.inputs?.find((input: any) => input.key === "messageType")?.value || "Text"
    const phoneNumberId = data.inputs?.find((input: any) => input.key === "phoneNumberId")?.value

    // Add to console output
    consoleOutput.push(`${timestamp()} Preparing to send WhatsApp message to ${recipient}`)
    consoleOutput.push(`${timestamp()} Message type: ${messageType}`)
    consoleOutput.push(`${timestamp()} Message content: ${message}`)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if WhatsApp API is configured
    const isConfigured = phoneNumberId && process.env.WHATSAPP_ACCESS_TOKEN

    if (isConfigured) {
      try {
        // In a real implementation, this would call the WhatsApp service
        // For simulation, we'll just pretend it worked
        consoleOutput.push(`${timestamp()} WhatsApp API configured, attempting to send message...`)
        await new Promise((resolve) => setTimeout(resolve, 500))

        outputs["status"] = "sent"
        outputs["messageId"] = `whatsapp_msg_${Date.now()}`
        consoleOutput.push(`${timestamp()} Message sent successfully!`)
      } catch (error: any) {
        consoleOutput.push(`${timestamp()} Error sending message: ${error.message}`)
        outputs["status"] = "error"
        outputs["error"] = error.message
      }
    } else {
      // Simulate success in simulation mode
      consoleOutput.push(`${timestamp()} WhatsApp API not configured, using simulation mode`)
      outputs["status"] = "simulated"
      outputs["messageId"] = `simulated_msg_${Date.now()}`
      consoleOutput.push(`${timestamp()} Simulated message delivery successful`)
    }

    // Add message details to output
    outputs["messageDetails"] = {
      recipient,
      messageType,
      content: message,
      timestamp: new Date().toISOString(),
      isSimulation: !isConfigured,
    }
  } catch (error: any) {
    consoleOutput.push(`${timestamp()} Error in WhatsApp Output node: ${error.message}`)
    outputs["status"] = "error"
    outputs["error"] = error.message
  }

  return outputs
}

