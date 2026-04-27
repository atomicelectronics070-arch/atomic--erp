import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { cycleId, fixedPay, commissionPct } = body

        if (!cycleId) {
            return NextResponse.json({ error: "ID de ciclo requerido" }, { status: 400 })
        }

        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(startDate.getDate() + 30)

        const updatedCycle = await prisma.workCycle.update({
            where: {
                id: cycleId
            },
            data: {
                isActive: true,
                fixedPay: parseFloat(fixedPay) || 0,
                commissionPct: parseFloat(commissionPct) || 0,
                startDate,
                endDate
            }
        })

        return NextResponse.json({ 
            success: true, 
            message: "Ciclo activado satisfactoriamente.",
            cycle: updatedCycle 
        })

    } catch (error) {
        console.error("Contract approve error:", error)
        return NextResponse.json({ error: "No se pudo activar el ciclo" }, { status: 500 })
    }
}


