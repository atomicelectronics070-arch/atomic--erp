import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

async function requireAdmin(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return null
    }
    return session
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params
    const session = await requireAdmin(req)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { title, description, imageUrl, published, categoryId } = body

    try {
        const course = await prisma.course.update({
            where: { id: courseId },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(published !== undefined && { published }),
                ...(categoryId !== undefined && { categoryId }),
            }
        })
        return NextResponse.json({ course })
    } catch (error) {
        console.error("[COURSE_PATCH]", error)
        return NextResponse.json({ error: "Error updating course" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params
    const session = await requireAdmin(req)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        await prisma.course.delete({ where: { id: courseId } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[COURSE_DELETE]", error)
        return NextResponse.json({ error: "Error deleting course" }, { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params
    const session = await requireAdmin(req)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { category: true, lessons: { orderBy: { order: "asc" } } }
        })
        return NextResponse.json({ course })
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}
