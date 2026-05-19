import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const [
            usersByRole,
            totalQuotes,
            totalWebOrders,
            totalWAConversations,
            totalWAMessages,
            totalEnrollments,
            totalProducts,
            totalTransactions,
            totalClients,
            visitSettings
        ] = await Promise.all([
            prisma.user.groupBy({ by: ["role"], _count: { _all: true }, where: { isActive: true } }),
            prisma.quote.count(),
            prisma.webOrder.count(),
            prisma.wAConversation.count(),
            prisma.wAMessage.count(),
            prisma.courseEnrollment.count(),
            prisma.product.count({ where: { isDeleted: false } }),
            prisma.transaction.count(),
            prisma.client.count(),
            prisma.systemSetting.findMany({
                where: { key: { in: ["visits_dashboard", "visits_web", "visits_total"] } }
            })
        ])

        const visits: Record<string, number> = { visits_dashboard: 0, visits_web: 0, visits_total: 0 }
        for (const s of visitSettings) visits[s.key] = parseInt(s.value) || 0

        const roleMap: Record<string, number> = {}
        for (const r of usersByRole) roleMap[r.role] = r._count._all

        return NextResponse.json({
            visits,
            users: {
                total: Object.values(roleMap).reduce((a, b) => a + b, 0),
                byRole: roleMap
            },
            activity: {
                quotes: totalQuotes,
                webOrders: totalWebOrders,
                waConversations: totalWAConversations,
                waMessages: totalWAMessages,
                enrollments: totalEnrollments,
                products: totalProducts,
                transactions: totalTransactions,
                clients: totalClients
            }
        })
    } catch (error) {
        console.error("[SYSTEM_STATS]", error)
        return NextResponse.json({ error: "Error fetching stats" }, { status: 500 })
    }
}
