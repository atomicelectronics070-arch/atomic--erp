export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
    try {
        const { name } = await params;
        const safeName = path.basename(name);

        // Candidate paths for both local dev and Railway standalone container
        const candidatePaths = [
            path.join(process.cwd(), 'public', 'web-banners', safeName),
            path.join(process.cwd(), '..', 'public', 'web-banners', safeName),
            path.join(process.cwd(), '.next', 'standalone', 'public', 'web-banners', safeName),
            path.resolve(__dirname, '..', '..', '..', '..', '..', 'public', 'web-banners', safeName),
        ];

        let foundPath: string | null = null;
        for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
                foundPath = p;
                break;
            }
        }

        if (!foundPath) {
            console.error(`Banner image not found for: ${safeName}. Tried paths:`, candidatePaths);
            return new NextResponse('Image not found', { status: 404 });
        }

        const fileBuffer = fs.readFileSync(foundPath);
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (e: any) {
        console.error("Error serving banner image:", e);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
