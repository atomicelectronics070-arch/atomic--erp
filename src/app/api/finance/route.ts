export const dynamic = 'force-dynamic';
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
        
        const transactions = await prisma.transaction.findMany({
            where: isAdmin ? {} : { salespersonId: session.user.id },
            include: {
                salesperson: { select: { name: true, email: true } }
            },
            orderBy: { date: 'desc' }
        })
        return NextResponse.json(transactions)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "No autorizado. Inicie sesión nuevamente." }, { status: 401 })
        }

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        const body = await req.json()
        
        // Find all existing transactions to calculate the next numeric trxId reliably
        const allTrx = await prisma.transaction.findMany({
            select: { trxId: true }
        })

        let maxNumber = 0
        for (const t of allTrx) {
            const matches = t.trxId ? t.trxId.match(/^TRX-(\d+)$/) : null
            if (matches) {
                const num = parseInt(matches[1], 10)
                if (num > maxNumber) {
                    maxNumber = num
                }
            }
        }

        let nextNumber = Math.max(maxNumber + 1, 1)
        let trxId = `TRX-${nextNumber.toString().padStart(3, '0')}`

        const existingSet = new Set(allTrx.map(t => t.trxId))
        while (existingSet.has(trxId)) {
            nextNumber++
            trxId = `TRX-${nextNumber.toString().padStart(3, '0')}`
        }

        // Status & Salesperson
        const status = isAdmin ? (body.status || "PAGADO") : "PENDIENTE"
        const salespersonId = isAdmin ? (body.salespersonId || session.user.id) : session.user.id

        // Values
        const amount = parseFloat(body.amount) || 0
        const pvp = parseFloat(body.pvp || body.amount) || amount
        const cost = isAdmin ? (parseFloat(body.cost) || 0) : 0
        const profit = isAdmin ? (parseFloat(body.profit) || (pvp - cost)) : 0
        const commission = isAdmin ? (parseFloat(body.commission) || 0) : 0
        const bonus = isAdmin ? (parseFloat(body.bonus) || 0) : 0

        // Parse date safely
        let trxDate = new Date()
        if (body.date) {
            const parsedDate = new Date(body.date)
            if (!isNaN(parsedDate.getTime())) {
                trxDate = parsedDate
            }
        }

        // Process proofUrl & multi-attachment metadata
        let proofUrlToStore = body.proofUrl || null
        if (body.attachments || body.exercise || body.costCenter || body.paymentMethod || body.metadata) {
            const rawMeta = body.metadata || body
            const meta = {
                attachments: Array.isArray(rawMeta.attachments) ? rawMeta.attachments : (body.proofUrl ? [{
                    id: "att-1",
                    name: "Comprobante Principal",
                    size: "Adjunto",
                    type: "image",
                    dataUrl: body.proofUrl,
                    uploadedAt: new Date().toISOString()
                }] : []),
                exercise: rawMeta.exercise || "2026",
                period: rawMeta.period || "Q4",
                costCenter: rawMeta.costCenter || "Operaciones",
                paymentMethod: rawMeta.paymentMethod || "Transferencia Bancaria",
                bankReference: rawMeta.bankReference || "",
                paymentTarget: rawMeta.paymentTarget || "",
                isPaymentAssigned: Boolean(rawMeta.isPaymentAssigned),
                paymentAssignmentType: rawMeta.paymentAssignmentType || "PROVEEDOR",
                taxDetails: rawMeta.taxDetails || null
            }
            proofUrlToStore = JSON.stringify(meta)
        }

        const transaction = await prisma.transaction.create({
            data: {
                trxId,
                client: body.client || "SIN ESPECIFICAR",
                amount,
                pvp,
                cost,
                profit,
                commission,
                bonus,
                quoteNumber: body.quoteNumber || null,
                status,
                type: body.type || "Venta Directa",
                date: trxDate,
                proofUrl: proofUrlToStore,
                salespersonId
            }
        })

        // Notify admins if created by non-admin advisor / coordinator
        if (!isAdmin) {
            try {
                const admins = await prisma.user.findMany({
                    where: { role: { in: ["ADMIN", "MANAGEMENT"] } }
                })
                
                await Promise.all(admins.map(admin => 
                    prisma.notification.create({
                        data: {
                            userId: admin.id,
                            title: "🛒 NUEVA VENTA REGISTRADA",
                            message: `El asesor ${session.user.name || 'Asesor'} ha registrado una venta para ${body.client || 'Cliente'}. Requiere aprobación técnica.`,
                            type: "TICKET",
                            relatedId: transaction.id
                        }
                    })
                ))
            } catch (notifyErr) {
                console.error("Warning: Could not create admin notifications:", notifyErr)
            }
        }

        return NextResponse.json({ ok: true, transaction })
    } catch (error: any) {
        console.error("Error creating transaction in /api/finance:", error)
        return NextResponse.json({ 
            error: error?.message || "No se pudo crear la transacción en la base de datos." 
        }, { status: 500 })
    }
}



