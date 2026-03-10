import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const history = await prisma.extractionHistory.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        // Map to include a friendly name or truncated domain as "provider"
        const formattedHistory = history.map(h => ({
            id: h.id,
            provider: h.domain.split('.')[0].toUpperCase(),
            url: h.url,
            date: h.createdAt.toISOString().replace('T', ' ').substring(0, 16),
            items: h.itemCount,
            status: h.status.toLowerCase()
        }))

        return NextResponse.json(formattedHistory)
    } catch (error) {
        return NextResponse.json({ error: "Error fetching history" }, { status: 500 })
    }
}
