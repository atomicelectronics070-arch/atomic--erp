export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage, sendWhatsAppMedia, sanitizeToE164 } from '@/lib/whatsapp/service';
import { formatRetryMetadata } from '@/lib/whatsapp/auto-retry';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { conversationId, text = '', type = 'text', mediaUrl, filename } = body;

        const conversation = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: { contact: true }
        });

        if (!conversation) return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });

        // Ensure recipient phone is sanitized to E.164 (593...)
        const rawPhone = conversation.contact.whatsappId;
        const e164Phone = sanitizeToE164(rawPhone);

        // Update contact in DB if raw phone was not in E.164
        if (rawPhone !== e164Phone) {
            try {
                await prisma.wAContact.update({
                    where: { id: conversation.contact.id },
                    data: { whatsappId: e164Phone }
                });
            } catch (e) {
                // Ignore if unique constraint collision occurs
            }
        }

        // 1. Send via Meta API (either rich media or text)
        let waMsgId = `out-${Date.now()}`;
        let metaResponsePayload: any = null;
        let messageStatus = 'SENT';
        let messageError: string | null = null;

        try {
            if (mediaUrl) {
                metaResponsePayload = await sendWhatsAppMedia(e164Phone, mediaUrl, type, text, filename);
            } else {
                metaResponsePayload = await sendWhatsAppMessage(e164Phone, text);
            }
            if (metaResponsePayload?.messages?.[0]?.id) waMsgId = metaResponsePayload.messages[0].id;
        } catch (err: any) {
            console.warn('Initial Meta Cloud API dispatch failed. Queuing for intelligent auto-retry:', err.message);
            messageStatus = 'FAILED';
            waMsgId = `fail-${Date.now()}`;
            const nextAt = Date.now() + 15000; // First auto-retry in 15 seconds
            messageError = formatRetryMetadata(0, nextAt, err.message || 'Error inicial de entrega');
        }

        // 2. Store in DB (so message is preserved even on transient network/Meta error)
        const message = await prisma.wAMessage.create({
            data: {
                conversationId,
                whatsappMessageId: waMsgId,
                direction: 'OUTBOUND',
                type: type || 'text',
                body: text || (type === 'image' ? '📷 Imagen' : type === 'audio' ? '🎵 Audio' : type === 'video' ? '🎬 Video' : '📄 Documento'),
                mediaUrl: mediaUrl || null,
                senderId: session?.user?.id || null,
                status: messageStatus,
                errorMessage: messageError
            }
        });

        // 3. Update conversation
        await prisma.wAConversation.update({
            where: { id: conversationId },
            data: { 
                status: messageStatus === 'FAILED' ? 'URGENT' : 'OPEN', 
                updatedAt: new Date(), 
                lastMessageAt: new Date() 
            }
        });

        if (messageStatus === 'FAILED') {
            return NextResponse.json({
                ...message,
                warning: 'Mensaje encolado en Motor de Reintento Inteligente. Se enviará automáticamente en segundos.',
                autoRetryQueued: true,
                nextRetryInSec: 15
            }, { status: 202 });
        }

        return NextResponse.json({
            ...message,
            metaResponse: metaResponsePayload
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
