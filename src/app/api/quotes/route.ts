import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

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
        const { 
            quoteNumber, globalQuoteNumber, clientName, clientEmail, clientPhone, city,
            subtotal, tax, discountPercent, total, items, 
            deliveryAddress, warrantyComments, advisorName, status, quoteSubject 
        } = body

        // Find or create a client record to satisfy database relations
        // Search by email OR phone to avoid duplicates
        let client = await prisma.client.findFirst({
            where: {
                OR: [
                    { email: clientEmail && clientEmail !== "no@especifica.com" ? clientEmail : undefined },
                    { phone: clientPhone ? clientPhone : undefined }
                ].filter(Boolean) as any
            }
        })

        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: clientName || "Cliente Generador",
                    firstName: clientName.split(" ")[0],
                    lastName: clientName.split(" ").slice(1).join(" "),
                    email: clientEmail,
                    phone: clientPhone,
                    salespersonId: salesperson.id,
                    source: "COTIZADOR_AUTO",
                    city: city || "",
                    requirement: quoteSubject || "Nueva Cotización",
                    status: "COTIZANDO"
                }
            })
        } else {
            // Update existing client with new activity
            await prisma.client.update({
                where: { id: client.id },
                data: {
                    status: "COTIZANDO",
                    requirement: `${client.requirement}\n---\nRef: ${quoteSubject || quoteNumber}`,
                    updatedAt: new Date()
                }
            })
        }

        // Save Quote to database
        const quote = await (prisma as any).quote.create({
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

                status: status || "SAVED"
            }
        })

        // AUTO-REGISTER IN FINANCE IF CLOSED
        if (status === "CERRADO") {
            try {
                const nextTrx = await (prisma as any).transaction.count() + 1
                await (prisma as any).transaction.create({
                    data: {
                        trxId: `TRX-${nextTrx.toString().padStart(3, '0')}`,
                        client: clientName,
                        amount: total, // PVP Inicial
                        pvp: total,
                        status: "PENDIENTE", // Requiere aprobación en finanzas
                        type: "Venta Directa (Cerrada)",
                        quoteNumber: quoteNumber,
                        salespersonId: salesperson.id
                    }
                })
            } catch (finErr) {
                console.error("Finance Auto-Registration failed:", finErr)
            }
        }

        return NextResponse.json({ success: true, quote })
    } catch (error: any) {
        console.error("Save Quote Error:", error)
        return NextResponse.json({ error: "Failed to save quote", details: error.message }, { status: 500 })
    }
}


