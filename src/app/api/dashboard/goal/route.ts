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

        const goalSetting = await prisma.systemSetting.findUnique({
            where: { key: "WEEKLY_GOAL" }
        })

        return NextResponse.json({ goal: goalSetting ? parseFloat(goalSetting.value) : 0 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch weekly goal" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { goal } = body

        if (goal === undefined || isNaN(Number(goal))) {
            return NextResponse.json({ error: "Invalid goal value" }, { status: 400 })
        }

        // Update or create the setting
        await prisma.systemSetting.upsert({
            where: { key: "WEEKLY_GOAL" },
            update: { value: String(goal) },
            create: { key: "WEEKLY_GOAL", value: String(goal), description: "Objetivo de Ventas Semanal (USD)" }
        })

        // Notify all Active users
        const activeUsers = await prisma.user.findMany({
            where: { status: "ACTIVE" },
            select: { id: true }
        })

        if (activeUsers.length > 0) {
            await prisma.notification.createMany({
                data: activeUsers.map(u => ({
                    userId: u.id,
                    title: "Nuevo Objetivo Semanal",
                    message: `El objetivo de esta semana se ha fijado en $${Number(goal).toLocaleString()}`,
                    type: "GOAL"
                }))
            })
        }

        return NextResponse.json({ success: true, goal })
    } catch (error) {
        console.error("Update goal error:", error)
        return NextResponse.json({ error: "Failed to update weekly goal" }, { status: 500 })
    }
}
