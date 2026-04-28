import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId')

    try {
        const courses = await prisma.course.findMany({
            where: categoryId ? { categoryId } : {},
            include: { 
                category: true,
                _count: { select: { lessons: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(courses)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { title, slug, description, imageUrl, categoryId, published } = body

        const course = await prisma.course.create({
            data: { title, slug, description, imageUrl, categoryId, published: published || false }
        })

        return NextResponse.json(course)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
    }
}
