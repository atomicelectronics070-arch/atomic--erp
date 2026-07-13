import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const source = searchParams.get("source") || "LANDING_PROVEEDORES"

    try {
        // Contar leads totales registrados en la landing
        const [totalLeads, recentLeads, sourceBreakdown] = await Promise.all([
            prisma.client.count({
                where: { source: source as any }
            }),
            prisma.client.findMany({
                where: { source: source as any },
                orderBy: { createdAt: "desc" },
                take: 10,
                select: { id: true, name: true, email: true, phone: true, createdAt: true }
            }),
            prisma.client.groupBy({
                by: ["source"],
                where: { source: { in: ["LANDING_PROVEEDORES", "LANDING_INTERCOMUNICACION", "WEBSITE", "WHATSAPP", "REFERIDO"] } },
                _count: { id: true }
            })
        ])

        // Obtener visitas totales de la web desde systemSetting
        const [webVisits, dashboardVisits] = await Promise.all([
            prisma.systemSetting.findUnique({ where: { key: "visits_web" } }),
            prisma.systemSetting.findUnique({ where: { key: "visits_dashboard" } })
        ])

        return NextResponse.json({
            totalLeads,
            recentLeads,
            sourceBreakdown,
            webVisits: parseInt(webVisits?.value || "0"),
            dashboardVisits: parseInt(dashboardVisits?.value || "0"),
        })
    } catch (err) {
        console.error("[landing-stats] Error:", err)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

