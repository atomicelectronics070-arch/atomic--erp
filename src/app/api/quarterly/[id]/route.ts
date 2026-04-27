import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        await prisma.quarterlyPlan.delete({
            where: { id }
        })
        return NextResponse.json({ message: "Plan deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 })
    }
}

