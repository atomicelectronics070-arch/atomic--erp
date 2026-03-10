import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage } from '@/lib/whatsapp/service';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { conversationId, text } = body;

    const conversation = await prisma.wAConversation.findUnique({
        where: { id: conversationId },
        include: { contact: true }
    });

    if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

    try {
        // 1. Send via API
        const waResult = await sendWhatsAppMessage(conversation.contact.whatsappId, text);

        // 2. Store in DB
        const message = await prisma.wAMessage.create({
            data: {
                conversationId,
                whatsappMessageId: waResult.messages[0].id,
                direction: 'OUTBOUND',
                type: 'text',
                body: text,
                senderId: session.user.id,
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
