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

        const clients = await prisma.client.findMany({
            include: { salesperson: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(clients)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const salesperson = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() }
        })

        if (!salesperson) {
            return NextResponse.json({ error: "Salesperson not found in DB" }, { status: 404 })
        }

        const body = await req.json()
        const nameValue = body.name || [body.firstName, body.lastName].filter(Boolean).join(" ") || "Sin Nombre"

        const client = await prisma.client.create({
            data: {
                name: nameValue,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                requirement: body.requirement,
                city: body.city,
                status: body.status || "PROSPECTO",
                source: body.source || "MANUAL",
                salespersonId: salesperson.id,
                campaignsSent: body.campaignsSent || 0,
                purchaseCount: body.purchaseCount || 0
            }
        })
        return NextResponse.json(client)
    } catch (error: any) {
        console.error("CRM POST Error:", error)
        return NextResponse.json({ error: "Failed to create client", details: error.message }, { status: 500 })
    }
}


