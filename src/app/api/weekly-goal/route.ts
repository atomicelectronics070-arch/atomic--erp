import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const goal = await prisma.weeklyGoal.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(goal || { amount: 0, description: "No hay meta establecida para esta semana." })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch goal" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { amount, description } = await req.json()

        // Deactivate previous active goals
        await prisma.weeklyGoal.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        })

        const newGoal = await prisma.weeklyGoal.create({
            data: {
                amount: parseFloat(amount),
                description,
                isActive: true
            }
        })

        return NextResponse.json(newGoal)
    } catch (error) {
        console.error("Goal Update Error:", error)
        return NextResponse.json({ error: "Failed to set goal" }, { status: 500 })
    }
}
