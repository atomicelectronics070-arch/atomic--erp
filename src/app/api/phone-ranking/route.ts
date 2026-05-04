import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { startOfWeek, addHours, isAfter, startOfHour, nextMonday } from "date-fns"

// Helper to check and handle reset
async function handleResetIfNeeded() {
    const now = new Date()
    
    // Find a record to check last reset
    const firstRecord = await prisma.phoneRanking.findFirst()
    if (!firstRecord) return

    const lastReset = new Date(firstRecord.lastReset)
    
    // Calculate the next Monday 7 AM after the last reset
    // startOfWeek for Monday is 1. nextMonday from lastReset, then set to 7 AM.
    let nextReset = startOfHour(addHours(startOfWeek(lastReset, { weekStartsOn: 1 }), 7))
    
    // If lastReset was before this week's Monday 7 AM, and we are currently after it, reset.
    // Or simpler: if it's been more than a week, or we crossed the Monday 7AM threshold.
    
    // Calculate the most recent Monday 7 AM
    const currentMonday = startOfWeek(now, { weekStartsOn: 1 })
    const currentMonday7AM = addHours(currentMonday, 7)
    
    if (isAfter(now, currentMonday7AM) && isAfter(currentMonday7AM, lastReset)) {
        // RESET TIME!
        await prisma.$transaction([
            // Add current week to historical
            prisma.$executeRaw`UPDATE "PhoneRanking" SET "historicalCount" = "historicalCount" + "currentWeekCount"`,
            // Reset current week
            prisma.$executeRaw`UPDATE "PhoneRanking" SET "currentWeekCount" = 0, "lastReset" = ${currentMonday7AM}`,
        ])
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await handleResetIfNeeded()

        const ranking = await prisma.phoneRanking.findMany({
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
                { currentWeekCount: 'desc' },
                { historicalCount: 'desc' }
            ]
        })

        return NextResponse.json(ranking)
    } catch (error) {
        console.error("Ranking Fetch Error:", error)
        return NextResponse.json({ error: "Failed to fetch ranking" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { userId, count, mode } = await req.json() // mode: 'set' or 'add'

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        const record = await prisma.phoneRanking.upsert({
            where: { userId },
            create: {
                userId,
                currentWeekCount: count || 0,
                historicalCount: 0,
            },
            update: {
                currentWeekCount: mode === 'add' 
                    ? { increment: count || 0 }
                    : (count || 0)
            }
        })

        return NextResponse.json(record)
    } catch (error) {
        console.error("Ranking Update Error:", error)
        return NextResponse.json({ error: "Failed to update ranking" }, { status: 500 })
    }
}
