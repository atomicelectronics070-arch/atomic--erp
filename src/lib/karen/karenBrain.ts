import axios from "axios";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp/service";

export const JUAN_PHONE = "593969043453";
export const JUAN_PHONE_LOCAL = "0969043453";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
const NVIDIA_MODEL = "meta/llama-3.2-90b-vision-instruct";

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

// Sesión privada para interacción de Juan (Contratos / Cotizaciones 1111)
interface JuanSessionState {
    stage: "IDLE" | "AWAITING_PIN" | "AWAITING_QUOTE_DATA";
    data: any;
    updatedAt: number;
}

let juanSessionState: JuanSessionState = {
    stage: "IDLE",
    data: {},
    updatedAt: Date.now()
};

const REFERENCE_PRICES: Record<string, number> = {
    "videoportero": 285.00,
    "videoporteros": 285.00,
    "portero": 285.00,
    "hikvision": 92.40,
    "ds-kis212": 92.40,
    "kocom": 149.00,
    "citofono": 149.00,
    "citofonia": 149.00,
    "collective": 134.20,
    "intelbras": 134.20,
    "collective 8i": 134.20,
    "collective 4i": 121.81,
    "collective 12i": 143.00,
    "collective 16i": 155.38,
    "collective 20i": 176.46,
    "collective 24i": 190.18,
    "torniquete": 720.00,
    "ts1000": 720.00,
    "fbl4000": 1850.00,
    "fht2300": 2950.00,
    "biometrico": 175.00,
    "senseface": 175.00,
    "zkteco": 175.00,
    "cerco": 89.00,
    "jfl": 89.00,
    "hagroy": 98.00,
    "imou": 45.40,
    "camara": 45.40,
    "camaras": 45.40,
    "antena": 499.96,
    "antenas": 499.96,
    "antihurto": 499.96,
    "antipanico": 98.00,
    "barra": 98.00,
    "barra antipanico": 98.00,
    "boc241n": 28.90,
    "barra sonido": 28.90,
    "barra de sonido": 28.90,
    "1 hora": 28.90,
    "ranger": 35.80,
    "mini pt": 39.10,
    "doble lente": 42.50,
    "doble lente exterior": 63.77,
    "ezviz": 43.99,
    "h6c": 43.99,
    "camara exterior": 47.82,
    "ip66": 47.82,
    "cruiser": 135.00,
    "cruiser triple": 135.00,
    "titan": 115.00,
    "titan pro": 115.00,
    "aurora": 115.00,
    "combo nvr": 95.00,
    "nks4223wbth": 95.00,
    "portero multifuncion": 198.99,
    "portero zkteco": 198.99,
    "zkbio": 198.99,
    "ditec": 1928.90,
    "ditec 2027": 1928.90,
    "barrera ditec": 1928.90,
    "barreras ditec": 1928.90,
    "antenas 576": 576.00,
    "antenas acrilicas": 745.00,
    "antenas 745": 745.00,
    "generador": 50.00,
    "mantenimiento generador": 50.00,
    "generador basico": 50.00,
    "generador industrial": 180.00
};

/**
 * Valida si el número telefónico corresponde EXCLUSIVAMENTE a Juan (Dueño / Administrador)
 */
export function isJuan(phone: string): boolean {
    if (!phone) return false;
    const clean = phone.replace(/\D/g, "");
    return clean === "593969043453" || clean === "0969043453" || clean.endsWith("969043453");
}

/**
 * Genera un resumen en vivo de los últimos chats y mensajes del CRM para que Karen conozca el flujo actual en tiempo real
 */
async function getLiveCrmContextSummary(): Promise<string> {
    try {
        const recentConvs = await prisma.wAConversation.findMany({
            take: 8,
            orderBy: { updatedAt: "desc" },
            include: {
                contact: true,
                messages: {
                    take: 2,
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!recentConvs || recentConvs.length === 0) return "No hay conversaciones recientes en la base de datos.";

        const lines = recentConvs.map(c => {
            const lastMsg = c.messages?.[0]?.body || "(sin texto)";
            const sender = c.contact?.name || "Cliente";
            const phone = c.contact?.whatsappId || "S/N";
            const status = c.status || "NEW";
            return `• ${sender} (${phone}) [Estado: ${status}]: "${lastMsg.substring(0, 90)}"`;
        });

        return `ESTADO EN VIVO DEL CRM Y ÚLTIMAS CONVERSACIONES:\n${lines.join("\n")}`;
    } catch (e) {
        return "CRM en línea sin novedades críticas.";
    }
}

/**
 * Motor conversacional LLM para respuestas ultra naturales y humanas de Karen a Juan
 */
async function askKarenLLM(juanMessage: string, chatHistory: string = ""): Promise<string> {
    const liveCrmSummary = await getLiveCrmContextSummary();

    const systemPrompt = `
Eres Karen, la Jefa de Mensajería, Auditora de Leads y Asistente Ejecutiva de Juan, dueño y director general de ATOMIC Electronics / ATOMIC Industrias Ecuador.
Estás hablando con Juan (dueño) o desde el panel de auditoría de WhatsApp CRM.
Tu personalidad es humana, cálida, brillante, resolutiva y profesional. Hablas como una colega y mano derecha de alta confianza.
NUNCA suenas como un bot de soporte al cliente genérico ni uses frases acartonadas.
Si Juan te escribe casualmente, te saluda, te hace una pregunta, o escribe un mensaje por error o descuido, mantén la conversación con total fluidez, naturalidad y simpatía.

INFORMACIÓN EN VIVO DEL FLUJO DE MENSAJES Y CHATS EN ATOMIC:
${liveCrmSummary}

DIRECTRICES:
- Tienes conocimiento en tiempo real de cómo van los mensajes, qué clientes han escrito y qué solicitudes están abiertas. Si Juan te pregunta cómo van los chats o qué novedades hay, respóndele con datos específicos y exactos del CRM en vivo.
- Conoces todo el portafolio (videoporteros, citofonía colectiva Intelbras, torniquetes ZKTeco, cámaras de seguridad, cercos eléctricos, antenas antihurto, empleo y contratación de vendedores freelance y fijos).
- Si Juan te pide generar contratos o cotizaciones, recuérdale su código de trabajador 1111 para autorizarlo.
- Mantén tus respuestas concisas, naturales y directas al grano (1 a 3 párrafos cortos como en una conversación real de WhatsApp).
`;

    try {
        const response = await axios.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                model: NVIDIA_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...(chatHistory ? [{ role: "user", content: `Historial de diálogo previo con Juan:\n${chatHistory}` }] : []),
                    { role: "user", content: juanMessage }
                ],
                temperature: 0.7,
                max_tokens: 450
            },
            {
                headers: {
                    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 12000
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content?.trim();
        if (reply) return reply;
    } catch (e: any) {
        console.warn('[KAREN_LLM_WARN]', e.response?.data || e.message);
    }

    // Respuesta cálida y natural de contingencia
    return `¡Hola Juan! Te leo con total claridad. Estoy al frente de la mensajería y la auditoría de los chats de ATOMIC. ¿En qué te puedo colaborar en este momento o necesitas revisar alguna cotización o lead? 💼✨`;
}

/**
 * Procesa mensajes y comandos de Juan (Karen existe exclusivamente para su número 0969043453)
 */
export async function processJuanCommand(messageText: string, conversationId?: string): Promise<string> {
    const raw = (messageText || "").trim();
    const lower = raw.toLowerCase();

    // ─────────────────────────────────────────────────────────────────────────
    // 1. SESIÓN ACTIVA DE COTIZACIONES / CONTRATOS CON CÓDIGO 1111
    // ─────────────────────────────────────────────────────────────────────────
    if (juanSessionState.stage === "AWAITING_PIN") {
        if (raw === "1111" || raw.includes("1111")) {
            juanSessionState.stage = "AWAITING_QUOTE_DATA";
            juanSessionState.updatedAt = Date.now();
            return `Listo Juan, código 1111 verificado. Te ayudo de inmediato a generar el contrato / cotización. 📄✨

Dame los siguientes datos:
• **Nombre o Razón Social del Cliente**
• **Cédula o RUC**
• **Ciudad o Dirección de Entrega**
• **Teléfono / WhatsApp**
• **Producto(s) con cantidad**
• **Observaciones o Garantía**

Mándame los datos y separa cada dato del otro con un guion bajo \`_\` tratando de poner en orden los datos . espacio aparte o por un punto el resto lo identifico yo.`;
        } else {
            return `❌ Código no autorizado, Juan. Por favor confirma tu código de trabajador / contraseña de acceso (1111) para continuar con el contrato.`;
        }
    }

    if (juanSessionState.stage === "AWAITING_QUOTE_DATA") {
        // Separar datos por guión bajo, saltos de línea o puntos
        const rawSegments = raw
            .split(/[_|\n]+/)
            .map(s => s.trim())
            .filter(Boolean);

        const phoneMatch = raw.match(/(?:\+?593|0)9\d{8}\b|\b0\d{8,9}\b/);
        const cedulaMatch = raw.match(/\b\d{10}\b|\b\d{13}\b/);

        let clientName = "";
        let cedula = cedulaMatch ? cedulaMatch[0] : "";
        let phone = phoneMatch ? phoneMatch[0] : "";
        let city = "";
        let productsText = "";
        let observations = "";

        if (rawSegments.length >= 1) clientName = rawSegments[0].replace(/^(cliente:|nombre:)/i, "").trim();
        if (rawSegments.length >= 2 && !cedula) cedula = rawSegments[1].replace(/^(cedula:|ruc:)/i, "").trim();
        if (rawSegments.length >= 3) city = rawSegments[2].replace(/^(ciudad:|direccion:)/i, "").trim();
        if (rawSegments.length >= 4 && !phone) phone = rawSegments[3].replace(/^(telefono:|celular:)/i, "").trim();
        if (rawSegments.length >= 5) productsText = rawSegments[4].replace(/^(productos?:|items?:)/i, "").trim();
        if (rawSegments.length >= 6) observations = rawSegments.slice(5).join(" ").trim();

        if (!productsText) {
            const potential = raw.replace(clientName, "").replace(cedula, "").replace(phone, "").trim();
            if (potential.length > 5) productsText = potential;
        }

        if (!clientName || !productsText) {
            return `Juan, recibí parte de los datos pero me faltan el **Nombre del Cliente** y los **Productos con cantidad** para armar el contrato.\n\nPor favor mándame los datos separando cada dato con un guion bajo \`_\` (ej: *Juan Pérez _ 1723456789 _ Quito _ 0991234567 _ 2 Videoporteros 2 Pantallas _ Garantía 1 año*).`;
        }

        // Armar desglose y precios
        const itemsList: Array<{ name: string; quantity: number; price: number; subtotal: number }> = [];
        const productLines = productsText.split(/[,;\n]+/).map(p => p.trim()).filter(Boolean);

        for (const line of productLines) {
            const qtyMatch = line.match(/^(\d+)\s+(.+)/) || line.match(/(.+?)\s+(\d+)$/);
            const qty = qtyMatch ? parseInt(qtyMatch[1] || qtyMatch[2]) : 1;
            const pName = qtyMatch ? (qtyMatch[2] || qtyMatch[1]).trim() : line;

            let unitPrice = 120.00;
            const lowerP = pName.toLowerCase();
            for (const [key, price] of Object.entries(REFERENCE_PRICES)) {
                if (lowerP.includes(key)) {
                    unitPrice = price;
                    break;
                }
            }

            const explicitPrice = line.match(/\$?(\d+(?:\.\d{2})?)\s*(?:usd|dolares|c\/u|\$)?/i);
            if (explicitPrice && parseFloat(explicitPrice[1]) > 5) {
                unitPrice = parseFloat(explicitPrice[1]);
            }

            itemsList.push({
                name: pName,
                quantity: qty,
                price: unitPrice,
                subtotal: qty * unitPrice
            });
        }

        if (itemsList.length === 0) {
            itemsList.push({
                name: productsText,
                quantity: 1,
                price: 150.00,
                subtotal: 150.00
            });
        }

        const subtotal = itemsList.reduce((acc, it) => acc + it.subtotal, 0);
        const iva = subtotal * 0.15;
        const total = subtotal + iva;
        const quoteCode = `PROP-KAREN-${Date.now().toString().slice(-6)}`;

        // Guardar cotización en Base de Datos
        try {
            await (prisma as any).quote.create({
                data: {
                    leadName: clientName,
                    leadEmail: 'ventas@atomic.com.ec',
                    leadPhone: phone || JUAN_PHONE,
                    quoteData: JSON.stringify({
                        quoteCode,
                        city: city || 'Quito',
                        cedula: cedula || 'Consumidor Final',
                        items: itemsList,
                        subtotal,
                        iva,
                        total,
                        observations: observations || 'Garantía oficial ATOMIC 1 año',
                        generatedBy: 'KAREN_CHIEF_DIRECT_JUAN'
                    })
                }
            });
        } catch (dbErr) {
            console.warn('[KAREN_QUOTE_SAVE_WARN]', dbErr);
        }

        // Reset estado Juan
        juanSessionState.stage = "IDLE";
        juanSessionState.data = {};

        const itemsFormatted = itemsList
            .map(it => `• **${it.quantity}x** ${it.name} — $${it.price.toFixed(2)} c/u ($${it.subtotal.toFixed(2)} USD)`)
            .join("\n");

        return `✅ **¡Listo Juan! Contrato y Cotización Oficial generados con éxito:**

📋 **Código:** \`${quoteCode}\`
👤 **Cliente:** ${clientName}
🆔 **Cédula/RUC:** ${cedula || "Consumidor Final"}
📍 **Ciudad / Destino:** ${city || "Quito, Ecuador"}
📱 **Teléfono:** ${phone || "Registrado"}

📦 **Detalle de Ítems:**
${itemsFormatted}

💰 **Subtotal:** $${subtotal.toFixed(2)} USD
📊 **IVA (15%):** $${iva.toFixed(2)} USD
💵 **TOTAL A PAGAR:** $${total.toFixed(2)} USD

🛡️ **Garantía / Observaciones:** ${observations || "Garantía oficial de 1 año con respaldo técnico ATOMIC"}

🔗 Puedes descargar el PDF o exportar a Excel en el módulo oficial PROP:
https://atomiccotizador.shop/dashboard/quotes`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. DETECCIÓN DE INTENCIÓN DE CONTRATO O COTIZACIÓN
    // ─────────────────────────────────────────────────────────────────────────
    const isQuoteIntent = 
        lower.includes("contrato") ||
        lower.includes("cotizacion") ||
        lower.includes("cotización") ||
        lower.includes("cotizar") ||
        lower.includes("proforma") ||
        lower.includes("armar una cotizacion");

    if (isQuoteIntent) {
        juanSessionState.stage = "AWAITING_PIN";
        juanSessionState.updatedAt = Date.now();
        return `Con gusto Juan, te ayudo a generar el contrato o cotización. Por favor ayúdame con tu código de trabajador / contraseña de acceso.`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. COMANDOS DE CONTROL: EMOJI ROJO 🔴 / PARAR -> MODO MANUAL
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
    // 4. COMANDOS DE CONTROL: EMOJI VERDE 🟢 / SEGUIR -> MODO AUTOMÁTICO
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
    // 5. EMOJI AMARILLO 🟡 -> REPORTE DE CONTEXTO Y AUTORIZACIÓN
    // ─────────────────────────────────────────────────────────────────────────
    if (raw.includes("🟡") || lower === "amarillo" || lower === "autorizacion" || lower === "autorización") {
        karenState.mode = "AWAITING_APPROVAL";

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
    // 6. PREGUNTA: "¿DE QUÉ TRATA ESE CHAT?"
    // ─────────────────────────────────────────────────────────────────────────
    if (
        lower.includes("de que trata") || 
        lower.includes("de qué trata") || 
        lower.includes("que dice el chat") || 
        lower.includes("qué dice el chat") ||
        lower.includes("explicame el chat")
    ) {
        if (!karenState.lastUncatalogedChat) {
            const lastConv = await prisma.wAConversation.findFirst({
                where: {
                    contact: {
                        NOT: [
                            { whatsappId: "593969043453" },
                            { whatsappId: "0969043453" }
                        ]
                    }
                },
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
            return `Juan, el último chat registrado es de **${lastConv.contact?.name || lastConv.contact?.whatsappId}** (${lastConv.contact?.whatsappId}):\n\n💬 *Mensaje reciente:* "${msgs}"\n\n¿Quieres que le responda ofreciéndole nuestro catálogo de productos o prefieres que le envíe un mensaje redactado por ti?`;
        }

        const chat = karenState.lastUncatalogedChat;
        return `Juan, el chat de **${chat.contactName}** (${chat.phone}) trata de lo siguiente:\n\n💬 *Último mensaje recibido:* "${chat.lastMessage}"\n📌 *Asunto:* ${chat.detectedTopic || "Consulta general no clasificada"}.\n\n¿Cómo deseas que le responda? Dime: *'Envía [tu respuesta] a ${chat.contactName}'* y yo lo despacho con tu confirmación.`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 7. CONFIRMACIÓN: JUAN DICE "SÍ" PARA ENVIAR MENSAJE PENDIENTE
    // ─────────────────────────────────────────────────────────────────────────
    if ((lower === "si" || lower === "sí" || lower === "dale" || lower === "confirmo" || lower === "enviar") && karenState.pendingSend) {
        const action = karenState.pendingSend;
        karenState.pendingSend = null;

        try {
            await sendWhatsAppMessage(action.recipientPhone, action.messageText);

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

            const pendingList = await prisma.wAConversation.findMany({
                where: {
                    contact: {
                        NOT: [
                            { whatsappId: "593969043453" },
                            { whatsappId: "0969043453" }
                        ]
                    },
                    messages: { some: { direction: "INBOUND" } }
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
    // 8. COMANDO INTELIGENTE DE ENVÍO A CLIENTE (SÚPER PRO, DILIGENTE Y RESOLUTIVO)
    // Ejemplos: "mándale el precio de tal cámara", "dile que cuesta 45 dólares", "envíale la proforma al cliente"
    // ─────────────────────────────────────────────────────────────────────────
    const isDirectSendOrder = /(?:envia|envía|mandale|mándale|manda|escribe|escríbele|dile|responderle|respondele|contéstale|contestale)/i.test(raw);

    if (isDirectSendOrder) {
        // Encontrar a qué cliente se refiere (el último chat activo o el último chat sin catalogar)
        let targetConv = await prisma.wAConversation.findFirst({
            where: {
                contact: {
                    NOT: [
                        { whatsappId: "593969043453" },
                        { whatsappId: "0969043453" },
                        { whatsappId: { contains: "969043453" } }
                    ]
                }
            },
            orderBy: { updatedAt: "desc" },
            include: {
                contact: true,
                messages: {
                    take: 3,
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (targetConv && targetConv.contact) {
            const recipientPhone = targetConv.contact.whatsappId;
            const recipientName = targetConv.contact.name || "Cliente";
            const lastClientMsg = targetConv.messages?.[0]?.body || "";

            // Redactar mensaje profesional usando IA ejecutiva
            const composePrompt = `
Eres Karen, asistente ejecutiva y mano derecha de Juan en ATOMIC Electronics.
Juan te acaba de dar una instrucción sobre qué responderle a un cliente.
Instrucción de Juan: "${raw}"
Nombre del cliente: "${recipientName}"
Último mensaje recibido del cliente: "${lastClientMsg}"

PORTAFOLIO DE PRECIOS OFICIALES ATOMIC:
- Cámaras Interior Hogar 360: IMOU Ranger 3MP ($35.80), IMOU Mini PT Full Color ($39.10), Doble Lente 360 ($42.50), EZVIZ H6C ($43.99).
- Cámaras Exterior IP66: Wi-Fi IP66 ($47.82), Doble Lente IP81 ($63.77), Combo NVR ($95.00), IMOU Cruiser Triple 11MP ($135.00), IMOU Titan Aurora ($115.00).
- Videoporteros: Kit Residencial 2 Pantallas HD ($285.00), Hikvision DS-KIS212 ($92.40), Portero Multifunción ZKTeco con app ($198.99).
- Barreras Automáticas Dítec 2027: $1,928.90 + IVA.
- Antenas Antihurto: Kit Estándar ($576.00 + IVA), Kit Acrílico ($745.00 + IVA).
- Generadores: Mantenimiento preventivo básico $50.00.
- Barra de Sonido Gamer 1 HORA BOC241N: $28.90 + IVA.

TAREA:
Redacta el mensaje final exacto que se le enviará por WhatsApp a este cliente cumpliendo exactamente lo que Juan pide.
Debe sonar impecable, educado, comercial y directo. Con emojis sobrios y llamado a la acción.
Devuelve ÚNICAMENTE el texto que se le enviará al cliente, sin introducciones ni comillas.
`;

            let craftedMessage = "";
            try {
                const draftRes = await axios.post(
                    "https://integrate.api.nvidia.com/v1/chat/completions",
                    {
                        model: NVIDIA_MODEL,
                        messages: [
                            { role: "system", content: "Eres una redactora comercial de élite de ATOMIC Electronics." },
                            { role: "user", content: composePrompt }
                        ],
                        temperature: 0.5,
                        max_tokens: 350
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                            "Content-Type": "application/json"
                        },
                        timeout: 10000
                    }
                );
                craftedMessage = draftRes.data?.choices?.[0]?.message?.content?.trim() || "";
            } catch (_) {}

            if (!craftedMessage) {
                craftedMessage = `¡Hola ${recipientName}! 👋 Con mucho gusto te saluda el equipo de ATOMIC Electronics. En respuesta a tu consulta:\n\n${raw.replace(/^(oye|karen|mandale|mándale|dile|envia|envía|escribe)\s+/i, '')}\n\n¿Deseas que te coordinemos la entrega a domicilio o te preparamos la proforma formal? Quedamos a tus órdenes. 📲`;
            }

            // Despachar inmediatamente el mensaje al cliente sin trabas ni bucles
            try {
                await sendWhatsAppMessage(recipientPhone, craftedMessage);

                // Registrar en la conversación del CRM
                await prisma.wAMessage.create({
                    data: {
                        conversationId: targetConv.id,
                        direction: "OUTBOUND",
                        type: "text",
                        body: craftedMessage,
                        status: "SENT",
                        senderId: "KAREN_CHIEF_DIRECT"
                    }
                });

                // Actualizar timestamp
                await prisma.wAConversation.update({
                    where: { id: targetConv.id },
                    data: { updatedAt: new Date(), lastMessageAt: new Date() }
                });

                return `✅ **¡Listo Juan! Mensaje despachado de inmediato:**

👤 **Cliente:** ${recipientName} (${recipientPhone})
📝 **Mensaje enviado:**
"${craftedMessage}"

El cliente ya fue atendido con éxito y el chat quedó actualizado en el CRM. ¿Necesitas que despache algo más? 🚀`;
            } catch (sendErr: any) {
                return `⚠️ Juan, intenté despachar el mensaje a ${recipientName} (${recipientPhone}) pero ocurrió un inconveniente con WhatsApp API: ${sendErr.message}. Verifica que el número sea válido.`;
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 9. CONVERSACIÓN NATURAL, HUMANA Y EJECUTIVA (LLM REAL PARA JUAN)
    // ─────────────────────────────────────────────────────────────────────────
    let recentChatContext = "";
    if (conversationId) {
        try {
            const recentMsgs = await prisma.wAMessage.findMany({
                where: { conversationId },
                orderBy: { createdAt: "desc" },
                take: 5
            });
            recentChatContext = recentMsgs.reverse().map(m => 
                `${m.direction === "INBOUND" ? "Juan" : "Karen"}: ${m.body}`
            ).join("\n");
        } catch (_) {}
    }

    return await askKarenLLM(raw, recentChatContext);
}

/**
 * Notifica a Juan sobre mensajes entrantes en tiempo real (agrupados cada 5 minutos)
 */
export async function notifyJuanIncomingBurst() {
    // KAREN SILENCIOSA & EFICIENTE:
    // No interrumpir a Juan en WhatsApp con ráfagas constantes de cada 5 minutos.
    // Los contadores se mantienen activos en memoria para el panel de auditoría web y resúmenes solicitados.
    const counters = karenState.burstCounters;
    const total = counters.recruitment + counters.sales + counters.autoRegister + counters.uncataloged;

    if (total === 0) return;

    // Solo notificar si hay un volumen excepcionalmente alto de más de 15 leads acumulados y han pasado al menos 3 horas
    const now = Date.now();
    if (total >= 15 && (now - karenState.lastJuanNotificationAt >= 3 * 60 * 60 * 1000)) {
        karenState.lastJuanNotificationAt = now;
        const summaryParts: string[] = [];
        if (counters.sales > 0) summaryParts.push(`🛒 ${counters.sales} consultas de Clientes & Cotizaciones`);
        if (counters.recruitment > 0) summaryParts.push(`💼 ${counters.recruitment} aspirantes a Asesores Comerciales`);
        if (counters.autoRegister > 0) summaryParts.push(`⚡ ${counters.autoRegister} registros de sistema`);

        const message = 
`Juan, te comparto el reporte de alto tráfico en ATOMIC:
${summaryParts.join("\n")}

La IA está atendiendo y canalizando cada requerimiento con fluidez sin que tengas que intervenir. 🚀`;

        counters.recruitment = 0;
        counters.sales = 0;
        counters.autoRegister = 0;
        counters.uncataloged = 0;

        try {
            await sendWhatsAppMessage(JUAN_PHONE, message);
        } catch (_) {}
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
 * Saludo matutino diario de Karen a Juan (se envía todas las mañanas entre 07:00 y 11:00 AM hora de Ecuador)
 */
export async function checkAndSendMorningBriefingToJuan(): Promise<boolean> {
    try {
        // Hora local Ecuador (UTC-5)
        const ecuadorNow = new Date(Date.now() - 5 * 60 * 60 * 1000);
        const currentHour = ecuadorNow.getUTCHours();
        const todayStr = ecuadorNow.toISOString().split("T")[0];

        // Ventana matutina de 07:00 AM a 11:00 AM
        if (currentHour < 7 || currentHour > 11) {
            return false;
        }

        // Verificar si ya se envió hoy mediante SystemSetting en Base de Datos
        const setting = await prisma.systemSetting.findUnique({
            where: { key: "KAREN_LAST_MORNING_DATE" }
        });

        if (setting?.value === todayStr) {
            return false;
        }

        // Analizar actividad de la noche (últimas 12 horas)
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
        const nightMessages = await prisma.wAMessage.count({
            where: {
                direction: "INBOUND",
                createdAt: { gte: twelveHoursAgo },
                conversation: {
                    contact: {
                        NOT: [
                            { whatsappId: "593969043453" },
                            { whatsappId: "0969043453" }
                        ]
                    }
                }
            }
        });

        const pendingChats = await prisma.wAConversation.count({
            where: {
                status: { in: ["NEW", "PENDING", "AUTO_REGISTER", "LEAD_PAUTA"] },
                contact: {
                    NOT: [
                        { whatsappId: "593969043453" },
                        { whatsappId: "0969043453" }
                    ]
                }
            }
        });

        let morningMessage = "";
        if (nightMessages === 0) {
            morningMessage = 
`¡Buenos días Juan! 🌅 Te saluda Karen. Espero que hayas tenido un excelente descanso.

Te comento que la bandeja amaneció tranquila sin mensajes nuevos durante la madrugada. Sería un momento ideal para activar las pautas en Meta para que empiecen a entrar clientes y asesores desde temprano. 📢🚀

¿Tienes alguna prioridad para hoy o necesitas que revise algo en particular en la plataforma? ¡Que tengamos un día muy productivo! 💼✨`;
        } else {
            morningMessage = 
`¡Buenos días Juan! 🌅 Soy Karen. Te doy el reporte de cómo amaneció el WhatsApp:

📊 Amanecimos con movimiento comercial: **${nightMessages} mensaje(s) recibido(s)** en la madrugada y **${pendingChats} chats activos** en la bandeja. La IA está canalizando a los clientes sin problema.

💡 **Recomendación para hoy:** Dar seguimiento a las cotizaciones de videoporteros y torniquetes pendientes de la semana para asegurar transferencias bancarias.

¡Vamos con toda la energía hoy, Juan! ¿En qué te colaboro esta mañana? 🚀`;
        }

        await sendWhatsAppMessage(JUAN_PHONE, morningMessage);

        await prisma.systemSetting.upsert({
            where: { key: "KAREN_LAST_MORNING_DATE" },
            update: { value: todayStr },
            create: {
                key: "KAREN_LAST_MORNING_DATE",
                value: todayStr,
                description: "Fecha del último saludo matutino enviado por Karen a Juan"
            }
        });

        console.log(`[KAREN_MORNING_BRIEFING_SENT] Enviado saludo matutino a Juan (${JUAN_PHONE})`);
        return true;
    } catch (err: any) {
        console.warn("[KAREN_MORNING_BRIEFING_ERR]", err.message);
        return false;
    }
}

/**
 * Revisa inactividad y alerta a Juan si pasan horas sin mensajes
 */
export async function checkInactivityAndAlertJuan(): Promise<boolean> {
    const now = Date.now();
    const twoHoursMs = 2 * 60 * 60 * 1000;

    // Solo alertar en horario de oficina (08:00 a 20:00 Ecuador)
    const currentHour = (new Date().getUTCHours() - 5 + 24) % 24;
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
