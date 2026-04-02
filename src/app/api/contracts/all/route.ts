import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const pendingCycles = await prisma.workCycle.findMany({
            where: {
                isActive: false
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ cycles: pendingCycles })

    } catch (error) {
        console.error("Contract all error:", error)
        return NextResponse.json({ error: "No se pudieron recuperar las solicitudes pendientes" }, { status: 500 })
    }
}
