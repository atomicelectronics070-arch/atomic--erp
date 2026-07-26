import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Role-specific system prompts
function getRoleAdvice(role: string): string {
    switch (role) {
        case "SALESPERSON":
            return `ERES UN COACH DE VENTAS DE ÉLITE. Guía al asesor con:
- Técnicas de cierre: AIDA, Spin Selling, Sandler
- Manejo de objeciones de precio con contraargumentos concretos
- Scripts de WhatsApp y llamada probados
- Estrategias de seguimiento sin ser invasivo
- Cómo leer el lenguaje corporal y timing del cliente
- Métricas que deben monitorear diariamente (tasa de conversión, ticket promedio)`
        case "COORDINATOR":
            return `ERES UN COACH DE COORDINACIÓN Y LIDERAZGO. Guía con:
- Técnicas de gestión de equipos y motivación
- Planificación diaria, semanal y OKRs
- Cómo dar feedback constructivo a los vendedores
- Gestión del tiempo y delegación efectiva
- KPIs de coordinación (leads asignados, tasa de respuesta, conversiones del equipo)
- Resolución de conflictos entre vendedores`
        case "ADMIN":
            return `ERES EL ASISTENTE EJECUTIVO DEL ADMINISTRADOR DE ATOMIC INDUSTRIES. Tienes visión 360°:
- Estrategia de negocio, expansión y posicionamiento
- Análisis de rendimiento de todos los equipos
- Decisiones sobre precios, márgenes y proveedores
- Gestión de la plataforma tecnológica y sus módulos
- Resúmenes ejecutivos de actividad del sistema`
        case "MANAGEMENT":
            return `ERES UN COACH DE GESTIÓN ESTRATÉGICA. Guías con:
- Gestión de proyectos y tecnología
- Coordinación entre áreas de la empresa
- Análisis de datos y decisiones basadas en métricas
- Implementación de nuevas herramientas y procesos`
        default:
            return `ERES UN ASISTENTE PERSONAL PROFESIONAL DE ATOMIC INDUSTRIES.
- Guía al usuario en sus tareas diarias
- Ofrece técnicas y consejos según el contexto
- Mantén un tono motivador, profesional y cercano`
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

        // 1. Load user full profile
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
                    select: { points: true, quotesCount: true, salesCount: true, contactsCount: true, totalProfit: true }
                },
                socialPosts: {
                    orderBy: { createdAt: "desc" },
                    take: 3,
                    select: { content: true, createdAt: true }
                },
                waOwnedChats: {
                    take: 3,
                    orderBy: { lastMessageAt: "desc" },
                    include: {
                        contact: { select: { name: true } },
                        messages: { take: 3, orderBy: { createdAt: "desc" }, select: { body: true } }
                    }
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
        const ranking = user.salesRanking

        // 2. Get or create bot memory
        let memory = user.personalBot
        if (!memory) {
            memory = await prisma.personalBotMemory.create({
                data: { userId: session.user.id },
                include: { messages: true }
            })
        }

        // 3. If naming bot — save the name
        if (isNamingBot && message.trim()) {
            await prisma.personalBotMemory.update({
                where: { userId: session.user.id },
                data: { botName: message.trim(), onboardingDone: false }
            })
        }

        const botName = isNamingBot ? message.trim() : (memory.botName || "ATOM")
        const onboardingDone = memory.onboardingDone

        // 4. Build context
        const quoteContext = user.conversations.length > 0
            ? user.conversations.map(q => `- Cotización ${q.quoteNumber}: $${q.total} (${q.status})`).join("\n")
            : "Sin cotizaciones recientes"

        const rankingContext = ranking
            ? `Posición en ranking: Puntos=${ranking.points || 0}, Cotizaciones=${ranking.quotesCount || 0}, Ventas=${ranking.salesCount || 0}, Leads=${ranking.contactsCount || 0}, Ganancias=$${ranking.totalProfit?.toLocaleString() || 0}`
            : "Sin datos de ranking aún"

        const socialContext = user.socialPosts.length > 0
            ? user.socialPosts.map(p => `- "${p.content.substring(0, 80)}..."`).join("\n")
            : "Sin publicaciones recientes"

        const waContext = user.waOwnedChats.length > 0
            ? user.waOwnedChats.map(c => `- Chat con ${c.contact?.name}: ${c.messages.map(m => m.body).join(" | ")}`).join("\n")
            : "Sin chats WhatsApp recientes"

        // 5. Build system prompt with full profile context
        const systemPrompt = `
Eres ${botName}, el asistente personal exclusivo de ${fullName} en ATOMIC Industries.
Tu relación con ${fullName.split(" ")[0]} es única, personalizada y con memoria permanente.

═══════════════════════════════════════
PERFIL COMPLETO DE ${fullName.toUpperCase()}
═══════════════════════════════════════
Nombre: ${fullName}
Rol: ${user.role}
Área: ${user.area || "General"}
Días en ATOMIC: ${daysInAtomic} días
Teléfono: ${user.phoneNumber || "No registrado"}

DESEMPEÑO Y RANKING:
${rankingContext}

COTIZACIONES RECIENTES:
${quoteContext}

ACTIVIDAD EN RED SOCIAL INTERNA:
${socialContext}

CRM WHATSAPP RECIENTE:
${waContext}

═══════════════════════════════════════
PERSONALIDAD Y COMPORTAMIENTO
═══════════════════════════════════════
- Habla SIEMPRE en primera persona como ${botName}
- Eres cálido, motivador y extremadamente profesional
- Recuerdas TODO lo que te ha contado ${fullName.split(" ")[0]}
- Usas datos reales del perfil para contextualizar tus respuestas
- Al FINAL de cada respuesta, sugiere 3 preguntas relevantes en este formato exacto:
  [[SUGGESTIONS: "¿Pregunta 1?", "¿Pregunta 2?", "¿Pregunta 3?"]]

${!onboardingDone ? `
PRIMERA VEZ - FLUJO DE BIENVENIDA:
El usuario acaba de darte el nombre "${botName}". Responde:
1. Agradece el nombre con entusiasmo
2. Preséntate como ${botName}
3. Menciona su rol (${user.role}) y que llevan ${daysInAtomic} días juntos en ATOMIC
4. Dile que lo guiarás en su camino laboral
5. Pregúntale cómo va hasta ahora
` : ""}

ESPECIALIZACIÓN POR ROL:
${getRoleAdvice(user.role)}
`.trim()

        // 6. Build message history for context
        const historyMessages = (memory.messages || []).slice(-15).map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }))

        // Add current message
        historyMessages.push({
            role: "user",
            parts: [{ text: message }]
        })

        // 7. Call Gemini
        const GOOGLE_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
        if (!GOOGLE_API_KEY) {
            return NextResponse.json({ text: "🔑 Clave de API de IA no configurada. Contacta al administrador.", suggestions: [] })
        }

        const payload = {
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: historyMessages,
            generationConfig: { temperature: 0.8, maxOutputTokens: 1200 }
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
        )

        const data = await response.json()
        let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta."

        // 8. Extract suggestions
        const suggestMatch = replyText.match(/\[\[SUGGESTIONS:\s*(.*?)\]\]/s)
        let suggestions: string[] = []
        if (suggestMatch) {
            try {
                suggestions = suggestMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, "")) || []
            } catch { suggestions = [] }
            replyText = replyText.replace(/\[\[SUGGESTIONS:.*?\]\]/s, "").trim()
        }

        // 9. Save messages to DB
        await prisma.personalBotMessage.createMany({
            data: [
                { memoryId: memory.id, role: "user", content: message },
                { memoryId: memory.id, role: "assistant", content: replyText }
            ]
        })

        // 10. Mark onboarding done if this was the naming step
        if (isNamingBot && !onboardingDone) {
            await prisma.personalBotMemory.update({
                where: { userId: session.user.id },
                data: { onboardingDone: true }
            })
        }

        return NextResponse.json({ text: replyText, suggestions, botName })

    } catch (error) {
        console.error("Personal Bot API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
