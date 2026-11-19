export const dynamic = 'force-dynamic';
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
            client: body.client || oldTrx.client,
            type: body.type || oldTrx.type,
            date: body.date ? new Date(body.date) : oldTrx.date,
            proofUrl: body.proofUrl !== undefined ? body.proofUrl : oldTrx.proofUrl,
            quoteNumber: body.quoteNumber !== undefined ? body.quoteNumber : oldTrx.quoteNumber,
        }

        if (isAdmin) {
            data.pvp = parseFloat(body.pvp || body.amount) || 0
            data.amount = parseFloat(body.amount) || 0
            data.cost = parseFloat(body.cost) || 0
            data.profit = parseFloat(body.profit) || 0
            data.commission = parseFloat(body.commission) || 0
            data.bonus = parseFloat(body.bonus || 0)
            data.status = body.status || oldTrx.status
            data.commissionStatus = body.commissionStatus || oldTrx.commissionStatus
            data.salespersonId = body.salespersonId || oldTrx.salespersonId
        } else if (oldTrx.salespersonId === session.user.id) {
            // Salesperson can update their pending transaction amount before approval
            if (oldTrx.status === "PENDIENTE") {
                const amount = parseFloat(body.amount) || oldTrx.amount
                data.amount = amount
                data.pvp = parseFloat(body.pvp || body.amount) || amount
            }
        }

        const transaction = await prisma.transaction.update({
            where: { id: resolvedParams.id },
            data
        })

        // Notify user if was pending and now approved
        if (isAdmin && oldTrx.status === "PENDIENTE" && body.status === "PAGADO" && transaction.salespersonId) {
            try {
                await prisma.notification.create({
                    data: {
                        userId: transaction.salespersonId,
                        title: "💰 VENTA CONSOLIDADA",
                        message: `Tu venta con ${transaction.client} ha sido procesada. PVP: $${transaction.amount}, Comisión: $${transaction.commission}.`,
                        type: "GOAL",
                        relatedId: transaction.id
                    }
                })
            } catch (notifyErr) {
                console.error("Warning: Notification failed on transaction approval:", notifyErr)
            }
        }

        return NextResponse.json({ ok: true, transaction })
    } catch (error: any) {
        console.error("Error updating transaction:", error)
        return NextResponse.json({ error: error?.message || "Failed to update transaction" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const resolvedParams = await params
        await prisma.transaction.update({
            where: { id: resolvedParams.id },
            data: { status: "CANCELADO" }
        })
        return NextResponse.json({ message: "Transaction deactivated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
    }
}

