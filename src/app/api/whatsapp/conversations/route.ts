import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // NEW, OPEN, etc.

    const conversations = await prisma.wAConversation.findMany({
        where: status ? { status } : {},
        include: {
            contact: true,
            owner: { select: { name: true, id: true } },
            messages: {
                take: 1,
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(conversations);
}


