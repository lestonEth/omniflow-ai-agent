import { type NextRequest, NextResponse } from "next/server"
import { telegramService } from "@/lib/services/telegram-service"

// Store active flows that have Telegram nodes
const activeTelegramFlows: Record<string, any> = {}

// Register a flow with a Telegram node
export function registerTelegramFlow(flowId: string, nodeId: string, config: any) {
    activeTelegramFlows[flowId] = {
        nodeId,
        config,
        lastUpdated: new Date().toISOString(),
    }

    console.log(`Registered Telegram flow: ${ flowId }, node: ${ nodeId }`)
    return true
}

// Unregister a flow
export function unregisterTelegramFlow(flowId: string) {
    if (activeTelegramFlows[flowId]) {
        delete activeTelegramFlows[flowId]
        console.log(`Unregistered Telegram flow: ${ flowId }`)
        return true
    }
    return false
}

export async function POST(req: NextRequest) {
    try {
        const update = await req.json()

        // Process the update from Telegram
        const processedUpdate = telegramService.processUpdate(update)

        if (!processedUpdate) {
            return NextResponse.json({ status: "error", message: "Invalid update" }, { status: 400 })
        }

        // Log the received message
        console.log("Received Telegram update:", processedUpdate)

        // Store the message in the database (in a real implementation)
        // For now, we'll just process it directly

        // Check if this is a message
        if (processedUpdate.type === "message" && processedUpdate.text) {
            const chatId = processedUpdate.chatId
            const text = processedUpdate.text

            // Parse command
            let command = null
            if (text.startsWith("/")) {
                const parts = text.split(" ")
                command = {
                    action: parts[0].substring(1), // Remove the / prefix
                    params: parts.slice(1),
                }
            }

            // Find flows that should receive this message
            const matchingFlows = Object.entries(activeTelegramFlows).filter(([_, flow]) => {
                return flow.config.chatId === String(chatId)
            })

            if (matchingFlows.length > 0) {
                // Trigger the flow execution with this message
                for (const [flowId, flow] of matchingFlows) {
                    // In a real implementation, you would trigger the flow execution
                    // For now, we'll just log it
                    console.log(`Triggering flow ${ flowId } with message: ${ text }`)

                    // You would call your flow execution service here
                    // flowExecutionService.triggerNode(flow.nodeId, { message: text, command })
                }

                // Send acknowledgment
                if (command) {
                    await telegramService.sendMessage(String(chatId), `Processing command: ${ command.action }`)
                }
            } else {
                // No matching flows found
                console.log(`No matching flows found for chat ID: ${ chatId }`)
            }
        }

        return NextResponse.json({ status: "ok" })
    } catch (error) {
        console.error("Error processing Telegram webhook:", error)
        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 })
    }
}

// This is used for Telegram webhook verification
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams

    // Check if this is a webhook verification request
    if (searchParams.has("setup") && searchParams.get("setup") === "webhook") {
        const botTokenParam = searchParams.get("token")
        const baseUrlOrigin = req.next.url.origin

        if (botTokenParam) {
            // Create a temporary service with the provided token
            const tempService = new telegramService.constructor(botTokenParam)

            // Set the webhook URL
            const webhookUrl = `${ baseUrlOrigin }/api/telegram/webhook`
            const result = await tempService.setWebhook(webhookUrl)

            if (result.ok) {
                return NextResponse.json({
                    status: "success",
                    message: "Webhook set successfully",
                    webhook_url: webhookUrl,
                })
            } else {
                return NextResponse.json(
                    {
                        status: "error",
                        message: result.description || "Failed to set webhook",
                    },
                    { status: 400 },
                )
            }
        }
    }

    // Standard verification for Telegram webhook
    const mode = searchParams.get("hub.mode")
    const token = searchParams.get("hub.verify_token")
    const challenge = searchParams.get("hub.challenge")

    // Verify the webhook
    const verifyToken = process.env.TELEGRAM_VERIFY_TOKEN || "your_verification_token"

    if (mode && token) {
        if (mode === "subscribe" && token === verifyToken) {
            return new Response(challenge || "", {
                status: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
            })
        }
    }

    return new Response("Verification failed", { status: 403 })
}

