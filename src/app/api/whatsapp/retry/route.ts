export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage, sendWhatsAppMedia, sendWhatsAppTemplate, sanitizeToE164 } from '@/lib/whatsapp/service';
import { handleIncomingWhatsAppBot } from '@/lib/whatsapp/ai-bot';
import { executeSmartRetryForMessage } from '@/lib/whatsapp/auto-retry';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { conversationId, messageId, action = 'retry_message', templateName } = body;

        if (!conversationId) {
            return NextResponse.json({ error: 'Falta conversationId' }, { status: 400 });
        }

        const conversation = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: {
                contact: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!conversation || !conversation.contact) {
            return NextResponse.json({ error: 'Conversación o contacto no encontrado' }, { status: 404 });
        }

        const cleanPhone = sanitizeToE164(conversation.contact.whatsappId);

        // ═══════════════════════════════════════════════════════════
        // ACCIÓN 1: REINTENTAR ENVÍO DE MENSAJE ESPECÍFICO FALLIDO
        // ═══════════════════════════════════════════════════════════
        if (action === 'retry_message') {
            let targetMsg = messageId 
                ? await prisma.wAMessage.findUnique({ where: { id: messageId } })
                : conversation.messages.find(m => m.direction === 'OUTBOUND' && m.status === 'FAILED');

            if (!targetMsg) {
                targetMsg = conversation.messages.find(m => m.direction === 'OUTBOUND');
            }

            if (!targetMsg) {
                return NextResponse.json({ error: 'No se encontró mensaje para reintentar' }, { status: 404 });
            }

            const smartResult = await executeSmartRetryForMessage(targetMsg.id, { force: true });

            if (smartResult.success) {
                return NextResponse.json({
                    success: true,
                    message: '¡Mensaje reenviado y entregado con éxito a Meta WhatsApp!',
                    data: smartResult
                });
            } else {
                return NextResponse.json({
                    success: false,
                    error: smartResult.errorMessage || 'Error al reintentar entrega en Meta WhatsApp',
                    data: smartResult
                }, { status: 400 });
            }
        }

        // ═══════════════════════════════════════════════════════════
        // ACCIÓN 2: RESUCITAR CHAT / DISPARAR RESPUESTA AUTOMÁTICA IA
        // ═══════════════════════════════════════════════════════════
        if (action === 'resuscitate_chat') {
            const lastInbound = conversation.messages.find(m => m.direction === 'INBOUND');
            const promptText = lastInbound?.body || 'Hola, deseo información';

            const replyText = await handleIncomingWhatsAppBot({
                whatsappId: cleanPhone,
                contactName: conversation.contact.name || 'Cliente WhatsApp',
                messageText: promptText,
                mediaUrl: lastInbound?.mediaUrl || null,
                conversationId: conversation.id
            });

            return NextResponse.json({
                success: true,
                message: 'Chat resucitado exitosamente con respuesta inteligente',
                reply: replyText
            });
        }

        // ═══════════════════════════════════════════════════════════
        // ACCIÓN 3: ENVIAR PLANTILLA OFICIAL META (SI VENTANA 24H EXPIRÓ)
        // ═══════════════════════════════════════════════════════════
        if (action === 'send_template') {
            const templateToUse = templateName || 'hello_world';
            const res = await sendWhatsAppTemplate(cleanPhone, templateToUse);

            await prisma.wAMessage.create({
                data: {
                    conversationId,
                    whatsappMessageId: res?.messages?.[0]?.id || `tpl-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: 'template',
                    body: `📲 [Plantilla Oficial Meta: ${templateToUse}]`,
                    status: 'SENT',
                    senderId: session.user.id
                }
            });

            return NextResponse.json({
                success: true,
                message: `Plantilla "${templateToUse}" enviada para reabrir ventana de 24 horas.`,
                data: res
            });
        }

        return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 });
    } catch (e: any) {
        console.error('[API_RETRY_ERROR]', e);
        return NextResponse.json({ 
            error: e.message || 'Error al reintentar mensaje en WhatsApp' 
        }, { status: 500 });
    }
}
