import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(transactions)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const lastTrx = await prisma.transaction.findFirst({
            orderBy: { trxId: 'desc' }
        })

        let nextNumber = 1
        if (lastTrx) {
            const lastNum = parseInt(lastTrx.trxId.split('-')[1])
            nextNumber = lastNum + 1
        }

        const trxId = `TRX-${nextNumber.toString().padStart(3, '0')}`

        const transaction = await prisma.transaction.create({
            data: {
                trxId,
                client: body.client,
                amount: parseFloat(body.amount),
                cost: parseFloat(body.cost),
                profit: parseFloat(body.profit),
                commission: parseFloat(body.commission),
                status: body.status || "PENDIENTE",
                type: body.type || "Venta Directa",
                date: body.date ? new Date(body.date) : new Date(),
            }
        })
        return NextResponse.json(transaction)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
    }
}
