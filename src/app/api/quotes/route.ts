import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() }
        })

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const isAdmin = user.role === "ADMIN" || user.role === "MANAGEMENT"

        const quotes = await prisma.quote.findMany({
            where: isAdmin ? {} : { salespersonId: user.id },
            include: isAdmin ? { salesperson: { select: { name: true, email: true } } } : undefined,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(quotes)
    } catch (error) {
        console.error("Fetch Quotes Error:", error)
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
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
        const { quoteNumber, globalQuoteNumber, clientName, clientEmail, subtotal, tax, discountPercent, total, items, deliveryAddress, warrantyComments, advisorName } = body

        // Find or create a client record to satisfy database relations
        let client = await prisma.client.findFirst({
            where: { email: clientEmail }
        })

        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: clientName || "Cliente Generador",
                    email: clientEmail,
                    salespersonId: salesperson.id,
                    source: "COTIZADOR_AUTO"
                }
            })
        }

        // Save Quote to database
        const quote = await prisma.quote.create({
            data: {
                quoteNumber,
                globalQuoteNumber,
                clientId: client.id,
                salespersonId: salesperson.id,
                subtotal,
                tax,
                discount: discountPercent > 0 ? (subtotal * (discountPercent / 100)) : 0,
                total,

                // UI Preservation
                clientName,
                discountPercent,
                deliveryAddress,
                warrantyComments,
                advisorName,
                itemsData: JSON.stringify(items),

                status: "SAVED"
            }
        })

        return NextResponse.json({ success: true, quote })
    } catch (error: any) {
        console.error("Save Quote Error:", error)
        return NextResponse.json({ error: "Failed to save quote", details: error.message }, { status: 500 })
    }
}
