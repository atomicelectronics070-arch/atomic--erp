import { prisma } from "@/lib/prisma";
import { karenState } from "@/lib/karen/karenBrain";

/**
 * ALFRED — Inteligencia Artificial Ejecutiva de Supervisión y Dirección
 * Diseñado exclusivamente para Juan Guzmán (Supervisor / Gerencia)
 * Color temático: ESMERALDA (#10B981)
 */

export interface AlfredContext {
    soft3Status: {
        client: string;
        debtor: string;
        planModules: number;
        modulesRemaining: number;
        paymentPromisedDate: string;
        daysOverdue: number;
        totalEstimatedModules: number;
        notes: string;
        actionItem: string;
    };
    keyDeals: Array<{
        name: string;
        type: string;
        amount: number;
        date: string;
        status: string;
        details: string;
    }>;
    recentContacts: Array<{
        name: string;
        phone: string;
        role: string;
        summary: string;
    }>;
}

export const ALFRED_SUPERVISOR_CONTEXT: AlfredContext = {
    soft3Status: {
        client: "SOFTRES SISTEMAS / AB INGENIEROS",
        debtor: "Sr. Rómulo",
        planModules: 12,
        modulesRemaining: 11,
        paymentPromisedDate: "Miércoles 7 de Octubre de 2026",
        daysOverdue: 43, // Más de 6 semanas de mora calculadas al 19/11/2026
        totalEstimatedModules: 12,
        notes: "El Sr. Rómulo debe pagar el valor acordado destinado a compra de servidores y dominios para la migración multi-tenant. En la conversación del 17/11/2026 afirmó: 'finalicemos ahí tenemos que cobrar para pagarle a ust'.",
        actionItem: "Exigir el abono en cada requerimiento técnico (bancos, ventas, facturación) y activar rendimiento comercial para captar nuevos clientes para Soft 3."
    },
    keyDeals: [
        {
            name: "DOMUM CONSTRUCCIONES (DOMUN-CONS CIA.LTDA)",
            type: "Implementación Sistema Asistencia Vehicular",
            amount: 4229.00,
            date: "26/10/2026",
            status: "Registrado en Finanzas para Aprobación Técnica",
            details: "Cotización TMIT-00056: 2 Barreras vehiculares Dítec 3m ($3,300), fotoceldas anticierre ($165), tótems de soporte ($600), puntos de trabajo Costa ($788), breaker, materiales y red."
        }
    ],
    recentContacts: [
        {
            name: "Abg. Cristhian Arellano",
            phone: "+593 99 690 0777",
            role: "Cliente Residencial Cámaras",
            summary: "Instalación de cámaras Wansview en conjunto, calibración de red WiFi y mantenimiento de rodamientos."
        },
        {
            name: "David Cabrera (Adm. Conjunto María Belén)",
            phone: "+593 99 852 4034",
            role: "Administrador de Conjunto",
            summary: "Control de accesos y apertura de puerta peatonal por app móvil. Sincronización de residentes (Casa 1: Fernando Villafuerte, Alicia Bermúdez, Luis Enrique Villafuerte)."
        },
        {
            name: "Lesly IDC MAYORISTA",
            phone: "+593 98 010 1091",
            role: "Proveedor Mayorista Hardware",
            summary: "Abastecimiento de tablets Samsung Galaxy A11, iPhone 16 Pro Max ($934.13) y monitores para proyectos de Atomic."
        },
        {
            name: "Sr. Rómulo (Softres)",
            phone: "+593 99 868 6590",
            role: "Socio / Cliente Software Soft 3",
            summary: "Gestión de soporte en bancos, facturación e inventarios. 43 días de atraso en pagos de desarrollo y servidores."
        }
    ]
};

/**
 * Obtener lista de contactos globales de WhatsApp CRM sin distinción
 */
export async function getGlobalWhatsAppContacts() {
    try {
        const contacts = await prisma.wAContact.findMany({
            take: 100,
            orderBy: { createdAt: "desc" },
            include: {
                conversations: {
                    take: 1,
                    orderBy: { updatedAt: "desc" },
                    include: {
                        messages: {
                            take: 1,
                            orderBy: { createdAt: "desc" }
                        }
                    }
                }
            }
        });

        return contacts.map(c => {
            const lastConv = c.conversations?.[0];
            const lastMsg = lastConv?.messages?.[0];
            return {
                id: c.id,
                name: c.name || "Sin nombre registrado",
                whatsappId: c.whatsappId,
                status: lastConv?.status || "NEW",
                priority: lastConv?.priority || "MEDIUM",
                lastMessage: lastMsg?.body ? (lastMsg.body.length > 70 ? lastMsg.body.slice(0, 67) + "..." : lastMsg.body) : "Sin mensajes aún",
                lastDate: lastMsg?.createdAt || c.createdAt
            };
        });
    } catch (e: any) {
        console.error("Error fetching global contacts in Alfred:", e);
        return [];
    }
}

/**
 * Obtener estado de supervisión diario consolidado
 */
export async function getDailyAlfredBriefing() {
    const now = new Date();
    const todayStr = now.toLocaleDateString("es-EC", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    // 1. Estado en Finanzas / Ventas de hoy
    const recentTrx = await prisma.transaction.findMany({
        take: 5,
        orderBy: { date: "desc" },
        select: { client: true, amount: true, status: true, trxId: true, type: true }
    }).catch(() => []);

    // 2. Estado en WhatsApp / Karen
    const unreadConvs = await prisma.wAConversation.count({
        where: { status: { in: ["NEW", "LEAD_PAUTA", "OPEN"] } }
    }).catch(() => 0);

    const totalContactsCount = await prisma.wAContact.count().catch(() => 0);

    return {
        date: todayStr,
        soft3: {
            client: ALFRED_SUPERVISOR_CONTEXT.soft3Status.client,
            debtor: ALFRED_SUPERVISOR_CONTEXT.soft3Status.debtor,
            daysOverdue: ALFRED_SUPERVISOR_CONTEXT.soft3Status.daysOverdue,
            promisedDate: ALFRED_SUPERVISOR_CONTEXT.soft3Status.paymentPromisedDate,
            actionItem: ALFRED_SUPERVISOR_CONTEXT.soft3Status.actionItem
        },
        finances: {
            recentTransactions: recentTrx,
            highlightDeal: "DOMUM CONSTRUCCIONES ($4,229.00) — Sistema Asistencia Vehicular"
        },
        karen: {
            mode: karenState.mode,
            activeChatsCount: unreadConvs,
            totalContacts: totalContactsCount,
            burstCounters: karenState.burstCounters
        }
    };
}

/**
 * Procesador de mensajes exclusivo para ALFRED
 */
export async function processAlfredSupervisorMessage(message: string): Promise<string> {
    const lower = (message || "").toLowerCase().trim();

    // 1. Skill: Contactos Globales / Mensajes Globales
    if (
        lower.includes("contacto") || 
        lower.includes("contactos globales") || 
        lower.includes("mensajes globales") || 
        lower.includes("lista de contactos") ||
        lower.includes("contactos de whatsapp") ||
        lower.includes("contactos crm") ||
        lower.includes("todos los contactos")
    ) {
        const contacts = await getGlobalWhatsAppContacts();
        if (contacts.length === 0) {
            return `👑 **ALFRED — Contactos Globales WhatsApp CRM**\n\nNo se encontraron contactos registrados en la base de datos de WhatsApp en este momento.`;
        }

        let reply = `👑 **ALFRED — Lista Maestra de Contactos Globales (${contacts.length} registros)**\n\n`;
        reply += `*Aquí tienes el listado completo sin distinción de todos los contactos que han interactuado con nuestro WhatsApp CRM:*\n\n`;

        contacts.slice(0, 25).forEach((c, idx) => {
            const cleanPhone = c.whatsappId.replace(/\D/g, "");
            reply += `${idx + 1}. **${c.name}**\n`;
            reply += `   📲 WhatsApp: [${c.whatsappId}](https://wa.me/${cleanPhone}) | Estado: \`${c.status}\`\n`;
            reply += `   💬 Último mensaje: _"${c.lastMessage}"_\n\n`;
        });

        if (contacts.length > 25) {
            reply += `ℹ️ _Mostrando los primeros 25 de ${contacts.length} contactos totales. Puedes ver la lista completa en el panel del WhatsApp CRM._\n`;
        }

        return reply;
    }

    // 2. Skill: Soft 3 / Sr. Rómulo y Cobranza
    if (
        lower.includes("soft 3") || 
        lower.includes("soft3") || 
        lower.includes("softres") || 
        lower.includes("rómulo") || 
        lower.includes("romulo") ||
        lower.includes("ciclo de pago") ||
        lower.includes("atraso") ||
        lower.includes("deuda")
    ) {
        const s3 = ALFRED_SUPERVISOR_CONTEXT.soft3Status;
        return `👑 **ALFRED — Informe Estratégico: Soft 3 & Sr. Rómulo**\n\n` +
            `📊 **Estado del Cliente:** ${s3.client}\n` +
            `👤 **Responsable:** ${s3.debtor}\n` +
            `🗓️ **Compromiso de Pago:** ${s3.promisedDate}\n` +
            `⏳ **Tiempo Atrasado:** ⚠️ **${s3.daysOverdue} días de mora (más de 6 semanas)**\n` +
            `📦 **Plan de Trabajo:** Cupo de ${s3.planModules} módulos (${s3.modulesRemaining} disponibles). Módulos trabajados: Kardex y gestión de bancos, facturación en efectivo/transferencias y entregas.\n` +
            `🎯 **Motivo del Pago Pendiente:** Fondos requeridos para adquisición de dominios y servidor para consolidar la migración y arquitectura multi-tenant.\n` +
            `💬 **Última conversación:** El Sr. Rómulo indicó: _"finalicemos ahí tenemos que cobrar para pagarle a ust"_ (17/11/2026).\n\n` +
            `⚡ **Directiva de Supervisión:**\n` +
            `>${s3.actionItem}\n\n` +
            `¿Deseas que preparemos un borrador de notificación formal de cobro o que audite el código en producción de Softres?`;
    }

    // 3. Skill: Briefing Diario (Hoy en Soft 3, Ventas y Karen)
    if (
        lower.includes("hoy") || 
        lower.includes("briefing") || 
        lower.includes("resumen del dia") || 
        lower.includes("resumen diario") || 
        lower.includes("estado hoy") ||
        lower.includes("que tenemos")
    ) {
        const b = await getDailyAlfredBriefing();
        let reply = `👑 **ALFRED — Estado Ejecutivo Diario | ${b.date}**\n\n`;
        reply += `Estimado Juan, este es el resumen consolidado de nuestras tres líneas de mando:\n\n`;

        reply += `🔹 **1. EN SOFT 3 (Sistemas & Desarrollo):**\n`;
        reply += `• Cliente: **${b.soft3.client}** (${b.soft3.debtor})\n`;
        reply += `• Mora de Pago: **${b.soft3.daysOverdue} días atrasado** (Comprometido: ${b.soft3.promisedDate}).\n`;
        reply += `• Acción: Mantener presión de cobranza ante cada ticket de soporte en bancos o facturación y captar clientes para él.\n\n`;

        reply += `🔹 **2. EN VENTAS & FINANZAS:**\n`;
        reply += `• Proyecto Bandera: **${b.finances.highlightDeal}**.\n`;
        if (b.finances.recentTransactions.length > 0) {
            reply += `• Transacciones recientes en base de datos:\n`;
            b.finances.recentTransactions.forEach(t => {
                reply += `   - \`${t.trxId}\`: ${t.client} ($${t.amount.toLocaleString()}) — [${t.status}]\n`;
            });
        }
        reply += `\n`;

        reply += `🔹 **3. CON KAREN (WhatsApp IA):**\n`;
        reply += `• Modo actual: **${b.karen.mode === "AUTOMATIC" ? "🟢 100% Automático" : "🟡 Supervisado"}**\n`;
        reply += `• Total Contactos CRM: **${b.karen.totalContacts} clientes registrados**\n`;
        reply += `• Conversaciones activas: **${b.karen.activeChatsCount} chats en bandeja**\n`;
        reply += `• Atenciones: Ventas (${b.karen.burstCounters.sales}), Empleo (${b.karen.burstCounters.recruitment}), Registro (${b.karen.burstCounters.autoRegister})\n\n`;

        reply += `💡 _Escribe "contactos globales", "soft 3", o "karen" para profundizar en cualquiera de estos frentes._`;
        return reply;
    }

    // 4. Skill: Contexto de lo que hace Karen / Auditoría
    if (lower.includes("karen") || lower.includes("auditoria") || lower.includes("bot de whatsapp")) {
        return `👑 **ALFRED — Monitor Maestro de Karen IA**\n\n` +
            `Karen está operando en WhatsApp en modo **${karenState.mode === "AUTOMATIC" ? "🟢 AUTOMÁTICO ACTIVO" : "🟡 REVISIÓN"}**.\n\n` +
            `📊 **Rendimiento Reciente de Karen:**\n` +
            `• Consultas de Ventas procesadas: ${karenState.burstCounters.sales}\n` +
            `• Postulaciones laborales orientadas: ${karenState.burstCounters.recruitment}\n` +
            `• Registros automáticos de asesores: ${karenState.burstCounters.autoRegister}\n` +
            `• Chats sin catalogar: ${karenState.burstCounters.uncataloged}\n\n` +
            `🛡️ **Mejoras Aplicadas a Karen:**\n` +
            `1. Auto-rescate activo: Si la API de NVIDIA tarda más de 8 segundos, responde con el motor nativo de ATOMIC sin dejar al cliente esperando.\n` +
            `2. Envío de fotos oficiales garantizado para cercos, cámaras IMOU/EZVIZ, videoporteros y barras de sonido.\n` +
            `3. Tienes el botón de acceso directo rosa en la barra lateral para revisar su historial o pausarla.\n\n` +
            `¿Deseas que le envíe una directiva o consulte los últimos leads de Karen?`;
    }

    // 5. Skill: Contexto General de Juan (Domum, Arellano, Cabrera, IDC)
    if (lower.includes("domum") || lower.includes("domun") || lower.includes("arellano") || lower.includes("cabrera") || lower.includes("maria belen") || lower.includes("idc") || lower.includes("lesly")) {
        const deal = ALFRED_SUPERVISOR_CONTEXT.keyDeals[0];
        const contacts = ALFRED_SUPERVISOR_CONTEXT.recentContacts;

        let reply = `👑 **ALFRED — Contexto de Negociaciones y Clientes Clave**\n\n`;
        reply += `🏗️ **Proyecto DOMUM CONSTRUCCIONES:**\n`;
        reply += `• PVP: **$${deal.amount.toLocaleString()} USD** | Fecha: ${deal.date}\n`;
        reply += `• Objeto: ${deal.type}\n`;
        reply += `• Equipos: ${deal.details}\n`;
        reply += `• Estado: ${deal.status}\n\n`;

        reply += `👥 **Contactos y Casos en Curso:**\n`;
        contacts.forEach(c => {
            reply += `• **${c.name}** (${c.phone}): ${c.summary}\n`;
        });

        return reply;
    }

    // Default: Asistente Ejecutivo Esmeralda de Juan
    return `👑 **ALFRED — A tus órdenes, Juan.**\n\n` +
        `Como tu asistente ejecutivo esmeralda, tengo acceso y contexto total de tus operaciones diarias:\n\n` +
        `• 📋 **"hoy" / "briefing"**: Resumen diario de Soft 3, Ventas y Karen.\n` +
        `• 📱 **"contactos globales"**: Listado completo sin distinción de todos los contactos del CRM.\n` +
        `• 🏢 **"soft 3"**: Ciclo de pago, 43 días de atraso del Sr. Rómulo y plan de 12 módulos.\n` +
        `• 🤖 **"karen"**: Monitoreo y control de Karen en WhatsApp.\n` +
        `• 🏗️ **"domum"**: Detalles de la cotización vehicular de $4,229.\n\n` +
        `¿En qué frente estratégico deseas que nos enfoquemos en este momento?`;
}
