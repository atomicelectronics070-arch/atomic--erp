import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        const [products, lastQuote, history, clients] = await Promise.all([
            prisma.product.findMany({
                where: { isDeleted: false },
                select: { id: true, name: true, price: true, sku: true, description: true, stock: true, images: true },
                orderBy: [{ stock: "desc" }, { updatedAt: "desc" }],
                take: 30
            }),
            prisma.quote.findFirst({
                orderBy: { createdAt: "desc" },
                select: { quoteNumber: true }
            }),
            session?.user
                ? prisma.quote.findMany({
                      orderBy: { createdAt: "desc" },
                      take: 20
                  })
                : Promise.resolve([]),
            session?.user
                ? prisma.client.findMany({
                      orderBy: { name: "asc" },
                      select: { id: true, name: true, city: true, phone: true, email: true, cedula: true }
                  })
                : Promise.resolve([])
        ])

        let nextNumber = "PROP-00-001"
        if (lastQuote?.quoteNumber) {
            const match = lastQuote.quoteNumber.match(/PROP-(\d+)-(\d+)/)
            if (match) {
                const sequence = parseInt(match[2], 10) + 1
                nextNumber = `PROP-00-${sequence.toString().padStart(3, "0")}`
            }
        }

        return NextResponse.json({
            products,
            history,
            clients,
            nextNumber,
            session
        })
    } catch (error) {
        console.error("GET /api/quotes/bootstrap error:", error)
        return NextResponse.json({ error: "Error inicializando cotizador" }, { status: 500 })
    }
}
