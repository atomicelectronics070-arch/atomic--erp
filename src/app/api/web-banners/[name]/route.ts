export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { name: string } }) {
    try {
        const fileName = params.name;
        // Prevent path traversal
        const safeName = path.basename(fileName);
        const filePath = path.join(process.cwd(), 'public', 'web-banners', safeName);

        if (!fs.existsSync(filePath)) {
            return new NextResponse('Image not found', { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (e: any) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
