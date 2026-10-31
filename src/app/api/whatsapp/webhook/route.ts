export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleIncomingWhatsAppBot } from '@/lib/whatsapp/ai-bot';
import { checkAndSendMorningBriefingToJuan } from '@/lib/karen/karenBrain';

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
        // Disparar saludo matutino automático de Karen para Juan si es horario AM
        checkAndSendMorningBriefingToJuan().catch(() => {});

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
                let referral = msg.referral || 
                               msg.context?.referral || 
                               (value as any).referral || 
                               (msg.context?.referred_product ? {
                                   source_url: '',
                                   source_type: 'product_catalog',
                                   source_id: msg.context.referred_product.catalog_id || '',
                                   headline: 'Producto de Catálogo Meta',
                                   body: `ID de Retailer: ${msg.context.referred_product.product_retailer_id || ''}`,
                                   media_type: 'image',
                                   image_url: '',
                                   thumbnail_url: '',
                                   video_url: '',
                                   ctwa_clid: ''
                               } : null);

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

                // 3. Detector Heurístico de Pautas / Campañas Meta
                // Si Meta no envió el objeto referral explícito pero el mensaje o contexto proviene de un anuncio o campaña
                if (!referral && msgBody) {
                    const textLower = msgBody.toLowerCase();
                    const hasAdMention = textLower.includes('facebook') || 
                                         textLower.includes('instagram') || 
                                         textLower.includes('anuncio') || 
                                         textLower.includes('pauta') || 
                                         textLower.includes('vi esto') || 
                                         textLower.includes('vi su') || 
                                         textLower.includes('publicidad') ||
                                         textLower.includes('tiktok');

                    if (textLower.includes('empleo') || textLower.includes('vacante') || textLower.includes('trabajo') || textLower.includes('postul') || textLower.includes('contrat') || textLower.includes('laboral')) {
                        referral = {
                            source_url: 'https://atomiccotizador.shop/web/contrataciones',
                            source_type: 'ad',
                            source_id: 'PAUTA-RECLUTAMIENTO-30D',
                            headline: 'Pauta Oficial: Convocatoria Asesores Comerciales',
                            body: 'Plan Laboral de 30 días con dedicación de 2h/día, sueldo $100-$450 + comisiones y grupo de WhatsApp.',
                            media_type: 'image',
                            image_url: '/images/contrataciones/empleo-ingeniero-redes.jpg',
                            thumbnail_url: '/images/contrataciones/empleo-ingeniero-redes.jpg',
                            video_url: '',
                            ctwa_clid: ''
                        };
                    } else if (textLower.includes('torniquet') || textLower.includes('molinete') || textLower.includes('ts1000') || textLower.includes('fbl4000')) {
                        referral = {
                            source_url: 'https://atomiccotizador.shop/web/torniquetes',
                            source_type: 'ad',
                            source_id: 'PAUTA-TORNIQUETES-ZKTECO',
                            headline: 'Campaña: Torniquetes Peatonales ZKTeco Pro',
                            body: 'Trípodes TS1000 Pro en acero inoxidable 304, aletas flap barrier y molinetes anti-intrusión.',
                            media_type: 'image',
                            image_url: '/images/promociones/torniquetes-portada.jpg',
                            thumbnail_url: '/images/promociones/torniquetes-portada.jpg',
                            video_url: '',
                            ctwa_clid: ''
                        };
                    } else if (textLower.includes('portero') || textLower.includes('videoportero') || textLower.includes('citofon') || textLower.includes('collective')) {
                        referral = {
                            source_url: 'https://atomiccotizador.shop/web/videoporteros',
                            source_type: 'ad',
                            source_id: 'PAUTA-VIDEOPORTEROS-RESIDENCIAL',
                            headline: 'Campaña: Videoportero Residencial 2 Pantallas HD ($285)',
                            body: 'Frente exterior HD + 2 pantallas a color con envío gratis para casas y centrales Intelbras para edificios.',
                            media_type: 'image',
                            image_url: '/images/videoporteros/videoportero-diel-10.jpg',
                            thumbnail_url: '/images/videoporteros/videoportero-diel-10.jpg',
                            video_url: '',
                            ctwa_clid: ''
                        };
                    } else if (textLower.includes('biometric') || textLower.includes('biométric') || textLower.includes('senseface')) {
                        referral = {
                            source_url: 'https://atomiccotizador.shop/web/cerraduras-smart',
                            source_type: 'ad',
                            source_id: 'PAUTA-SENSEFACE-2A',
                            headline: 'Campaña: Biométrico Facial ZKTeco SenseFace 2A ($175)',
                            body: 'Reconocimiento facial ultra rápido, huella, tarjetas RFID, WiFi y videollamada a la App móvil.',
                            media_type: 'image',
                            image_url: '/images/promociones/senseface-portada.jpg',
                            thumbnail_url: '/images/promociones/senseface-portada.jpg',
                            video_url: '',
                            ctwa_clid: ''
                        };
                    } else if (textLower.includes('cerco') || textLower.includes('jfl') || textLower.includes('hagroy')) {
                        referral = {
                            source_url: 'https://atomiccotizador.shop/web/cercos-electricos',
                            source_type: 'ad',
                            source_id: 'PAUTA-CERCOS-PERIMETRALES',
                            headline: 'Campaña: Cercos Eléctricos JFL / Hagroy (Desde $89)',
                            body: 'Electrificadores perimetrales de alto voltaje con batería de respaldo y control por App móvil.',
                            media_type: 'image',
                            image_url: '/images/promociones/cercos-electricos-portada.jpg',
                            thumbnail_url: '/images/promociones/cercos-electricos-portada.jpg',
                            video_url: '',
                            ctwa_clid: ''
                        };
                    } else if (textLower.includes('camara') || textLower.includes('cámara') || textLower.includes('imou')) {
                        referral = {
                            source_url: 'https://atomiccotizador.shop/web/seguridad',
                            source_type: 'ad',
                            source_id: 'PAUTA-CAMARAS-IMOU',
                            headline: 'Campaña: Cámaras Robóticas IMOU 360° WiFi ($45.40)',
                            body: 'Visión nocturna 24/7, audio bidireccional y alertas inteligentes al celular con 3 años de garantía.',
                            media_type: 'image',
                            image_url: '/images/camaras/camara-wifi-bateria.jpg',
                            thumbnail_url: '/images/camaras/camara-wifi-bateria.jpg',
                            video_url: '',
                            ctwa_clid: ''
                        };
                    } else if (hasAdMention) {
                        referral = {
                            source_url: 'https://atomiccotizador.shop/web',
                            source_type: 'ad',
                            source_id: 'PAUTA-META-REDES',
                            headline: 'Lead de Anuncio Meta / Redes Sociales',
                            body: 'Cliente interactuó con una pauta activa de ATOMIC Electronics.',
                            media_type: 'image',
                            image_url: '',
                            thumbnail_url: '',
                            video_url: '',
                            ctwa_clid: ''
                        };
                    }
                }

                let referralPrefix = '';
                if (referral) {
                    const referralData = {
                        sourceUrl: referral.source_url || referral.sourceUrl || '',
                        sourceType: referral.source_type || referral.sourceType || 'ad',
                        sourceId: referral.source_id || referral.sourceId || '',
                        headline: referral.headline || '',
                        body: referral.body || '',
                        mediaType: referral.media_type || referral.mediaType || 'image',
                        imageUrl: referral.image_url || referral.imageUrl || '',
                        videoUrl: referral.video_url || referral.videoUrl || '',
                        thumbnailUrl: referral.thumbnail_url || referral.thumbnailUrl || referral.image_url || referral.imageUrl || '',
                        ctwaClid: referral.ctwa_clid || referral.ctwaClid || ''
                    };
                    referralPrefix = `[PAUTA_META:${JSON.stringify(referralData)}]\n`;
                }

                // Ensure message body is never blank, especially for pauta leads or media
                if (!msgBody || msgBody.trim() === '' || msgBody === '[Mensaje unsupported]') {
                    if (referral) {
                        msgBody = `📢 Lead originado de Pauta: ${referral.headline || referral.source_url || 'Anuncio de Meta'}`;
                    } else if (msgType === 'unsupported') {
                        msgBody = '📢 Interacción de anuncio publicitario';
                    } else if (mediaUrl) {
                        msgBody = msgType === 'image' ? '📷 Imagen' : msgType === 'audio' ? '🎵 Audio' : msgType === 'video' ? '🎬 Video' : '📄 Documento';
                    }
                }

                const finalBody = referralPrefix + msgBody;

                // 4. Find or create contact
                const contact = await prisma.wAContact.upsert({
                    where: { whatsappId: from },
                    update: { name: contactName },
                    create: { whatsappId: from, name: contactName }
                });

                // 5. Find or create/reopen conversation
                let conversation = await prisma.wAConversation.findFirst({
                    where: {
                        contactId: contact.id,
                        status: { in: ['NEW', 'OPEN', 'PENDING', 'LEAD_PAUTA'] }
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
                } else if (referral) {
                    // Actualizar estado a LEAD_PAUTA si el contacto existente interactuó desde un anuncio
                    await prisma.wAConversation.update({
                        where: { id: conversation.id },
                        data: {
                            status: 'LEAD_PAUTA',
                            priority: 'HIGH'
                        }
                    }).catch(() => {});
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

                // 7. Auto-respuesta Inteligente con IA (NVIDIA 90B Vision)
                handleIncomingWhatsAppBot({
                    whatsappId: from,
                    contactName,
                    messageText: finalBody,
                    mediaUrl,
                    conversationId: conversation.id
                }).catch(err => console.error('[BOT_AUTO_REPLY_ERROR]', err));
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
