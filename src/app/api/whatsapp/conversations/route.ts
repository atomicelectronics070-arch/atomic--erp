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
                    take: 50,
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Server-side cleanup of legacy / empty message bodies
        const sanitized = conversations.map(conv => ({
            ...conv,
            messages: (conv.messages || []).map(m => {
                let cleanBody = m.body || '';
                let cleanType = m.type || 'text';
                
                if (cleanBody === '[Mensaje unsupported]' || cleanType === 'unsupported') {
                    cleanBody = '📢 Lead de Anuncio publicitario (Meta)';
                    cleanType = 'text';
                } else if (!cleanBody.trim() && !m.mediaUrl) {
                    cleanBody = '👋 Cliente inició la conversación';
                }

                return {
                    ...m,
                    body: cleanBody,
                    type: cleanType
                };
            })
        }));

        return NextResponse.json(sanitized);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
