import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const categories = await prisma.academyCategory.findMany({
            include: {
                courses: {
                    where: { published: true },
                    include: {
                        _count: { select: { lessons: true, enrollments: true } }
                    },
                    orderBy: { createdAt: "asc" }
                }
            },
            orderBy: { name: "asc" }
        })

        // Filter categories that have at least one published course
        const filtered = categories.filter(cat => cat.courses.length > 0)

        return NextResponse.json({ categories: filtered })
    } catch (error) {
        console.error("[PUBLIC_ACADEMY_GET]", error)
        return NextResponse.json({ error: "Error fetching courses" }, { status: 500 })
    }
}
