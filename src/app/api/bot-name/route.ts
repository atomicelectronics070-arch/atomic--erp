export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ name: null })
    const conf = await prisma.userPromptConfig.findUnique({ where: { userId_type: { userId: session.user.id, type: "BOT_NAME" } } })
    return NextResponse.json({ name: conf?.prompt || null })
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { name } = await req.json()
    await prisma.userPromptConfig.upsert({
        where: { userId_type: { userId: session.user.id, type: "BOT_NAME" } },
        update: { prompt: name },
        create: { userId: session.user.id, type: "BOT_NAME", prompt: name }
    })
    return NextResponse.json({ success: true, name })
}
