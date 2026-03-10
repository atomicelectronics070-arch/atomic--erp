import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email') || 'juanguzman7100@gmail.com';
        const testPassword = searchParams.get('pass') || 'Jp2024013gg002';

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found in Vercel database', email }, { status: 404 });
        }

        const match = await bcrypt.compare(testPassword, user.passwordHash);

        return NextResponse.json({
            success: true,
            email: user.email,
            status: user.status,
            role: user.role,
            hashSnippet: user.passwordHash.substring(0, 15) + '...',
            passwordMatch: match,
            envUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'MISSING',
            nextAuthUrl: process.env.NEXTAUTH_URL || 'MISSING'
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Prisma Connection Error', message: error.message }, { status: 500 });
    }
}
