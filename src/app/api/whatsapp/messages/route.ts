export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage, sanitizeToE164 } from '@/lib/whatsapp/service';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { conversationId, text } = body;

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

        // 1. Send via Meta API
        let waMsgId = `out-${Date.now()}`;
        let metaResponsePayload: any = null;

        try {
            metaResponsePayload = await sendWhatsAppMessage(e164Phone, text);
            if (metaResponsePayload?.messages?.[0]?.id) waMsgId = metaResponsePayload.messages[0].id;
        } catch (err: any) {
            console.error('Failed to send via Meta Cloud API:', err.message);
            return NextResponse.json({ error: `Error Meta WhatsApp: ${err.message}` }, { status: 400 });
        }

        // 2. Store in DB
        const message = await prisma.wAMessage.create({
            data: {
                conversationId,
                whatsappMessageId: waMsgId,
                direction: 'OUTBOUND',
                type: 'text',
                body: text,
                senderId: session?.user?.id || null,
                status: 'SENT'
            }
        });

        // 3. Update conversation
        await prisma.wAConversation.update({
            where: { id: conversationId },
            data: { status: 'OPEN', updatedAt: new Date(), lastMessageAt: new Date() }
        });

        return NextResponse.json({
            ...message,
            metaResponse: metaResponsePayload
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
