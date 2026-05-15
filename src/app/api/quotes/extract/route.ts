import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || text.trim() === '') {
            return NextResponse.json({ success: false, error: "Texto vacío." }, { status: 400 });
        }

        if (!NVIDIA_API_KEY) {
            return NextResponse.json({ success: false, error: "API Key no configurada." }, { status: 500 });
        }

        const systemPrompt = `Eres un asistente de ventas experto en extraer datos desorganizados de clientes y convertirlos en un JSON estricto para cotizaciones.
Debes extraer: clientName, clientCity, clientPhone, quoteSubject, e items (array de { description, quantity, unitPrice }).
Si hay datos faltantes importantes (ej. no se menciona el nombre del cliente, ciudad, teléfono, o los productos no tienen precio), debes indicarlo en la propiedad "missingInfo" con un texto breve en español diciendo qué falta. Si todo parece estar bien, deja "missingInfo" como null. Si no hay precio, asume 0. Si no hay cantidad, asume 1.

Responde ÚNICAMENTE con el objeto JSON válido, sin markdown ni explicaciones.
Estructura esperada:
{
  "clientName": "...",
  "clientCity": "...",
  "clientPhone": "...",
  "quoteSubject": "...",
  "items": [
    { "description": "...", "quantity": 1, "unitPrice": 10.5 }
  ],
  "missingInfo": "..." // o null
}`;

        const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.WORKER_MODEL || "nvidia/llama-3.1-nemotron-70b-instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Texto del vendedor:\n${text}` }
                ],
                temperature: 0.1,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            console.error("NVIDIA API Error:", await response.text());
            return NextResponse.json({ success: false, error: "Error en el nodo de IA." }, { status: 500 });
        }

        const data = await response.json();
        let reply = data.choices[0]?.message?.content || "{}";
        
        // Clean markdown JSON ticks if present
        reply = reply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const parsed = JSON.parse(reply);
        return NextResponse.json({ success: true, data: parsed });

    } catch (error: any) {
        console.error("Extract API Error:", error);
        return NextResponse.json({ success: false, error: "Error procesando el texto." }, { status: 500 });
    }
}
