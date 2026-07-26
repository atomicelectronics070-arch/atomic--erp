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
- Métricas diarias (tasa de conversión, ticket promedio)`
        case "COORDINATOR":
            return `ERES UN COACH DE COORDINACIÓN Y LIDERAZGO. Guía con:
- Técnicas de gestión de equipos y motivación
- Planificación diaria, semanal y OKRs
- Cómo dar feedback constructivo a los vendedores
- Gestión del tiempo y delegación efectiva
- Asignación de tareas y metas de leads`
        case "ADMIN":
            return `ERES EL ASISTENTE EJECUTIVO DEL ADMINISTRADOR MAESTRO DE ATOMIC INDUSTRIES. Tienes visión 360°:
- Estrategia de negocio, expansión y posicionamiento
- Análisis de rendimiento de todos los equipos y bots
- Decisiones sobre precios, márgenes y proveedores
- Asignación de tareas a perfiles que no tengan un colaborador físico aun (la IA actúa como trabajador interino)`
        case "MANAGEMENT":
            return `ERES UN COACH DE GESTIÓN ESTRATÉGICA. Guías con:
- Gestión de proyectos y tecnología
- Coordinación entre áreas de la empresa
- Análisis de datos y decisiones basadas en métricas`
        default:
            return `ERES UN ASISTENTE PERSONAL PROFESIONAL DE ATOMIC INDUSTRIES.`
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { message, isNamingBot, currentPath } = body

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
                    select: { quotesCount: true, salesCount: true, contactsCount: true, totalProfit: true }
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

        // 4. Contextual explanation based on current path
        let routeGuide = ""
        if (currentPath === "/dashboard") {
            routeGuide = `[UBICACIÓN ACTUAL: DASHBOARD DE OFICINA VIRTUAL]
Explícale que aquí tiene la gestión integral de la red social interna, noticias corporativas, área de trabajo con avatares e instrucciones de áreas, y el ranking de ventas.`
        } else if (currentPath === "/dashboard/analytics") {
            routeGuide = `[UBICACIÓN ACTUAL: MÓDULO DE ANÁLISIS STRATEGIC BI 2027]
Explícale que este módulo está diseñado para dar un análisis profundo y resumen del sistema en tiempo real: métricas de tráfico, ingresos por categorías de productos y tasa de conversión.`
        } else if (currentPath === "/dashboard/coordinacion") {
            routeGuide = `[UBICACIÓN ACTUAL: MÓDULO DE COORDINACIÓN]
Explícale que este módulo está diseñado para la planificación diaria, asignación de objetivos de leads, reporte de ventas y supervisión de equipos.`
        } else if (currentPath === "/dashboard/quotes") {
            routeGuide = `[UBICACIÓN ACTUAL: MÓDULO DE COTIZACIONES]
Explícale que aquí se emiten cotizaciones formales en PDF. Menciona que puedes darle un formato para cotización rápida listo para llenar o procesar datos en texto plano.`
        } else if (currentPath === "/dashboard/shop") {
            routeGuide = `[UBICACIÓN ACTUAL: MÓDULO DE INVENTARIO Y PRECIOS]
Explícale que aquí consulta el catálogo completo de productos con stock en tiempo real, precios y fichas técnicas descargables.`
        } else if (currentPath === "/dashboard/map-prospecting") {
            routeGuide = `[UBICACIÓN ACTUAL: RADAR DE PROSPECCIÓN EN MAPA]
Explícale que aquí puede buscar negocios o conjuntos cercanos en el mapa. Si te escribe una búsqueda aquí mismo (ej: "conjuntos residenciales en Quito"), confírmale que estás ejecutando el radar y analiza los resultados. Si un lead no tiene teléfono, menciona que se puede añadir al CRM para visitas técnicas.`
        }

        // 5. Build context
        const quoteContext = user.conversations.length > 0
            ? user.conversations.map(q => `- Cotización ${q.quoteNumber}: $${q.total} (${q.status})`).join("\n")
            : "Sin cotizaciones recientes"

        const rankingContext = ranking
            ? `Posición en ranking: Puntos=${ranking.points || 0}, Cotizaciones=${ranking.quotesCount || 0}, Ventas=${ranking.salesCount || 0}, Leads=${ranking.contactsCount || 0}, Ganancias=$${ranking.totalProfit?.toLocaleString() || 0}`
            : "Sin datos de ranking aún"

        // 6. Build system prompt
        const systemPrompt = `
Eres ${botName}, el asistente personal exclusivo de ${fullName} en ATOMIC Industries.
Tu relación con ${fullName.split(" ")[0]} es única, personalizada y con memoria permanente.

PERFIL COMPLETO:
- Nombre: ${fullName}
- Rol: ${user.role} | Área: ${user.area || "General"} | Días en ATOMIC: ${daysInAtomic}
- Desempeño: ${rankingContext}
- Cotizaciones: ${quoteContext}

${routeGuide}

COMPORTAMIENTO:
- Habla en primera persona como ${botName}
- Tono motivador, ultra profesional y carismático
- Si te piden un formato de cotización rápida, genera este bloque Markdown listo con botón de copia
- Si estás en Mapa y te piden buscar algo, simula la búsqueda indicando cuántos prospectos encontraste y cuáles no tienen teléfono para asignarlos a Visitas Técnicas.
- Al final de cada respuesta, incluye 3 sugerencias en este formato exacto:
  [[SUGGESTIONS: "¿Pregunta 1?", "¿Pregunta 2?", "¿Pregunta 3?"]]

ESPECIALIZACIÓN POR ROL:
${getRoleAdvice(user.role)}
`.trim()

        const historyMessages = (memory.messages || []).slice(-15).map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }))

        historyMessages.push({
            role: "user",
            parts: [{ text: message }]
        })

        const GOOGLE_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
        if (!GOOGLE_API_KEY) {
            return NextResponse.json({ text: "🔑 Clave de API de IA no configurada.", suggestions: [] })
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

        const suggestMatch = replyText.match(/\[\[SUGGESTIONS:\s*(.*?)\]\]/s)
        let suggestions: string[] = []
        if (suggestMatch) {
            try {
                suggestions = suggestMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, "")) || []
            } catch { suggestions = [] }
            replyText = replyText.replace(/\[\[SUGGESTIONS:.*?\]\]/s, "").trim()
        }

        await prisma.personalBotMessage.createMany({
            data: [
                { memoryId: memory.id, role: "user", content: message },
                { memoryId: memory.id, role: "assistant", content: replyText }
            ]
        })

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
