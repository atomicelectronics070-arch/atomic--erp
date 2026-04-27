import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const publishedOnly = searchParams.get('published') === 'true'
        const limitStr = searchParams.get('limit')
        let take = limitStr ? parseInt(limitStr) : undefined

        const blogs = await prisma.blog.findMany({
            where: publishedOnly ? { published: true } : {},
            orderBy: { createdAt: 'desc' },
            take,
            include: {
                author: {
                    select: { name: true }
                }
            }
        })
        return NextResponse.json(blogs)
    } catch (error) {
        console.error("Blogs GET error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user?.canCreateBlogs && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT') {
            return NextResponse.json({ error: "No tienes permiso para crear blogs" }, { status: 403 })
        }

        const body = await req.json()
        const { title, excerpt, content, imageUrl, published, contentType, videoUrl, socialTargets } = body

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
        }

        const blog = await prisma.blog.create({
            data: {
                title,
                excerpt,
                content,
                imageUrl,
                published: published || false,
                contentType: contentType || 'article',
                videoUrl: videoUrl || null,
                socialTargets: socialTargets ? JSON.stringify(socialTargets) : null,
                authorId: session.user.id
            }
        })

        return NextResponse.json(blog)
    } catch (error) {
        console.error("Blogs POST error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { id, title, excerpt, content, imageUrl, published } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const existing = await prisma.blog.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

        if (existing.authorId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT') {
            return NextResponse.json({ error: "No tienes permiso para editar este blog" }, { status: 403 })
        }

        const updated = await prisma.blog.update({
            where: { id },
            data: { title, excerpt, content, imageUrl, published }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Blogs PUT error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const existing = await prisma.blog.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

        if (existing.authorId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT') {
            return NextResponse.json({ error: "No tienes permiso para borrar este blog" }, { status: 403 })
        }

        await prisma.blog.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Blogs DELETE error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}


