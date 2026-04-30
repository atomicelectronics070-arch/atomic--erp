import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    _req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const course = await prisma.course.findUnique({
            where: { slug: params.slug, published: true },
            include: {
                category: true,
                lessons: {
                    orderBy: { order: "asc" }
                },
                _count: { select: { enrollments: true } }
            }
        })

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 })
        }

        return NextResponse.json({ course })
    } catch (error) {
        console.error("[PUBLIC_COURSE_GET]", error)
        return NextResponse.json({ error: "Error fetching course" }, { status: 500 })
    }
}
