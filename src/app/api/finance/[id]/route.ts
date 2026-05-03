import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        const body = await req.json()
        const resolvedParams = await params

        // Get old transaction to check status change
        const oldTrx = await prisma.transaction.findUnique({
            where: { id: resolvedParams.id }
        })

        if (!oldTrx) return NextResponse.json({ error: "Not found" }, { status: 404 })

        const data: any = {
            client: body.client,
            type: body.type,
            date: body.date ? new Date(body.date) : undefined,
        }

        if (isAdmin) {
            data.pvp = parseFloat(body.pvp || body.amount)
            data.amount = parseFloat(body.amount)
            data.cost = parseFloat(body.cost)
            data.profit = parseFloat(body.profit)
            data.commission = parseFloat(body.commission)
            data.bonus = parseFloat(body.bonus || 0)
            data.quoteNumber = body.quoteNumber || oldTrx.quoteNumber
            data.status = body.status
            data.salespersonId = body.salespersonId || oldTrx.salespersonId
        }

        const transaction = await prisma.transaction.update({
            where: { id: resolvedParams.id },
            data
        })

        // Notify user if was pending and now approved
        if (isAdmin && oldTrx.status === "PENDIENTE" && body.status === "PAGADO" && transaction.salespersonId) {
            await prisma.notification.create({
                data: {
                    userId: transaction.salespersonId,
                    title: "💰 VENTA CONSOLIDADA",
                    message: `Tu venta con ${transaction.client} ha sido procesada. PVP: $${transaction.amount}, Comisión: $${transaction.commission}.`,
                    type: "GOAL",
                    relatedId: transaction.id
                }
            })
        }

        return NextResponse.json(transaction)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const resolvedParams = await params
        await prisma.transaction.delete({
            where: { id: resolvedParams.id }
        })
        return NextResponse.json({ message: "Transaction permanently deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
    }
}

