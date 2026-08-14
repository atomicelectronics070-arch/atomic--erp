export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage } from '@/lib/whatsapp/service';

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

        // 1. Send via Meta API
        let waMsgId = `out-${Date.now()}`;
        try {
            const waResult = await sendWhatsAppMessage(conversation.contact.whatsappId, text);
            if (waResult?.messages?.[0]?.id) waMsgId = waResult.messages[0].id;
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
            data: { status: 'OPEN', updatedAt: new Date() }
        });

        return NextResponse.json(message);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
