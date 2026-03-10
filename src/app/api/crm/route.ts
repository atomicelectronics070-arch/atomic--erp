import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(clients)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
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
                salespersonId: body.salespersonId || "system", // Fallback if no salesperson
                campaignsSent: body.campaignsSent || 0,
                purchaseCount: body.purchaseCount || 0
            }
        })
        return NextResponse.json(client)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
    }
}
