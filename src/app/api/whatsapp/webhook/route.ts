export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'atomic_whatsapp_verify_token_2026';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && (token === VERIFY_TOKEN || token === 'atomic_whatsapp_verify_token_2026' || !process.env.WHATSAPP_VERIFY_TOKEN)) {
        return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Basic structure validation
        if (!body.object || !body.entry?.[0]?.changes?.[0]?.value) {
            return NextResponse.json({ status: 'ignored' });
        }

        const value = body.entry[0].changes[0].value;

        // Handle Inbound Messages
        if (value.messages) {
            for (const msg of value.messages) {
                const from = msg.from; // Phone number in E.164 format
                const contactName = value.contacts?.[0]?.profile?.name || 'Cliente WhatsApp';
                
                let msgType = msg.type || 'text';
                let msgBody = '';
                let mediaUrl: string | null = null;

                // 1. Check for Facebook/Instagram Ads Referral (Click to WhatsApp Ads)
                const referral = msg.referral || msg.context?.referral;
                let referralPrefix = '';
                if (referral) {
                    const referralData = {
                        sourceUrl: referral.source_url || '',
                        sourceType: referral.source_type || 'ad',
                        sourceId: referral.source_id || '',
                        headline: referral.headline || '',
                        body: referral.body || '',
                        mediaType: referral.media_type || 'image',
                        imageUrl: referral.image_url || '',
                        videoUrl: referral.video_url || '',
                        thumbnailUrl: referral.thumbnail_url || referral.image_url || '',
                        ctwaClid: referral.ctwa_clid || ''
                    };
                    referralPrefix = `[PAUTA_META:${JSON.stringify(referralData)}]\n`;
                }

                // 2. Extract content & media according to message type
                switch (msgType) {
                    case 'text':
                        msgBody = msg.text?.body || '';
                        break;
                    case 'image':
                        mediaUrl = `/api/whatsapp/media/${msg.image.id}`;
                        msgBody = msg.image.caption || '';
                        break;
                    case 'audio':
                        mediaUrl = `/api/whatsapp/media/${msg.audio.id}`;
                        msgBody = msg.audio.voice ? '🎤 Nota de voz' : '🎵 Audio';
                        break;
                    case 'video':
                        mediaUrl = `/api/whatsapp/media/${msg.video.id}`;
                        msgBody = msg.video.caption || '🎬 Video';
                        break;
                    case 'document':
                        mediaUrl = `/api/whatsapp/media/${msg.document.id}`;
                        msgBody = msg.document.filename 
                            ? `📄 ${msg.document.filename}${msg.document.caption ? ' · ' + msg.document.caption : ''}`
                            : (msg.document.caption || '📄 Documento');
                        break;
                    case 'location':
                        msgBody = `📍 Ubicación: ${msg.location.name || ''} ${msg.location.address || ''} (${msg.location.latitude}, ${msg.location.longitude})`.trim();
                        break;
                    case 'sticker':
                        mediaUrl = `/api/whatsapp/media/${msg.sticker.id}`;
                        msgBody = '🏷️ Sticker';
                        break;
                    case 'interactive':
                        msgBody = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || 'Respuesta interactiva';
                        break;
                    case 'button':
                        msgBody = msg.button?.text || 'Respuesta de botón';
                        break;
                    default:
                        msgBody = msg.text?.body || `[Mensaje ${msgType}]`;
                }

                const finalBody = referralPrefix + msgBody;

                // 3. Find or create contact
                const contact = await prisma.wAContact.upsert({
                    where: { whatsappId: from },
                    update: { name: contactName },
                    create: { whatsappId: from, name: contactName }
                });

                // 4. Find or create/reopen conversation
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
                            status: referral ? 'LEAD_PAUTA' : 'NEW',
                            priority: referral ? 'HIGH' : 'MEDIUM'
                        }
                    });
                }

                // 5. Store message safely
                try {
                    await prisma.wAMessage.create({
                        data: {
                            conversationId: conversation.id,
                            whatsappMessageId: msg.id,
                            direction: 'INBOUND',
                            type: msgType,
                            body: finalBody,
                            mediaUrl: mediaUrl,
                            status: 'DELIVERED'
                        }
                    });
                } catch (e) {
                    // Ignore duplicate message webhook retry
                }

                // 6. Update conversation timestamp
                await prisma.wAConversation.update({
                    where: { id: conversation.id },
                    data: { updatedAt: new Date(), lastMessageAt: new Date() }
                });
            }
        }

        // Handle Status Updates (sent, delivered, read)
        if (value.statuses) {
            for (const statusObj of value.statuses) {
                try {
                    await prisma.wAMessage.updateMany({
                        where: { whatsappMessageId: statusObj.id },
                        data: {
                            status: statusObj.status.toUpperCase()
                        }
                    });
                } catch (e) {
                    // Ignore status update errors
                }
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (e: any) {
        console.error('Webhook error:', e);
        return NextResponse.json({ status: 'error', message: e.message }, { status: 200 });
    }
}
