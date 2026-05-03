import { NextResponse } from "next/server"
import { OpenAI } from "openai"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { instanceId, chatId, context, variant, type = 'suggestion' } = await req.json()

        // Instanciamos OpenAI dentro del handler para evitar errores de credenciales en el build
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })

        // 1. Obtener el Plan Maestro y la Memoria Neuronal de la base de datos
        const [planSetting, memorySetting] = await Promise.all([
            prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_BOT_PLAN' } }),
            prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_NEURAL_MEMORY' } })
        ])

        const activePlan = planSetting?.value || "Foco en ventas y soporte técnico profesional."
        const neuralMemory = memorySetting?.value || "Inicio de aprendizaje. No hay datos históricos de larga duración aún."

        // 2. Construir el Prompt Evolutivo
        let systemPrompt = ""
        
        if (type === 'analysis') {
            systemPrompt = `
                Eres el ANALISTA VETERANO de ATOMIC. 
                SABIDURÍA ACUMULADA DE LA EMPRESA:
                ${neuralMemory}

                TAREA: Realiza un análisis estratégico de este chat. 
                - Resume los puntos clave.
                - Identifica si este cliente encaja con patrones previos guardados en memoria.
                - Sugiere una acción táctica basada en el PLAN MAESTRO: ${activePlan}.
                
                HISTORIAL DEL CHAT:
                ${context}
            `
        } else {
            let toneInstruction = "Mantén un tono equilibrado y profesional."
            if (variant === 'friendly') toneInstruction = "Sé extremadamente amable y empático."
            if (variant === 'direct') toneInstruction = "Sé muy directo y conciso."

            systemPrompt = `
                Eres un ASISTENTE SENIOR de ATOMIC. 
                PLAN MAESTRO: ${activePlan}
                SABIDURÍA DE LA EMPRESA: ${neuralMemory}
                
                INSTRUCCIÓN: Usa el contexto de la empresa y del chat para dar la respuesta más inteligente posible. 
                TONO: ${toneInstruction}
                
                CONTEXTO DEL MENSAJE:
                ${context}

                TAREA: Responde de forma que demuestres conocimiento de la empresa. Solo devuelve el texto.
            `
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: type === 'analysis' ? "Analiza y extrae nuevos aprendizajes para tu memoria." : "Genera la respuesta senior." }
            ],
            temperature: 0.6,
        })

        const result = completion.choices[0].message.content

        return NextResponse.json(type === 'analysis' ? { report: result } : { suggestion: result })
    } catch (error) {
        console.error("[WHATSAPP_AI_ERROR]", error)
        return NextResponse.json({ error: "AI Engine Failure" }, { status: 500 })
    }
}
