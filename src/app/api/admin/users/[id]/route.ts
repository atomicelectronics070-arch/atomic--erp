import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id: userId } = await params

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        // Permanent deletion
        await prisma.user.delete({
            where: { id: userId },
        })

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error("User deletion error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { status, role } = body
        const { id: userId } = await params

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        // Prepare update data
        const updateData: any = {}
        if (status) updateData.status = status
        if (role) updateData.role = role

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        })

        return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 })
    } catch (error) {
        console.error("User update error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
