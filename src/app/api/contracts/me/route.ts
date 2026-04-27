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

        // Recuperar el ciclo más reciente del usuario
        const cycle = await prisma.workCycle.findFirst({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!cycle) {
            return NextResponse.json({ cycle: null })
        }

        return NextResponse.json({ cycle })

    } catch (error) {
        console.error("Contract me error:", error)
        return NextResponse.json({ error: "No se pudo recuperar el ciclo del usuario" }, { status: 500 })
    }
}


