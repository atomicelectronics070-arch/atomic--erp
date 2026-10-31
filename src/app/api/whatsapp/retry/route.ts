export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWhatsAppMessage, sendWhatsAppMedia, sendWhatsAppTemplate, sanitizeToE164 } from '@/lib/whatsapp/service';
import { handleIncomingWhatsAppBot } from '@/lib/whatsapp/ai-bot';

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
                // Si no hay un mensaje fallido específico, tomar el último outbound
                targetMsg = conversation.messages.find(m => m.direction === 'OUTBOUND');
            }

            if (!targetMsg) {
                return NextResponse.json({ error: 'No se encontró mensaje para reintentar' }, { status: 404 });
            }

            // Limpiar prefijo de error si existía para enviar el texto limpio al cliente
            let cleanBody = targetMsg.body || '';
            if (cleanBody.includes('[ERROR DE ENVÍO META]:')) {
                cleanBody = cleanBody.replace(/⚠️\s*\[ERROR DE ENVÍO META\]:\s*/g, '');
                if (cleanBody.includes('\n\nMotivo del fallo:')) {
                    cleanBody = cleanBody.split('\n\nMotivo del fallo:')[0].trim();
                }
            } else if (cleanBody.includes('[FALLO DE IA / PROCESO]')) {
                cleanBody = '¡Hola! Qué gusto saludarte. Un asesor de ATOMIC Electronics se pondrá en contacto contigo de inmediato para brindarte asesoría personalizada.';
            }

            let metaResult: any = null;
            if (targetMsg.mediaUrl) {
                metaResult = await sendWhatsAppMedia(
                    cleanPhone, 
                    targetMsg.mediaUrl, 
                    (targetMsg.type as any) || 'image', 
                    cleanBody
                );
            } else {
                metaResult = await sendWhatsAppMessage(cleanPhone, cleanBody);
            }

            const updatedMsg = await prisma.wAMessage.update({
                where: { id: targetMsg.id },
                data: {
                    body: cleanBody,
                    status: 'SENT',
                    errorMessage: null,
                    whatsappMessageId: metaResult?.messages?.[0]?.id || `retry-${Date.now()}`
                }
            });

            await prisma.wAConversation.update({
                where: { id: conversationId },
                data: { updatedAt: new Date(), lastMessageAt: new Date() }
            });

            return NextResponse.json({
                success: true,
                message: 'Mensaje reenviado y entregado con éxito a Meta WhatsApp',
                data: updatedMsg
            });
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
