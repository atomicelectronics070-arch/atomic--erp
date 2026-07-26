import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { content } = body

        if (!content?.trim()) {
            return NextResponse.json({ error: "Content required" }, { status: 400 })
        }

        const post = await prisma.socialPost.create({
            data: {
                content,
                authorId: session.user.id,
            }
        })

        return NextResponse.json({ success: true, post })
    } catch (err) {
        console.error("Social post create error:", err)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
