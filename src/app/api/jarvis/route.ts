import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!NVIDIA_API_KEY) {
            console.warn("Falta NVIDIA_API_KEY para Nemotron. Fallback activado.");
            return NextResponse.json({ 
                content: "Error: NVIDIA API Key no encontrada en el sistema. Jarvis offline." 
            });
        }

        const systemPrompt = `
Eres Jarvis PRO, el asistente de Onboarding y Soporte Operativo de Atomic ERP. 
Tu rol principal es guiar a los usuarios (empleados, admins, distribuidores) a usar la plataforma.
Instrucciones clave:
1. Explica cómo usar los módulos (CRM para ventas, Academia para cursos, WhatsApp para chats).
2. Da sugerencias operativas para mejorar la eficiencia del usuario.
3. Mantén un tono profesional, útil y 'Cyberpunk Elegant' (directo y técnico).
4. Respuestas concisas (máx 3-4 oraciones).
Si el usuario pregunta algo técnico del sistema, guíalo paso a paso.
`;

        const nemotronMessages = [
            { role: "system", content: systemPrompt },
            ...messages.map((m: any) => ({
                role: m.role === 'model' ? 'assistant' : 'user',
                content: m.content
            }))
        ];

        console.log("Jarvis conectando con Nemotron...");

        const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.WORKER_MODEL || "nvidia/llama-3.1-nemotron-70b-instruct",
                messages: nemotronMessages,
                temperature: 0.6,
                max_tokens: 512
            })
        });

        if (!response.ok) {
            console.error("Error Nemotron:", await response.text());
            return NextResponse.json({ content: "Error de comunicación con el nodo principal de Nemotron." }, { status: 500 });
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || "Sincronización fallida. Nodo vacío.";

        return NextResponse.json({ content: reply });

    } catch (error: any) {
        console.error("Jarvis API Error:", error);
        return NextResponse.json({ content: "Error crítico de conexión." }, { status: 500 });
    }
}
