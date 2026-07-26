import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const requester = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (requester?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            area: true,
            createdAt: true,
            isActive: true,
            phoneNumber: true,
            plainPassword: true,
            personalBot: {
                select: { botName: true, onboardingDone: true, updatedAt: true }
            },
            salesRanking: {
                select: { quotesCount: true, salesCount: true, totalProfit: true }
            }
        },
        orderBy: { createdAt: "asc" }
    })

    return NextResponse.json({ users })
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const requester = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (requester?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { name, lastName, email, password, role, area } = body

    if (!email || !password || !name) {
        return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
        data: {
            name,
            lastName: lastName || null,
            email,
            passwordHash,
            role: role || "SALESPERSON",
            area: area || null,
            status: "ACTIVE",
            isActive: true,
            plainPassword: password,
        }
    })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const requester = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (requester?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { userId, role, area, status, isActive } = body

    if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 })

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(role !== undefined && { role }),
            ...(area !== undefined && { area }),
            ...(status !== undefined && { status }),
            ...(isActive !== undefined && { isActive }),
        }
    })

    return NextResponse.json({ user })
}
