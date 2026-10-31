export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseRetryMetadata } from '@/lib/whatsapp/auto-retry';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const conversations = await prisma.wAConversation.findMany({
            where: {
                ...(status ? { status } : {}),
                contact: {
                    NOT: [
                        { whatsappId: { contains: '969043453' } },
                        { whatsappId: '593969043453' },
                        { whatsappId: '0969043453' }
                    ]
                }
            },
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

            return {
                ...conv,
                isFromAd,
                adHeadline,
                hasFailedMessage: Boolean(failedMessage),
                failedMessage,
                messages: cleanedMessages
            };
        });

        return NextResponse.json(sanitized);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
