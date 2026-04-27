import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() }
        })

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const now = new Date()
        const month = (now.getMonth() + 1).toString().padStart(2, '0')
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        // 1. Calculate User-Specific Quote Number
        const userCount = await prisma.quote.count({
            where: {
                salespersonId: user.id,
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        })

        // Generate a short deterministic prefix from the user's name
        const userPrefix = user.name ? user.name.split(" ")[0].toUpperCase().substring(0, 4) : "USR"
        const nextUserNumber = (userCount + 1).toString().padStart(3, '0')
        const quoteNumber = `${userPrefix}-${month}-${nextUserNumber}`

        // 2. Calculate Global Quote Number (Company-wide)
        const globalCount = await prisma.quote.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        })

        const nextGlobalNumber = (globalCount + 1).toString().padStart(3, '0')
        const globalQuoteNumber = `GLB-${month}-${nextGlobalNumber}`

        return NextResponse.json({
            quoteNumber,
            globalQuoteNumber
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate quote number" }, { status: 500 })
    }
}


