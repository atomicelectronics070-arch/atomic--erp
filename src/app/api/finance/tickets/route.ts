import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const isUserAdmin = ["ADMIN"].includes(session.user.role)
        const userId = session.user.id

        // Admins see all tickets, Advisors see their own
        const tickets = await prisma.paymentTicket.findMany({
            where: isUserAdmin ? {} : { advisorId: userId },
            include: {
                advisor: { select: { name: true, email: true } },
                admin: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(tickets)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !["ADMIN", "MANAGEMENT"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { advisorId, amount, dueDate, concept, issueDate } = body

        if (!advisorId || !amount || !dueDate || !concept) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        const ticket = await prisma.paymentTicket.create({
            data: {
                advisorId,
                adminId: session.user.id,
                amount: parsedAmount,
                dueDate: new Date(dueDate),
                issueDate: issueDate ? new Date(issueDate) : new Date(),
                concept
            }
        })

        // Notify the advisor
        await prisma.notification.create({
            data: {
                userId: advisorId,
                title: "Nuevo Ticket de Pago",
                message: `Has recibido un ticket de pago por $${parsedAmount} (Concepto: ${concept}).`,
                type: "TICKET",
                relatedId: ticket.id
            }
        })

        return NextResponse.json(ticket)
    } catch (error) {
        console.error("Create ticket error:", error)
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
    }
}


