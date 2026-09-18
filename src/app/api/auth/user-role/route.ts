export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email')?.trim().toLowerCase();
        if (!email) {
            return NextResponse.json({ role: 'SALESPERSON' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true, status: true }
        });

        if (!user) {
            return NextResponse.json({ role: 'SALESPERSON' });
        }

        return NextResponse.json({ role: user.role, status: user.status });
    } catch (e) {
        return NextResponse.json({ role: 'SALESPERSON' });
    }
}
