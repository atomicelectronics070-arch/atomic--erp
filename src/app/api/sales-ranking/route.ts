import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { startOfWeek, addHours, isAfter, startOfHour } from "date-fns"

async function handleResetIfNeeded() {
    const now = new Date()
    const firstRecord = await prisma.salesRanking.findFirst()
    if (!firstRecord) return

    const lastReset = new Date(firstRecord.lastReset)
    const currentMonday = startOfWeek(now, { weekStartsOn: 1 })
    const currentMonday7AM = addHours(currentMonday, 7)
    
    if (isAfter(now, currentMonday7AM) && isAfter(currentMonday7AM, lastReset)) {
        await prisma.$transaction([
            prisma.$executeRaw`UPDATE "SalesRanking" SET "historicalAmount" = "historicalAmount" + "currentWeekAmount"`,
            prisma.$executeRaw`UPDATE "SalesRanking" SET "currentWeekAmount" = 0, "lastReset" = ${currentMonday7AM}`,
        ])
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        await handleResetIfNeeded()

        const ranking = await prisma.salesRanking.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                        role: true,
                        profilePicture: true
                    }
                }
            },
            orderBy: [
                { currentWeekAmount: 'desc' },
                { historicalAmount: 'desc' }
            ]
        })

        return NextResponse.json(ranking)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch ranking" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const { userId, amount, mode } = await req.json()

        if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 })

        const record = await prisma.salesRanking.upsert({
            where: { userId },
            create: {
                userId,
                currentWeekAmount: parseFloat(amount) || 0,
                historicalAmount: 0,
            },
            update: {
                currentWeekAmount: mode === 'add' 
                    ? { increment: parseFloat(amount) || 0 }
                    : (parseFloat(amount) || 0)
            }
        })

        return NextResponse.json(record)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update ranking" }, { status: 500 })
    }
}
