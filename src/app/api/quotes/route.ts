import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
    try {
        const quotes = await prisma.quote.findMany({
            include: { client: true, salesperson: true },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(quotes)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Find or create a generic client if needed (for simplicity in this step)
        let client = await prisma.client.findFirst({ where: { name: "CLIENTE GENÉRICO" } })
        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: "CLIENTE GENÉRICO",
                    salespersonId: "system",
                }
            })
        }

        const quote = await prisma.quote.create({
            data: {
                quoteNumber: body.quoteNumber,
                clientId: client.id,
                salespersonId: "system",
                subtotal: parseFloat(body.subtotal),
                tax: parseFloat(body.tax),
                discount: parseFloat(body.discount || 0),
                total: parseFloat(body.total),
                warrantyComments: body.warrantyComments,
                deliveryAddress: body.deliveryAddress,
                status: "APPROVED"
            }
        })
        return NextResponse.json(quote)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create quote" }, { status: 500 })
    }
}
