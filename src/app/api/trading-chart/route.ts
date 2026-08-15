export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: fetch the current active cycle data
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get active cycle from SystemSetting
        const cycleSetting = await prisma.systemSetting.findUnique({
            where: { key: "ACTIVE_TRADING_CYCLE" }
        })

        if (!cycleSetting) {
            return NextResponse.json({ cycle: null, dataPoints: [] })
        }

        const cycle = JSON.parse(cycleSetting.value)
        const cycleStart = new Date(cycle.startedAt)
        const now = new Date()
        const daysPassed = Math.floor((now.getTime() - cycleStart.getTime()) / 86400000)

        // Count quotes created since cycle start
        const quotes = await prisma.quote.count({
            where: { createdAt: { gte: cycleStart } }
        })

        // Count clients (contacts) created since cycle start
        const contacts = await prisma.client.count({
            where: { createdAt: { gte: cycleStart } }
        })

        // Count transactions (sales) since cycle start
        const sales = await prisma.transaction.count({
            where: { createdAt: { gte: cycleStart } }
        })

        // Count payment tickets issued since cycle start (secret MK)
        const payments = await prisma.paymentTicket.count({
            where: { createdAt: { gte: cycleStart } }
        })

        // Count attendance (days with group opening) since cycle start
        const attendance = await prisma.coordinationDaily.count({
            where: { date: { gte: cycleStart }, openTime: { not: null } }
        })

        // Get daily data points for the chart
        const dataPoints = []
        for (let d = 0; d <= Math.min(daysPassed, 29); d++) {
            const dayStart = new Date(cycleStart)
            dayStart.setDate(dayStart.getDate() + d)
            const dayEnd = new Date(dayStart)
            dayEnd.setDate(dayEnd.getDate() + 1)

            const [dQuotes, dContacts, dSales, dPayments, dAttendance] = await Promise.all([
                prisma.quote.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
                prisma.client.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
                prisma.transaction.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
                prisma.paymentTicket.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
                prisma.coordinationDaily.count({ where: { date: { gte: dayStart, lt: dayEnd }, openTime: { not: null } } })
            ])

            dataPoints.push({
                day: d + 1,
                date: dayStart.toISOString().split("T")[0],
                quotes: dQuotes,
                contacts: dContacts,
                sales: dSales,
                mk: dPayments,
                attendance: dAttendance
            })
        }

        return NextResponse.json({
            cycle: {
                ...cycle,
                daysPassed: daysPassed + 1,
                totals: { quotes, contacts, sales, payments, attendance }
            },
            dataPoints
        })
    } catch (err) {
        console.error("Trading chart API error:", err)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}

// POST: admin resets cycle or saves historical cycle
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const requester = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true, name: true }
        })
        if (requester?.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const { action, cycleData } = body

        if (action === "reset") {
            // Save historical if there was a previous cycle
            const prev = await prisma.systemSetting.findUnique({ where: { key: "ACTIVE_TRADING_CYCLE" } })
            if (prev) {
                const prevHistory = await prisma.systemSetting.findUnique({ where: { key: "TRADING_CYCLE_HISTORY" } })
                const history = prevHistory ? JSON.parse(prevHistory.value) : []
                history.push({ ...JSON.parse(prev.value), archivedAt: new Date().toISOString() })
                await prisma.systemSetting.upsert({
                    where: { key: "TRADING_CYCLE_HISTORY" },
                    update: { value: JSON.stringify(history) },
                    create: { key: "TRADING_CYCLE_HISTORY", value: JSON.stringify(history), description: "Trading cycles history" }
                })
            }

            // Create new cycle
            const newCycle = {
                startedAt: new Date().toISOString(),
                startedBy: requester.name,
                cycleId: Date.now()
            }
            await prisma.systemSetting.upsert({
                where: { key: "ACTIVE_TRADING_CYCLE" },
                update: { value: JSON.stringify(newCycle) },
                create: { key: "ACTIVE_TRADING_CYCLE", value: JSON.stringify(newCycle), description: "Active trading performance cycle" }
            })

            return NextResponse.json({ success: true, cycle: newCycle })
        }

        if (action === "save_and_post") {
            // Generate the social post copy using the cycle summary
            const { totals, startedAt } = cycleData
            const startDate = new Date(startedAt)
            const endDate = new Date()
            const days = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1

            const postContent = `🚀 **RESUMEN DE JORNADA ATOMIC INDUSTRIES**

📅 Ciclo de ${days} días | ${startDate.toLocaleDateString("es-ES", { day: "numeric", month: "long" })} — ${endDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}

📊 **RESULTADOS OBTENIDOS:**
• 💬 Cotizaciones emitidas: **${totals.quotes}**
• 🤝 Ventas concretadas: **${totals.sales}**
• 📍 Nuevos contactos registrados: **${totals.contacts}**
• 📈 Crecimiento de la semana: ${totals.sales > 0 ? "+" : ""}${((totals.sales / (totals.quotes || 1)) * 100).toFixed(0)}% conversión

🔥 Cada cifra refleja el esfuerzo de nuestro equipo. ¡Seguimos adelante!

#AtomicIndustries #Ventas #ResultadosReales #EquipoAtómica #CierreSemanalo`

            return NextResponse.json({ success: true, postContent })
        }

        if (action === "cancel") {
            // Delete the active cycle WITHOUT saving to history
            await prisma.systemSetting.deleteMany({
                where: { key: "ACTIVE_TRADING_CYCLE" }
            })
            return NextResponse.json({ success: true, message: "Ciclo cancelado y descartado" })
        }

        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    } catch (err) {
        console.error("Trading chart action error:", err)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
