export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp/service';
import { PRE_APPROVED_BROADCAST_TEMPLATES } from '@/lib/karen/karenBrain';

const INTERNAL_EXCLUSIONS = [
    { whatsappId: { contains: '969043453' } },
    { whatsappId: '593969043453' },
    { whatsappId: '0969043453' },
    { whatsappId: '593980319050' },
    { whatsappId: '0980319050' }
];

const META_PRICE_PER_MSG_USD = 0.038;

// Template para la categoría 'consolas'
const BROADCAST_TEMPLATES: Record<string, { title: string; category: string; body: string }> = {
    ...Object.entries(PRE_APPROVED_BROADCAST_TEMPLATES).reduce((acc, [k, v]) => {
        acc[k] = { ...v, category: 'GENERAL' };
        return acc;
    }, {} as Record<string, { title: string; category: string; body: string }>),
    "consolas_gamer": {
        title: "Consolas & Accesorios Gamer PlayStation / Xbox / Nintendo",
        category: "CONSOLAS",
        body: `¡Hola {{1}}! 🎮 En ATOMIC Games tenemos disponibilidad inmediata de consolas y periféricos:\n\n🕹️ *PlayStation 4 & 5, Nintendo Switch y Mandos Inalámbricos Originales.*\n• Servicio técnico especializado y mantenimiento preventivo.\n• Garantía directa por escrito.\n• Envíos inmediatos a todo el país.\n\n🌐 Revisa nuestro inventario gamer: https://atomiccotizador.shop/web/mantenimiento-consolas\n\n¿Buscas alguna consola o repuesto en particular? ¡Respóndenos aquí! 👾`
    }
};

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const segment = searchParams.get('segment') || 'ALL';

        const totalEligible = await prisma.wAContact.count({
            where: {
                NOT: INTERNAL_EXCLUSIONS
            }
        });

        const trashCount = await prisma.wAConversation.count({
            where: {
                status: 'TRASH',
                contact: { NOT: INTERNAL_EXCLUSIONS }
            }
        });

        // Contar por segmentos basados en conversaciones
        const conversations = await prisma.wAConversation.findMany({
            where: {
                status: { not: 'TRASH' },
                contact: { NOT: INTERNAL_EXCLUSIONS }
            },
            include: {
                contact: true,
                messages: { take: 5, orderBy: { createdAt: 'desc' } }
            }
        });

        let consolasCount = 0;
        let residencialCount = 0;
        let empresarialCount = 0;
        let unansweredCount = 0;

        for (const conv of conversations) {
            const allText = conv.messages.map(m => m.body || '').join(' ').toLowerCase();
            const lastMsg = conv.messages[0];
            if (lastMsg && lastMsg.direction === 'inbound') {
                unansweredCount++;
            }
            if (/(playstation|ps4|ps5|xbox|nintendo|switch|consola|consolas|mando|gamepad|videojuego)/i.test(allText)) {
                consolasCount++;
            } else if (/(empresa|local|negocio|bodega|oficina|antena|antihurto|torniquete|barrera)/i.test(allText)) {
                empresarialCount++;
            } else if (/(c[aá]mara|videoportero|citofono|hogar|casa|conjunto|residencial)/i.test(allText)) {
                residencialCount++;
            }
        }

        const templatesList = Object.entries(BROADCAST_TEMPLATES).map(([key, data]) => ({
            id: key,
            title: data.title,
            category: data.category,
            body: data.body,
            estimatedCost: (totalEligible * META_PRICE_PER_MSG_USD).toFixed(2)
        }));

        return NextResponse.json({
            success: true,
            totalEligible,
            trashCount,
            segments: {
                ALL: totalEligible,
                CONSOLAS: consolasCount,
                RESIDENCIAL: residencialCount,
                EMPRESARIAL: empresarialCount,
                UNANSWERED: unansweredCount
            },
            metaPricePerMessageUsd: META_PRICE_PER_MSG_USD,
            estimatedTotalBudgetUsd: (totalEligible * META_PRICE_PER_MSG_USD).toFixed(2),
            templates: templatesList
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            templateId, 
            customBody, 
            segment = 'ALL', 
            confirmed = false,
            specificContactIds 
        } = body;

        let messageText = customBody;
        if (!messageText && templateId && BROADCAST_TEMPLATES[templateId]) {
            messageText = BROADCAST_TEMPLATES[templateId].body;
        }

        if (!messageText) {
            return NextResponse.json({ error: 'Debes seleccionar una plantilla o redactar el texto del mensaje.' }, { status: 400 });
        }

        // Obtener contactos según el segmento
        let contacts: Array<{ id: string; name: string | null; whatsappId: string }> = [];

        if (Array.isArray(specificContactIds) && specificContactIds.length > 0) {
            contacts = await prisma.wAContact.findMany({
                where: {
                    id: { in: specificContactIds },
                    NOT: INTERNAL_EXCLUSIONS
                },
                select: { id: true, name: true, whatsappId: true }
            });
        } else {
            contacts = await prisma.wAContact.findMany({
                where: {
                    NOT: INTERNAL_EXCLUSIONS
                },
                select: { id: true, name: true, whatsappId: true }
            });
        }

        const recipientCount = contacts.length;
        const totalBudgetUsd = parseFloat((recipientCount * META_PRICE_PER_MSG_USD).toFixed(2));

        // Si no está confirmado explícitamente, devolver resumen y pedir confirmación
        if (!confirmed) {
            return NextResponse.json({
                success: false,
                requiresConfirmation: true,
                recipientCount,
                metaPricePerMessageUsd: META_PRICE_PER_MSG_USD,
                totalBudgetUsd,
                previewMessage: messageText.replace(/\{\{1\}\}/g, 'Cliente'),
                message: `El envío masivo alcanzará a ${recipientCount} contactos con un presupuesto estimado de ~$${totalBudgetUsd} USD en Meta Cloud API. Confirma para proceder.`
            });
        }

        // Ejecutar el envío masivo en segundo plano de forma segura
        let sentCount = 0;
        let failedCount = 0;

        for (const contact of contacts) {
            try {
                const personalizedBody = messageText.replace(/\{\{1\}\}/g, contact.name || 'estimado/a');
                await sendWhatsAppMessage(contact.whatsappId, personalizedBody);

                // Encontrar o crear conversación
                let conv = await prisma.wAConversation.findFirst({
                    where: { contactId: contact.id }
                });

                if (!conv) {
                    conv = await prisma.wAConversation.create({
                        data: {
                            contactId: contact.id,
                            status: 'OPEN',
                            priority: 'MEDIUM',
                            lastMessageAt: new Date()
                        }
                    });
                } else {
                    await prisma.wAConversation.update({
                        where: { id: conv.id },
                        data: { lastMessageAt: new Date() }
                    });
                }

                // Registrar mensaje en la base de datos
                await prisma.wAMessage.create({
                    data: {
                        conversationId: conv.id,
                        direction: 'outbound',
                        type: 'text',
                        body: personalizedBody,
                        status: 'SENT'
                    }
                });

                sentCount++;
            } catch (err) {
                console.error(`Error enviando masivo a ${contact.whatsappId}:`, err);
                failedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            recipientCount,
            sentCount,
            failedCount,
            totalBudgetUsd,
            message: `Envío masivo finalizado. ${sentCount} mensajes enviados exitosamente (${failedCount} con error). Costo estimado: $${totalBudgetUsd} USD.`
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
