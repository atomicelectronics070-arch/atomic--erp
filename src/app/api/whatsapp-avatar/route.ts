export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Prioritize official WhatsApp profile picture stored in database
        try {
            const dbSetting = await prisma.systemSetting.findFirst({
                where: { key: 'WHATSAPP_PROFILE_BASE64' }
            });
            if (dbSetting?.value) {
                const buffer = Buffer.from(dbSetting.value, 'base64');
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
            console.warn('[WHATSAPP_AVATAR_DB_WARN]', dbErr);
        }

        // 2. Fallback to official ATOMIC images on disk
        const atomicPublicPath = path.join(process.cwd(), 'public', 'images', 'atomic_whatsapp_profile.jpg');
        const standardPublicPath = path.join(process.cwd(), 'public', 'images', 'whatsapp_profile.jpg');
        const userUploadedBrainPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\dd376637-2aad-48f3-96f6-8caa8e9dc5cb\\.user_uploaded\\media_1791779100566.jpg';

        let targetPath = '';
        if (fs.existsSync(atomicPublicPath)) targetPath = atomicPublicPath;
        else if (fs.existsSync(userUploadedBrainPath)) targetPath = userUploadedBrainPath;
        else if (fs.existsSync(standardPublicPath)) targetPath = standardPublicPath;

        if (targetPath) {
            const imageBuffer = fs.readFileSync(targetPath);

            // Auto-seed in Database and local disk for persistence
            try {
                const base64Str = imageBuffer.toString('base64');
                prisma.systemSetting.upsert({
                    where: { key: 'WHATSAPP_PROFILE_BASE64' },
                    update: { value: base64Str },
                    create: {
                        key: 'WHATSAPP_PROFILE_BASE64',
                        value: base64Str,
                        description: 'Foto oficial de WhatsApp Business (ATOMIC)'
                    }
                }).catch(() => {});

                const dir = path.join(process.cwd(), 'public', 'images');
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                if (!fs.existsSync(atomicPublicPath)) fs.writeFileSync(atomicPublicPath, imageBuffer);
                if (!fs.existsSync(standardPublicPath)) fs.writeFileSync(standardPublicPath, imageBuffer);
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

        // 3. Fallback SVG if no image is found
        const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0369a1"/><circle cx="100" cy="100" r="70" fill="#0284c7"/><text x="100" y="108" font-family="Arial" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">ATOMIC</text></svg>`;
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

        // Save to Database
        await prisma.systemSetting.upsert({
            where: { key: 'WHATSAPP_PROFILE_BASE64' },
            update: { value: base64Data },
            create: {
                key: 'WHATSAPP_PROFILE_BASE64',
                value: base64Data,
                description: 'Foto oficial de WhatsApp Business (ATOMIC)'
            }
        });

        // Also save to disk
        try {
            const buffer = Buffer.from(base64Data, 'base64');
            const dir = path.join(process.cwd(), 'public', 'images');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'atomic_whatsapp_profile.jpg'), buffer);
            fs.writeFileSync(path.join(dir, 'whatsapp_profile.jpg'), buffer);
        } catch (_) {}

        return NextResponse.json({
            success: true,
            message: 'Foto oficial de WhatsApp Business actualizada con éxito',
            url: `/api/whatsapp-avatar?t=${Date.now()}`
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error al guardar foto' }, { status: 500 });
    }
}
