export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const advisors = await prisma.user.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                area: true
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ advisors });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { conversationId, action, advisorName } = body; // action: 'ASSIGN', 'SELF_ASSIGN' or 'UNASSIGN'

    if (action === 'ASSIGN' || action === 'SELF_ASSIGN') {
        let targetUserId = session.user.id;
        let finalAdvisorName = session.user.name || 'Asesor Comercial';

        if (advisorName && advisorName.trim()) {
            finalAdvisorName = advisorName.trim();
            const matchedUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { name: { contains: finalAdvisorName, mode: 'insensitive' } },
                        { email: { contains: finalAdvisorName, mode: 'insensitive' } }
                    ]
                }
            });

            if (matchedUser) {
                targetUserId = matchedUser.id;
            } else {
                // If custom name provided and current user has no name or wants to adopt it
                try {
                    await prisma.user.update({
                        where: { id: session.user.id },
                        data: { name: finalAdvisorName }
                    });
                } catch (e) {}
            }
        }

        const updated = await prisma.wAConversation.update({
            where: { id: conversationId },
            data: {
                ownerId: targetUserId,
                status: 'OPEN',
                assignments: {
                    create: {
                        assignerId: session.user.id,
                        assigneeId: targetUserId,
                    }
                }
            },
            include: {
                owner: { select: { id: true, name: true } }
            }
        });
        return NextResponse.json({ success: true, conversation: updated });
    }

    if (action === 'UNASSIGN') {
        const updated = await prisma.wAConversation.update({
            where: { id: conversationId },
            data: {
                ownerId: null,
                status: 'PENDING'
            }
        });
        return NextResponse.json({ success: true, conversation: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}


