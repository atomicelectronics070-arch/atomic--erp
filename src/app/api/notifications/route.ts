import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.user.id,
                isRead: false
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        })

        return NextResponse.json(notifications)
    } catch (error) {
        console.error("Fetch notifications error:", error)
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { notificationId } = body

        if (!notificationId) {
            return NextResponse.json({ error: "Missing notificationId" }, { status: 400 })
        }

        const updated = await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId: session.user.id // Ensure we only update our own notifications
            },
            data: {
                isRead: true
            }
        })

        return NextResponse.json({ success: true, updated: updated.count })
    } catch (error) {
        console.error("Update notification error:", error)
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
    }
}
