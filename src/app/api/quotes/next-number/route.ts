import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const now = new Date()
        const month = (now.getMonth() + 1).toString().padStart(2, '0')

        // Count quotes created this month to generate the next number
        // In a real high-concurrency app, this should be an atomic counter, 
        // but for this ERP scale, a monthly count is sufficient.
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const count = await prisma.quote.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        })

        const nextNumber = (count + 1).toString().padStart(3, '0')
        const quoteNumber = `PROP-${month}-${nextNumber}`

        return NextResponse.json({ quoteNumber })
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate quote number" }, { status: 500 })
    }
}
