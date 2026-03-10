import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { conversationId, action } = body; // action: 'SELF_ASSIGN' or 'UNASSIGN'

    if (action === 'SELF_ASSIGN') {
        const conversation = await prisma.wAConversation.findUnique({ where: { id: conversationId } });
        if (conversation?.ownerId) return NextResponse.json({ error: 'Already assigned' }, { status: 400 });

        const updated = await prisma.wAConversation.update({
            where: { id: conversationId },
            data: {
                ownerId: session.user.id,
                status: 'OPEN',
                assignments: {
                    create: {
                        assigneeId: session.user.id,
                    }
                }
            }
        });
        return NextResponse.json(updated);
    }

    if (action === 'UNASSIGN') {
        const updated = await prisma.wAConversation.update({
            where: { id: conversationId },
            data: {
                ownerId: null,
                status: 'PENDING'
            }
        });
        return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
