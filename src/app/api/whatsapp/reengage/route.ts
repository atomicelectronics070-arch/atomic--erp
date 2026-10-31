export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage, sendWhatsAppMedia, sanitizeToE164 } from '@/lib/whatsapp/service';
import { generateIntelligentApologyMessage, detectArticleAndCategory } from '@/lib/whatsapp/pauta-assets';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json({ error: 'Falta conversationId' }, { status: 400 });
        }

        const conv = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: {
                contact: true,
                messages: {
                    take: 15,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!conv || !conv.contact) {
            return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
        }

        const allMessagesText = conv.messages.map(m => m.body || '').join(' ');
        
        let headline = '';
        if (conv.messages.some(m => m.body && m.body.includes('[PAUTA_META:'))) {
            try {
                const match = allMessagesText.match(/\[PAUTA_META:([\s\S]*?)\]/);
                if (match && match[1]) {
                    const parsed = JSON.parse(match[1]);
                    if (parsed.headline) headline = parsed.headline;
                }
            } catch (_) {}
        }

        const apology = generateIntelligentApologyMessage({
            clientName: conv.contact.name || '',
            phone: conv.contact.whatsappId,
            headline: headline,
            messagesText: allMessagesText
        });

        return NextResponse.json({
            success: true,
            ...apology
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { conversationId, customMessage, includeImage = false } = body;

        if (!conversationId) {
            return NextResponse.json({ error: 'Falta conversationId' }, { status: 400 });
        }

        const conv = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: {
                contact: true,
                messages: {
                    take: 15,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!conv || !conv.contact) {
            return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
        }

        const cleanPhone = sanitizeToE164(conv.contact.whatsappId);
        const allMessagesText = conv.messages.map(m => m.body || '').join(' ');

        let headline = '';
        if (conv.messages.some(m => m.body && m.body.includes('[PAUTA_META:'))) {
            try {
                const match = allMessagesText.match(/\[PAUTA_META:([\s\S]*?)\]/);
                if (match && match[1]) {
                    const parsed = JSON.parse(match[1]);
                    if (parsed.headline) headline = parsed.headline;
                }
            } catch (_) {}
        }

        const apology = generateIntelligentApologyMessage({
            clientName: conv.contact.name || '',
            phone: conv.contact.whatsappId,
            headline: headline,
            messagesText: allMessagesText
        });

        const textToSend = (customMessage && customMessage.trim()) ? customMessage.trim() : apology.messageText;

        let metaResult: any = null;
        let finalType = 'text';
        let finalMediaUrl: string | null = null;

        if (includeImage && apology.suggestedImage) {
            metaResult = await sendWhatsAppMedia(cleanPhone, apology.suggestedImage, 'image', textToSend);
            finalType = 'image';
            finalMediaUrl = apology.suggestedImage;
        } else {
            metaResult = await sendWhatsAppMessage(cleanPhone, textToSend);
        }

        const deliveredId = metaResult?.messages?.[0]?.id || `reengage-${Date.now()}`;

        // Guardar mensaje en BD
        const message = await prisma.wAMessage.create({
            data: {
                conversationId: conv.id,
                whatsappMessageId: deliveredId,
                direction: 'OUTBOUND',
                type: finalType,
                body: textToSend,
                mediaUrl: finalMediaUrl,
                status: 'SENT',
                senderId: session.user.id
            }
        });

        // Actualizar conversación: pasa a abierta y se asigna al usuario que la atendió si estaba sin asignar
        await prisma.wAConversation.update({
            where: { id: conv.id },
            data: {
                ownerId: conv.ownerId || session.user.id,
                status: 'OPEN',
                updatedAt: new Date(),
                lastMessageAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            message: `¡Mensaje de disculpa inteligente enviado exitosamente a ${apology.clientFirstName}!`,
            data: message,
            detectedArticle: apology.detectedArticle
        });
    } catch (e: any) {
        console.error('[API_REENGAGE_ERROR]', e);
        return NextResponse.json({ error: e.message || 'Error enviando mensaje de reactivación' }, { status: 500 });
    }
}
