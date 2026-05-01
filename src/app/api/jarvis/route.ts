import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!NVIDIA_API_KEY) {
            return NextResponse.json({ 
                content: "Error: NVIDIA API Key no encontrada. Jarvis offline." 
            });
        }

        const systemPrompt = `Eres Jarvis PRO, el núcleo ejecutivo de Atomic ERP.
Tienes autoridad para ejecutar acciones tácticas.
CAPACIDADES:
- CRM: [ACTION: CRM_ADD {"firstName": "...", "lastName": "...", "phone": "...", "city": "..."}]
- QUOTES: [ACTION: QUOTE_CREATE {"client": "...", "subject": "...", "items": []}]
- SHOP: [ACTION: SHOP_EDIT {"id": "...", "price": 0, "stock": 0}]
Si el usuario solicita una gestión, responde confirmando y añade la etiqueta [ACTION: NAME {JSON}] al final.`;

        const nemotronMessages = [
            { role: "system", content: systemPrompt },
            ...messages.map((m: any) => ({
                role: m.role === 'model' ? 'assistant' : 'user',
                content: m.content
            }))
        ];

        const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.WORKER_MODEL || "nvidia/llama-3.1-nemotron-70b-instruct",
                messages: nemotronMessages,
                temperature: 0.2,
                max_tokens: 1024
            })
        });

        if (!response.ok) return NextResponse.json({ content: "Error de nodo neuronal." }, { status: 500 });

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || "";
        let action = null;
        const actionMatch = reply.match(/\[ACTION:\s*(\w+)\s*({.*})\]/);
        if (actionMatch) {
            try {
                action = { name: actionMatch[1], data: JSON.parse(actionMatch[2]) };
            } catch (e) {}
        }

        return NextResponse.json({ 
            content: reply.replace(/\[ACTION:.*\]/, "").trim(),
            action
        });

    } catch (error: any) {
        console.error("Jarvis API Error:", error);
        return NextResponse.json({ content: "Error crítico de conexión." }, { status: 500 });
    }
}
