export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseRetryMetadata } from '@/lib/whatsapp/auto-retry';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const whereClause: any = {
            contact: {
                NOT: [
                    { whatsappId: { contains: '969043453' } },
                    { whatsappId: '593969043453' },
                    { whatsappId: '0969043453' }
                ]
            }
        };

        if (status === 'TRASH') {
            whereClause.status = 'TRASH';
        } else if (status && status !== 'ALL') {
            whereClause.status = status;
        } else if (status !== 'ALL') {
            whereClause.status = { not: 'TRASH' };
        }

        const [conversations, trashCount] = await Promise.all([
            prisma.wAConversation.findMany({
                where: whereClause,
                take: 120,
                include: {
                    contact: true,
                    owner: { select: { name: true, id: true } },
                    messages: {
                        take: 50,
                        orderBy: { createdAt: 'desc' }
                    }
                },
                orderBy: { updatedAt: 'desc' }
            }),
            prisma.wAConversation.count({
                where: {
                    status: 'TRASH',
                    contact: {
                        NOT: [
                            { whatsappId: { contains: '969043453' } },
                            { whatsappId: '593969043453' },
                            { whatsappId: '0969043453' }
                        ]
                    }
                }
            })
        ]);

        // Server-side cleanup of legacy / empty message bodies and metadata extraction
        const sanitized = conversations.map(conv => {
            const rawMessages = conv.messages || [];
            let isFromAd = conv.status === 'LEAD_PAUTA';
            let adHeadline = '';
            let failedMessage: any = null;

            const cleanedMessages = rawMessages.map(m => {
                let cleanBody = m.body || '';
                let cleanType = m.type || 'text';
                let retryMeta = null;
                
                if (m.status === 'FAILED') {
                    const parsed = parseRetryMetadata(m.errorMessage);
                    const remainingSec = parsed.nextRetryAt > Date.now() 
                        ? Math.ceil((parsed.nextRetryAt - Date.now()) / 1000) 
                        : 0;

                    retryMeta = {
                        attempt: parsed.attempt,
                        maxAttempts: parsed.maxAttempts,
                        nextRetryAt: parsed.nextRetryAt,
                        remainingSec,
                        cleanError: parsed.cleanError
                    };

                    if (!failedMessage) {
                        failedMessage = {
                            ...m,
                            retryMeta,
                            errorMessage: parsed.cleanError || m.errorMessage
                        };
                    }
                }

                if (cleanBody.includes('[PAUTA_META:')) {
                    isFromAd = true;
                    try {
                        const match = cleanBody.match(/\[PAUTA_META:([\s\S]*?)\]/);
                        if (match && match[1]) {
                            const parsed = JSON.parse(match[1]);
                            if (parsed.headline && !adHeadline) adHeadline = parsed.headline;
                        }
                    } catch (_) {}
                }

                if (cleanBody === '[Mensaje unsupported]' || cleanType === 'unsupported') {
                    cleanBody = '📢 Lead de Anuncio publicitario (Meta)';
                    cleanType = 'text';
                    isFromAd = true;
                } else if (!cleanBody.trim() && !m.mediaUrl) {
                    cleanBody = '👋 Cliente inició la conversación';
                }

                return {
                    ...m,
                    body: cleanBody,
                    type: cleanType,
                    retryMeta,
                    errorMessage: retryMeta ? retryMeta.cleanError : m.errorMessage
                };
            });

            const isBotActive = conv.status !== 'MANUAL' && conv.status !== 'TRASH';

            return {
                ...conv,
                isFromAd,
                adHeadline,
                isBotActive,
                hasFailedMessage: Boolean(failedMessage),
                failedMessage,
                messages: cleanedMessages
            };
        });

        const response = NextResponse.json(sanitized);
        response.headers.set('X-Trash-Count', trashCount.toString());
        return response;
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { conversationId, action } = body;

        if (!conversationId) {
            return NextResponse.json({ error: 'conversationId es requerido' }, { status: 400 });
        }

        if (action === 'trash') {
            const updated = await prisma.wAConversation.update({
                where: { id: conversationId },
                data: { status: 'TRASH' }
            });
            return NextResponse.json({ success: true, conversation: updated, message: 'Chat movido a la papelera' });
        }

        if (action === 'restore') {
            const updated = await prisma.wAConversation.update({
                where: { id: conversationId },
                data: { status: 'OPEN' }
            });
            return NextResponse.json({ success: true, conversation: updated, message: 'Chat restaurado con éxito' });
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('id');
        const emptyTrash = searchParams.get('emptyTrash') === 'true';

        if (emptyTrash) {
            const trashConvs = await prisma.wAConversation.findMany({
                where: { status: 'TRASH' },
                select: { id: true }
            });
            const ids = trashConvs.map(c => c.id);
            if (ids.length > 0) {
                await prisma.wAMessage.deleteMany({ where: { conversationId: { in: ids } } });
                await prisma.wANote.deleteMany({ where: { conversationId: { in: ids } } });
                await prisma.wAAssignment.deleteMany({ where: { conversationId: { in: ids } } });
                await prisma.wAConversation.deleteMany({ where: { id: { in: ids } } });
            }
            return NextResponse.json({ success: true, count: ids.length, message: 'Papelera vaciada completamente' });
        }

        if (!conversationId) {
            return NextResponse.json({ error: 'id de conversación es requerido' }, { status: 400 });
        }

        await prisma.wAMessage.deleteMany({ where: { conversationId } });
        await prisma.wANote.deleteMany({ where: { conversationId } });
        await prisma.wAAssignment.deleteMany({ where: { conversationId } });
        await prisma.wAConversation.delete({ where: { id: conversationId } });

        return NextResponse.json({ success: true, message: 'Chat eliminado permanentemente' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
