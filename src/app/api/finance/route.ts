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
            orderBy: { createdAt: 'desc' }
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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        const body = await req.json()
        
        const lastTrx = await prisma.transaction.findFirst({
            orderBy: { trxId: 'desc' }
        })

        let nextNumber = 1
        if (lastTrx) {
            const matches = lastTrx.trxId.match(/TRX-(\d+)/)
            if (matches) {
                nextNumber = parseInt(matches[1]) + 1
            }
        }

        const trxId = `TRX-${nextNumber.toString().padStart(3, '0')}`

        // If not admin, force status PENDING and no financial details
        const status = isAdmin ? (body.status || "PAGADO") : "PENDIENTE"
        const salespersonId = isAdmin ? (body.salespersonId || session.user.id) : session.user.id

        const transaction = await prisma.transaction.create({
            data: {
                trxId,
                client: body.client,
                amount: parseFloat(body.amount),
                pvp: isAdmin ? parseFloat(body.pvp || body.amount) : 0,
                cost: isAdmin ? parseFloat(body.cost || 0) : 0,
                profit: isAdmin ? parseFloat(body.profit || 0) : 0,
                commission: isAdmin ? parseFloat(body.commission || 0) : 0,
                bonus: isAdmin ? parseFloat(body.bonus || 0) : 0,
                quoteNumber: body.quoteNumber || null,
                status,
                type: body.type || "Venta Directa",
                date: body.date ? new Date(body.date) : new Date(),
                proofUrl: body.proofUrl || null,
                salespersonId
            }
        })

        // Notify admins if created by salesperson
        if (!isAdmin) {
            const admins = await prisma.user.findMany({
                where: { role: { in: ["ADMIN", "MANAGEMENT"] } }
            })
            
            await Promise.all(admins.map(admin => 
                prisma.notification.create({
                    data: {
                        userId: admin.id,
                        title: "🛒 NUEVA VENTA REGISTRADA",
                        message: `El asesor ${session.user.name} ha registrado una venta para ${body.client}. Requiere aprobación técnica.`,
                        type: "TICKET",
                        relatedId: transaction.id
                    }
                })
            ))
        }

        return NextResponse.json(transaction)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
    }
}


