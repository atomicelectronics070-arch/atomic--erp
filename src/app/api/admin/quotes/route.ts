import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const quotes = await prisma.quote.findMany({
            include: { salesperson: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ quotes })
    } catch (error) {
        console.error("Fetch Admin Quotes Error:", error)
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { id, status } = body

        if (!id || !status) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
        }

        const quote = await prisma.quote.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json({ success: true, quote })
    } catch (error) {
        console.error("Update Admin Quote Error:", error)
        return NextResponse.json({ error: "Failed to update quote" }, { status: 500 })
    }
}
