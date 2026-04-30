import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) return null
    return session
}

export async function PATCH(
    req: Request,
    { params }: { params: { lessonId: string } }
) {
    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { title, content, videoUrl, order } = body

    try {
        const lesson = await prisma.lesson.update({
            where: { id: params.lessonId },
            data: {
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
                ...(videoUrl !== undefined && { videoUrl: videoUrl || null }),
                ...(order !== undefined && { order }),
            }
        })
        return NextResponse.json({ lesson })
    } catch (error) {
        console.error("[LESSON_PATCH]", error)
        return NextResponse.json({ error: "Error updating lesson" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { lessonId: string } }
) {
    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        await prisma.lesson.delete({ where: { id: params.lessonId } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[LESSON_DELETE]", error)
        return NextResponse.json({ error: "Error deleting lesson" }, { status: 500 })
    }
}
