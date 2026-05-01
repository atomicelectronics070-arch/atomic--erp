import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) return null
    return session
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { title, slug, content, videoUrl, order } = body

    try {
        const lesson = await prisma.lesson.create({
            data: {
                title,
                slug,
                content: content || "",
                videoUrl: videoUrl || null,
                order: order || 0,
                courseId: courseId,
            }
        })
        return NextResponse.json({ lesson })
    } catch (error) {
        console.error("[LESSON_CREATE]", error)
        return NextResponse.json({ error: "Error creating lesson" }, { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const lessons = await prisma.lesson.findMany({
        where: { courseId: courseId },
        orderBy: { order: "asc" }
    })
    return NextResponse.json({ lessons })
}
