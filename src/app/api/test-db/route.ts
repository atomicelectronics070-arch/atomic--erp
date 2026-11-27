import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    const session = await getServerSession(authOptions)
    const role = String((session?.user as any)?.role || "").toUpperCase()
    if (!session || (!role.includes("ADMIN") && !role.includes("MANAGEMENT"))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const counts = await Promise.all([
            prisma.user.count().catch(() => -1),
            prisma.product.count().catch(() => -1),
            prisma.quote.count().catch(() => -1),
            prisma.transaction.count().catch(() => -1),
            prisma.paymentTicket.count().catch(() => -1),
            prisma.internalMessage.count().catch(() => -1),
            (prisma as any).workCycle.count().catch(() => -1)
        ])

        return NextResponse.json({
            status: "connected",
            counts: {
                users: counts[0],
                products: counts[1],
                quotes: counts[2],
                transactions: counts[3],
                paymentTickets: counts[4],
                internalMessages: counts[5],
                workCycles: counts[6]
            }
        })
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 })
    }
}
