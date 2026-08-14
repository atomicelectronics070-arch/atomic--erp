export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const conversations = await prisma.wAConversation.findMany({
            where: status ? { status } : {},
            include: {
                contact: true,
                owner: { select: { name: true, id: true } },
                messages: {
                    take: 20,
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(conversations);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
