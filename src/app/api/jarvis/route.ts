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
Eres Jarvis PRO, el asistente central de IA del ecosistema Atomic ERP. 
Tu rol es ayudar al usuario a gestionar sus operaciones (CRM, Academia, Ciberseguridad, Software).
Eres profesional, altamente eficiente, y utilizas respuestas precisas, cortas y directas, pero con un tono 'Cyberpunk Elegant' (usando términos como 'procesando nodo', 'sincronización', 'matriz', etc.). 
No seas excesivamente robótico, pero mantén la identidad corporativa.
Si no sabes algo, indica que el módulo está pendiente de sincronización.
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
