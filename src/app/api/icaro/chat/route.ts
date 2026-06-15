import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

async function fetchWithTimeout(url: string, options: any, timeoutMs = 3500) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        })
        clearTimeout(id)
        return response
    } catch (error) {
        clearTimeout(id)
        throw error
    }
}

// Contexto reciente de Softres y Guías de ventas
const SOFTRES_CONTEXT = `
[Contexto de Softres y guía de ventas integrado]
`;

export async function POST(req: Request) {
    try {
        let message = ""
        let vendedor_id = "Unknown"
        let role = "vendedor"
        let persona = "icaro"
        let topic = "Lista de Precios"
        let filesList: { name: string; type: string; base64: string }[] = []

        const contentType = req.headers.get("content-type") || ""

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData()
            message = formData.get("message") as string || ""
            vendedor_id = formData.get("vendedor_id") as string || "Unknown"
            role = formData.get("role") as string || "vendedor"
            persona = formData.get("persona") as string || "icaro"
            topic = formData.get("topic") as string || "Lista de Precios"
            
            const files = formData.getAll("files")
            for (const f of files) {
                if (f instanceof File) {
                    const bytes = await f.arrayBuffer()
                    const base64 = Buffer.from(bytes).toString("base64")
                    filesList.push({
                        name: f.name,
                        type: f.type,
                        base64
                    })
                }
            }
        } else {
            const body = await req.json()
            message = body.message || ""
            vendedor_id = body.vendedor_id || "Unknown"
            role = body.role || "vendedor"
            persona = body.persona || "icaro"
            topic = body.topic || "Lista de Precios"
        }

        console.log(`[ICARO CLOUD] Chat request received: ${message.substring(0, 50)}...`);

        // Log user message to Supabase
        try {
            await prisma.$executeRawUnsafe(
                `INSERT INTO conversaciones (vendedor_id, emisor, mensaje) VALUES ($1, $2, $3)`,
                vendedor_id, 'user', message + (filesList.length > 0 ? ' [Archivos Adjuntos]' : '')
            )
        } catch(e) {
            console.error("Error logging user message to DB:", e)
        }

        // System prompt with sales guidelines and Obsidian instructions
        const systemPrompt = `You are ÍCARO, the Virtual Corporate Brain of Soft 3 and Atomic.
User: "${vendedor_id}" (Role: "${role}")
Topic: "${topic}"

## DIRECTRICES DE GUÍA LABORAL Y PUBLICACIONES DE VENTAS:
- Esporádicamente, recuérdale que haga sus publicaciones de Facebook/Marketplace y responda a tiempo.
- Importancia de compartir en grupos de ventas de inmediato.
- Detalles del anuncio: Título (gancho), Descripción (características), Etiquetas (SEO), Ubicación (periferias/valles/provincias, evitar Quito centro saturado).
- Recuérdale que puedes guardar números de teléfono y notas del cliente.
- Puedes guardar contexto y recordatorios en Obsidian. Si te dicen algo como "Hoy le pedí a este cliente tal cosa y recuérdame mañana", debes:
  1) Crear un recordatorio (shouldCreateNode = true, nodeFolder = "Ventas" o "Reportes Diarios").
  2) Escribir explícitamente el recordatorio en tu respuesta.

OUTPUT STRICTLY JSON WITHOUT MARKDOWN. Format:
{
  "shouldCreateNode": boolean,
  "nodeTitle": "Brief descriptive title",
  "nodeContent": "Structured content to save",
  "nodeFolder": "Ventas" | "Reportes Diarios" | "Sugerencias Bot",
  "saveReport": boolean,
  "reportData": { "tipo": "ventas|cliente|otro", "resumen": "...", "monto": 0 },
  "instructionsForExecutor": "Tell the local AI what to respond to the user in Spanish."
}`;

        const GOOGLE_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY
        const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY

        let geminiError = ""
        let nvidiaError = ""

        let parsedPlan: any = null
        let responseText = ""

        // Phase 1: Call Orchestrator (Gemini with Fallback to Nvidia)
        let modelResponse = ""
        let usedNvidia = false

        if (GOOGLE_API_KEY && GOOGLE_API_KEY !== "your_gemini_api_key_here") {
            try {
                const parts: any[] = [{ text: systemPrompt + "\nUser Input:\n" + message }]
                for (const f of filesList) {
                    parts.push({
                        inlineData: {
                            data: f.base64,
                            mimeType: f.type
                        }
                    })
                }

                const res = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts }]
                    })
                }, 3500)

                if (res.ok) {
                    const data = await res.ok ? await res.json() : null
                    modelResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
                } else {
                    const errText = await res.text().catch(() => "")
                    geminiError = `HTTP ${res.status}: ${errText}`
                    console.warn(`Gemini API returned error: ${res.status}. Falling back to Nvidia...`, errText)
                }
            } catch (err: any) {
                geminiError = err.message
                console.error("Gemini failed. Falling back to Nvidia...", err)
            }
        }

        // Fallback to Nvidia NIM if Gemini failed or key is missing
        if (!modelResponse && NVIDIA_API_KEY) {
            try {
                usedNvidia = true
                const res = await fetchWithTimeout("https://integrate.api.nvidia.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${NVIDIA_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: message }
                        ],
                        max_tokens: 1024
                    })
                }, 5000)

                if (res.ok) {
                    const json = await res.json()
                    modelResponse = json.choices[0].message.content || ""
                } else {
                    const errText = await res.text().catch(() => "")
                    nvidiaError = `HTTP ${res.status}: ${errText}`
                    console.error("Nvidia API failed as well:", res.status, errText)
                }
            } catch (err: any) {
                nvidiaError = err.message
                console.error("Nvidia API failed:", err)
            }
        }

        // Parse JSON output from model
        if (modelResponse) {
            let cleanResponse = modelResponse.trim()
            if (cleanResponse.startsWith("```json")) {
                cleanResponse = cleanResponse.slice(7, -3).trim()
            } else if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse.slice(3, -3).trim()
            }

            try {
                parsedPlan = JSON.parse(cleanResponse)
            } catch(e) {
                console.error("JSON parse error on model response:", modelResponse)
                parsedPlan = {
                    shouldCreateNode: false,
                    saveReport: false,
                    instructionsForExecutor: modelResponse
                }
            }
        }

        if (!parsedPlan) {
            const hasGemini = !!GOOGLE_API_KEY;
            const hasNvidia = !!NVIDIA_API_KEY;
            const geminiPrefix = GOOGLE_API_KEY ? GOOGLE_API_KEY.substring(0, 6) : "None";
            const nvidiaPrefix = NVIDIA_API_KEY ? NVIDIA_API_KEY.substring(0, 8) : "None";
            parsedPlan = {
                shouldCreateNode: false,
                saveReport: false,
                instructionsForExecutor: `Lo siento, experimenté un problema de conexión con el enlace de inteligencia artificial. Por favor, intenta de nuevo. (Debug: G:${hasGemini ? "OK" : "NO"} N:${hasNvidia ? "OK" : "NO"} GPfx:${geminiPrefix} NPfx:${nvidiaPrefix} errG:${geminiError} errN:${nvidiaError})`
            }
        }

        // Database logic: Save report if saveReport is true
        if (parsedPlan.saveReport && parsedPlan.reportData) {
            try {
                await prisma.$executeRawUnsafe(
                    `INSERT INTO reportes_ventas (vendedor_id, datos) VALUES ($1, $2::jsonb)`,
                    vendedor_id, JSON.stringify(parsedPlan.reportData)
                )
                console.log("[DB] Saved sales report to database.")
            } catch(e) {
                console.error("Error saving report to DB:", e)
            }
        }

        // Database logic: Save Obsidian reminders to a special table "recordatorios_obsidian"
        if (parsedPlan.shouldCreateNode && parsedPlan.nodeData) {
            try {
                // Ensure table exists (create it dynamically if it doesn't, using raw query to prevent schema crash)
                await prisma.$executeRawUnsafe(`
                    CREATE TABLE IF NOT EXISTS recordatorios_obsidian (
                        id SERIAL PRIMARY KEY,
                        vendedor_id TEXT,
                        folder TEXT,
                        title TEXT,
                        content TEXT,
                        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `).catch(() => {})

                await prisma.$executeRawUnsafe(
                    `INSERT INTO recordatorios_obsidian (vendedor_id, folder, title, content) VALUES ($1, $2, $3, $4)`,
                    vendedor_id, parsedPlan.nodeFolder || topic, parsedPlan.nodeData.title, parsedPlan.nodeData.content
                )
                console.log("[DB] Saved Obsidian reminder to database.")
            } catch(e) {
                console.error("Error saving Obsidian note to DB:", e)
            }
        }

        // Phase 2: Call Executor to synthesize final response
        let finalResponseText = parsedPlan.instructionsForExecutor

        if (parsedPlan.instructionsForExecutor) {
            const execPrompt = `You are ÍCARO, the Virtual Corporate Brain of Atomic.
Synthesize a direct, helpful, and professional response in Spanish to the user "${vendedor_id}".
User Input: "${message}"
Instructions/Directive: ${parsedPlan.instructionsForExecutor}

OUTPUT ONLY the text of the final response to be shown in the chat window.`;

            let synthesized = false;

            if (GOOGLE_API_KEY && GOOGLE_API_KEY !== "your_gemini_api_key_here") {
                try {
                    const res = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: execPrompt }] }]
                        })
                    }, 3500)

                    if (res.ok) {
                        const data = await res.json()
                        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
                        if (text) {
                            finalResponseText = text
                            synthesized = true
                        }
                    }
                } catch (err) {
                    console.error("Gemini Executor synthesis failed:", err)
                }
            }

            if (!synthesized && NVIDIA_API_KEY) {
                try {
                    const res = await fetchWithTimeout("https://integrate.api.nvidia.com/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${NVIDIA_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
                            messages: [
                                { role: "system", content: "You are a helpful assistant." },
                                { role: "user", content: execPrompt }
                            ],
                            max_tokens: 1024
                        })
                    }, 5000)

                    if (res.ok) {
                        const json = await res.json()
                        const text = json.choices[0].message.content || ""
                        if (text) finalResponseText = text
                    }
                } catch (err) {
                    console.error("Nvidia Executor synthesis failed:", err)
                }
            }
        }

        // Log response to DB
        try {
            await prisma.$executeRawUnsafe(
                `INSERT INTO conversaciones (vendedor_id, emisor, mensaje) VALUES ($1, $2, $3)`,
                vendedor_id, 'ai', finalResponseText
            )
        } catch(e) {
            console.error("Error logging AI message to DB:", e)
        }

        return NextResponse.json({
            response: finalResponseText,
            shouldCreateNode: parsedPlan.shouldCreateNode,
            nodeData: parsedPlan.nodeData || null,
            nodeFolder: parsedPlan.nodeFolder || null
        })

    } catch (error: any) {
        console.error("Icaro Chat error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
