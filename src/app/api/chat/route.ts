import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { messages, botType = "CAPACITADOR" } = body 

        const session = await getServerSession(authOptions)
        const isPublic = botType === "PUBLIC_BOT"

        if (!session?.user?.id && !isPublic) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 1. Fetch User Data if session exists
        let dbUser = null
        if (session?.user?.id) {
            dbUser = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { 
                    createdAt: true, 
                    name: true,
                    waOwnedChats: {
                        take: 3,
                        orderBy: { lastMessageAt: 'desc' },
                        include: {
                            contact: { select: { name: true } },
                            messages: { take: 5, orderBy: { createdAt: 'desc' } }
                        }
                    },
                    conversations: {
                        take: 3,
                        orderBy: { createdAt: 'desc' },
                        select: { quoteNumber: true, total: true, status: true }
                    },
                }
            })
        }

        const name = dbUser?.name || (isPublic ? "CLIENTE WEB" : "Asesor")
        const daysRegistered = dbUser ? Math.floor((new Date().getTime() - new Date(dbUser.createdAt).getTime()) / (1000 * 3600 * 24)) : 0

        // 2. Format Context
        const waContext = dbUser?.waOwnedChats?.map(chat => 
            `- Chat con ${chat.contact?.name}: ${chat.messages.map(m => m.body).reverse().join(' | ')}`
        ).join('\n') || ""

        const quoteContext = dbUser?.conversations?.map(q => 
            `- Cotización ${q.quoteNumber}: $${q.total} (${q.status})`
        ).join('\n') || ""

        // 3. Comprobar configuración de prompt para este usuario
        let userConfig = null
        if (session?.user?.id) {
            userConfig = await prisma.userPromptConfig.findUnique({
                where: {
                    userId_type: { userId: session.user.id, type: botType }
                }
            })
        }

        const basePrompt = userConfig?.prompt || "Eres un capacitador de \u00e9lite de Atomic Solutions. Tu misi\u00f3n es guiar al vendedor, ayudarle con documentos y ser su mentor constante."

        // 4. Inject Dynamic Context (MEMORIA ENLAZADA)
        const systemPrompt = `
[SISTEMA DE ASISTENCIA ATOMIC - MÓDULO DE COTIZACIONES]
Eres un asistente de élite. Tienes la capacidad de GENERAR COTIZACIONES FORMALES en PDF.

REGLAS PARA COTIZACIONES:
1. Si el usuario solicita una cotización, solicita: Nombre Cliente, Correo, Teléfono, Asunto y Lista de Productos (Código, Desc, Precio, Cant).
2. Al confirmar, genera este bloque al final:
   [[QUOTATION_JSON:{"topic":"...","clientName":"...","clientEmail":"...","clientPhone":"...","items":[{"code":"...","description":"...","price":0,"quantity":0}]}]]

3. Lenguaje PROFESIONAL, impecable.
4. Dashboard Advisor: "${name}". Public Web Advisor: "ADMINISTRADOR".

CONTEXTO ACTUAL:
Asesor: ${name}
Días en la Compañía: ${daysRegistered}

RECIENTE EN WHATSAPP CRM:
${waContext || 'Sin chats recientes vinculados.'}

COTIZACIONES RECIENTES:
${quoteContext || 'Sin cotizaciones generadas recientemente.'}

--- INSTRUCCIONES DE COMPORTAMIENTO ---
${basePrompt}
`.trim()

        // To use Gemini REST API directly without installing extra SDKs
        const GOOGLE_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY

        if (!GOOGLE_API_KEY) {
            return NextResponse.json({
                text: "El sistema de IA está configurado, pero falta la clave de API (GOOGLE_GEMINI_API_KEY) en el entorno. Por favor, solicite a soporte que la agregue para habilitar las respuestas reales."
            })
        }

        interface ChatMessage { role: 'user' | 'model' | 'assistant'; content: string; }

        const payload = {
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: (messages as ChatMessage[]).map((msg) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            }
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("Gemini API Error:", data)
            return NextResponse.json({ error: "Error from AI Service" }, { status: 500 })
        }

        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."

        return NextResponse.json({ text: replyText })

    } catch (error) {
        console.error("Chat API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


