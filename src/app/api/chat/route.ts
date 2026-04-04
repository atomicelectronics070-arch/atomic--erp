import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { messages, botType = "CAPACITADOR" } = body // Expected format: [{ role: 'user' | 'model', content: '...' }]

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
        }

        // 1. Fetch User Data to calculate Days Registered
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { createdAt: true, name: true }
        })

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const daysRegistered = Math.floor((new Date().getTime() - new Date(dbUser.createdAt).getTime()) / (1000 * 3600 * 24))

        // 2. Comprobar configuración de prompt para este usuario
        let userConfig = await prisma.userPromptConfig.findUnique({
            where: {
                userId_type: { userId: session.user.id, type: botType }
            }
        })

        if (!userConfig || !userConfig.prompt || userConfig.prompt.trim() === "") {
            return NextResponse.json({ 
                text: "No tengo configurado un diálogo aún. Por favor, comunícate con tu administrador para que me asigne un modelo de comportamiento." 
            })
        }

        const basePrompt = userConfig.prompt

        // 3. Inject Dynamic Context
        const systemPrompt = `[CONTEXTO DEL SISTEMA INYECTADO: Asesor: ${dbUser.name || 'Usuario'}, Días registrado: ${daysRegistered}]\n\n--- INSTRUCCIONES ---\n${basePrompt}`

        // To use Gemini REST API directly without installing extra SDKs
        const GOOGLE_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY

        if (!GOOGLE_API_KEY) {
            return NextResponse.json({
                text: "El sistema de IA está configurado, pero falta la clave de API (GOOGLE_GEMINI_API_KEY) en el entorno. Por favor, solicite a soporte que la agregue para habilitar las respuestas reales."
            })
        }

        const payload = {
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: messages.map(msg => ({
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
