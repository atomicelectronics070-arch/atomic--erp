import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    try {
        const lessons = await prisma.lesson.findMany({
            where: courseId ? { courseId } : {},
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(lessons)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { title, slug, content, videoUrl, quizData, order, courseId } = body

        const lesson = await prisma.lesson.create({
            data: { title, slug, content, videoUrl, quizData, order: parseInt(order) || 0, courseId }
        })

        return NextResponse.json(lesson)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { id, title, slug, content, videoUrl, quizData, order } = body

        const lesson = await prisma.lesson.update({
            where: { id },
            data: { title, slug, content, videoUrl, quizData, order: parseInt(order) || 0 }
        })

        return NextResponse.json(lesson)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
    }
}
