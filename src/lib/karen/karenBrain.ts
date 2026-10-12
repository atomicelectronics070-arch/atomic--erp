import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp/service";

export const JUAN_PHONE = "593969043453";
export const JUAN_PHONE_LOCAL = "0969043453";

export interface PendingSendAction {
    recipientPhone: string;
    recipientName: string;
    messageText: string;
    requestedAt: number;
}

export interface KarenState {
    mode: "AUTOMATIC" | "MANUAL" | "AWAITING_APPROVAL";
    lastJuanNotificationAt: number;
    lastIncomingAt: number;
    pendingSend: PendingSendAction | null;
    burstCounters: {
        recruitment: number;
        sales: number;
        autoRegister: number;
        uncataloged: number;
        firstTime: number;
    };
    lastUncatalogedChat: {
        conversationId: string;
        contactName: string;
        phone: string;
        lastMessage: string;
        detectedTopic?: string;
    } | null;
}

// Karen Global In-Memory Persistent State
export const karenState: KarenState = {
    mode: "AUTOMATIC",
    lastJuanNotificationAt: 0,
    lastIncomingAt: Date.now(),
    pendingSend: null,
    burstCounters: {
        recruitment: 0,
        sales: 0,
        autoRegister: 0,
        uncataloged: 0,
        firstTime: 0
    },
    lastUncatalogedChat: null
};

/**
 * Valida si el número telefónico corresponde a Juan (Dueño / Administrador)
 */
export function isJuan(phone: string): boolean {
    if (!phone) return false;
    const clean = phone.replace(/\D/g, "");
    return clean === "593969043453" || clean === "0969043453" || clean.endsWith("969043453");
}

/**
 * Procesa comandos directos enviados por Juan a Karen a través de WhatsApp o del CRM
 */
export async function processJuanCommand(messageText: string): Promise<string> {
    const raw = (messageText || "").trim();
    const lower = raw.toLowerCase();

    // ─────────────────────────────────────────────────────────────────────────
    // 1. EMOJI ROJO 🔴 / PARAR -> MODO MANUAL
    // ─────────────────────────────────────────────────────────────────────────
    if (
        raw.includes("🔴") || 
        raw.includes("🛑") || 
        lower === "parar" || 
        lower === "stop" || 
        lower === "manual" ||
        lower.includes("modo manual") ||
        lower.includes("para el bot")
    ) {
        karenState.mode = "MANUAL";
        return `🔴 **Modo MANUAL activado, Juan.**\n\nHe pausado las respuestas automáticas de la IA en WhatsApp. Te dejo el control total a ti. Ningún bot responderá automáticamente hasta que me envíes un emoji verde 🟢 o me digas 'auto'.`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. EMOJI VERDE 🟢 / SEGUIR -> MODO AUTOMÁTICO
    // ─────────────────────────────────────────────────────────────────────────
    if (
        raw.includes("🟢") || 
        lower === "seguir" || 
        lower === "continuar" || 
        lower === "auto" || 
        lower.includes("modo automatico") ||
        lower.includes("modo automático") ||
        lower.includes("activa el bot")
    ) {
        karenState.mode = "AUTOMATIC";
        return `🟢 **Modo AUTOMÁTICO reanudado, Juan.**\n\nLa IA vuelve a operar con normalidad. Estoy respondiendo y canalizando leads de ventas, contratación y registro automático en tiempo real.`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. EMOJI AMARILLO 🟡 -> REPORTE DE CONTEXTO Y SOLICITUD DE AUTORIZACIÓN
    // ─────────────────────────────────────────────────────────────────────────
    if (raw.includes("🟡") || lower === "amarillo" || lower === "autorizacion" || lower === "autorización") {
        karenState.mode = "AWAITING_APPROVAL";

        // Obtener estadísticas en vivo de la base de datos
        const activeConversations = await prisma.wAConversation.findMany({
            take: 15,
            orderBy: { updatedAt: "desc" },
            include: {
                contact: true,
                messages: { take: 1, orderBy: { createdAt: "desc" } }
            }
        });

        const autoRegisterCount = activeConversations.filter(c => 
            c.status === "AUTO_REGISTER" || c.status === "REGISTRO_AUTOMATICO"
        ).length;

        const unreadPending = activeConversations.filter(c => 
            c.messages.length > 0 && c.messages[0].direction === "INBOUND"
        ).length;

        return `🟡 **Juan, aquí tienes el contexto general en vivo:**

📊 **Estado de la Mensajería:**
• Modo actual: **Modo Autorización 🟡 (Consulta previa)**
• Chats recientes monitoreados: **${activeConversations.length}**
• Registros & Proformas automáticas: **${autoRegisterCount}**
• Mensajes de clientes esperando respuesta: **${unreadPending}**

${karenState.lastUncatalogedChat ? `⚠️ **Chat pendiente de atención:** ${karenState.lastUncatalogedChat.contactName} (${karenState.lastUncatalogedChat.phone})` : "✅ Todos los chats principales están catalogados."}

¿Deseas que ejecute alguna respuesta o acción específica tras este reporte? Si deseas enviar un mensaje a un cliente, dime: *'Envía [mensaje] a [nombre o número]'*.`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. PREGUNTA: "¿DE QUÉ TRATA ESE CHAT?"
    // ─────────────────────────────────────────────────────────────────────────
    if (
        lower.includes("de que trata") || 
        lower.includes("de qué trata") || 
        lower.includes("que dice el chat") || 
        lower.includes("qué dice el chat") ||
        lower.includes("explicame el chat")
    ) {
        if (!karenState.lastUncatalogedChat) {
            // Buscar la última conversación entrante
            const lastConv = await prisma.wAConversation.findFirst({
                orderBy: { updatedAt: "desc" },
                include: {
                    contact: true,
                    messages: { take: 3, orderBy: { createdAt: "desc" } }
                }
            });

            if (!lastConv) {
                return `Juan, en este momento no hay chats activos o sin catalogar en la bandeja. Todo está al día.`;
            }

            const msgs = (lastConv.messages || []).map(m => m.body).join(" | ");
            return `Juan, el último chat registrado es de **${lastConv.contact?.name || lastConv.contact?.whatsappId}** (${lastConv.contact?.whatsappId}):\n\n💬 *Mensaje reciente:* "${msgs}"\n\n¿Quieres que le responda ofreciéndole nuestro catálogo de productos o prefieres que le envíe un mensaje específico redactado por ti?`;
        }

        const chat = karenState.lastUncatalogedChat;
        return `Juan, el chat de **${chat.contactName}** (${chat.phone}) trata de lo siguiente:\n\n💬 *Último mensaje recibido:* "${chat.lastMessage}"\n📌 *Asunto:* ${chat.detectedTopic || "Consulta general no clasificada"}.\n\n¿Cómo deseas que le responda? Dime: *'Envía [tu respuesta] a ${chat.contactName}'* y yo lo despacho con tu confirmación.`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. CONFIRMACIÓN: JUAN DICE "SÍ" PARA ENVIAR MENSAJE PENDIENTE
    // ─────────────────────────────────────────────────────────────────────────
    if ((lower === "si" || lower === "sí" || lower === "dale" || lower === "confirmo" || lower === "enviar") && karenState.pendingSend) {
        const action = karenState.pendingSend;
        karenState.pendingSend = null;

        try {
            await sendWhatsAppMessage(action.recipientPhone, action.messageText);

            // Registrar en base de datos
            const contact = await prisma.wAContact.findFirst({
                where: { whatsappId: action.recipientPhone }
            });

            if (contact) {
                const conv = await prisma.wAConversation.findFirst({
                    where: { contactId: contact.id }
                });
                if (conv) {
                    await prisma.wAMessage.create({
                        data: {
                            conversationId: conv.id,
                            direction: "OUTBOUND",
                            type: "text",
                            body: action.messageText,
                            status: "SENT",
                            senderId: "KAREN_CHIEF_DIRECT"
                        }
                    });
                }
            }

            // Buscar mensajes pendientes y leídos sin responder para el reporte adjunto
            const pendingList = await prisma.wAConversation.findMany({
                where: {
                    messages: {
                        some: { direction: "INBOUND" }
                    }
                },
                take: 3,
                include: { contact: true, messages: { take: 1, orderBy: { createdAt: "desc" } } }
            });

            const pendingNames = pendingList
                .filter(p => p.messages[0]?.direction === "INBOUND")
                .map(p => `• ${p.contact?.name || p.contact?.whatsappId}`)
                .join("\n") || "• Ninguno en este momento";

            return `✅ **¡Listo, Juan! Mensaje enviado con éxito.**
Destinatario: **${action.recipientName}** (${action.recipientPhone})

📋 **Reporte de Pendientes:**
Tenemos mensajes pendientes o leídos sin responder de:
${pendingNames}

💡 **Te sugiero hacer lo siguiente esta semana:**
1. Enviar recordatorio a clientes que cotizaron videoporteros y torniquetes hace más de 48 horas.
2. Mantener encendida la pauta de Asesores Comerciales en Meta para alimentar la cola de inducción.
3. El viernes recuerda enviar la promoción semanal directa a todos los contactos de la base de datos para activar compras de fin de semana.`;
        } catch (err: any) {
            return `⚠️ Error al despachar el mensaje por WhatsApp: ${err.message}. Verifica que el número ${action.recipientPhone} sea válido.`;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 6. SOLICITUD DE ENVÍO: "ENVÍA [MENSAJE] A [PERSONA / NÚMERO]"
    // ─────────────────────────────────────────────────────────────────────────
    const sendMatch = raw.match(/(?:envia|envía|mandale|mándale|escribe|escríbele|dile)\s+(?:a\s+)?([^\s:]+)\s*(?:que\s+|:\s*|\s+)([\s\S]+)/i);
    if (sendMatch) {
        const rawTarget = sendMatch[1].trim();
        const msgToSend = sendMatch[2].trim();

        // Buscar el contacto por teléfono o nombre
        let targetPhone = rawTarget.replace(/\D/g, "");
        let targetName = rawTarget;

        if (targetPhone.length < 9) {
            // Es un nombre, buscar en BD
            const contact = await prisma.wAContact.findFirst({
                where: { name: { contains: rawTarget, mode: "insensitive" } }
            });
            if (contact) {
                targetPhone = contact.whatsappId;
                targetName = contact.name || rawTarget;
            } else if (karenState.lastUncatalogedChat && karenState.lastUncatalogedChat.contactName.toLowerCase().includes(rawTarget.toLowerCase())) {
                targetPhone = karenState.lastUncatalogedChat.phone;
                targetName = karenState.lastUncatalogedChat.contactName;
            }
        }

        if (!targetPhone) {
            return `Juan, no encontré el número de celular de '${rawTarget}'. Por favor indícame su número (ejemplo: *'Envía [mensaje] a 0998765432'*).`;
        }

        // Guardar para confirmación
        karenState.pendingSend = {
            recipientPhone: targetPhone,
            recipientName: targetName,
            messageText: msgToSend,
            requestedAt: Date.now()
        };

        return `De acuerdo, ¿confirmas enviar este mensaje a **${targetName}** (${targetPhone})?\n\n📝 **Mensaje:**\n"${msgToSend}"\n\n👉 Responde **SÍ** para enviar.`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 7. RESPUESTA INTELIGENTE CONSULTIVA / AUDITORÍA GENERAL PARA JUAN
    // ─────────────────────────────────────────────────────────────────────────
    return `Hola Juan, soy **Karen**, tu Jefa de Mensajería y Auditoría de Leads. 💼

Aquí tienes un resumen ejecutivo de lo que puedo hacer por ti ahora mismo:
• 🔴 Envía un emoji rojo para pausar la IA y pasar a **Modo Manual**.
• 🟢 Envía un emoji verde para reanudar la **Atención Automática**.
• 🟡 Envía un emoji amarillo para darte el **Contexto General** y pedirte autorización.
• Dime *'¿De qué trata ese chat?'* para analizarte cualquier conversación entrante.
• Dime *'Envía [mensaje] a [persona o número]'* y te pediré confirmación con un 'SÍ' antes de despachar.
• ¿Quieres un análisis completo de las oportunidades de venta de la semana? Solo pídemelo.`;
}

/**
 * Notifica a Juan sobre mensajes entrantes en tiempo real (agrupados cada 5 minutos)
 */
export async function notifyJuanIncomingBurst() {
    const now = Date.now();
    const counters = karenState.burstCounters;
    const total = counters.recruitment + counters.sales + counters.autoRegister + counters.uncataloged;

    if (total === 0) return;

    // Respetar ventana de 5 minutos si ya enviamos notificación reciente
    if (now - karenState.lastJuanNotificationAt < 5 * 60 * 1000) {
        return;
    }

    karenState.lastJuanNotificationAt = now;

    const summaryParts: string[] = [];
    if (counters.recruitment > 0) summaryParts.push(`💼 ${counters.recruitment} lead(s) de Contratación / Empleo`);
    if (counters.autoRegister > 0) summaryParts.push(`⚡ ${counters.autoRegister} de Registro / Cotización Automática`);
    if (counters.sales > 0) summaryParts.push(`🛒 ${counters.sales} de Ventas & Catálogo`);
    if (counters.uncataloged > 0) summaryParts.push(`❓ ${counters.uncataloged} por catalogar`);

    const message = 
`Juan, excelente, están entrando mensajes: estamos respondiendo a:
${summaryParts.join("\n")}

La IA está atendiendo a los clientes con fluidez. Te mantendré informado. 🚀`;

    // Reset counters
    counters.recruitment = 0;
    counters.sales = 0;
    counters.autoRegister = 0;
    counters.uncataloged = 0;

    try {
        await sendWhatsAppMessage(JUAN_PHONE, message);
        console.log(`[KAREN_NOTIFIED_JUAN] Resumen enviado a ${JUAN_PHONE}`);
    } catch (e) {
        console.warn(`[KAREN_NOTIFY_WARN] No se pudo enviar notificación a Juan:`, e);
    }
}

/**
 * Notifica a Juan si un cliente representa una OPORTUNIDAD CALIENTE DE VENTA
 */
export async function notifyJuanHotOpportunity(contactName: string, phone: string, detail: string, estAmount?: number) {
    const amountStr = estAmount ? ` (Aprox. $${estAmount.toFixed(2)} USD)` : "";
    const message = 
`🔥 ¡JUAN! ¡OPORTUNIDAD DE CIERRE CALIENTE! 🔥

El cliente **${contactName}** (${phone}) está solicitando cotización de:
📦 **${detail}**${amountStr}

¡Atención prioritaria recomendada para asegurar el cierre de esta venta! Puedes escribirle directo o pedirme que le mande un mensaje.`;

    try {
        await sendWhatsAppMessage(JUAN_PHONE, message);
    } catch (_) {}
}

/**
 * Notifica a Juan si un chat no pudo ser catalogado
 */
export async function notifyJuanUncatalogedChat(contactName: string, phone: string, snippet: string, conversationId: string) {
    karenState.lastUncatalogedChat = {
        conversationId,
        contactName,
        phone,
        lastMessage: snippet
    };

    const message = 
`Juan, llevo un chat sin catalogar de **${contactName}** (${phone}):
💬 "${snippet.substring(0, 120)}..."

¿Deseas saber de qué trata? Respóndeme *'¿De qué trata ese chat?'* y te cuento el contexto o cómo le respondemos.`;

    try {
        await sendWhatsAppMessage(JUAN_PHONE, message);
    } catch (_) {}
}

/**
 * Revisa inactividad y alerta a Juan si pasan horas sin mensajes
 */
export async function checkInactivityAndAlertJuan(): Promise<boolean> {
    const now = Date.now();
    const twoHoursMs = 2 * 60 * 60 * 1000;

    // Solo alertar en horario de oficina (08:00 a 20:00 Ecuador)
    const currentHour = new Date().getHours();
    if (currentHour < 8 || currentHour > 20) return false;

    if (now - karenState.lastIncomingAt > twoHoursMs && now - karenState.lastJuanNotificationAt > twoHoursMs) {
        karenState.lastJuanNotificationAt = now;
        const message = `Juan, no hay mensajes nuevos en las últimas horas. ¡Activa las pautas Juan para levantar el flujo de clientes! 📢🚀`;
        try {
            await sendWhatsAppMessage(JUAN_PHONE, message);
            return true;
        } catch (_) {}
    }
    return false;
}
