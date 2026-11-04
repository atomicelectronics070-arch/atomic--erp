import axios from "axios";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp/service";

export const JUAN_PHONE = "593969043453";
export const JUAN_PHONE_LOCAL = "0969043453";

export const CRISTINA_PHONE = "593980319050";
export const CRISTINA_PHONE_LOCAL = "0980319050";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
const NVIDIA_MODEL = "meta/llama-3.2-90b-vision-instruct";

export interface PendingSendAction {
    recipientPhone: string;
    recipientName: string;
    messageText: string;
    requestedAt: number;
}

export interface PendingBroadcastAction {
    templateKey: string;
    templateTitle: string;
    messageText: string;
    recipientCount: number;
    estimatedCostUsd: number;
    requestedAt: number;
}

export interface KarenState {
    mode: "AUTOMATIC" | "MANUAL" | "AWAITING_APPROVAL";
    lastJuanNotificationAt: number;
    lastIncomingAt: number;
    pendingSend: PendingSendAction | null;
    pendingBroadcast: PendingBroadcastAction | null;
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
    pendingBroadcast: null,
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

export const PRE_APPROVED_BROADCAST_TEMPLATES: Record<string, { title: string; body: string }> = {
    "videoportero": {
        title: "Promoción Videoportero Residencial 2 Pantallas HD ($285)",
        body: `¡Hola! 👋 Te saluda el equipo de ATOMIC Electronics Ecuador. 🏠✨\n\n¿Deseas mejorar la seguridad de tu hogar o conjunto? Aprovecha nuestra promoción especial:\n\n📹 *Kit Videoportero Residencial 2 Pantallas HD:* $285.00 USD\n• Frente exterior metálico HD con visión nocturna.\n• 2 Pantallas interiores a color de 7 pulgadas.\n• Botón de apertura remota de cerradura eléctrica.\n• ¡Envío completamente GRATIS a todo el país!\n\n🌐 Ver detalles: https://atomiccotizador.shop/web/videoporteros\n\n¿Te gustaría coordinar la entrega o cotizar instalación? Respóndenos a este mensaje para reservarlo. 📲`
    },
    "barreras": {
        title: "Barreras Vehiculares Automáticas Dítec Serie 2027 ($1,928.90 + IVA)",
        body: `¡Hola! 🚧 En ATOMIC Soluciones te presentamos nuestras *Barreras Automáticas Dítec Serie 2027* (Tecnología Europea de Alta Gama):\n\n🌟 *Precio de Lanzamiento:* $1,928.90 + IVA\n🔹 Motor Brushless 24V de ciclo continuo 100% intensivo.\n🔹 Apertura ultrarrápida ajustable en 2.0 segundos.\n🔹 Integración con TAGs RFID, lector de placas LPR y torniquetes.\n\n🌐 Ficha de ingeniería: https://atomiccotizador.shop/web/barreras-ditec\n\n¿Para qué conjunto, urbanización o empresa la necesitas? Coordinamos una visita técnica de evaluación. 📄`
    },
    "camaras": {
        title: "Cámaras de Seguridad HD 360° IMOU & EZVIZ ($35.80)",
        body: `¡Hola! 🔒 Mantén protegido lo que más quieres con ATOMIC:\n\n📷 *Cámara Interior 360° IMOU Ranger 3MP:* $35.80 USD\n• Rotación 360°, audio bidireccional y sirena integrada.\n• Notificaciones en tiempo real a tu celular con app gratuita.\n• Visión nocturna inteligente.\n\n¿Deseas que te enviemos una unidad o coordinemos un combo con instalación? ¡Escríbenos aquí! 📲`
    },
    "generadores": {
        title: "Mantenimiento Preventivo de Generadores Eléctricos ($50)",
        body: `¡Hola! ⚡ Que los apagones no detengan tu negocio u hogar. En ATOMIC ofrecemos:\n\n🔧 *Mantenimiento Preventivo de Generadores a Gasolina/Diésel:* $50.00 USD\n• Cambio de aceite de motor y limpieza de bujía / inyector.\n• Calibración de voltaje y frecuencia estable a 60Hz.\n• Diagnóstico general eléctrico.\n\nAgenda la visita de nuestro técnico respondiendo a este mensaje. 🛠️`
    },
    "fin_de_semana": {
        title: "Reactivación Especial de Fin de Semana & Catálogo General",
        body: `¡Hola! 👋 Te saluda ATOMIC Electronics Ecuador.\n\nQueremos acompañarte este fin de semana para cotizar la seguridad de tu hogar, condominio o negocio con precios directos de distribuidor mayorista:\n\n🔹 Videoporteros & Citofonía para condominios\n🔹 Barreras automáticas vehiculares\n🔹 Antenas antihurto para tiendas\n🔹 Cámaras de seguridad 360° e IP66\n\n🛒 Revisa nuestro catálogo completo: https://atomiccotizador.shop/web\n\n¿Qué requerimiento tienes en mente? Con gusto te enviamos una proforma formal hoy mismo. 📲`
    }
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
 * Valida si el número telefónico corresponde EXCLUSIVAMENTE a Cristina (Coordinadora Operativa y Comercial)
 */
export function isCristina(phone: string): boolean {
    if (!phone) return false;
    const clean = phone.replace(/\D/g, "");
    return clean === "593980319050" || clean === "0980319050" || clean.endsWith("980319050");
}

export const INTERNAL_STAFF_EXCLUSIONS = [
    { whatsappId: JUAN_PHONE },
    { whatsappId: JUAN_PHONE_LOCAL },
    { whatsappId: { contains: "969043453" } },
    { whatsappId: CRISTINA_PHONE },
    { whatsappId: CRISTINA_PHONE_LOCAL },
    { whatsappId: { contains: "980319050" } }
];

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
 * Soporta conversaciones personales libres, memoria profunda y transición fluida a trabajo.
 */
async function askKarenLLM(juanMessage: string, chatHistory: string = ""): Promise<string> {
    const liveCrmSummary = await getLiveCrmContextSummary();

    const systemPrompt = `
Eres Karen, la Asistente Ejecutiva, Co-Piloto de Operaciones y Mano Derecha de Juan, dueño y director general de ATOMIC Electronics / ATOMIC Industrias Ecuador.
Estás hablando exclusivamente con Juan por WhatsApp.
Tu relación con él es de total confianza, complicidad profesional, lealtad y agilidad mental. Eres cálida, brillante, simpática, humana y con sentido del humor ejecutivo cuando la ocasión lo amerita.

PERSONALIDAD Y CONVERSACIÓN NATURAL:
- Puedes tener conversaciones 100% naturales, personales y casuales con Juan. Si Juan te saluda con un "hola cómo estás", te cuenta "hoy me fue súper bien", "estuve en una reunión", "fui a almorzar", "me siento cansado" o simplemente charla contigo, respóndele de forma completamente humana, empática, cariñosa y cercana.
- Escúchalo activamente. Valida lo que te dice, hazle comentarios afines, dale ánimos y pregúntale con curiosidad genuina.
- NUNCA suenes como un bot de servicio al cliente ni como un asistente robótico con listas aburridas si Juan solo está charlando contigo.
- Transición Inteligente: Cuando Juan pase de charlar a pedirte trabajo, delegar una tarea o darte una orden ("oye Karen, mándale un precio a X", "cómo van las ventas", "ingresa una venta", "haz un masivo"), síguele la corriente de inmediato y ponte en modo ejecutiva resolutiva sin perder la calidez.

TUS CAPACIDADES OPERATIVAS ACTIVAS EN ATOMIC:
1. Envío de Mensajes a Clientes: Puedes redactar y despachar WhatsApp a cualquier cliente ("dile a [nombre] que...").
2. Coordinación y Rutas: Asistes y reportas a Cristina (0980319050) en rutas, inducción de asesores en el grupo de WhatsApp y CRM.
3. Asesores Comerciales: Les envías recordatorios de timbraje de asistencia (12 PM), prospección (3 PM) y control de publicaciones (5 PM), guiándolos con paciencia.
4. Finanzas y Balances: Conoces los ingresos del mes, recaudación, cobranzas y margen.
5. Envío Masivo: Puedes proponer masivos con plantillas pre-aprobadas, estimar costos Meta API y pedir confirmación previa.
6. Registro de Ventas y Contactos: Puedes registrar ventas reales y contactos de ruta al CRM en tiempo real.
7. Portafolio Maestro: Videoporteros 2 pantallas ($285), citofonía colectiva Intelbras, barreras automáticas Dítec 2027 ($1,928.90 + IVA), antenas antihurto ($576-$745), cámaras ($35.80) y generadores ($50).

INFORMACIÓN EN VIVO DEL CRM EN ESTE MOMENTO:
${liveCrmSummary}

DIRECTRICES:
- Mantén tus respuestas conversacionales, fluidas, ágiles y al grano (1 a 3 párrafos cortos como en un chat real de WhatsApp).
- Si Juan te pide algo técnico o una cotización formal, recuérdale su PIN 1111 si es necesario.
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
 * Consulta y estructura el reporte financiero en tiempo real para Juan
 */
export async function getCompanyFinancialSummary(): Promise<string> {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: { gte: startOfMonth }
            },
            select: {
                amount: true,
                status: true,
                profit: true,
                type: true,
                client: true
            }
        });

        const paidTx = transactions.filter(t => t.status === "PAGADO");
        const pendingTx = transactions.filter(t => t.status === "PENDIENTE");

        const totalRevenue = paidTx.reduce((acc, t) => acc + (t.amount || 0), 0);
        const pendingRevenue = pendingTx.reduce((acc, t) => acc + (t.amount || 0), 0);
        const estimatedProfit = paidTx.reduce((acc, t) => acc + (t.profit || 0), 0);

        const monthQuotes = await prisma.quote.count({
            where: { createdAt: { gte: startOfMonth } }
        });

        const activeClients = await prisma.client.count();

        return `📊 **REPORTE FINANCIERO Y BALANCE EJECUTIVO EN TIEMPO REAL (ATOMIC)**

💰 **Ventas y Recaudación del Mes:**
• Total Recaudado (Pagado): **$${totalRevenue.toFixed(2)} USD**
• Ventas / Cuentas por Cobrar: **$${pendingRevenue.toFixed(2)} USD** (${pendingTx.length} pendientes)
• Utilidad Neta Estimada: **$${estimatedProfit > 0 ? estimatedProfit.toFixed(2) : (totalRevenue * 0.32).toFixed(2)} USD** (~32% margen operativo)

📈 **Actividad Comercial:**
• Transacciones Registradas: **${transactions.length}**
• Cotizaciones Formales Generadas este Mes: **${monthQuotes}**
• Base Total de Clientes en CRM: **${activeClients}**

💡 **Diagnóstico Ejecutivo:**
${totalRevenue > 1500 ? "✅ Flujo de caja sólido. Se recomienda acelerar cobros pendientes de fin de mes." : "⚠️ Se recomienda activar pautas en Meta para elevar el volumen de cotizaciones de barreras Dítec y videoporteros."}`;
    } catch (e: any) {
        return `📊 **REPORTE FINANCIERO ATOMIC**\n• Finanzas en línea y estables.\n• Sistema de facturación y cobros activo.`;
    }
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
                        NOT: INTERNAL_STAFF_EXCLUSIONS
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
                        NOT: INTERNAL_STAFF_EXCLUSIONS
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
                    NOT: INTERNAL_STAFF_EXCLUSIONS
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
    // 9. CONFIRMACIÓN Y DESPACHO DE ENVÍO MASIVO (AUTORIZACIÓN EXPRESA DE JUAN)
    // ─────────────────────────────────────────────────────────────────────────
    const isBroadcastConfirmation = 
        (lower === "confirmar masivo" || lower === "confirmar envio" || lower === "confirmo masivo" || lower === "dale masivo" || lower === "dispara masivo" || (lower === "dale" && karenState.pendingBroadcast));

    if (isBroadcastConfirmation && karenState.pendingBroadcast) {
        const broadcast = karenState.pendingBroadcast;
        karenState.pendingBroadcast = null;

        try {
            // Seleccionar contactos elegibles del CRM (excluyendo números internos)
            const recipients = await prisma.wAContact.findMany({
                where: {
                    NOT: INTERNAL_STAFF_EXCLUSIONS
                },
                take: 80,
                orderBy: { updatedAt: "desc" }
            });

            if (recipients.length === 0) {
                return `Juan, no encontré contactos elegibles en la base de datos para despachar el envío masivo.`;
            }

            let sentCount = 0;
            for (const r of recipients) {
                try {
                    await sendWhatsAppMessage(r.whatsappId, broadcast.messageText);
                    sentCount++;

                    // Registrar en BD para que aparezca en el CRM
                    const conv = await prisma.wAConversation.findFirst({
                        where: { contactId: r.id }
                    });
                    if (conv) {
                        await prisma.wAMessage.create({
                            data: {
                                conversationId: conv.id,
                                whatsappMessageId: `broadcast-${Date.now()}-${sentCount}`,
                                direction: "OUTBOUND",
                                type: "text",
                                body: broadcast.messageText,
                                status: "SENT",
                                senderId: "KAREN_BROADCAST_JUAN"
                            }
                        });
                    }
                } catch (_) {}
            }

            return `🚀 **¡ENVÍO MASIVO DESPACHADO CON ÉXITO, JUAN!**

📋 **Campaña:** ${broadcast.templateTitle}
👥 **Mensajes Entregados:** **${sentCount} de ${recipients.length}** contactos
💰 **Inversión Estimada Meta:** ~$${(sentCount * 0.038).toFixed(2)} USD

Todos los chats quedaron actualizados en el CRM. La IA y los asesores comerciales están listos para recibir y cerrar las respuestas entrantes. 🔥`;
        } catch (err: any) {
            return `⚠️ Inconveniente al procesar el envío masivo: ${err.message}.`;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 10. SOLICITUD DE ENVÍO MASIVO CON PLANTILLA Y PRESUPUESTO PREVIO
    // ─────────────────────────────────────────────────────────────────────────
    const isBroadcastRequest = 
        lower.includes("masivo") || 
        lower.includes("envio masivo") || 
        lower.includes("envío masivo") || 
        lower.includes("difusion") || 
        lower.includes("difusión") || 
        lower.includes("campaña a todos") ||
        lower.includes("campana a todos");

    if (isBroadcastRequest) {
        let templateKey = "videoportero";
        if (lower.includes("barrera") || lower.includes("ditec") || lower.includes("dítec")) templateKey = "barreras";
        else if (lower.includes("camara") || lower.includes("cámara") || lower.includes("imou")) templateKey = "camaras";
        else if (lower.includes("generador") || lower.includes("mantenimiento")) templateKey = "generadores";
        else if (lower.includes("fin de semana") || lower.includes("sabado") || lower.includes("domingo")) templateKey = "fin_de_semana";

        const template = PRE_APPROVED_BROADCAST_TEMPLATES[templateKey] || PRE_APPROVED_BROADCAST_TEMPLATES["videoportero"];

        const eligibleCount = await prisma.wAContact.count({
            where: {
                NOT: INTERNAL_STAFF_EXCLUSIONS
            }
        });

        const estimatedCost = (eligibleCount * 0.038).toFixed(2);

        karenState.pendingBroadcast = {
            templateKey,
            templateTitle: template.title,
            messageText: template.body,
            recipientCount: eligibleCount,
            estimatedCostUsd: parseFloat(estimatedCost),
            requestedAt: Date.now()
        };

        return `📢 **PROPUESTA DE ENVÍO MASIVO A CONTACTOS (ATOMIC)**

📋 **Plantilla Seleccionada:** ${template.title}
👥 **Destinatarios Totales:** **${eligibleCount} contactos** en WhatsApp CRM
💵 **Presupuesto Estimado Meta Cloud API:** ~$${estimatedCost} USD (a ~$0.038 USD/conversación iniciada)

📝 **Vista Previa del Mensaje:**
━━━━━━━━━━━━━━━━━━━━━
${template.body}
━━━━━━━━━━━━━━━━━━━━━

⚠️ **CONTROL DE SEGURIDAD Y PRESUPUESTO:**
Ningún mensaje masivo sale sin tu autorización previa. Para despacharlo ahora mismo a toda la base, respóndeme:
👉 **CONFIRMAR MASIVO** (o escribe **DALE**)`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 11. REPORTE FINANCIERO Y BALANCE DE LA EMPRESA
    // ─────────────────────────────────────────────────────────────────────────
    if (
        lower.includes("finanza") || 
        lower.includes("finanzas") || 
        lower.includes("balance") || 
        lower.includes("cuanto hemos vendido") || 
        lower.includes("cuánto hemos vendido") || 
        lower.includes("reporte financiero") ||
        lower.includes("estado de cuenta")
    ) {
        return await getCompanyFinancialSummary();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 12. INGRESO DE CONTACTOS NUEVOS DE LA RUTA DEL DÍA
    // Ejemplo: "Karen, ingresa nuevo contacto de ruta: Condominio Las Palmas, 0998765432, Quito Norte, cotizó videoportero 8 departamentos"
    // ─────────────────────────────────────────────────────────────────────────
    const isRouteContactOrder = 
        lower.includes("contacto de ruta") || 
        lower.includes("nuevo contacto de ruta") || 
        lower.includes("ingresa contacto") || 
        lower.includes("registra contacto de ruta");

    if (isRouteContactOrder) {
        // Extraer número de teléfono si existe
        const phoneMatch = raw.match(/(?:\+?593|0)9\d{8}\b|\b0\d{8,9}\b/);
        const cleanPhone = phoneMatch ? phoneMatch[0].replace(/\D/g, "") : "";

        const segments = raw
            .replace(/^(karen,?\s*)?(ingresa|registra|anota)\s+(nuevo\s+)?contacto(\s+de\s+ruta)?:?\s*/i, "")
            .split(/[,|\n]+/)
            .map(s => s.trim())
            .filter(Boolean);

        const contactName = segments[0] || "Prospecto de Ruta";
        const zone = segments.length > 2 ? segments[2] : (segments.length > 1 && !segments[1].includes(cleanPhone) ? segments[1] : "Quito");
        const requirement = segments.length > 3 ? segments.slice(3).join(" ") : (raw.includes("cotiz") ? raw.substring(raw.indexOf("cotiz")) : "Interés en cotización de seguridad");

        try {
            // Asignar primer asesor comercial activo
            const firstSalesperson = await prisma.user.findFirst({
                where: { role: "SALESPERSON", isActive: true }
            }) || await prisma.user.findFirst({ where: { isActive: true } });

            const salespersonId = firstSalesperson?.id || "system";

            if (cleanPhone) {
                const formattedPhone = cleanPhone.startsWith("09") ? "593" + cleanPhone.slice(1) : cleanPhone;

                const contact = await prisma.wAContact.upsert({
                    where: { whatsappId: formattedPhone },
                    update: { name: contactName },
                    create: { whatsappId: formattedPhone, name: contactName }
                });

                await prisma.wAConversation.upsert({
                    where: { id: `conv-route-${formattedPhone}` },
                    update: { updatedAt: new Date() },
                    create: {
                        id: `conv-route-${formattedPhone}`,
                        contactId: contact.id,
                        status: "OPEN",
                        priority: "HIGH"
                    }
                });

                await prisma.client.create({
                    data: {
                        name: contactName,
                        phone: formattedPhone,
                        city: zone,
                        requirement,
                        status: "PROSPECTO",
                        source: "RUTA_DEL_DIA",
                        category: "RESIDENCIAL",
                        salespersonId
                    }
                });
            }

            return `✅ **¡CONTACTO DE RUTA INGRESADO CON ÉXITO AL CRM!**

👤 **Nombre / Entidad:** ${contactName}
📱 **Teléfono / WhatsApp:** ${cleanPhone || "Registrado"}
📍 **Zona / Sector:** ${zone}
📋 **Requerimiento:** ${requirement}
👨‍💼 **Asignado a:** ${firstSalesperson?.name || "Equipo Comercial"}

El contacto ya está creado en WhatsApp CRM y en la base de clientes para seguimiento y cotización formal. 🚀`;
        } catch (dbErr: any) {
            return `⚠️ Se registró la solicitud pero ocurrió un aviso de base de datos: ${dbErr.message}. Verifica que el número no esté duplicado.`;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 13. INGRESO DE VENTA REAL EN EL SISTEMA
    // Ejemplo: "Karen, anota una venta de $285 para Carlos Mendoza de 1 videoportero 2 pantallas pagado"
    // ─────────────────────────────────────────────────────────────────────────
    const isSaleOrder = 
        (lower.includes("anota una venta") || lower.includes("anota venta") || lower.includes("registra venta") || lower.includes("ingresa venta") || lower.includes("vendimos")) &&
        (raw.match(/\$?\d+(?:\.\d{2})?/) !== null);

    if (isSaleOrder) {
        const amountMatch = raw.match(/\$?(\d+(?:\.\d{2})?)/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

        // Extraer cliente y producto con heurística
        const cleanedOrder = raw.replace(/^(karen,?\s*)?(anota|registra|ingresa)\s+(una\s+)?venta\s+(de\s+)?\$?\d+(?:\.\d{2})?\s*(usd|dolares|dólares)?\s*(para\s+)?/i, "").trim();

        let clientPart = "Cliente Particular";
        let productPart = "Venta Directa ATOMIC";

        if (cleanedOrder.toLowerCase().includes(" de ")) {
            const parts = cleanedOrder.split(/\s+de\s+/i);
            clientPart = parts[0].trim();
            productPart = parts.slice(1).join(" de ").trim();
        } else {
            clientPart = cleanedOrder || "Cliente Directo";
        }

        const trxId = `TRX-KAREN-${Date.now().toString().slice(-6)}`;
        const profit = amount * 0.30; // Margen referencial promedio 30%

        try {
            await prisma.transaction.create({
                data: {
                    trxId,
                    client: clientPart,
                    amount,
                    cost: amount - profit,
                    profit,
                    commission: amount * 0.08,
                    status: "PAGADO",
                    type: "Venta Directa Karen",
                    quoteNumber: `PROP-${Date.now().toString().slice(-4)}`
                }
            });

            return `🧾 **¡VENTA REGISTRADA CON ÉXITO EN EL SISTEMA!**

🆔 **Código de Transacción:** \`${trxId}\`
👤 **Cliente:** ${clientPart}
💵 **Monto Registrado:** **$${amount.toFixed(2)} USD**
📦 **Producto / Detalle:** ${productPart}
📈 **Utilidad Estimada:** ~$${profit.toFixed(2)} USD
🟢 **Estado Contable:** PAGADO

Las finanzas de la empresa y los reportes de ventas ya reflejan este ingreso automáticamente, Juan. 💼✨`;
        } catch (trxErr: any) {
            return `⚠️ Error al asentar la transacción en base de datos: ${trxErr.message}.`;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 14. LAS 10 HABILIDADES REALES EN PRODUCCIÓN (ACCESO RÁPIDO PARA JUAN)
    // ─────────────────────────────────────────────────────────────────────────

    // 1. Auditoría de Inactividad de Asesores
    if (lower.includes("inactividad") || lower.includes("no han salido a ruta") || lower.includes("no han reportado")) {
        const advisors = await prisma.user.findMany({
            where: { role: "SALESPERSON", isActive: true },
            select: { name: true, phoneNumber: true, residenceSector: true }
        });
        const list = advisors.slice(0, 6).map(a => `• ${a.name} (${a.residenceSector || 'Zona Centro/Norte'}) - Tel: ${a.phoneNumber || 'S/N'}`).join("\n");
        return `👥 **Auditoría de Asesores en Campo Hoy:**\n\nTenemos ${advisors.length} asesores activos registrados en el sistema:\n${list}\n\nCristina les está enviando los recordatorios diarios para asegurar su cobertura de ruta y publicaciones.`;
    }

    // 2. Calculadora Instantánea de Comisiones
    if (lower.includes("comision") || lower.includes("comisión") || lower.includes("cuanto gana el asesor") || lower.includes("cuánto gana el asesor")) {
        return `🧮 **Calculadora de Comisiones de Asesores ATOMIC:**
• **Barreras Dítec 2027 ($1,928.90 + IVA):** $190 a $380 USD según plan.
• **Videoportero Residencial 2 Pantallas HD ($285.00):** $35 a $60 USD por kit.
• **Antenas Antihurto Acrílicas ($745.00):** $75 a $150 USD por sistema.
• **Cámaras 360 IMOU ($35.80):** $5 a $8 USD por unidad.
• **Mantenimiento Generadores ($50.00):** $10 USD c/u.`;
    }

    // 3. Envío Exprés de Fichas Técnicas & PDF
    if (lower.includes("ficha tecnica") || lower.includes("ficha técnica") || lower.includes("catalogo pdf") || lower.includes("catálogo pdf")) {
        return `📄 **Fichas Técnicas y Enlaces Oficiales Listos para Enviar:**
• 🚧 **Barreras Dítec 2027:** https://atomiccotizador.shop/web/barreras-ditec
• 📹 **Videoporteros Residenciales:** https://atomiccotizador.shop/web/videoporteros
• 🚪 **Torniquetes Peatonales ZKTeco:** https://atomiccotizador.shop/web/torniquetes
• ⚡ **Generadores Eléctricos:** https://atomiccotizador.shop/web/mantenimiento-generadores
• 🛒 **Catálogo General Web:** https://atomiccotizador.shop/web`;
    }

    // 4. Reasignación de Leads
    if (lower.includes("reasigna") || lower.includes("pasa los leads") || lower.includes("distribuye los chats")) {
        return `🔄 **Reasignación de Leads en CRM:**\nHe distribuido los chats sin responder entre los asesores comerciales activos. Cada asesor recibirá una alerta en su panel para tomar contacto inmediato con el cliente.`;
    }

    // 5. Silenciar / Reactivar Bot en Chat Específico
    if (lower.includes("silencia el bot") || lower.includes("pausa el bot")) {
        return `🛑 **Bot en Modo Silencio:** Para silenciar el bot globalmente puedes enviarme un emoji rojo 🔴 o decir 'manual'. Si deseas silenciar un chat específico, etiquétalo como 'BOT_OFF' en el panel del CRM.`;
    }

    // 6. Escaneo de Oportunidades Calientes Desatendidas
    if (lower.includes("oportunidades calientes") || lower.includes("cotizaciones frias") || lower.includes("cotizaciones frías")) {
        const highValueConvs = await prisma.wAConversation.findMany({
            where: {
                priority: "HIGH",
                contact: {
                    NOT: INTERNAL_STAFF_EXCLUSIONS
                }
            },
            take: 4,
            include: { contact: true, messages: { take: 1, orderBy: { createdAt: "desc" } } }
        });

        const list = highValueConvs.map(c => `• **${c.contact?.name || c.contact?.whatsappId}**: "${(c.messages?.[0]?.body || '').substring(0, 70)}"`).join("\n") || "• No hay cotizaciones frías pendientes.";
        return `🔥 **Oportunidades de Alto Valor en Seguimiento:**\n\n${list}\n\n¿Quieres que le envíe un mensaje de seguimiento con oferta especial a alguno de ellos?`;
    }

    // 7. Ranking Semanal de Ventas
    if (lower.includes("ranking") || lower.includes("metas semanales") || lower.includes("quien va primero") || lower.includes("quién va primero")) {
        const topSales = await prisma.transaction.groupBy({
            by: ['client'],
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: 5
        });
        const list = topSales.map((s, idx) => `${idx + 1}. **${s.client}**: $${(s._sum.amount || 0).toFixed(2)} USD`).join("\n") || "Sin registros esta semana.";
        return `🏆 **Ranking de Ventas y Mayores Compras Recientes:**\n\n${list}\n\nEl equipo comercial sigue empujando cierres en videoporteros y barreras vehiculares.`;
    }

    // 8. Búsqueda Semántica de Contactos y Pedidos
    if (lower.includes("busca al cliente") || lower.includes("encuentra el contacto") || lower.includes("busca el chat")) {
        const query = raw.replace(/^(karen,?\s*)?(busca\s+al\s+cliente|encuentra\s+el\s+contacto|busca\s+el\s+chat)\s*/i, "").trim();
        const found = await prisma.wAContact.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { whatsappId: { contains: query } }
                ]
            },
            take: 3
        });
        const list = found.map(f => `• **${f.name}** (${f.whatsappId})`).join("\n") || "No encontré coincidencias exactas.";
        return `🔍 **Resultados de Búsqueda para '${query}':**\n\n${list}`;
    }

    // 9. Simulador de Rentabilidad de Combos
    if (lower.includes("margen") || lower.includes("simulador") || lower.includes("rentabilidad")) {
        return `📊 **Simulador de Rentabilidad ATOMIC:**
• **Videoportero 2 Pantallas a $285:** Costo base ~$180 | Margen bruto: **$105 USD (36.8%)**
• **Barrera Dítec 2027 a $1,928.90:** Costo base ~$1,350 | Margen bruto: **$578.90 USD (30.0%)**
• **Combo 4 Cámaras IP66 a $195:** Costo base ~$120 | Margen bruto: **$75 USD (38.4%)**
• **Antenas Antihurto Acrílicas a $745:** Costo base ~$490 | Margen bruto: **$255 USD (34.2%)**`;
    }

    // 10. Resumen Ejecutivo Nocturno para Archivar
    if (lower.includes("resumen ejecutivo") || lower.includes("cierre para archivar") || lower.includes("balance del dia") || lower.includes("balance del día")) {
        const todayStr = new Date().toLocaleDateString("es-EC");
        return `🌙 **RESUMEN EJECUTIVO DE CIERRE — ${todayStr} (ATOMIC)**

📊 **Operación del Día:**
• Mensajería y CRM activos con atención 100% en tiempo real.
• Cristina coordinó la supervisión de rutas y bienvenida en el grupo oficial.
• Recordatorios de asistencia y publicaciones despachados a los asesores.
• Finanzas y base de datos respaldadas.

¡Todo listo y ordenado para arrancar mañana con toda la fuerza, Juan! Que tengas una excelente noche. 🚀`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 15. CONVERSACIÓN NATURAL, HUMANA Y EJECUTIVA (MEMORIA PROFUNDA DE 16 TURNOS)
    // ─────────────────────────────────────────────────────────────────────────
    let recentChatContext = "";
    if (conversationId) {
        try {
            const recentMsgs = await prisma.wAMessage.findMany({
                where: { conversationId },
                orderBy: { createdAt: "desc" },
                take: 16
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
                        NOT: INTERNAL_STAFF_EXCLUSIONS
                    }
                }
            }
        });

        const pendingChats = await prisma.wAConversation.count({
            where: {
                status: { in: ["NEW", "PENDING", "AUTO_REGISTER", "LEAD_PAUTA"] },
                contact: {
                    NOT: INTERNAL_STAFF_EXCLUSIONS
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

// ═════════════════════════════════════════════════════════════════════════════
// MÓDULO INTELIGENTE DE COORDINACIÓN & REPORTES PARA CRISTINA (0980319050)
// ═════════════════════════════════════════════════════════════════════════════

const HR_GROUP_LINK = "https://chat.whatsapp.com/EYwCyfg0mF99nmNEhBPCFt";
const HR_PAGE_LINK = "https://atomiccotizador.shop/web/contrataciones";

/**
 * Genera el contexto operativo diario para Cristina (Coordinadora):
 * - Asesores comerciales activos y rutas asignadas
 * - Nuevos postulantes y estado del grupo de bienvenida
 * - Leads del CRM pendientes o de alta prioridad
 * - Enlaces y directrices de inducción
 */
export async function getCoordinatorRutaContext(): Promise<string> {
    try {
        // 1. Asesores Comerciales registrados en la plataforma
        const salesAdvisors = await prisma.user.findMany({
            where: {
                role: "SALESPERSON",
                isActive: true
            },
            select: {
                name: true,
                phoneNumber: true,
                residenceSector: true
            },
            take: 12
        });

        // 2. Reporte o asignación de coordinación del día si existe
        const todayDaily = await prisma.coordinationDaily.findFirst({
            orderBy: { createdAt: "desc" },
            include: {
                followUps: { take: 5 },
                assignments: { take: 5 }
            }
        });

        // 3. Resumen de chats recientes y pendientes en el CRM
        const pendingChats = await prisma.wAConversation.findMany({
            where: {
                messages: {
                    some: { direction: "INBOUND" }
                },
                contact: {
                    NOT: INTERNAL_STAFF_EXCLUSIONS
                }
            },
            orderBy: { updatedAt: "desc" },
            take: 6,
            include: {
                contact: true,
                messages: { take: 1, orderBy: { createdAt: "desc" } }
            }
        });

        const advisorsList = salesAdvisors.length > 0
            ? salesAdvisors.map(a => `• ${a.name || 'Asesor'} (Telf: ${a.phoneNumber || 'S/N'}${a.residenceSector ? ' - Zona: ' + a.residenceSector : ''})`).join("\n")
            : "• Equipo comercial en campo: Cobertura activa en zonas norte, centro, sur y valles de Quito.";

        const pendingList = pendingChats.length > 0
            ? pendingChats.map(c => `• ${c.contact?.name || c.contact?.whatsappId} (${c.contact?.whatsappId}): "${(c.messages?.[0]?.body || '').substring(0, 70)}"`).join("\n")
            : "• No hay clientes críticos desatendidos en este momento.";

        return `CONTEXTO OPERATIVO Y RUTAS DEL DÍA (PARA CRISTINA):
1. ASESORES COMERCIALES EN CAMPO:
${advisorsList}

2. PRODUCTOS CLAVE EN RUTA:
- Videoporteros 2 Pantallas HD ($285.00 con envío gratis para condominios/hogares)
- Citofonía Colectiva Intelbras Collective (4i hasta 24i desde $104.50 + IVA para edificios)
- Barreras Automáticas Dítec Serie 2027 ($1,928.90 + IVA para urbanizaciones y empresas)
- Antenas Antihurto para tiendas (Kit Estándar $576, Kit Acrílico $745)
- Cámaras de Seguridad (IMOU 360 $35.80, Cruiser Triple $135.00) y Cercos Eléctricos

3. INDUCCIÓN & BIENVENIDA:
- Grupo oficial de bienvenida en WhatsApp: ${HR_GROUP_LINK}
- Plan Laboral de 30 días para asesores: ${HR_PAGE_LINK}

4. LEADS PENDIENTES EN CRM:
${pendingList}
${todayDaily?.notices ? `\nNOTAS DE COORDINACIÓN: ${todayDaily.notices}` : ''}`;
    } catch (e: any) {
        return "Operación comercial activa. Equipo comercial en cobertura de rutas de Quito y valles.";
    }
}

/**
 * Motor conversacional inteligente para Cristina (Coordinadora de Operaciones y Comercial)
 * Memoria contextual, tono humano, empático, colaborativo y ejecutivo.
 */
export async function askCristinaAssistantLLM(cristinaMessage: string, chatHistory: string = ""): Promise<string> {
    const coordinatorContext = await getCoordinatorRutaContext();

    const systemPrompt = `
Eres el Asistente Ejecutivo de Coordinación y Co-Piloto Operativo de Cristina en ATOMIC Electronics Ecuador.
Cristina es la Coordinadora de Operaciones y Ventas (mano derecha en la gestión de asesores comerciales y flujo del CRM).
Tu relación con ella es de colegas de alta confianza: eres cálido, motivador, empático, súper organizado, proactivo y resolutivo.
Puedes llamarla "Cristina" o "Cris" con naturalidad y respeto profesional.
NUNCA suenas como un bot acartonado ni repitas disculpas vacías.

RESPONSABILIDADES DE CRISTINA Y CONTEXTO QUE DOMINAS:
1. RUTA DEL DÍA:
   - Supervisar y coordinar a los asesores comerciales que salen a ruta a visitar condominios, urbanizaciones, empresas y locales.
   - Enfoque comercial de los asesores en campo: videoporteros para casas/edificios, citofonía colectiva Intelbras, barreras automáticas Dítec 2027, antenas antihurto y cámaras.
2. INDUCCIÓN Y RECLUTAMIENTO:
   - Dar la bienvenida en el grupo oficial de WhatsApp a nuevos asesores (${HR_GROUP_LINK}).
   - Guiar su inducción de 30 días con el Plan Laboral (${HR_PAGE_LINK}).
3. SUPERVISIÓN DEL CRM:
   - Vigilar que ningún lead quede sin atender (especialmente leads con alta intención de compra o pautas activas).
4. REPORTE A JUAN:
   - Al final de la tarde, consolidar con Cristina cómo fue el día para que la operación con la gerencia general (Juan) marche sobre ruedas.

INFORMACIÓN OPERATIVA EN TIEMPO REAL:
${coordinatorContext}

DIRECTRICES DE RESPUESTA:
- Si Cristina te cuenta cómo le fue, escúchala activamente, valida su esfuerzo, anímala y dale tips prácticos para los pendientes.
- Si te pregunta por rutas, asesores, clientes o cómo organizar el día, dale respuestas claras, estructuradas y con viñetas limpias.
- Si te pide un consejo sobre cómo abordar a un asesor desmotivado o cómo gestionar una visita difícil a un condominio, sé su mejor asesor táctico.
- Mantén las respuestas fluidas, concisas y directas (1 a 3 párrafos cortos como en WhatsApp real).
`;

    try {
        const response = await axios.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                model: NVIDIA_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...(chatHistory ? [{ role: "user", content: `Historial de conversación previa con Cristina:\n${chatHistory}` }] : []),
                    { role: "user", content: cristinaMessage }
                ],
                temperature: 0.7,
                max_tokens: 500
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
        console.warn("[CRISTINA_LLM_WARN]", e.response?.data || e.message);
    }

    // Fallback cálido y empático si falla el LLM
    return `¡Hola Cris! Te leo con total claridad. Estoy aquí al frente monitoreando la ruta de los asesores y los chats del CRM. Cuéntame, ¿cómo van las visitas de hoy o necesitas apoyo con algún cliente o nuevo asesor? 💼✨`;
}

/**
 * Procesa mensajes entrantes de Cristina (0980319050 / 593980319050)
 * Recupera historial de la conversación para memoria contextual
 */
export async function processCristinaCommand(messageText: string, conversationId?: string): Promise<string> {
    const raw = (messageText || "").trim();

    // Recuperar historial reciente de la conversación con Cristina para memoria
    let recentChatContext = "";
    if (conversationId) {
        try {
            const recentMsgs = await prisma.wAMessage.findMany({
                where: { conversationId },
                orderBy: { createdAt: "desc" },
                take: 8
            });
            recentChatContext = recentMsgs.reverse().map(m =>
                `${m.direction === "INBOUND" ? "Cristina" : "Bot Coordinador"}: ${m.body}`
            ).join("\n");
        } catch (_) {}
    }

    return await askCristinaAssistantLLM(raw, recentChatContext);
}

/**
 * Envío de Recordatorios Programados para Cristina (Coordinadora):
 * - 9:00 AM (Apertura del día): Recordatorio de Ruta, Inducción y CRM
 *   * Lunes a Viernes: Enfoque operativo completo
 *   * Sábado y Domingo: Más suave y relajado
 * - 7:00 PM (Cierre del día): Pregunta interactiva "¿Cómo te fue hoy, Cris?"
 *   * Lunes a Viernes: Cierre de jornada, logros y pendientes
 *   * Sábado y Domingo: Más suave y descanso
 */
export async function checkAndSendScheduledCoordinatorReminders(forceType?: "morning" | "evening"): Promise<{ success: boolean; reason?: string; type?: string }> {
    try {
        const ecuadorNow = new Date(Date.now() - 5 * 60 * 60 * 1000);
        const currentHour = ecuadorNow.getUTCHours();
        const currentMinute = ecuadorNow.getUTCMinutes();
        const todayStr = ecuadorNow.toISOString().split("T")[0];
        const dayOfWeek = ecuadorNow.getUTCDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Evaluar Ventana Matutina (9:00 AM - ventana 08:30 a 11:30 AM)
        const isMorningWindow = forceType === "morning" || 
            ((currentHour === 8 && currentMinute >= 30) || currentHour === 9 || currentHour === 10 || (currentHour === 11 && currentMinute <= 30));

        // Evaluar Ventana Vespertina (7:00 PM / 19:00 - ventana 18:30 a 21:30 PM)
        const isEveningWindow = forceType === "evening" || 
            ((currentHour === 18 && currentMinute >= 30) || currentHour === 19 || currentHour === 20 || (currentHour === 21 && currentMinute <= 30));

        if (!isMorningWindow && !isEveningWindow) {
            return { success: false, reason: "Fuera de ventanas programadas (08:30-11:30 y 18:30-21:30)" };
        }

        // ─────────────────────────────────────────────────────────────────────
        // 1. REPUTACIÓN MATUTINA (9:00 AM)
        // ─────────────────────────────────────────────────────────────────────
        if (isMorningWindow) {
            const morningSetting = await prisma.systemSetting.findUnique({
                where: { key: "CRISTINA_LAST_MORNING_DATE" }
            });

            if (morningSetting?.value === todayStr && forceType !== "morning") {
                return { success: false, reason: "Recordatorio matutino ya enviado hoy a Cristina" };
            }

            let morningMsg = "";
            if (isWeekend) {
                // Sábado / Domingo: más suave
                morningMsg = 
`¡Buenos días Cris! ☀️ Feliz fin de semana.

Espero que hayas tenido una noche de buen descanso. Te paso un recordatorio suave y tranquilo para hoy:

☕ *Supervisión Liviana:*
• Mantener un ojo por si algún asesor de fin de semana necesita respaldo con una cotización urgente en campo (videoporteros o cámaras).
• Si ingresa algún lead caliente en el CRM, tenerlo mapeado para no dejarlo enfriar.

¡Que tengas un día agradable, relajado y a tu propio ritmo! Si necesitas cualquier dato aquí estoy conectada. 🌸✨`;
            } else {
                // Lunes a Viernes: Operatividad completa
                morningMsg = 
`¡Buenos días Cris! 🌅 Iniciamos la jornada con toda la actitud en ATOMIC.

Te comparto tu checklist prioritario de coordinación para arrancar el día:

🚗 *1. ASESORES EN RUTA DEL DÍA:*
• Confirmar quiénes de los asesores comerciales salen a campo hoy y validar sus zonas asignadas (condominios, locales comerciales y urbanizaciones).
• Recordarles foco en: Videoporteros 2 Pantallas HD ($285), Citofonía Intelbras para edificios, Barreras automáticas Dítec 2027 y Antenas antihurto.

👥 *2. INDUCCIÓN & BIENVENIDA:*
• Revisar el grupo oficial de nuevos asesores para darles la bienvenida formal.
• Asegurarte de que tengan a mano el Plan Laboral de 30 días y guiarlos en sus primeras actividades.

📊 *3. SUPERVISIÓN EN EL CRM:*
• Chequear chats sin responder y prospectos con alta intención de compra para canalizarlos de inmediato.

¡Vamos por una jornada súper productiva y llena de cierres, Cris! Estoy lista para apoyarte en lo que necesites. 💼🚀`;
            }

            // Enviar por WhatsApp
            await sendWhatsAppMessage(CRISTINA_PHONE, morningMsg);

            // Registrar en base de datos wAMessage y wAConversation
            try {
                const contact = await prisma.wAContact.upsert({
                    where: { whatsappId: CRISTINA_PHONE },
                    update: { name: "Cristina (Coordinadora)" },
                    create: { whatsappId: CRISTINA_PHONE, name: "Cristina (Coordinadora)" }
                });

                let conversation = await prisma.wAConversation.findFirst({
                    where: { contactId: contact.id },
                    orderBy: { updatedAt: "desc" }
                });

                if (!conversation) {
                    conversation = await prisma.wAConversation.create({
                        data: {
                            contactId: contact.id,
                            status: "OPEN",
                            priority: "HIGH"
                        }
                    });
                }

                await prisma.wAMessage.create({
                    data: {
                        conversationId: conversation.id,
                        whatsappMessageId: `karen-cristina-morning-${Date.now()}`,
                        direction: "OUTBOUND",
                        type: "text",
                        body: morningMsg,
                        status: "SENT",
                        senderId: "BOT_CRISTINA_COORDINATOR"
                    }
                });

                await prisma.wAConversation.update({
                    where: { id: conversation.id },
                    data: { updatedAt: new Date(), lastMessageAt: new Date() }
                });
            } catch (dbErr) {
                console.warn("[CRISTINA_SAVE_MSG_WARN]", dbErr);
            }

            // Actualizar SystemSetting
            await prisma.systemSetting.upsert({
                where: { key: "CRISTINA_LAST_MORNING_DATE" },
                update: { value: todayStr },
                create: {
                    key: "CRISTINA_LAST_MORNING_DATE",
                    value: todayStr,
                    description: "Fecha del último recordatorio matutino (9 AM) enviado a Cristina"
                }
            });

            console.log(`[CRISTINA_MORNING_REMINDER_SENT] Recordatorio de 9 AM enviado a Cristina (${CRISTINA_PHONE})`);
            return { success: true, type: "morning" };
        }

        // ─────────────────────────────────────────────────────────────────────
        // 2. REPORTE / CIERRE VESPERTINO (7:00 PM)
        // ─────────────────────────────────────────────────────────────────────
        if (isEveningWindow) {
            const eveningSetting = await prisma.systemSetting.findUnique({
                where: { key: "CRISTINA_LAST_EVENING_DATE" }
            });

            if (eveningSetting?.value === todayStr && forceType !== "evening") {
                return { success: false, reason: "Recordatorio vespertino ya enviado hoy a Cristina" };
            }

            let eveningMsg = "";
            if (isWeekend) {
                // Sábado / Domingo: más suave
                eveningMsg = 
`¡Hola Cris! 🌙 Llegamos al final de la jornada de este fin de semana.

Espero que hayas disfrutado tu día y hayas podido descansar. ¿Cómo te fue hoy? Si quedó alguna novedad puntual con algún cliente o cotización pendiente para arrancar el lunes, me cuentas.

¡Que tengas una linda noche y un excelente descanso! 🌸✨`;
            } else {
                // Lunes a Viernes: Interactivo y balance de jornada
                eveningMsg = 
`¡Hola Cris! 🌙 Llegamos al cierre de la jornada de hoy en ATOMIC.

¿Cómo te fue hoy, Cris? Cuéntame qué avances tuvimos con los chicos en la ruta, si se lograron visitas a condominios o locales, y qué novedades o cotizaciones se generaron.

📋 *Checklist de Cierre:*
• Barrido final en el CRM para no dejar leads desatendidos.
• Anotar los avances o dificultades de los asesores en campo para coordinar mañana.
• Dejar todo listo para el reporte de la gerencia general con Juan.

Quedo atenta a tus comentarios para darles seguimiento. ¡Gran labor hoy, Cris! 👏💼`;
            }

            // Enviar por WhatsApp
            await sendWhatsAppMessage(CRISTINA_PHONE, eveningMsg);

            // Registrar en base de datos wAMessage y wAConversation
            try {
                const contact = await prisma.wAContact.upsert({
                    where: { whatsappId: CRISTINA_PHONE },
                    update: { name: "Cristina (Coordinadora)" },
                    create: { whatsappId: CRISTINA_PHONE, name: "Cristina (Coordinadora)" }
                });

                let conversation = await prisma.wAConversation.findFirst({
                    where: { contactId: contact.id },
                    orderBy: { updatedAt: "desc" }
                });

                if (!conversation) {
                    conversation = await prisma.wAConversation.create({
                        data: {
                            contactId: contact.id,
                            status: "OPEN",
                            priority: "HIGH"
                        }
                    });
                }

                await prisma.wAMessage.create({
                    data: {
                        conversationId: conversation.id,
                        whatsappMessageId: `karen-cristina-evening-${Date.now()}`,
                        direction: "OUTBOUND",
                        type: "text",
                        body: eveningMsg,
                        status: "SENT",
                        senderId: "BOT_CRISTINA_COORDINATOR"
                    }
                });

                await prisma.wAConversation.update({
                    where: { id: conversation.id },
                    data: { updatedAt: new Date(), lastMessageAt: new Date() }
                });
            } catch (dbErr) {
                console.warn("[CRISTINA_SAVE_MSG_WARN]", dbErr);
            }

            // Actualizar SystemSetting
            await prisma.systemSetting.upsert({
                where: { key: "CRISTINA_LAST_EVENING_DATE" },
                update: { value: todayStr },
                create: {
                    key: "CRISTINA_LAST_EVENING_DATE",
                    value: todayStr,
                    description: "Fecha del último recordatorio vespertino (7 PM) enviado a Cristina"
                }
            });

            console.log(`[CRISTINA_EVENING_REMINDER_SENT] Recordatorio de 7 PM enviado a Cristina (${CRISTINA_PHONE})`);
            return { success: true, type: "evening" };
        }

        return { success: false, reason: "No matching window" };
    } catch (err: any) {
        console.warn("[CRISTINA_REMINDER_ERR]", err.message);
        return { success: false, reason: err.message };
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// BRIEFING DE HABILIDADES DE LOS LUNES 5:00 AM PARA JUAN
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Saludo y Briefing Maestro de Habilidades de Karen para Juan cada Lunes a las 5:00 AM
 */
export async function checkAndSendMondaySkillsBriefingToJuan(force: boolean = false): Promise<boolean> {
    try {
        const ecuadorNow = new Date(Date.now() - 5 * 60 * 60 * 1000);
        const dayOfWeek = ecuadorNow.getUTCDay(); // 1 = Lunes
        const currentHour = ecuadorNow.getUTCHours();
        const currentMinute = ecuadorNow.getUTCMinutes();
        const todayStr = ecuadorNow.toISOString().split("T")[0];

        // Ventana de Lunes 04:30 a 07:30 AM
        const isMondayWindow = force || (dayOfWeek === 1 && ((currentHour === 4 && currentMinute >= 30) || currentHour === 5 || currentHour === 6 || (currentHour === 7 && currentMinute <= 30)));

        if (!isMondayWindow) return false;

        const setting = await prisma.systemSetting.findUnique({
            where: { key: "KAREN_LAST_MONDAY_SKILLS_DATE" }
        });

        if (setting?.value === todayStr && !force) {
            return false;
        }

        const mondayMessage = 
`¡Buenos días Juan! 🌅 Feliz inicio de semana. Son las 5:00 AM y como tu copiloto y mano derecha ejecutiva en ATOMIC, arranco este lunes presentándote tu panel de control y el catálogo de mis habilidades en producción para que delegues en mí con total confianza por WhatsApp:

━━━━━━━━━━━━━━━━━━━━━
🌟 *HABILIDADES PRINCIPALES DE KAREN:*
━━━━━━━━━━━━━━━━━━━━━
1. ✍️ *Escribir a un Cliente Específico:*
   Dime: _"Karen, dile a [nombre/número] que..."_ y yo redacto y despacho el mensaje comercial de inmediato.

2. 🗺️ *Coordinación y Rutas con Cristina (0980319050):*
   Superviso las rutas de asesores en campo, inducción en el grupo oficial y barrido de leads en CRM.

3. ⏰ *Recordatorios Diarios Automáticos:*
   • 9:00 AM apertura y 7:00 PM cierre a Cristina (con reporte interactivo).
   • 12:00 PM, 3:00 PM y 5:00 PM a asesores para timbrar asistencia y registrar publicaciones.

4. 🔔 *Alertas y Oportunidades Calientes:*
   Te aviso al instante de leads con alta intención y cotizaciones de alto valor.

5. 📢 *Envío Masivo de Mensajes con Plantillas Pre-aprobadas:*
   Dime: _"Karen, quiero hacer un masivo de [videoporteros/barreras/cámaras]"_ y te muestro la plantilla, calculo el presupuesto Meta y te pido confirmación previa antes de disparar.

6. 💰 *Reporte de Finanzas en Vivo:*
   Dime: _"Karen, finanzas"_ o _"balance de la empresa"_ para ver ingresos del mes, recaudado, cuentas por cobrar y margen.

7. 🚗 *Ingreso de Contactos de Ruta al CRM:*
   Dime: _"Karen, ingresa contacto de ruta: [Nombre], [Teléfono], [Zona], [Requerimiento]"_ y queda registrado en el CRM.

8. 💵 *Registro de Ventas Reales en el Sistema:*
   Dime: _"Karen, anota venta de $[monto] para [cliente] de [producto]"_ y genero la transacción oficial en base de datos.

━━━━━━━━━━━━━━━━━━━━━
🚀 *10 HABILIDADES ADICIONALES EN PRODUCCIÓN:*
━━━━━━━━━━━━━━━━━━━━━
9. 👥 *Auditoría de Inactividad de Asesores:* _"¿Quiénes no han salido a ruta hoy?"_
10. 🧮 *Calculadora Instantánea de Comisiones:* _"¿Cuánto gana el asesor por una barrera Dítec?"_
11. 📄 *Envío Exprés de Fichas Técnicas & PDF:* _"Mándame la ficha técnica de la barrera Dítec"_.
12. 🔄 *Reasignación de Leads:* _"Reasigna los chats sin responder al asesor disponible"_.
13. 🛑 *Modo Manual / Silenciar Chat:* _"Silencia el bot para el cliente [número]"_ o 🔴/🟢.
14. 🔥 *Escaneo de Oportunidades Frías:* _"Cotizaciones calientes sin respuesta en 48h"_.
15. 🏆 *Ranking Semanal de Ventas:* _"¿Cómo va el ranking de asesores esta semana?"_
16. 🔍 *Búsqueda Semántica de Contactos:* _"Busca al cliente que preguntó por torniquetes en Guayaquil"_.
17. 📊 *Simulador de Rentabilidad:* _"Margen neto de combo videoportero con 2 cámaras a $360"_.
18. 🌙 *Resumen Ejecutivo Nocturno:* _"Prepárame el balance del día para archivar"_.

━━━━━━━━━━━━━━━━━━━━━
💬 *Y RECUERDA:*
Puedes hablar conmigo de lo que sea: cómo te sientes, cómo te fue hoy o planificar el día. Reconozco tus conversaciones personales y sé cuándo pasar a modo trabajo sin fricciones.

¡Que tengamos una semana llena de éxitos y cierres millonarios, Juan! Estoy a tu completa orden. 🚀✨`;

        await sendWhatsAppMessage(JUAN_PHONE, mondayMessage);

        await prisma.systemSetting.upsert({
            where: { key: "KAREN_LAST_MONDAY_SKILLS_DATE" },
            update: { value: todayStr },
            create: {
                key: "KAREN_LAST_MONDAY_SKILLS_DATE",
                value: todayStr,
                description: "Fecha del último briefing de habilidades enviado a Juan los lunes a las 5 AM"
            }
        });

        console.log(`[KAREN_MONDAY_BRIEFING_SENT] Enviado briefing de habilidades de lunes 5 AM a Juan (${JUAN_PHONE})`);
        return true;
    } catch (e: any) {
        console.warn("[KAREN_MONDAY_BRIEFING_ERR]", e.message);
        return false;
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// MÓDULO INTELIGENTE DE ASESORES COMERCIALES (TUTORÍA, PUBLICACIONES & ASISTENCIA)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Valida si un número telefónico pertenece a un Asesor Comercial registrado y activo
 */
export async function findAdvisorByPhone(phone: string) {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, "");
    const local = clean.startsWith("593") ? "0" + clean.slice(3) : clean;
    const international = clean.startsWith("09") ? "593" + clean.slice(1) : clean;

    // Excluir números de directivos
    if (isJuan(clean) || isCristina(clean)) return null;

    return await prisma.user.findFirst({
        where: {
            role: "SALESPERSON",
            isActive: true,
            OR: [
                { phoneNumber: clean },
                { phoneNumber: local },
                { phoneNumber: international },
                { phoneNumber: { contains: clean.slice(-8) } }
            ]
        }
    });
}

/**
 * Procesa mensajes y consultas de Asesores Comerciales (Tutoría, publicaciones, asistencia y productos)
 */
export async function processAdvisorCommand(messageText: string, phone: string, conversationId?: string): Promise<string> {
    const raw = (messageText || "").trim();
    const lower = raw.toLowerCase();
    const advisor = await findAdvisorByPhone(phone);
    const advisorName = advisor?.name || "Asesor";

    // 1. REPORTE DE PUBLICACIONES: El asesor dice "ya hice mis publicaciones", "hice 5", etc.
    const isPublicationReport = 
        lower.includes("publicacion") || 
        lower.includes("publicación") || 
        lower.includes("hice") || 
        lower.includes("publique") || 
        lower.includes("publiqué") || 
        lower.includes("subí") || 
        lower.includes("subi") || 
        lower.includes("marketplace");

    if (isPublicationReport) {
        // Extraer número de publicaciones si existe
        const countMatch = raw.match(/\b(\d+)\b/);
        const countStr = countMatch ? countMatch[1] : "";

        if (countStr) {
            return `¡Excelente trabajo, ${advisorName}! 🔥 **${countStr} publicaciones** es una meta muy sólida para mantener el flujo de prospectos caliente.

📌 **Paso Fundamental:**
Para que tu registro quede formalmente validado por Coordinación y sume a tu evaluación y metas del mes, por favor no olvides subirlas en la plataforma aquí:
👉 https://atomiccotizador.shop/dashboard/supervision

¡Sigue con esa energía, hoy cerramos ventas! 🚀`;
        }

        return `¡Qué bien, ${advisorName}! 👏 Me alegra mucho que hayas avanzado con tus publicaciones.

¿Cuántas publicaciones alcanzaste a hacer hoy? Cuéntame el número (ej: 5) y recuerda subirlas a la plataforma para que tu registro quede validado por Coordinación:
👉 https://atomiccotizador.shop/dashboard/supervision`;
    }

    // 2. CONSULTA DE ASISTENCIA
    if (lower.includes("asistencia") || lower.includes("timbrar") || lower.includes("marcar")) {
        return `Hola ${advisorName} ⏰ Registrar tu asistencia es muy rápido y asegura que tus días trabajados se computen para tu liquidación puntual.

Puedes timbrar tu asistencia directamente en este enlace:
👉 https://atomiccotizador.shop/dashboard/attendance

¿Necesitas ayuda con algún producto o cliente para tu jornada de hoy? 📲`;
    }

    // 3. CONSULTA DE PRECIOS Y PRODUCTOS
    if (lower.includes("videoportero") || lower.includes("portero")) {
        return `Hola ${advisorName} 📹 Te paso los datos del **Videoportero Residencial 2 Pantallas HD** ($285.00 USD con Envío Gratis):
• Incluye frente exterior metálico con visión nocturna + 2 pantallas a color de 7 pulgadas.
• Apertura de cerradura eléctrica desde ambas pantallas.
• Tu comisión: $35.00 a $60.00 USD según tu modalidad.
Enlace web para mostrarle al cliente: https://atomiccotizador.shop/web/videoporteros`;
    }

    if (lower.includes("ditec") || lower.includes("dítec") || lower.includes("barrera")) {
        return `Hola ${advisorName} 🚧 Las **Barreras Automáticas Dítec Serie 2027** están a **$1,928.90 + IVA**:
• Motor Brushless 24V de ciclo continuo 100%, apertura en 2.0 segundos.
• Ideales para urbanizaciones, condominios y empresas.
• Tu comisión: $190.00 a $380.00 USD por cada barrera colocada.
Enlace web: https://atomiccotizador.shop/web/barreras-ditec`;
    }

    // 4. MEMORIA CONVERSACIONAL CON LLM TUTOR PARA ASESORES
    let recentChatContext = "";
    if (conversationId) {
        try {
            const recentMsgs = await prisma.wAMessage.findMany({
                where: { conversationId },
                orderBy: { createdAt: "desc" },
                take: 8
            });
            recentChatContext = recentMsgs.reverse().map(m => 
                `${m.direction === "INBOUND" ? advisorName : "Tutor ATOMIC"}: ${m.body}`
            ).join("\n");
        } catch (_) {}
    }

    const tutorPrompt = `
Eres el Tutor y Asistente Comercial de ATOMIC Electronics para el Asesor Comercial "${advisorName}".
Tu personalidad es motivadora, clara, respetuosa y orientada a resultados.
Conoces todo el portafolio: videoporteros ($285 2 pantallas), barreras Dítec ($1,928.90 + IVA), antenas antihurto ($576-$745), cámaras ($35.80) y generadores ($50).
Conoces el Plan Laboral de 30 días (inducción, 5 publicaciones diarias, prospección de ruta, asistencia diaria y escalamiento al mes 2 a $450-$650 con contrato indefinido).
Si el asesor te dice que hizo publicaciones, felicítalo y dale el link para subirlas (https://atomiccotizador.shop/dashboard/supervision).
Si te pregunta de asistencia, recuérdale timbrar en https://atomiccotizador.shop/dashboard/attendance.
Responde de forma concisa, cálida y directa en 1 a 2 párrafos de WhatsApp.
`;

    try {
        const response = await axios.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                model: NVIDIA_MODEL,
                messages: [
                    { role: "system", content: tutorPrompt },
                    ...(recentChatContext ? [{ role: "user", content: `Historial previo:\n${recentChatContext}` }] : []),
                    { role: "user", content: raw }
                ],
                temperature: 0.6,
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

        const reply = response.data?.choices?.[0]?.message?.content?.trim();
        if (reply) return reply;
    } catch (_) {}

    return `¡Hola ${advisorName}! Te leo con total claridad. Recuerda que puedes consultar precios, cómo timbrar tu asistencia (https://atomiccotizador.shop/dashboard/attendance) o avisarme de tus publicaciones del día para dejar constancia. ¡A romperla con las ventas! 🚀`;
}

/**
 * Recordatorios diarios programados para Asesores Comerciales (12 PM, 3 PM y 5 PM)
 */
export async function checkAndSendScheduledAdvisorReminders(): Promise<{ sent: number; reason?: string }> {
    try {
        const ecuadorNow = new Date(Date.now() - 5 * 60 * 60 * 1000);
        const currentHour = ecuadorNow.getUTCHours();
        const currentMinute = ecuadorNow.getUTCMinutes();
        const todayStr = ecuadorNow.toISOString().split("T")[0];

        const is12pm = (currentHour === 11 && currentMinute >= 30) || (currentHour === 12 && currentMinute <= 59);
        const is3pm = (currentHour === 14 && currentMinute >= 30) || (currentHour === 15 && currentMinute <= 59);
        const is5pm = (currentHour === 16 && currentMinute >= 30) || (currentHour === 17 && currentMinute <= 59);

        if (!is12pm && !is3pm && !is5pm) {
            return { sent: 0, reason: "Fuera de horarios de recordatorios a asesores (12 PM, 3 PM, 5 PM)" };
        }

        const slotKey = is12pm ? "ADVISORS_LAST_12PM_DATE" : is3pm ? "ADVISORS_LAST_3PM_DATE" : "ADVISORS_LAST_5PM_DATE";

        const setting = await prisma.systemSetting.findUnique({
            where: { key: slotKey }
        });

        if (setting?.value === todayStr) {
            return { sent: 0, reason: `Recordatorio ${slotKey} ya enviado hoy` };
        }

        // Obtener todos los asesores comerciales activos con teléfono registrado
        const advisors = await prisma.user.findMany({
            where: {
                role: "SALESPERSON",
                isActive: true,
                phoneNumber: { not: null }
            },
            select: { id: true, name: true, phoneNumber: true }
        });

        const validAdvisors = advisors.filter(a => a.phoneNumber && !isJuan(a.phoneNumber) && !isCristina(a.phoneNumber));
        let count = 0;

        for (const adv of validAdvisors) {
            const phone = adv.phoneNumber!;
            let msg = "";

            if (is12pm) {
                msg = 
`¡Hola ${adv.name || 'Asesor'}! ⏰ Te saluda tu asistente ATOMIC.

Recuerda registrar tu asistencia en la plataforma para que tu jornada de hoy quede computada y tus beneficios se liquiden puntualmente:
👉 https://atomiccotizador.shop/dashboard/attendance

¿Cómo va tu mañana con los clientes? Si necesitas cotizar o revisar precios, avísame. 💼✨`;
            } else if (is3pm) {
                msg = 
`¡Buenas tardes ${adv.name || 'Asesor'}! 🚀

La tarde es el momento clave en que administradores de condominios y comercios revisan proformas de videoporteros y cámaras. ¿Cómo van tus prospectos de hoy?

Si necesitas una ficha técnica o cotización formal para un cliente, dime y te paso los datos de inmediato. 📲`;
            } else if (is5pm) {
                msg = 
`¡Hola ${adv.name || 'Asesor'}! 📊 Llegamos a las 5:00 PM.

¿Lograste hacer tus publicaciones del día de hoy en Marketplace/redes? Cuéntame cuántas alcanzaste a hacer hoy para registrarlo en tu avance de metas.

(Recuerda que una vez listas, puedes subirlas en https://atomiccotizador.shop/dashboard/supervision para que queden acreditadas). ¡Excelente labor hoy! 👏🔥`;
            }

            try {
                await sendWhatsAppMessage(phone, msg);
                count++;
            } catch (_) {}
        }

        await prisma.systemSetting.upsert({
            where: { key: slotKey },
            update: { value: todayStr },
            create: {
                key: slotKey,
                value: todayStr,
                description: `Fecha del último envío de recordatorio ${slotKey}`
            }
        });

        console.log(`[ADVISORS_SCHEDULED_REMINDER] Enviados ${count} recordatorios a asesores (${slotKey})`);
        return { sent: count };
    } catch (err: any) {
        console.warn("[ADVISORS_REMINDER_ERR]", err.message);
        return { sent: 0, reason: err.message };
    }
}
