import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const [courses, categories, totalEnrollments] = await Promise.all([
            prisma.course.findMany({
                include: {
                    category: true,
                    _count: { select: { lessons: true, enrollments: true } }
                },
                orderBy: { createdAt: "desc" }
            }),
            prisma.academyCategory.findMany({
                include: { _count: { select: { courses: true } } },
                orderBy: { name: "asc" }
            }),
            prisma.courseEnrollment.count()
        ])

        return NextResponse.json({ courses, categories, totalEnrollments })
    } catch (error) {
        console.error("[ADMIN_ACADEMY_GET]", error)
        return NextResponse.json({ error: "Error fetching academy data" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { title, description, categoryId, imageUrl, published } = body

        const slug = title.toLowerCase()
            .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e")
            .replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o")
            .replace(/[úùüû]/g, "u").replace(/[ñ]/g, "n")
            .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
            + "-" + Date.now().toString(36)

        const course = await prisma.course.create({
            data: { title, slug, description: description || null, categoryId, imageUrl: imageUrl || null, published: published ?? false },
            include: { category: true, _count: { select: { lessons: true, enrollments: true } } }
        })

        return NextResponse.json({ course })
    } catch (error) {
        console.error("[ADMIN_ACADEMY_POST]", error)
        return NextResponse.json({ error: "Error creating course" }, { status: 500 })
    }
}
