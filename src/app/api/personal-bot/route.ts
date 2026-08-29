export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Fallback intelligent responses for all modules if AI API is offline
const MODULE_KNOWLEDGE_BASE: Record<string, { title: string; text: string; suggestions: string[]; link?: string }> = {
    "cotizaciones": {
        title: "Módulo de Cotizaciones PROP",
        text: "📄 **MÓDULO DE COTIZACIONES OFICIALES (PROP)**\n\nEn este módulo generas y emites propuestas comerciales formales en formato PDF A4 y Ticket:\n1. **Datos del Cliente:** Ingresa Razón Social, Teléfono/WhatsApp y Ciudad.\n2. **Ítems y Equipos:** Selecciona productos del catálogo o escribe personalizados con descuento y margen.\n3. **Generación Instantánea:** Haz clic en **Generar Propuesta PDF** para descargar el documento oficial con membrete corporativo, número secuencial PROP-XXXX y liquidación detallada.\n4. **Registro Central:** Toda propuesta se sincroniza automáticamente con la base de datos del Admin.",
        suggestions: ["¿Cómo aplicar descuentos en cotizaciones?", "¿Cómo compartir PDF por WhatsApp?", "Generar cotización rápida"],
        link: "/dashboard/quotes"
    },
    "inventario": {
        title: "Módulo de Inventario y Catálogo",
        text: "📦 **MÓDULO DE INVENTARIO Y CATÁLOGO GENERAL**\n\nAcceso restringido para **Coordinación y Administradores**:\n• **Stock en Tiempo Real:** Visualiza más de 9,700 artículos con costo, precio de venta sugerido y margen ROI.\n• **Gestión de Proveedores:** Filtra por marcas como Dahua, Hikvision, EZVIZ, Steren, IDC, etc.\n• **Acciones Rápidas:** Edición masiva de precios, actualización de fotos y exportación de listas de precios oficiales en PDF.",
        suggestions: ["¿Cómo exportar lista de precios PDF?", "¿Quiénes tienen acceso a inventario?", "Consultar productos en oferta"],
        link: "/dashboard/shop"
    },
    "coordinacion": {
        title: "Módulo de Coordinación Estratégica",
        text: "👥 **MÓDULO DE COORDINACIÓN & LEAD MANAGEMENT**\n\nHerramienta para coordinadores y dirección:\n• **Bitácora Diaria:** Registro de novedades y checklist de seguimiento B2B.\n• **Asignación de Metas:** Distribución de contactos y cuotas de prospección a cada asesor comercial.\n• **Supervisión de Propuestas:** Aprobación o rechazo de cotizaciones emitidas por el equipo.",
        suggestions: ["¿Cómo asignar leads a asesores?", "¿Cómo registrar novedades en la bitácora?", "Revisar metas del mes"],
        link: "/dashboard/coordinacion"
    },
    "prospeccion": {
        title: "Radar de Prospección en Mapa",
        text: "🗺️ **RADAR DE PROSPECCIÓN GEOLOCALIZADA**\n\nMódulo para encontrar nuevos clientes y empresas:\n• **Búsqueda por Nicho:** Busca conjuntos residenciales, gimnasios, farmacias o empresas de seguridad en cualquier zona.\n• **Filtro Telefónico:** Los leads con WhatsApp se envían al CRM para contacto digital; los que no tienen número se marcan para **Visitas Técnicas Presenciales**.",
        suggestions: ["Buscar conjuntos en Quito", "Buscar empresas en Guayaquil", "Exportar prospectos a CRM"],
        link: "/dashboard/map-prospecting"
    },
    "whatsapp": {
        title: "WhatsApp CRM & Gestión de Leads",
        text: "📱 **WHATSAPP CRM INTEGRAL**\n\nCentral de mensajería omnicanal de ATOMIC:\n• **Bandeja Multicanal:** Visualización de chats entrantes desde pautas publicitarias de Meta y WhatsApp directo.\n• **Detección de Anuncio:** Identifica el anuncio publicitario y la campaña exacta de donde proviene cada cliente.\n• **Envío de Propuestas:** Comparte propuestas PDF y catálogos directamente al chat del prospecto.",
        suggestions: ["¿Cómo ver de qué pauta entra un cliente?", "¿Cómo etiquetar un lead caliente?", "Ver historial de mensajes"],
        link: "/dashboard/whatsapp/crm"
    },
    "finanzas": {
        title: "Módulo de Gestión Financiera",
        text: "💰 **GESTIÓN ECONÓMICA Y FINANZAS**\n\nMonitorea la salud financiera de ATOMIC:\n• **Flujo de Caja:** Ingresos por cotizaciones cerradas vs costos de proveedores.\n• **Márgenes de Utilidad:** Cálculo neto por categoría y comisiones comerciales.\n• **Control de Cobranzas:** Seguimiento de transferencias, tarjetas de crédito y efectivo.",
        suggestions: ["Ver resumen de ingresos", "Consultar comisiones de ventas", "¿Cómo registrar un pago?"],
        link: "/dashboard/finance"
    },
    "temas": {
        title: "Personalización de Temas del Sistema",
        text: "🎨 **SISTEMA DE TEMAS GLOBALES ATOMIC**\n\nPersonaliza la apariencia del sistema desde tu **Perfil de Usuario**:\n1. Haz clic en tu avatar o ve a /dashboard/profile.\n2. Selecciona la pestaña **Temas del Ecosistema**.\n3. Elige entre **Cyber Neon**, **Emerald Matrix**, **Midnight Amethyst**, **Solar Amber** o **OLED Pure Dark**.\n4. El tema se guarda y se aplica de inmediato en todo tu espacio de trabajo.",
        suggestions: ["Ir a personalizar temas", "¿Cuáles son los 5 temas disponibles?", "Restablecer tema Cyber Neon"],
        link: "/dashboard/profile"
    }
}

// Role-specific system prompts
function getRoleAdvice(role: string): string {
    switch (role) {
        case "SALESPERSON":
            return "ERES UN COACH DE VENTAS DE ÉLITE. Guía al asesor con técnicas de cierre (AIDA, Sandler), manejo de objeciones de precio, scripts de WhatsApp y cotizaciones formales PROP."
        case "COORDINATOR":
            return "ERES UN COACH DE COORDINACIÓN Y LIDERAZGO. Guía con técnicas de gestión de equipos, asignación de leads, bitácoras y supervisión de propuestas."
        case "ADMIN":
            return "ERES EL ASISTENTE EJECUTIVO DEL ADMINISTRADOR MAESTRO DE ATOMIC INDUSTRIES. Tienes visión 360° de la empresa, finanzas, inventario, cotizaciones, personal y automatizaciones."
        case "MANAGEMENT":
            return "ERES UN COACH DE GESTIÓN ESTRATÉGICA Y SISTEMAS. Guía en optimización de procesos, rentabilidad y proyectos tecnológicos."
        default:
            return "ERES UN ASISTENTE INTEGRAL Y GUÍA OPERATIVO DE ATOMIC INDUSTRIES."
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { message, isNamingBot } = body
        const lowerMsg = (message || "").toLowerCase()

        // 1. Load user profile
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                lastName: true,
                role: true,
                area: true,
                createdAt: true,
                phoneNumber: true,
                conversations: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                    select: { quoteNumber: true, total: true, status: true, createdAt: true }
                },
                salesRanking: {
                    select: { currentWeekAmount: true, historicalAmount: true, lastReset: true }
                },
                personalBot: {
                    include: {
                        messages: { orderBy: { createdAt: "asc" }, take: 20 }
                    }
                }
            }
        })

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const fullName = [user.name, user.lastName].filter(Boolean).join(" ") || "Asesor"
        const daysInAtomic = Math.floor((Date.now() - user.createdAt.getTime()) / 86400000)

        // 2. Get or create bot memory
        let memory = user.personalBot
        if (!memory) {
            memory = await prisma.personalBotMemory.create({
                data: { userId: session.user.id },
                include: { messages: true }
            })
        }

        // 3. Name updates
        let isForcedNaming = false
        let forcedName = ""
        const nameMatch = message.match(/(?:quiero que te llames|llámate|cambia tu nombre a|te llamarás|te llamaras|bautízate como|bautizate como)\s+([A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s]{2,20})/i)
        if (nameMatch) {
            forcedName = nameMatch[1].trim()
            isForcedNaming = true
            await prisma.personalBotMemory.update({
                where: { userId: session.user.id },
                data: { botName: forcedName, onboardingDone: true }
            })
            return NextResponse.json({
                text: `¡Excelente! A partir de ahora me llamaré **${forcedName}** y estaré listo para asistirte en todo momento. ¿Qué módulo deseas explorar hoy?`,
                suggestions: ["¿Cómo emitir una cotización PROP?", "¿Cómo buscar clientes en el mapa?", "¿Cómo personalizar los temas visuales?"],
                botName: forcedName
            })
        }

        if (isNamingBot && message.trim() && !isForcedNaming) {
            await prisma.personalBotMemory.update({
                where: { userId: session.user.id },
                data: { botName: message.trim(), onboardingDone: true }
            })
        }

        const botName = memory.botName || "Alfred"

        // 4. Quick match with Knowledge Base for instant high-quality answers
        for (const [key, info] of Object.entries(MODULE_KNOWLEDGE_BASE)) {
            if (lowerMsg.includes(key) || (key === "cotizaciones" && (lowerMsg.includes("cotiz") || lowerMsg.includes("propuesta") || lowerMsg.includes("pdf"))) ||
                (key === "inventario" && (lowerMsg.includes("stock") || lowerMsg.includes("precio") || lowerMsg.includes("producto"))) ||
                (key === "prospeccion" && (lowerMsg.includes("mapa") || lowerMsg.includes("radar") || lowerMsg.includes("cliente"))) ||
                (key === "whatsapp" && (lowerMsg.includes("crm") || lowerMsg.includes("pauta") || lowerMsg.includes("lead"))) ||
                (key === "temas" && (lowerMsg.includes("tema") || lowerMsg.includes("color") || lowerMsg.includes("apariencia")))) {
                
                await prisma.personalBotMessage.createMany({
                    data: [
                        { memoryId: memory.id, role: "user", content: message },
                        { memoryId: memory.id, role: "assistant", content: info.text }
                    ]
                })

                return NextResponse.json({
                    text: info.text,
                    suggestions: info.suggestions,
                    botName
                })
            }
        }

        // 5. Try Gemini AI API
        const GOOGLE_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
        if (GOOGLE_API_KEY) {
            try {
                const systemPrompt = `
Eres ${botName}, el asistente personal ejecutivo y guía integral de ${fullName} en la plataforma ATOMIC Industries.
Conoces todos los módulos: Cotizaciones (formato PROP), Inventario (restringido a Coordinación y Admin), Coordinación, Prospección en Mapa, WhatsApp CRM, Finanzas y Personalización de Temas.
${getRoleAdvice(user.role)}
Responde de forma clara, profesional, motivadora y estructurada en Markdown.
Al final de tu respuesta agrega: [[SUGGESTIONS: "¿Pregunta 1?", "¿Pregunta 2?", "¿Pregunta 3?"]]
`.trim()

                const historyMessages = (memory.messages || []).slice(-10).map(m => ({
                    role: m.role === "user" ? "user" : "model",
                    parts: [{ text: m.content }]
                }))

                historyMessages.push({
                    role: "user",
                    parts: [{ text: message }]
                })

                const payload = {
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: historyMessages,
                    generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
                }

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
                    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
                )

                if (response.ok) {
                    const data = await response.json()
                    let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text
                    if (replyText && replyText.trim()) {
                        const suggestMatch = replyText.match(/\[\[SUGGESTIONS:\s*([\s\S]*?)\]\]/)
                        let suggestions: string[] = []
                        if (suggestMatch) {
                            try {
                                suggestions = suggestMatch[1].match(/"([^"]+)"/g)?.map((s: string) => s.replace(/"/g, "")) || []
                            } catch { suggestions = [] }
                            replyText = replyText.replace(/\[\[SUGGESTIONS:[\s\S]*?\]\]/, "").trim()
                        }

                        await prisma.personalBotMessage.createMany({
                            data: [
                                { memoryId: memory.id, role: "user", content: message },
                                { memoryId: memory.id, role: "assistant", content: replyText }
                            ]
                        })

                        return NextResponse.json({ text: replyText, suggestions, botName })
                    }
                }
            } catch (err) {
                console.warn("AI generation failed, falling back to local guidance:", err)
            }
        }

        // Smart fallback response if AI API is unavailable
        const fallbackText = `👋 ¡Hola ${fullName.split(" ")[0]}! Soy tu asistente **${botName}**.\n\nPuedo guiarte en cualquiera de las siguientes áreas:\n• 📄 **Cotizaciones:** Emisión formal de propuestas PROP en PDF.\n• 📦 **Inventario:** Consulta de productos, precios y stock.\n• 👥 **Coordinación:** Asignación de metas y supervisión.\n• 🗺️ **Prospección:** Búsqueda en mapa y radar de clientes.\n• 🎨 **Temas:** Cambia los colores y estilo del ERP desde tu Perfil.\n\n¿Sobre qué módulo deseas que te explique?`
        
        await prisma.personalBotMessage.createMany({
            data: [
                { memoryId: memory.id, role: "user", content: message },
                { memoryId: memory.id, role: "assistant", content: fallbackText }
            ]
        })

        return NextResponse.json({
            text: fallbackText,
            suggestions: ["¿Cómo emitir una cotización PROP?", "¿Cómo funciona el radar de prospección?", "¿Cómo cambiar los temas del sistema?"],
            botName
        })

    } catch (error) {
        console.error("Personal Bot API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
