export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Prioritize Karen avatar stored in database (persists on Vercel serverless)
        try {
            const dbAvatar = await prisma.systemSetting.findFirst({
                where: { key: 'KAREN_AVATAR_BASE64' }
            });
            if (dbAvatar?.value) {
                const buffer = Buffer.from(dbAvatar.value, 'base64');
                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': 'image/jpeg',
                        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                });
            }
        } catch (dbErr) {
            console.warn('[KAREN_AVATAR_DB_WARN]', dbErr);
        }

        // 2. Fallback to Karen executive avatar on disk
        const publicPath = path.join(process.cwd(), 'public', 'images', 'karen_executive_avatar.jpg');
        const localBrainPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\dd376637-2aad-48f3-96f6-8caa8e9dc5cb\\karen_executive_avatar_1791743857711.jpg';
        
        let targetPath = '';
        if (fs.existsSync(publicPath)) targetPath = publicPath;
        else if (fs.existsSync(localBrainPath)) targetPath = localBrainPath;

        if (targetPath) {
            const imageBuffer = fs.readFileSync(targetPath);

            // Auto-sembrar en Base de Datos para persistir en Vercel
            try {
                prisma.systemSetting.upsert({
                    where: { key: 'KAREN_AVATAR_BASE64' },
                    update: { value: imageBuffer.toString('base64') },
                    create: {
                        key: 'KAREN_AVATAR_BASE64',
                        value: imageBuffer.toString('base64'),
                        description: 'Avatar oficial de Karen (Jefa de Mensajería & CRM)'
                    }
                }).catch(() => {});

                const dir = path.join(process.cwd(), 'public', 'images');
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                if (!fs.existsSync(publicPath)) fs.writeFileSync(publicPath, imageBuffer);
            } catch (_) {}

            return new NextResponse(imageBuffer, {
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
        }

        // 3. Fallback SVG placeholder if no file is present
        const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0f172a"/><circle cx="100" cy="80" r="45" fill="#38bdf8"/><path d="M30 180 C30 135 70 120 100 120 C130 120 170 135 170 180 Z" fill="#0284c7"/><text x="100" y="195" font-family="Arial" font-size="14" fill="#94a3b8" text-anchor="middle">KAREN IA</text></svg>`;
        return new NextResponse(svgFallback, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            },
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        let base64Data = '';

        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const body = await req.json();
            base64Data = body.imageBase64 || '';
            if (base64Data.includes('base64,')) {
                base64Data = base64Data.split('base64,')[1];
            }
        } else if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('file') as Blob | null;
            if (file) {
                const arrayBuffer = await file.arrayBuffer();
                base64Data = Buffer.from(arrayBuffer).toString('base64');
            }
        }

        if (!base64Data) {
            return NextResponse.json({ error: 'No se envió ninguna imagen válida' }, { status: 400 });
        }

        // Save to Database (Persists on Vercel Serverless)
        await prisma.systemSetting.upsert({
            where: { key: 'KAREN_AVATAR_BASE64' },
            update: { value: base64Data },
            create: {
                key: 'KAREN_AVATAR_BASE64',
                value: base64Data,
                description: 'Foto / Avatar oficial de Karen (Jefa de Mensajería & CRM)'
            }
        });

        // Also attempt to save to filesystem if writable
        try {
            const buffer = Buffer.from(base64Data, 'base64');
            const dir = path.join(process.cwd(), 'public', 'images');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'karen_executive_avatar.jpg'), buffer);
        } catch (fsErr) {
            // Read-only filesystem in Vercel is expected; DB persistence handles it
        }

        return NextResponse.json({
            success: true,
            message: 'Foto de Karen actualizada con éxito',
            url: `/api/karen-avatar?t=${Date.now()}`
        });
    } catch (e: any) {
        console.error('[KAREN_AVATAR_POST_ERROR]', e);
        return NextResponse.json({ error: e.message || 'Error al guardar avatar' }, { status: 500 });
    }
}
