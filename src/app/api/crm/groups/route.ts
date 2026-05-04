import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"

        // Fetch all clients and group them by category in memory for flexibility
        // or fetch unique categories first.
        
        const clients = await prisma.client.findMany({
            where: isAdmin ? {} : { salespersonId: session.user.id },
            include: {
                salesperson: { select: { name: true } }
            },
            orderBy: { updatedAt: 'desc' }
        })

        const grouped = clients.reduce((acc: any, client: any) => {
            const cat = client.category || "GENERAL"
            if (!acc[cat]) acc[cat] = []
            acc[cat].push(client)
            return acc
        }, {})

        return NextResponse.json(grouped)
    } catch (error) {
        console.error("Fetch CRM Groups Error:", error)
        return NextResponse.json({ error: "Failed to fetch CRM groups" }, { status: 500 })
    }
}
