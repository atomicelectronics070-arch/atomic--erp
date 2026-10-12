export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { sendWhatsAppCatalogMessage } from '@/lib/whatsapp/service';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { conversationId, phone, text, footer } = body;

        let targetPhone = phone;

        if (!targetPhone && conversationId) {
            const conv = await prisma.wAConversation.findUnique({
                where: { id: conversationId },
                include: { contact: true }
            });
            targetPhone = conv?.contact?.whatsappId;
        }

        if (!targetPhone) {
            return NextResponse.json({ error: 'Número de teléfono o ID de conversación requerido' }, { status: 400 });
        }

        const messageText = text || '¡Hola! Te compartimos nuestro catálogo oficial de equipos y productos de seguridad electrónica, automatización y tecnología de ATOMIC.';
        const footerText = footer || 'ATOMIC • Seguridad & Tecnología';

        const result = await sendWhatsAppCatalogMessage(targetPhone, messageText, footerText);

        // Registrar en base de datos si existe conversationId
        if (conversationId) {
            try {
                await prisma.wAMessage.create({
                    data: {
                        conversationId,
                        direction: 'OUTBOUND',
                        type: 'interactive',
                        body: `🛍️ Catálogo Oficial enviado: ${messageText}`,
                        status: 'SENT'
                    }
                });
            } catch (_) {}
        }

        return NextResponse.json({
            success: true,
            message: '¡Catálogo interactivo enviado exitosamente por WhatsApp!',
            result
        });

    } catch (error: any) {
        console.error('[WHATSAPP_SEND_CATALOG_ERROR]', error);
        return NextResponse.json({
            error: error.message || 'Error al enviar mensaje de catálogo'
        }, { status: 500 });
    }
}
