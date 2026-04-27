import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/users
// Returns all approved users (or all users if admin) for internal messaging dropdown
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const statusFilter = searchParams.get("status") // optional: "APPROVED" | "ALL"

        // Build where clause - by default return APPROVED users only
        const where: any = {}
        if (statusFilter === "ALL") {
            // Only admins can see all users
            const currentUser = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { role: true }
            })
            if (currentUser?.role !== "ADMIN") {
                where.status = "APPROVED"
            }
        } else {
            where.status = "APPROVED"
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
            orderBy: [
                { role: "asc" },
                { name: "asc" }
            ]
        })

        return NextResponse.json({ users })

    } catch (error) {
        console.error("Admin users GET error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


