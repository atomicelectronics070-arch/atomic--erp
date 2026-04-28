import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const categories = await prisma.academyCategory.findMany({
            include: { _count: { select: { courses: true } } },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { name, slug, description, image } = body

        const category = await prisma.academyCategory.create({
            data: { name, slug, description, image }
        })

        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }
}
