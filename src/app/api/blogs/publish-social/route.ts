import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendMassEmail } from '@/lib/mail'

// Helper: Publish to Facebook Page
async function publishFacebook(settings: any, blog: any): Promise<{ success: boolean; postId?: string; error?: string }> {
    if (!settings.metaPageId || !settings.metaPageToken) {
        return { success: false, error: 'Credenciales Meta no configuradas' }
    }
    try {
        const isVideo = blog.contentType === 'video'
        const endpoint = isVideo
            ? `https://graph.facebook.com/${settings.metaPageId}/videos`
            : `https://graph.facebook.com/${settings.metaPageId}/feed`

        const body: any = {
            access_token: settings.metaPageToken,
        }

        if (isVideo) {
            body.description = `${blog.title}\n\n${blog.excerpt || ''}`
            body.file_url = blog.videoUrl
        } else {
            body.message = `${blog.title}\n\n${blog.excerpt || ''}`
            if (blog.imageUrl) body.link = blog.imageUrl
        }

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        if (data.id) return { success: true, postId: data.id }
        return { success: false, error: data.error?.message || 'Error publicando en Facebook' }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

// Helper: Publish to Instagram via Meta Graph API
async function publishInstagram(settings: any, blog: any): Promise<{ success: boolean; postId?: string; error?: string }> {
    if (!settings.metaInstagramActId || !settings.metaPageToken) {
        return { success: false, error: 'Cuenta Instagram no configurada' }
    }
    try {
        const isVideo = blog.contentType === 'video'
        const caption = `${blog.title}\n\n${blog.excerpt || ''}`

        // Step 1: Create media container
        const containerBody: any = {
            caption,
            access_token: settings.metaPageToken
        }
        if (isVideo) {
            containerBody.media_type = 'REELS'
            containerBody.video_url = blog.videoUrl
        } else {
            containerBody.image_url = blog.imageUrl
        }

        const containerRes = await fetch(
            `https://graph.facebook.com/${settings.metaInstagramActId}/media`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(containerBody)
            }
        )
        const container = await containerRes.json()
        if (!container.id) return { success: false, error: container.error?.message || 'Error creando contenedor' }

        // Step 2: Publish the container
        const publishRes = await fetch(
            `https://graph.facebook.com/${settings.metaInstagramActId}/media_publish`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ creation_id: container.id, access_token: settings.metaPageToken })
            }
        )
        const published = await publishRes.json()
        if (published.id) return { success: true, postId: published.id }
        return { success: false, error: published.error?.message || 'Error publicando en Instagram' }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

// Helper: Publish to YouTube (requires pre-uploaded video URL - just creates post/community post)
// Note: Full YouTube upload requires OAuth 2.0 flow with google-auth-library - here we do community post
async function publishYoutube(settings: any, blog: any): Promise<{ success: boolean; postId?: string; error?: string }> {
    if (!settings.youtubeRefreshToken) {
        return { success: false, error: 'Token YouTube no configurado' }
    }
    // For community posts or video descriptions - YouTube Data API v3
    // This is a placeholder - full video upload requires streaming upload
    return { success: false, error: 'YouTube requiere OAuth interactivo. Configure el canal primero.' }
}

// Helper: TikTok (Content Posting API)
async function publishTikTok(settings: any, blog: any): Promise<{ success: boolean; postId?: string; error?: string }> {
    if (!settings.tiktokAccessToken || !settings.tiktokOpenId) {
        return { success: false, error: 'Credenciales TikTok no configuradas' }
    }
    try {
        const res = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${settings.tiktokAccessToken}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                post_info: {
                    title: blog.title,
                    description: blog.excerpt || '',
                    disable_duet: false,
                    disable_comment: false,
                    disable_stitch: false,
                    privacy_level: 'PUBLIC_TO_EVERYONE',
                },
                source_info: {
                    source: 'PULL_FROM_URL',
                    video_url: blog.videoUrl,
                },
            })
        })
        const data = await res.json()
        if (data.data?.publish_id) return { success: true, postId: data.data.publish_id }
        return { success: false, error: data.error?.message || 'Error publicando en TikTok' }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user?.canCreateBlogs && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT') {
            return NextResponse.json({ error: 'No tienes permiso' }, { status: 403 })
        }

        const { blogId, platforms } = await req.json()

        const blog = await prisma.blog.findUnique({ where: { id: blogId } })
        if (!blog) return NextResponse.json({ error: 'Blog no encontrado' }, { status: 404 })

        let settings = await (prisma as any).socialSettings.findFirst({
            where: { userId: blog.authorId }
        })

        if (!settings) {
            settings = await (prisma as any).socialSettings.findFirst({
                where: { userId: null }
            })
        }
        
        if (!settings) return NextResponse.json({ error: 'No hay credenciales de redes sociales configuradas.' }, { status: 400 })

        const results: Record<string, any> = {}

        for (const platform of (platforms as string[])) {
            switch (platform) {
                case 'facebook':
                    results.facebook = await publishFacebook(settings, blog)
                    break
                case 'instagram':
                    results.instagram = await publishInstagram(settings, blog)
                    break
                case 'youtube':
                    results.youtube = await publishYoutube(settings, blog)
                    break
                case 'tiktok':
                    results.tiktok = await publishTikTok(settings, blog)
                    break
                case 'email':
                    // Fetch all client emails
                    const clients = await prisma.client.findMany({
                        where: { email: { not: null } },
                        select: { email: true }
                    })
                    const emails = clients.map(c => c.email as string).filter(Boolean)
                    
                    if (emails.length > 0) {
                        const emailContent = `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0F1923; color: white; padding: 40px; border-bottom: 4px solid #E8341A;">
                                <h1 style="text-transform: uppercase; letter-spacing: -2px; font-style: italic;">ATOMIC<span style="color: #E8341A;">.</span></h1>
                                <h2 style="font-size: 24px; margin-top: 20px;">${blog.title}</h2>
                                <p style="color: #888; font-size: 14px; margin-bottom: 30px;">${blog.excerpt || ''}</p>
                                ${blog.imageUrl ? `<img src="${blog.imageUrl}" style="width: 100%; border: 1px solid #333;" />` : ''}
                                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
                                    <a href="https://atomicsolutions.com/web/blogs/${blog.id}" style="background: #E8341A; color: white; text-decoration: none; padding: 15px 30px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Leer Artículo Completo</a>
                                </div>
                            </div>
                        `
                        results.email = await sendMassEmail(emails, `Nuevo Blog: ${blog.title}`, emailContent)
                    } else {
                        results.email = { success: false, error: 'No hay clientes con correo registrado' }
                    }
                    break
            }
        }

        // Persist results
        await prisma.blog.update({
            where: { id: blogId },
            data: {
                publishResults: JSON.stringify(results),
                socialTargets: JSON.stringify(platforms)
            }
        })

        return NextResponse.json({ success: true, results })
    } catch (e: any) {
        console.error('Social publish error:', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}


