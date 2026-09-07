export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_VERSION = 'v21.0';

function getFallbackSvg(text: string, subtext: string = 'Atomic WhatsApp Media') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#bg)" rx="16"/>
      <circle cx="200" cy="95" r="36" fill="#334155" opacity="0.6"/>
      <path d="M185 105l10-10 15 15 15-15 10 10" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="188" cy="85" r="4" fill="#38bdf8"/>
      <text x="200" y="165" text-anchor="middle" fill="#f1f5f9" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" font-weight="700">${text}</text>
      <text x="200" y="190" text-anchor="middle" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11">${subtext}</text>
    </svg>`;
}

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
            return new NextResponse(getFallbackSvg('ID Multimedia Ausente'), {
                status: 200,
                headers: { 'Content-Type': 'image/svg+xml' }
            });
        }

        // Check if it corresponds to a local uploaded file
        const localCheckPath = path.join(process.cwd(), 'public', 'uploads', 'whatsapp', path.basename(mediaId));
        if (fs.existsSync(localCheckPath)) {
            const buffer = fs.readFileSync(localCheckPath);
            const ext = path.extname(localCheckPath).toLowerCase();
            const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.mp4' ? 'video/mp4' : ext === '.mp3' ? 'audio/mpeg' : 'image/jpeg';
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    'Content-Type': mime,
                    'Cache-Control': 'public, max-age=86400, immutable'
                }
            });
        }

        const token = await getWhatsAppToken();
        if (!token) {
            return new NextResponse(
                getFallbackSvg('Token de WhatsApp no configurado', 'Guarda el Token en Ajustes de CRM para ver fotos'), 
                {
                    status: 200,
                    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' }
                }
            );
        }

        // 1. Get media signed URL and metadata from Meta Graph API
        const metaRes = await axios.get(`https://graph.facebook.com/${API_VERSION}/${mediaId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const downloadUrl = metaRes.data?.url;
        let mimeType = metaRes.data?.mime_type || 'application/octet-stream';

        // Normalize WhatsApp voice notes audio format
        if (mimeType.includes('ogg') || mimeType.includes('opus')) {
            mimeType = 'audio/ogg; codecs=opus';
        }

        if (!downloadUrl) {
            return new NextResponse(getFallbackSvg('Archivo no disponible en Meta'), {
                status: 200,
                headers: { 'Content-Type': 'image/svg+xml' }
            });
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

        const buffer = Buffer.from(mediaBinary.data);
        const totalSize = buffer.length;

        // Support partial content (HTTP 206) for smooth audio/video playback and seeking
        const rangeHeader = req.headers.get('range');
        if (rangeHeader && (mimeType.startsWith('audio') || mimeType.startsWith('video'))) {
            const parts = rangeHeader.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
            const chunk = buffer.subarray(start, end + 1);

            return new NextResponse(chunk, {
                status: 206,
                headers: {
                    'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunk.length.toString(),
                    'Content-Type': mimeType,
                    'Cache-Control': 'public, max-age=86400, immutable'
                }
            });
        }

        // 3. Return the full media buffer with correct content type and caching
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Length': totalSize.toString(),
                'Content-Disposition': 'inline',
                'Cache-Control': 'public, max-age=86400, immutable',
                'Accept-Ranges': 'bytes'
            }
        });

    } catch (error: any) {
        console.error('Error fetching WhatsApp media:', error?.response?.data || error.message);
        return new NextResponse(
            getFallbackSvg('No se pudo cargar el archivo', 'El archivo expiró en Meta o el Token caducó'),
            { 
                status: 200,
                headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' }
            }
        );
    }
}
