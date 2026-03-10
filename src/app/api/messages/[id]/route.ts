import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Update message status or mark as read
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { id: messageId } = await params
        const body = await req.json()
        const { status, isRead } = body

        // Verify the user owns or received this message
        const existingMsg = await prisma.internalMessage.findUnique({
            where: { id: messageId }
        })

        if (!existingMsg) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        if (existingMsg.receiverId !== session.user.id && existingMsg.senderId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const updateData: any = {}

        // Receiver can mark as read and update status
        if (existingMsg.receiverId === session.user.id) {
            if (isRead !== undefined) updateData.isRead = isRead
            if (status) updateData.status = status
        }

        const updatedMessage = await prisma.internalMessage.update({
            where: { id: messageId },
            data: updateData
        })

        return NextResponse.json({ message: updatedMessage })
    } catch (error) {
        console.error("Message PATCH error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
