import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
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

        // If not admin, they can ONLY set to RECIBIDO
        if (!isAdmin && status !== "RECIBIDO") {
            return NextResponse.json({ error: "Only admins can perform this change" }, { status: 403 })
        }

        // 1. Get current ticket to check if it's already paid or to get amount/advisor
        const ticket = await prisma.paymentTicket.findUnique({
            where: { id: params.id },
            include: { advisor: true }
        })

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
        }

        // 2. Update status
        const updatedTicket = await prisma.paymentTicket.update({
            where: { id: params.id },
            data: { status }
        })

        // 3. If turning to PAID, create a Transaction record for the advisor
        if (status === "PAGADO" && ticket.status !== "PAGADO") {
            const nextTrxId = `TRX-TKT-${Date.now().toString().slice(-4)}`
            
            await (prisma as any).transaction.create({
                data: {
                    trxId: nextTrxId,
                    client: `TICKET: ${ticket.concept}`,
                    amount: ticket.amount,
                    cost: 0,
                    profit: ticket.amount,
                    commission: ticket.amount, // Count as commission for the advisor
                    status: "PAGADO",
                    type: "Ticket de Pago",
                    salespersonId: ticket.advisorId,
                    date: new Date()
                }
            })

            // Optional: Notify the advisor that it's been paid
            await prisma.notification.create({
                data: {
                    userId: ticket.advisorId,
                    title: "Ticket Pagado",
                    message: `Tu ticket por $${ticket.amount} (${ticket.concept}) ha sido marcado como PAGADO.`,
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
