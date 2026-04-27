import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const settings = await (prisma as any).socialSettings.findFirst()
        // Never return tokens in plaintext - mask them
        if (settings) {
            return NextResponse.json({
                ...settings,
                metaPageToken: settings.metaPageToken ? '••••••••' + settings.metaPageToken.slice(-4) : null,
                youtubeRefreshToken: settings.youtubeRefreshToken ? '••••••••' + settings.youtubeRefreshToken.slice(-4) : null,
                tiktokAccessToken: settings.tiktokAccessToken ? '••••••••' + settings.tiktokAccessToken.slice(-4) : null,
                _hasMetaToken: !!settings.metaPageToken,
                _hasYouTubeToken: !!settings.youtubeRefreshToken,
                _hasTikTokToken: !!settings.tiktokAccessToken,
            })
        }
        return NextResponse.json(null)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await req.json()
        const existing = await (prisma as any).socialSettings.findFirst()
        
        // Don't overwrite masked values
        const cleanBody: any = {}
        if (body.metaPageId !== undefined) cleanBody.metaPageId = body.metaPageId
        if (body.metaPageToken && !body.metaPageToken.startsWith('••••')) cleanBody.metaPageToken = body.metaPageToken
        if (body.metaInstagramActId !== undefined) cleanBody.metaInstagramActId = body.metaInstagramActId
        if (body.youtubeChannelId !== undefined) cleanBody.youtubeChannelId = body.youtubeChannelId
        if (body.youtubeRefreshToken && !body.youtubeRefreshToken.startsWith('••••')) cleanBody.youtubeRefreshToken = body.youtubeRefreshToken
        if (body.tiktokOpenId !== undefined) cleanBody.tiktokOpenId = body.tiktokOpenId
        if (body.tiktokAccessToken && !body.tiktokAccessToken.startsWith('••••')) cleanBody.tiktokAccessToken = body.tiktokAccessToken

        if (existing) {
            await (prisma as any).socialSettings.update({ where: { id: existing.id }, data: cleanBody })
        } else {
            await (prisma as any).socialSettings.create({ data: cleanBody })
        }
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}


