import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
    const body = await req.json();

    // Basic structure validation
    if (!body.object || !body.entry?.[0]?.changes?.[0]?.value) {
        return NextResponse.json({ status: 'ignored' });
    }

    const value = body.entry[0].changes[0].value;

    // Handle Messages
    if (value.messages) {
        for (const msg of value.messages) {
            const from = msg.from; // Phone number
            const contactName = value.contacts?.[0]?.profile?.name || 'Cliente WhatsApp';
            const text = msg.text?.body || '';

            // 1. Find or create contact
            const contact = await prisma.wAContact.upsert({
                where: { whatsappId: from },
                update: { name: contactName },
                create: { whatsappId: from, name: contactName }
            });

            // 2. Find or create/reopen conversation
            let conversation = await prisma.wAConversation.findFirst({
                where: {
                    contactId: contact.id,
                    status: { in: ['NEW', 'OPEN', 'PENDING'] }
                },
                orderBy: { updatedAt: 'desc' }
            });

            if (!conversation) {
                conversation = await prisma.wAConversation.create({
                    data: {
                        contactId: contact.id,
                        status: 'NEW',
                        priority: 'MEDIUM'
                    }
                });
            }

            // 3. Store message
            await prisma.wAMessage.create({
                data: {
                    conversationId: conversation.id,
                    whatsappMessageId: msg.id,
                    direction: 'INBOUND',
                    type: msg.type,
                    body: text,
                    status: 'DELIVERED'
                }
            });

            // 4. Update conversation timestamp
            await prisma.wAConversation.update({
                where: { id: conversation.id },
                data: { updatedAt: new Date(), lastMessageAt: new Date() }
            });
        }
    }

    // Handle Status Updates (sent, delivered, read)
    if (value.statuses) {
        for (const statusObj of value.statuses) {
            await prisma.wAMessage.updateMany({
                where: { whatsappMessageId: statusObj.id },
                data: {
                    status: statusObj.status.toUpperCase(),
                    createdAt: new Date() // Useful for history
                }
            });
        }
    }

    return NextResponse.json({ status: 'ok' });
}
