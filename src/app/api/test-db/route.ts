import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const counts = await Promise.all([
            prisma.user.count().catch(() => -1),
            prisma.product.count().catch(() => -1),
            prisma.quote.count().catch(() => -1),
            prisma.transaction.count().catch(() => -1),
            (prisma as any).workCycle.count().catch(() => -1)
        ])

        return NextResponse.json({
            status: "connected",
            database: process.env.DATABASE_URL?.split("@")[1].split("/")[0] || "unknown",
            counts: {
                users: counts[0],
                products: counts[1],
                quotes: counts[2],
                transactions: counts[3],
                workCycles: counts[4]
            }
        })
    } catch (error: any) {
        return NextResponse.json({ 
            status: "error", 
            message: error.message,
            db_host: process.env.DATABASE_URL?.split("@")[1].split("/")[0] || "unknown"
        }, { status: 500 })
    }
}
