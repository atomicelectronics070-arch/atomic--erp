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

        const dbBlogs = await prisma.blog.findMany({
            where: publishedOnly ? { published: true } : {},
            orderBy: { createdAt: 'desc' },
            take,
            include: {
                author: {
                    select: { name: true }
                }
            }
        })

        const systemBlogs = [
            {
                id: 'sys-blog-laptops',
                title: '🔥 Mega Catálogo de Laptops: Encuentra tu equipo ideal',
                excerpt: 'Descubre nuestra colección completa de 54 laptops gaming, workstations y ultrabooks con fotos de estudio HD.',
                content: 'Análisis técnico y comparación completa de los 54 modelos de laptops disponibles en Ecuador.',
                imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200',
                published: true,
                contentType: 'article',
                createdAt: new Date().toISOString(),
                author: { name: 'Coordinación ATOMIC' }
            },
            {
                id: 'sys-blog-bloques',
                title: '🏗️ Guía Definitiva: Máquinas de Hacer Bloques e Inversión Industrial',
                excerpt: 'Manual técnico completo sobre bloqueras industriales, cálculo de ROI y producción automatizada.',
                content: 'Guía especializada de maquinaria pesada para la fabricación de adoquines y bloques de concreto.',
                imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200',
                published: true,
                contentType: 'article',
                createdAt: new Date().toISOString(),
                author: { name: 'División Industrial' }
            },
            {
                id: 'sys-blog-campanas',
                title: '🔔 Guía Técnica de Campanas Coruña & Barreras Antipánico',
                excerpt: 'Sistemas de evacuación de emergencia, normativas de seguridad y mantenimiento industrial.',
                content: 'Especificaciones técnicas para instalación y certificación de barreras antipánico y campanas de seguridad Coruña.',
                imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
                published: true,
                contentType: 'article',
                createdAt: new Date().toISOString(),
                author: { name: 'Ingeniería de Seguridad' }
            },
            {
                id: 'sys-blog-porteros',
                title: '📹 Video Tutorial: Introducción a Videoporteros IP & Control de Acceso',
                excerpt: 'Aprende a configurar kits de videoporteros inteligentes con conexión a smartphone y monitores táctiles.',
                content: 'Demostración paso a paso sobre instalación de frentes de calle IP y apertura remota.',
                imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200',
                published: true,
                contentType: 'video',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                createdAt: new Date().toISOString(),
                author: { name: 'Soporte Técnico' }
            }
        ]

        // Merge DB blogs and System blogs ensuring no duplicate IDs
        const existingIds = new Set(dbBlogs.map(b => b.id))
        const combined = [...dbBlogs, ...systemBlogs.filter(sb => !existingIds.has(sb.id))]

        return NextResponse.json(combined)
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
        const { title, excerpt, content, imageUrl, published, contentType, videoUrl, socialTargets, environmentId, targetAccounts } = body

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
                environmentId: environmentId || null,
                targetAccounts: targetAccounts || null,
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
        const { id, title, excerpt, content, imageUrl, published, contentType, videoUrl, socialTargets, environmentId, targetAccounts } = body

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

        const existing = await prisma.blog.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

        if (existing.authorId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT') {
            return NextResponse.json({ error: "No tienes permiso para editar este blog" }, { status: 403 })
        }

        const updated = await prisma.blog.update({
            where: { id },
            data: { 
                title, 
                excerpt, 
                content, 
                imageUrl, 
                published,
                contentType,
                videoUrl,
                socialTargets: socialTargets ? JSON.stringify(socialTargets) : null,
                environmentId,
                targetAccounts
            }
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


