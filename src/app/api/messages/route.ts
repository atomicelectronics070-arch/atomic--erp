import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get inbox or unread count
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const type = searchParams.get("type") || "inbox" // 'inbox', 'outbox', 'unread'

        if (type === "unread") {
            const count = await prisma.internalMessage.count({
                where: {
                    receiverId: session.user.id,
                    isRead: false
                }
            })
            return NextResponse.json({ unreadCount: count })
        }

        if (type === "outbox") {
            const outbox = await prisma.internalMessage.findMany({
                where: { senderId: session.user.id },
                include: {
                    receiver: { select: { name: true, role: true } }
                },
                orderBy: { createdAt: "desc" }
            })
            return NextResponse.json({ messages: outbox })
        }

        // Default: Inbox
        const inbox = await prisma.internalMessage.findMany({
            where: { receiverId: session.user.id },
            include: {
                sender: { select: { name: true, role: true } }
            },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json({ messages: inbox })

    } catch (error) {
        console.error("Messages GET error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// Send a new message
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { receiverIds, subject, type, content } = body

        if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.length === 0 || !subject || !content) {
            return NextResponse.json({ error: "Missing required fields or invalid recipients" }, { status: 400 })
        }

        const results = await prisma.$transaction(
            receiverIds.map(receiverId => {
                return prisma.internalMessage.create({
                    data: {
                        subject,
                        type: type || "Mensaje Simple",
                        content,
                        senderId: session.user.id,
                        receiverId
                    }
                })
            })
        )

        // Find created IDs and map to notifications
        await prisma.notification.createMany({
            data: results.map(msg => ({
                userId: msg.receiverId,
                title: "Nuevo Mensaje Interno",
                message: `Asunto: ${subject}`,
                type: "MESSAGE",
                relatedId: msg.id
            }))
        })

        return NextResponse.json({ messages: results }, { status: 201 })
    } catch (error) {
        console.error("Message POST error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


