export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

const API_VERSION = 'v21.0';

async function getWhatsAppToken() {
    let token = process.env.WHATSAPP_TOKEN;
    try {
        const dbToken = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_TOKEN' } });
        if (dbToken?.value) token = dbToken.value;
    } catch (e) {
        // Fallback to env
    }
    return token;
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ mediaId: string }> | { mediaId: string } }
) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const { mediaId } = resolvedParams;

        if (!mediaId) {
            return new NextResponse('Media ID missing', { status: 400 });
        }

        const token = await getWhatsAppToken();
        if (!token) {
            return new NextResponse('WhatsApp Token not configured', { status: 500 });
        }

        // 1. Get media signed URL and metadata from Meta Graph API
        const metaRes = await axios.get(`https://graph.facebook.com/${API_VERSION}/${mediaId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const downloadUrl = metaRes.data?.url;
        const mimeType = metaRes.data?.mime_type || 'application/octet-stream';

        if (!downloadUrl) {
            return new NextResponse('Media URL not found on Meta servers', { status: 404 });
        }

        // 2. Fetch the binary media data from Meta's signed URL
        const mediaBinary = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            headers: {
                Authorization: `Bearer ${token}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            maxRedirects: 5
        });

        // 3. Return the media buffer with correct content type and caching
        return new NextResponse(mediaBinary.data, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Length': mediaBinary.data.byteLength.toString(),
                'Content-Disposition': 'inline',
                'Cache-Control': 'public, max-age=86400, immutable',
                'Accept-Ranges': 'bytes'
            }
        });

    } catch (error: any) {
        console.error('Error fetching WhatsApp media:', error?.response?.data || error.message);
        return new NextResponse(JSON.stringify({ error: error.message }), { 
            status: 502,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
