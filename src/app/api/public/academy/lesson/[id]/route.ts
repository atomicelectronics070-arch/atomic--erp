import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id: params.id },
            include: {
                course: {
                    include: {
                        category: true,
                        lessons: { orderBy: { order: "asc" } }
                    }
                }
            }
        })

        if (!lesson || !lesson.course.published) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
        }

        return NextResponse.json({ lesson })
    } catch (error) {
        console.error("[PUBLIC_LESSON_GET]", error)
        return NextResponse.json({ error: "Error fetching lesson" }, { status: 500 })
    }
}
