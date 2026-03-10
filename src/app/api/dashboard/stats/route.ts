import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id
        const role = session.user.role

        // Rango: mes actual
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

        // ── Cotizaciones (mes actual vs mes anterior) ──
        const quotesWhere = role === "ADMIN"
            ? {}
            : { salespersonId: userId }

        const [quotesThisMonth, quotesLastMonth, totalQuotes] = await Promise.all([
            prisma.quote.count({
                where: { ...quotesWhere, createdAt: { gte: startOfMonth } }
            }),
            prisma.quote.count({
                where: { ...quotesWhere, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
            }),
            prisma.quote.count({ where: quotesWhere }),
        ])

        // ── Transacciones / Ventas ──
        const txWhere = { status: "PAGADO" }

        const [txThisMonth, txLastMonth] = await Promise.all([
            prisma.transaction.aggregate({
                where: { ...txWhere, createdAt: { gte: startOfMonth } },
                _sum: { amount: true },
                _count: { id: true },
            }),
            prisma.transaction.aggregate({
                where: { ...txWhere, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
                _sum: { amount: true },
            }),
        ])

        const ventasThisMonth = txThisMonth._sum.amount ?? 0
        const ventasLastMonth = txLastMonth._sum.amount ?? 0

        // Comisiones: suma de commission en transactions del mes
        const comisionesThisMonth = await prisma.transaction.aggregate({
            where: { status: "PAGADO", createdAt: { gte: startOfMonth } },
            _sum: { commission: true },
        })

        // Pendientes de pago
        const pendingAmount = await prisma.transaction.aggregate({
            where: { status: "PENDIENTE" },
            _sum: { amount: true },
        })

        // ── Efectividad: cotizaciones → ventas ──
        // Cotizaciones con status ACCEPTED vs total
        const quotesAccepted = await prisma.quote.count({
            where: { ...quotesWhere, status: "ACCEPTED" }
        })
        const efectividad = totalQuotes > 0
            ? Math.round((quotesAccepted / totalQuotes) * 100)
            : 0

        // ── Datos para gráficas: últimas 4 semanas ──
        const weeklyData = []
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date()
            weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
            weekStart.setHours(0, 0, 0, 0)
            const weekEnd = new Date()
            weekEnd.setDate(weekEnd.getDate() - i * 7)
            weekEnd.setHours(23, 59, 59, 999)

            const [wVentas, wCotizaciones, wComisiones] = await Promise.all([
                prisma.transaction.aggregate({
                    where: { status: "PAGADO", createdAt: { gte: weekStart, lte: weekEnd } },
                    _sum: { amount: true },
                }),
                prisma.quote.count({
                    where: { ...quotesWhere, createdAt: { gte: weekStart, lte: weekEnd } }
                }),
                prisma.transaction.aggregate({
                    where: { status: "PAGADO", createdAt: { gte: weekStart, lte: weekEnd } },
                    _sum: { commission: true },
                }),
            ])

            weeklyData.push({
                name: `Sem ${4 - i}`,
                ventas: wVentas._sum.amount ?? 0,
                cotizaciones: wCotizaciones,
                comisiones: wComisiones._sum.commission ?? 0,
            })
        }

        // ── Tendencias ──
        const ventasDiff = ventasLastMonth > 0
            ? Math.round(((ventasThisMonth - ventasLastMonth) / ventasLastMonth) * 100)
            : 0
        const cotizacionesDiff = quotesLastMonth > 0
            ? quotesThisMonth - quotesLastMonth
            : quotesThisMonth

        return NextResponse.json({
            stats: {
                ventas: ventasThisMonth,
                cotizaciones: quotesThisMonth,
                comisiones: comisionesThisMonth._sum.commission ?? 0,
                efectividad,
                pendientesPago: pendingAmount._sum.amount ?? 0,
            },
            trends: {
                ventasPct: ventasDiff,
                cotizacionesDiff,
            },
            weeklyData,
        })

    } catch (error) {
        console.error("Dashboard stats error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
