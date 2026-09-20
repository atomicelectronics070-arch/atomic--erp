export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/users
// Returns all approved users (or all users if admin/coordinator)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const statusFilter = searchParams.get("status") // optional: "APPROVED" | "ALL"
        const roleFilter = searchParams.get("role")

        const userRole = (session.user as any)?.role || ""
        const isAdminOrCoord = userRole === 'ADMIN' || userRole === 'MANAGEMENT' || userRole.includes('ADMIN') || userRole.includes('COORDINAT')

        // Build where clause
        const where: any = {}
        if (statusFilter === "ALL" && isAdminOrCoord) {
            // Can see all statuses
        } else if (statusFilter) {
            where.status = statusFilter
        } else {
            where.status = "APPROVED"
        }

        if (roleFilter) {
            where.role = { contains: roleFilter }
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                isActive: true,
                resetRequested: true,
                tempResetCode: true,
                profileData: true,
                profilePicture: true,
                phoneNumber: true,
                cedula: true,
                createdAt: true,
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
