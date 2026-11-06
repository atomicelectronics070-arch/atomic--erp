export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage, sanitizeToE164 } from '@/lib/whatsapp/service';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, phone, name, topic } = body;

        if (!email && !phone) {
            return NextResponse.json(
                { error: 'Por favor ingresa al menos un correo electrónico o un número de WhatsApp.' },
                { status: 400 }
            );
        }

        const subscriberData = {
            email: email ? String(email).trim().toLowerCase() : null,
            phone: phone ? String(phone).trim() : null,
            name: name ? String(name).trim() : 'Suscriptor VIP',
            topic: topic ? String(topic).trim() : 'Seguridad Electrónica y Automatización',
            createdAt: new Date().toISOString()
        };

        // 1. Persistir en SystemSetting (Registro maestro histórico)
        try {
            const existingSetting = await prisma.systemSetting.findUnique({
                where: { key: 'NEWSLETTER_SUBSCRIBERS' }
            });

            let list: any[] = [];
            if (existingSetting && existingSetting.value) {
                try {
                    list = JSON.parse(existingSetting.value);
                } catch {
                    list = [];
                }
            }

            // Evitar duplicados exactos si coincide email o teléfono
            const isAlready = list.some((s: any) => 
                (subscriberData.email && s.email === subscriberData.email) ||
                (subscriberData.phone && s.phone === subscriberData.phone)
            );

            if (!isAlready) {
                list.push(subscriberData);
                await prisma.systemSetting.upsert({
                    where: { key: 'NEWSLETTER_SUBSCRIBERS' },
                    update: { value: JSON.stringify(list) },
                    create: {
                        key: 'NEWSLETTER_SUBSCRIBERS',
                        value: JSON.stringify(list),
                        description: 'Lista de suscriptores al Newsletter y Lead Magnets de Atomic'
                    }
                });
            }
        } catch (dbErr: any) {
            console.warn('[NEWSLETTER_SETTING_WARN]', dbErr.message);
        }

        // 2. Si proporcionó WhatsApp, vincular con CRM de Karen
        if (subscriberData.phone) {
            const cleanPhone = sanitizeToE164(subscriberData.phone);
            try {
                const contact = await prisma.wAContact.upsert({
                    where: { whatsappId: cleanPhone },
                    update: { name: subscriberData.name },
                    create: {
                        whatsappId: cleanPhone,
                        name: subscriberData.name
                    }
                });

                let conv = await prisma.wAConversation.findFirst({
                    where: { contactId: contact.id },
                    orderBy: { updatedAt: 'desc' }
                });

                if (!conv) {
                    conv = await prisma.wAConversation.create({
                        data: {
                            contactId: contact.id,
                            status: 'BOT',
                            priority: 'MEDIUM'
                        }
                    });
                }

                await prisma.wAMessage.create({
                    data: {
                        conversationId: conv.id,
                        whatsappMessageId: `news-vip-${Date.now()}`,
                        direction: 'INBOUND',
                        type: 'text',
                        body: `📰 [LEAD NEWSLETTER VIP]: ${subscriberData.name} se suscribió con interés en "${subscriberData.topic}". Email: ${subscriberData.email || 'N/A'}.`,
                        status: 'RECEIVED',
                        senderId: 'SYSTEM_NEWSLETTER'
                    }
                });

                // Enviar mensaje de bienvenida automático al cliente
                const welcomeMsg = `👋 ¡Hola ${subscriberData.name}!\n\nBienvenido/a al Círculo Tecnológico de *Atomic*. ⚡\n\nQuedas registrado/a para recibir guías exclusivas, diagramas de instalación y primicias en videoseguridad, control de accesos y domótica.\n\n¿Tienes alguna duda o proyecto en marcha actualmente? Estoy aquí para ayudarte.`;
                sendWhatsAppMessage(cleanPhone, welcomeMsg).catch(err => {
                    console.warn('[NEWSLETTER_WELCOME_WA_FAIL]', err.message);
                });

            } catch (crmErr: any) {
                console.warn('[NEWSLETTER_CRM_WARN]', crmErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            message: '¡Bienvenido/a! Te has suscrito exitosamente al Círculo Tecnológico Atomic.'
        });

    } catch (e: any) {
        console.error('[NEWSLETTER_API_ERROR]', e);
        return NextResponse.json({ error: 'Ocurrió un error al procesar tu suscripción.' }, { status: 500 });
    }
}
