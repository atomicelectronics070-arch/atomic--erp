export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'whatsapp');
        await mkdir(uploadDir, { recursive: true });

        // Generate safe unique filename
        const ext = path.extname(file.name) || '.jpg';
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filePath = path.join(uploadDir, cleanName);

        await writeFile(filePath, buffer);

        // Determine media type
        let mediaType: 'image' | 'audio' | 'video' | 'document' = 'document';
        if (file.type.startsWith('image/')) mediaType = 'image';
        else if (file.type.startsWith('audio/')) mediaType = 'audio';
        else if (file.type.startsWith('video/')) mediaType = 'video';

        const publicUrl = `/uploads/whatsapp/${cleanName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            mediaType,
            filename: file.name,
            size: file.size
        });
    } catch (error: any) {
        console.error('Error uploading WhatsApp media:', error);
        return NextResponse.json({ error: error.message || 'Error al subir archivo' }, { status: 500 });
    }
}
