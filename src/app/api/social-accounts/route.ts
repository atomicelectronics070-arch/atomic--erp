import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, platform, environmentId } = await req.json()
    const account = await prisma.socialAccount.create({
        data: { name, platform, environmentId }
    })
    return NextResponse.json(account)
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await prisma.socialAccount.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
