import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const resolvedParams = await params
        const transaction = await prisma.transaction.update({
            where: { id: resolvedParams.id },
            data: {
                client: body.client,
                amount: parseFloat(body.amount),
                cost: parseFloat(body.cost),
                profit: parseFloat(body.profit),
                commission: parseFloat(body.commission),
                status: body.status,
                type: body.type,
                date: body.date ? new Date(body.date) : undefined,
            }
        })
        return NextResponse.json(transaction)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const resolvedParams = await params
        await prisma.transaction.delete({
            where: { id: resolvedParams.id }
        })
        return NextResponse.json({ message: "Transaction permanently deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
    }
}
