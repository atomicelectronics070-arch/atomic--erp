import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const environments = await prisma.environment.findMany({
        include: { accounts: true },
        orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(environments)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await req.json()
    const env = await prisma.environment.create({
        data: { name, description }
    })
    return NextResponse.json(env)
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, name, description } = await req.json()
    const env = await prisma.environment.update({
        where: { id },
        data: { name, description }
    })
    return NextResponse.json(env)
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await prisma.environment.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
