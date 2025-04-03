import { type NextRequest, NextResponse } from "next/server"
import { backgroundService } from "@/lib/services/background-service"

// This endpoint can be called by a cron service (like Vercel Cron) to trigger background processing
export async function GET(req: NextRequest) {
    try {
        // Verify authorization (use a simple API key mechanism)
        const apiKey = req.headers.get("x-api-key")

        if (apiKey !== process.env.CRON_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Manually trigger job processing
        await backgroundService.processJobs()

        return NextResponse.json({ status: "ok" })
    } catch (error) {
        console.error("Error in cron handler:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

