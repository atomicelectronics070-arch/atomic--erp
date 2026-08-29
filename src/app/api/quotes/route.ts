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
            include: {
                salesperson: { select: { name: true, email: true } },
                client: { select: { name: true, phone: true, city: true, email: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 100
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
        let salesperson: any = null

        if (session && session.user?.email) {
            salesperson = await prisma.user.findUnique({
                where: { email: session.user.email.toLowerCase() }
            })
        }

        // Si no hay sesión (ej. emitido desde la matriz de precios o enlace público), asignar al Administrador Central
        if (!salesperson) {
            salesperson = await prisma.user.findFirst({
                where: { OR: [{ role: "ADMIN" }, { role: "MANAGEMENT" }] },
                orderBy: { createdAt: "asc" }
            })
            if (!salesperson) {
                salesperson = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } })
            }
        }

        if (!salesperson) {
            return NextResponse.json({ error: "No administrator user found to assign quote" }, { status: 500 })
        }

        const body = await req.json()
        const { 
            quoteNumber: rawQuoteNumber, globalQuoteNumber, clientName, clientEmail, clientPhone, city,
            subtotal, tax, taxAmount, discountPercent, discountAmount, total, items, 
            deliveryAddress, warrantyComments, advisorName, status, quoteSubject, specs 
        } = body

        // Normalizar número de cotización siempre a prefijo PROP
        let quoteNumber = rawQuoteNumber || `PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`
        if (quoteNumber.startsWith("COT-")) {
            quoteNumber = quoteNumber.replace(/^COT-/, "PROP-")
        } else if (!quoteNumber.startsWith("PROP-")) {
            quoteNumber = `PROP-${quoteNumber}`
        }

        // Si el quoteNumber ya existe en base de datos, evitar conflicto generando uno único
        const existingQuote = await prisma.quote.findUnique({
            where: { quoteNumber }
        })
        if (existingQuote) {
            quoteNumber = `PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`
        }

        const effectiveClientName = (clientName || "Cliente General").trim()
        const effectivePhone = (clientPhone || "").trim()
        const effectiveEmail = (clientEmail && clientEmail !== "no@especifica.com") ? clientEmail.trim() : null
        const effectiveCity = (city || deliveryAddress || "Quito / A Domicilio").trim()

        // Buscar o registrar cliente en CRM
        let client = await prisma.client.findFirst({
            where: {
                OR: [
                    { phone: effectivePhone ? effectivePhone : undefined },
                    { email: effectiveEmail ? effectiveEmail : undefined },
                    { name: effectiveClientName }
                ].filter(Boolean) as any
            }
        })

        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: effectiveClientName,
                    firstName: effectiveClientName.split(" ")[0],
                    lastName: effectiveClientName.split(" ").slice(1).join(" ") || "",
                    email: effectiveEmail,
                    phone: effectivePhone,
                    salespersonId: salesperson.id,
                    source: "COTIZADOR_UNIFICADO_PROP",
                    city: effectiveCity,
                    requirement: quoteSubject || specs || `Cotización ${quoteNumber}`,
                    status: "COTIZANDO"
                }
            })
        } else {
            await prisma.client.update({
                where: { id: client.id },
                data: {
                    status: "COTIZANDO",
                    requirement: `${client.requirement || ''}\n---\nRef: ${quoteSubject || quoteNumber}`,
                    updatedAt: new Date()
                }
            })
        }

        const finalSubtotal = Number(subtotal) || Number(total) || 0
        const finalTax = Number(taxAmount) || Number(tax) || 0
        const finalDiscount = Number(discountAmount) || (discountPercent > 0 ? (finalSubtotal * (discountPercent / 100)) : 0)
        const finalTotal = Number(total) || (finalSubtotal + finalTax - finalDiscount)

        // Guardar la cotización en el colector central Quote
        const quote = await prisma.quote.create({
            data: {
                quoteNumber,
                globalQuoteNumber,
                clientId: client.id,
                salespersonId: salesperson.id,
                subtotal: finalSubtotal,
                tax: finalTax,
                discount: finalDiscount,
                total: finalTotal,

                // Metadatos y detalles para renderizado exacto
                clientName: effectiveClientName,
                discountPercent: Number(discountPercent) || 0,
                deliveryAddress: effectiveCity,
                warrantyComments: specs || warrantyComments || quoteSubject || "Garantía oficial de 1 año",
                advisorName: advisorName || salesperson.name || "ASESOR ATOMIC",
                itemsData: typeof items === "string" ? items : JSON.stringify(items || []),

                status: status || "PROPUESTA_EMITIDA"
            }
        })

        // Generar siguiente número secuencial si es necesario
        let nextQuoteNumber = "PROP-00-001"
        const lastQuote = await prisma.quote.findFirst({
            orderBy: { createdAt: "desc" },
            select: { quoteNumber: true }
        })
        if (lastQuote?.quoteNumber) {
            const match = lastQuote.quoteNumber.match(/PROP-(\d+)-(\d+)/)
            if (match) {
                const seq = parseInt(match[2]) + 1
                nextQuoteNumber = `PROP-00-${seq.toString().padStart(3, "0")}`
            } else {
                nextQuoteNumber = `PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`
            }
        }

        // Obtener historial reciente para actualizar UI en vivo
        const history = await prisma.quote.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        })

        return NextResponse.json({
            success: true,
            quote,
            nextQuoteNumber,
            history
        })
    } catch (error: any) {
        console.error("Save Quote Error:", error)
        return NextResponse.json({ error: "Failed to save quote", details: error.message }, { status: 500 })
    }
}
