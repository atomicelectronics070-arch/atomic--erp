import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// PATCH /api/admin/users/[id]
// Toggle status, update info or reset password
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { isActive, name, email, role, resetPassword, approveReset } = body

        const updateData: any = {}
        
        if (typeof isActive === 'boolean') updateData.isActive = isActive
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (role) updateData.role = role

        // Generation of Emergency Temp Code
        if (approveReset) {
            const tempCode = `ATOMIC-${Math.floor(1000 + Math.random() * 9000)}`
            const hashedTemp = await bcrypt.hash(tempCode, 10)
            updateData.passwordHash = hashedTemp
            updateData.tempResetCode = tempCode
            updateData.resetRequested = false
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: updateData
        })

        return NextResponse.json({ success: true, user })

    } catch (error) {
        console.error("Admin user PATCH error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// DELETE /api/admin/users/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // We delete only if it's not deleting themselves
        if (session.user.id === params.id) {
            return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Admin user DELETE error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
