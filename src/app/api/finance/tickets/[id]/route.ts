export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const isAdmin = ["ADMIN", "MANAGEMENT"].includes(session.user.role)
        const body = await req.json()
        const { status } = body

        if (!status) {
            return NextResponse.json({ error: "Missing status" }, { status: 400 })
        }

        // 1. Get current ticket to check authorization & amount/advisor details
        const ticket = await prisma.paymentTicket.findUnique({
            where: { id },
            include: { advisor: true, admin: true }
        })

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
        }

        // If not admin, verify that the logged-in user is the ticket's advisor
        const isAssignedAdvisor = session.user.id === ticket.advisorId || session.user.email === ticket.advisor.email
        if (!isAdmin && !isAssignedAdvisor) {
            return NextResponse.json({ error: "No autorizado para modificar este ticket" }, { status: 403 })
        }

        // Advisors can accept (status RECIBIDO or ACEPTADO)
        if (!isAdmin && status !== "RECIBIDO" && status !== "ACEPTADO") {
            return NextResponse.json({ error: "Solo puedes aceptar o confirmar este ticket" }, { status: 403 })
        }

        // Normalized status to store
        const normalizedStatus = (!isAdmin && (status === "ACEPTADO" || status === "RECIBIDO")) ? "RECIBIDO" : status

        // 2. Update status in PaymentTicket
        const updatedTicket = await prisma.paymentTicket.update({
            where: { id },
            data: { status: normalizedStatus }
        })

        const isBonus = ticket.concept.toLowerCase().includes("bonif") || 
                        ticket.concept.toLowerCase().includes("bono") || 
                        ticket.concept.toLowerCase().includes("rendimiento") ||
                        body.action === "ACCEPT_BONUS"

        // 3. When advisor ACCEPTS the ticket
        if (!isAdmin && (status === "RECIBIDO" || status === "ACEPTADO")) {
            // Find all admin users to notify them (including Santiago Guzmán)
            const adminUsers = await prisma.user.findMany({
                where: { role: "ADMIN" },
                select: { id: true }
            })
            const adminIdsToNotify = new Set([ticket.adminId, ...adminUsers.map(u => u.id)])

            const advisorName = ticket.advisor.name || "Patricio Esteban Miranda"
            const ticketRef = `TICKET-${ticket.id.slice(0, 8).toUpperCase()}`

            // A. Send notification to all admins
            for (const adminId of adminIdsToNotify) {
                await prisma.notification.create({
                    data: {
                        userId: adminId,
                        title: isBonus ? "✅ Bonificación de Rendimiento Aceptada" : "✅ Liquidación Aceptada por Asesor",
                        message: isBonus 
                            ? `${advisorName} ha ACEPTADO formalmente su bonificación de rendimiento por $${ticket.amount.toFixed(2)} (${ticket.concept}). Asentado en Registros Financieros.`
                            : `${advisorName} ha confirmado la recepción del ticket por $${ticket.amount.toFixed(2)} (${ticket.concept}).`,
                        type: "TICKET",
                        relatedId: ticket.id
                    }
                })
            }

            // B. Ensure financial record is registered and marked in Transaction
            const existingTrx = await prisma.transaction.findFirst({
                where: {
                    OR: [
                        { quoteNumber: { contains: ticketRef } },
                        { trxId: `TRX-TKT-${ticket.id.slice(-4).toUpperCase()}` }
                    ]
                }
            })

            if (existingTrx) {
                await prisma.transaction.update({
                    where: { id: existingTrx.id },
                    data: {
                        status: "PAGADO",
                        commissionStatus: "PAGADO",
                        bonus: ticket.amount,
                        commission: ticket.amount
                    }
                })
            } else {
                // Calculate next sequential trxId
                const allTrx = await prisma.transaction.findMany({ select: { trxId: true } })
                let maxNumber = 0
                for (const t of allTrx) {
                    const matches = t.trxId ? t.trxId.match(/^TRX-(\d+)$/) : null
                    if (matches) {
                        const num = parseInt(matches[1], 10)
                        if (num > maxNumber) maxNumber = num
                    }
                }
                let nextNumber = Math.max(maxNumber + 1, 1)
                let trxId = `TRX-${nextNumber.toString().padStart(3, '0')}`
                const existingSet = new Set(allTrx.map(t => t.trxId))
                while (existingSet.has(trxId)) {
                    nextNumber++
                    trxId = `TRX-${nextNumber.toString().padStart(3, '0')}`
                }

                const metadata = {
                    attachments: [],
                    exercise: "2026",
                    period: "Q4",
                    costCenter: "Nómina, Asistencia & Bonos",
                    paymentMethod: "Transferencia Banco Pichincha",
                    bankReference: ticketRef,
                    paymentTarget: advisorName,
                    isPaymentAssigned: true,
                    paymentAssignmentType: "ASESOR"
                }

                await prisma.transaction.create({
                    data: {
                        trxId,
                        client: `${advisorName} - ${isBonus ? "Bonificación de Rendimiento" : "Liquidación de Ticket"}`,
                        quoteNumber: `${ticketRef} | ${ticket.concept}`,
                        amount: ticket.amount,
                        pvp: 0,
                        cost: ticket.amount,
                        profit: 0,
                        commission: ticket.amount,
                        bonus: ticket.amount,
                        status: "PAGADO",
                        commissionStatus: "PAGADO",
                        type: "Egreso Comisión",
                        salespersonId: ticket.advisorId,
                        date: new Date(),
                        proofUrl: JSON.stringify(metadata)
                    }
                })
            }
        }

        // 4. If admin marks it as PAGADO manually
        if (isAdmin && status === "PAGADO" && ticket.status !== "PAGADO") {
            const ticketRef = `TICKET-${ticket.id.slice(0, 8).toUpperCase()}`
            const existingTrx = await prisma.transaction.findFirst({
                where: {
                    OR: [
                        { quoteNumber: { contains: ticketRef } },
                        { trxId: `TRX-TKT-${ticket.id.slice(-4).toUpperCase()}` }
                    ]
                }
            })

            if (existingTrx) {
                await prisma.transaction.update({
                    where: { id: existingTrx.id },
                    data: {
                        status: "PAGADO",
                        commissionStatus: "PAGADO"
                    }
                })
            } else {
                const nextTrxId = `TRX-TKT-${Date.now().toString().slice(-4)}`
                await prisma.transaction.create({
                    data: {
                        trxId: nextTrxId,
                        client: `${ticket.advisor.name || 'Asesor'} - ${ticket.concept}`,
                        quoteNumber: `${ticketRef} | ${ticket.concept}`,
                        amount: ticket.amount,
                        cost: ticket.amount,
                        pvp: 0,
                        profit: 0,
                        commission: ticket.amount,
                        status: "PAGADO",
                        commissionStatus: "PAGADO",
                        type: "Egreso Comisión",
                        salespersonId: ticket.advisorId,
                        date: new Date()
                    }
                })
            }

            // Notify the advisor
            await prisma.notification.create({
                data: {
                    userId: ticket.advisorId,
                    title: "Ticket Pagado",
                    message: `Tu ticket por $${ticket.amount.toFixed(2)} (${ticket.concept}) ha sido marcado como PAGADO.`,
                    type: "TICKET",
                    relatedId: ticket.id
                }
            })
        }

        return NextResponse.json(updatedTicket)
    } catch (error) {
        console.error("Update ticket status error:", error)
        return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
    }
}


