import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/user/profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                residenceSector: true,
                profilePicture: true,
                role: true
            }
        })

        return NextResponse.json(user)
    } catch (e) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// PATCH /api/user/profile
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { name, lastName, phoneNumber, residenceSector, profilePicture, requestRoleChange } = body

        const updateData: any = {}
        if (name) updateData.name = name
        if (lastName) updateData.lastName = lastName
        if (phoneNumber) updateData.phoneNumber = phoneNumber
        if (residenceSector) updateData.residenceSector = residenceSector
        if (profilePicture) updateData.profilePicture = profilePicture

        if (requestRoleChange) {
            // Send internal message to Admin
            const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
            if (admin) {
                await prisma.internalMessage.create({
                    data: {
                        senderId: session.user.id,
                        receiverId: admin.id,
                        subject: "SOLICITUD DE CAMBIO DE ROL",
                        content: `El usuario ${session.user.name} ha solicitado un cambio de rol a: ${requestRoleChange}.`,
                        type: "URGENTE"
                    }
                })
            }
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        })

        return NextResponse.json({ success: true, user })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
