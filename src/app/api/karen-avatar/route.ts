export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const publicPath = path.join(process.cwd(), 'public', 'images', 'karen_executive_avatar.jpg');
        const localBrainPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\dd376637-2aad-48f3-96f6-8caa8e9dc5cb\\karen_executive_avatar_1791743857711.jpg';
        
        const targetPath = fs.existsSync(publicPath) ? publicPath : localBrainPath;

        if (fs.existsSync(targetPath)) {
            const imageBuffer = fs.readFileSync(targetPath);
            return new NextResponse(imageBuffer, {
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
                },
            });
        }

        return NextResponse.json({ error: 'Karen avatar not found' }, { status: 404 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
