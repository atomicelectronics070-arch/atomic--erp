export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const memory = await prisma.personalBotMemory.findUnique({
        where: { userId: session.user.id },
        include: {
            messages: {
                orderBy: { createdAt: "asc" },
                take: 50,
            }
        }
    })

    return NextResponse.json({ memory })
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { botName, onboardingDone } = body

    const memory = await prisma.personalBotMemory.upsert({
        where: { userId: session.user.id },
        create: {
            userId: session.user.id,
            botName: botName ?? null,
            onboardingDone: onboardingDone ?? false,
        },
        update: {
            ...(botName !== undefined && { botName }),
            ...(onboardingDone !== undefined && { onboardingDone }),
        }
    })

    return NextResponse.json({ memory })
}
