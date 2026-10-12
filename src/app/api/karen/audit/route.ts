export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { karenState, checkInactivityAndAlertJuan, checkAndSendMorningBriefingToJuan } from '@/lib/karen/karenBrain';

/**
 * Endpoint de Auditoría en Vivo y Diagnóstico de Mensajería de Karen
 */
export async function GET() {
    try {
        // 1. Saludo matutino diario de Karen a Juan (si es horario AM)
        await checkAndSendMorningBriefingToJuan().catch(() => {});

        // 2. Verificar si hay inactividad prolongada para alertar a Juan
        await checkInactivityAndAlertJuan().catch(() => {});

        // 3. Cargar conversaciones recientes de clientes (excluyendo a Juan)
        const conversations = await prisma.wAConversation.findMany({
            where: {
                contact: {
                    NOT: [
                        { whatsappId: { contains: '969043453' } },
                        { whatsappId: '593969043453' },
                        { whatsappId: '0969043453' }
                    ]
                }
            },
            take: 100,
            orderBy: { updatedAt: 'desc' },
            include: {
                contact: true,
                messages: {
                    take: 2,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        const totalChats = conversations.length;
        
        // Clasificación de chats
        let autoRegisterCount = 0;
        let recruitmentCount = 0;
        let salesCount = 0;
        let uncatalogedCount = 0;
        let unansweredCount = 0;
        const hotOpportunities: any[] = [];

        for (const c of conversations) {
            const lastMsg = c.messages?.[0];
            const body = (lastMsg?.body || '').toLowerCase();
            const contactName = c.contact?.name || c.contact?.whatsappId || 'Cliente';
            const phone = c.contact?.whatsappId || '';

            if (lastMsg && lastMsg.direction === 'INBOUND') {
                unansweredCount++;
            }

            if (
                c.status === 'AUTO_REGISTER' || 
                c.status === 'REGISTRO_AUTOMATICO' || 
                body.includes('prop-2026-') || 
                body.includes('código de verificación') ||
                body.includes('código de trabajador') ||
                body.includes('quiero registrarme') ||
                body.includes('ayúdame a generar')
            ) {
                autoRegisterCount++;
            } else if (
                body.includes('empleo') || 
                body.includes('trabajo') || 
                body.includes('vacante') || 
                body.includes('postul') || 
                body.includes('contrat') || 
                body.includes('asesor comercial')
            ) {
                recruitmentCount++;
            } else if (
                body.includes('precio') || 
                body.includes('cuanto') || 
                body.includes('cotiz') || 
                body.includes('proforma') || 
                body.includes('camara') || 
                body.includes('portero') || 
                body.includes('torniquet') || 
                body.includes('citofon')
            ) {
                salesCount++;

                // Detección de oportunidad caliente
                if (
                    body.includes('torniquet') || 
                    body.includes('molinete') || 
                    body.includes('collective') || 
                    body.includes('edificio') || 
                    body.includes('antihurto') || 
                    body.includes('mayorista')
                ) {
                    hotOpportunities.push({
                        contactName,
                        phone,
                        snippet: lastMsg?.body || '',
                        time: lastMsg?.createdAt
                    });
                }
            } else {
                uncatalogedCount++;
            }
        }

        // Consejos estratégicos semanales de Karen
        const weeklyAdvice = [
            "Revisar y cerrar cotizaciones de torniquetes y porteros colectivos de conjuntos residenciales.",
            "Contactar a clientes que cotizaron hace 3 días y no concretaron la transferencia bancaria.",
            "Mantener activas las pautas en Meta para asesores de venta en modalidad 2 horas.",
            "Enviar promoción masiva directa el día viernes para aprovechar el fin de semana comercial."
        ];

        return NextResponse.json({
            success: true,
            karen: {
                name: "Karen",
                role: "Jefa de Mensajería & Discernimiento de Leads",
                avatarUrl: "/api/karen-avatar",
                mode: karenState.mode,
                lastJuanNotificationAt: karenState.lastJuanNotificationAt,
                lastIncomingAt: karenState.lastIncomingAt,
                pendingSend: karenState.pendingSend,
                lastUncatalogedChat: karenState.lastUncatalogedChat,
            },
            metrics: {
                totalChats,
                autoRegisterCount,
                recruitmentCount,
                salesCount,
                uncatalogedCount,
                unansweredCount,
                hotOpportunitiesCount: hotOpportunities.length
            },
            hotOpportunities: hotOpportunities.slice(0, 5),
            weeklyAdvice,
            weeklyPromoReminder: "📢 Viernes sugerido: Campaña masiva de Videoportero 2 Pantallas HD ($285 con envío gratis) y Citofonía Kocom."
        });

    } catch (error: any) {
        console.error("[KAREN_AUDIT_ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
