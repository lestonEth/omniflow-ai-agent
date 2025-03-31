// Crypto node simulators

// Simulate crypto wallet connection
export function simulateCryptoWallet(data: any) {
    const outputs: Record<string, any> = {}

    // Get connection type and wallet details
    const connectionType = data.inputs?.find((input: any) => input.key === "connectionType")?.value || "Wallet Address"
    const privateKey = data.inputs?.find((input: any) => input.key === "privateKey")?.value || ""
    const walletAddress = data.inputs?.find((input: any) => input.key === "walletAddress")?.value || ""
    const network = data.inputs?.find((input: any) => input.key === "network")?.value || "Ethereum"

    // Determine if we can connect
    const canConnect = connectionType === "Private Key" ? !!privateKey : !!walletAddress

    if (canConnect) {
        // Generate a simulated wallet address if not provided
        const address = walletAddress || generateRandomAddress(network)

        // Generate random balance based on network
        const balance = generateRandomBalance(network)
        const currency = getCurrencyForNetwork(network)

        outputs["connected"] = true
        outputs["walletInfo"] = {
            address,
            network,
            currency,
            connectionType,
            lastUpdated: new Date().toISOString(),
        }
        outputs["balance"] = balance
    } else {
        outputs["connected"] = false
        outputs["walletInfo"] = null
        outputs["balance"] = 0
    }

    return outputs
}

// Simulate crypto trade execution
export function simulateCryptoTrade(data: any, inputValues: Record<string, any>) {
    const outputs: Record<string, any> = {}

    // Get wallet info from input or node configuration
    const walletInfo = inputValues["walletInfo"] || data.inputs?.find((input: any) => input.key === "walletInfo")?.value

    // Get trade details
    const action = data.inputs?.find((input: any) => input.key === "action")?.value || "Buy"
    const token = data.inputs?.find((input: any) => input.key === "token")?.value || "ETH"
    const amount = data.inputs?.find((input: any) => input.key === "amount")?.value || 0.1
    const targetToken = data.inputs?.find((input: any) => input.key === "targetToken")?.value || "USDT"
    const priceLimit = data.inputs?.find((input: any) => input.key === "priceLimit")?.value || 0

    // Check if wallet is connected
    if (!walletInfo) {
        outputs["status"] = "failed"
        outputs["transactionId"] = null
        outputs["details"] = {
            error: "Wallet not connected",
            timestamp: new Date().toISOString(),
        }
        return outputs
    }

    // Generate random price
    const price = generateRandomPrice(token)

    // Check if price limit is satisfied
    const isPriceLimitSatisfied =
        priceLimit === 0 || (action === "Buy" && price <= priceLimit) || (action === "Sell" && price >= priceLimit)

    if (!isPriceLimitSatisfied) {
        outputs["status"] = "failed"
        outputs["transactionId"] = null
        outputs["details"] = {
            error: `Price limit not satisfied. Current price: $${ price }, Limit: $${ priceLimit }`,
            timestamp: new Date().toISOString(),
        }
        return outputs
    }

    // Simulate successful transaction
    outputs["status"] = "completed"
    outputs["transactionId"] = generateRandomTxId(walletInfo.network)
    outputs["details"] = {
        action,
        token,
        amount,
        price,
        total: price * amount,
        timestamp: new Date().toISOString(),
        fee: (price * amount * 0.001).toFixed(4),
        wallet: walletInfo.address,
    }

    // Add swap details if applicable
    if (action === "Swap") {
        const targetPrice = generateRandomPrice(targetToken)
        const targetAmount = (amount * price) / targetPrice
        outputs["details"] = {
            ...outputs["details"],
            targetToken,
            targetAmount,
            targetPrice,
            exchangeRate: `1 ${ token } = ${ (price / targetPrice).toFixed(6) } ${ targetToken }`,
        }
    }

    return outputs
}

// Simulate AI trading bot
export function simulateTradingBot(data: any, inputValues: Record<string, any>) {
    const outputs: Record<string, any> = {}

    // Get wallet info from input or node configuration
    const walletInfo = inputValues["walletInfo"] || data.inputs?.find((input: any) => input.key === "walletInfo")?.value

    // Get trading parameters
    const strategy = data.inputs?.find((input: any) => input.key === "strategy")?.value || "Balanced"
    const tokens = data.inputs?.find((input: any) => input.key === "tokens")?.value || ["ETH", "BTC"]
    const budget = data.inputs?.find((input: any) => input.key === "budget")?.value || 1000
    const timeframe = data.inputs?.find((input: any) => input.key === "timeframe")?.value || "4h"

    // Check if wallet is connected
    if (!walletInfo) {
        outputs["recommendation"] = {
            action: "none",
            token: "N/A",
            reason: "Wallet not connected. Please connect a wallet first.",
        }
        outputs["analysis"] = null
        outputs["performance"] = null
        return outputs
    }

    // Generate market analysis based on tokens
    const marketAnalysis = tokens.map((token: any) => ({
        token,
        price: generateRandomPrice(token),
        change24h: (Math.random() * 20 - 10).toFixed(2), // -10% to +10%
        volume: Math.floor(Math.random() * 1000000000),
        marketCap: Math.floor(Math.random() * 100000000000),
        sentiment: ["Bearish", "Neutral", "Bullish"][Math.floor(Math.random() * 3)],
    }))

    // Generate trading recommendation based on strategy
    let recommendedAction: string
    let recommendedToken: string
    let reason: string

    // Different strategies have different risk profiles
    if (strategy === "Conservative") {
        // Conservative strategy prefers stable coins or holding
        const stableTokens = marketAnalysis.filter((t: any) => Math.abs(Number.parseFloat(t.change24h)) < 3)
        if (stableTokens.length > 0) {
            const selectedToken = stableTokens[Math.floor(Math.random() * stableTokens.length)]
            recommendedAction = Number.parseFloat(selectedToken.change24h) > 0 ? "buy" : "hold"
            recommendedToken = selectedToken.token
            reason = `${ selectedToken.token } shows stable performance with ${ selectedToken.change24h }% change in 24h. ${ selectedToken.sentiment } sentiment detected.`
        } else {
            recommendedAction = "hold"
            recommendedToken = "USDT"
            reason = "Market volatility detected. Recommend holding stable assets."
        }
    } else if (strategy === "Aggressive") {
        // Aggressive strategy looks for high volatility
        const volatileTokens = marketAnalysis.filter((t: any) => Math.abs(Number.parseFloat(t.change24h)) > 5)
        if (volatileTokens.length > 0) {
            const selectedToken = volatileTokens[Math.floor(Math.random() * volatileTokens.length)]
            recommendedAction = Number.parseFloat(selectedToken.change24h) > 0 ? "buy" : "sell"
            recommendedToken = selectedToken.token
            reason = `${ selectedToken.token } shows high volatility with ${ selectedToken.change24h }% change in 24h. Opportunity for ${ recommendedAction } based on ${ selectedToken.sentiment } sentiment.`
        } else {
            recommendedAction = "buy"
            recommendedToken = marketAnalysis[0].token
            reason = "No high volatility detected. Recommend cautious buying based on market trends."
        }
    } else {
        // Balanced strategy
        const selectedToken = marketAnalysis[Math.floor(Math.random() * marketAnalysis.length)]
        recommendedAction =
            Number.parseFloat(selectedToken.change24h) > 2
                ? "buy"
                : Number.parseFloat(selectedToken.change24h) < -2
                    ? "sell"
                    : "hold"
        recommendedToken = selectedToken.token
        reason = `${ selectedToken.token } shows ${ selectedToken.change24h }% change in 24h. ${ selectedToken.sentiment } market sentiment suggests ${ recommendedAction } action.`
    }

    // Generate simulated performance metrics
    const winRate = 50 + (Math.random() * 30 - 15) // 35% to 65%
    const profit =
        strategy === "Conservative"
            ? Math.random() * 15 - 5
            : // -5% to +10%
            strategy === "Aggressive"
                ? Math.random() * 40 - 20
                : // -20% to +20%
                Math.random() * 25 - 10 // -10% to +15%

    // Set outputs
    outputs["recommendation"] = {
        action: recommendedAction,
        token: recommendedToken,
        amount: (budget * 0.1).toFixed(2), // Recommend using 10% of budget
        price: marketAnalysis.find((t: any) => t.token === recommendedToken)?.price,
        reason,
    }

    outputs["analysis"] = {
        market: marketAnalysis,
        timeframe,
        timestamp: new Date().toISOString(),
    }

    outputs["performance"] = {
        winRate: winRate.toFixed(1),
        profit: profit.toFixed(2),
        tradesExecuted: Math.floor(Math.random() * 50) + 10,
        successfulTrades: Math.floor(Math.random() * 30) + 5,
        averageReturn: (profit / 10).toFixed(2),
    }

    return outputs
}

// Helper functions
function generateRandomAddress(network: string): string {
    const prefix = network === "Ethereum" || network === "Binance Smart Chain" || network === "Polygon" ? "0x" : ""
    const chars = "0123456789abcdef"
    let result = prefix

    // Generate random hex string
    for (let i = 0; i < (network === "Solana" ? 44 : 40); i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }

    return result
}

function generateRandomBalance(network: string): string {
    let base: number

    switch (network) {
        case "Ethereum":
            base = Math.random() * 10 // 0-10 ETH
            break
        case "Binance Smart Chain":
            base = Math.random() * 100 // 0-100 BNB
            break
        case "Polygon":
            base = Math.random() * 1000 // 0-1000 MATIC
            break
        case "Solana":
            base = Math.random() * 100 // 0-100 SOL
            break
        default:
            base = Math.random() * 10
    }

    return base.toFixed(4)
}

function getCurrencyForNetwork(network: string): string {
    switch (network) {
        case "Ethereum":
            return "ETH"
        case "Binance Smart Chain":
            return "BNB"
        case "Polygon":
            return "MATIC"
        case "Solana":
            return "SOL"
        default:
            return "ETH"
    }
}

function generateRandomTxId(network: string): string {
    const prefix = network === "Ethereum" || network === "Binance Smart Chain" || network === "Polygon" ? "0x" : ""
    const chars = "0123456789abcdef"
    let result = prefix

    // Generate random hex string
    for (let i = 0; i < 64; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }

    return result
}

function generateRandomPrice(token: string): number {
    switch (token.toUpperCase()) {
        case "BTC":
            return 30000 + Math.random() * 10000
        case "ETH":
            return 1800 + Math.random() * 400
        case "SOL":
            return 80 + Math.random() * 40
        case "BNB":
            return 200 + Math.random() * 100
        case "MATIC":
            return 0.5 + Math.random() * 0.5
        case "USDT":
        case "USDC":
            return 0.99 + Math.random() * 0.02
        default:
            return 10 + Math.random() * 90
    }
}

