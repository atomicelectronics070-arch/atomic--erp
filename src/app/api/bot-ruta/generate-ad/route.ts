import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return NextResponse.json({ error: "Missing GEMINI_API_KEY in environment" }, { status: 500 })
    }

    try {
        const { productName } = await req.json()
        if (!productName) {
            return NextResponse.json({ error: "Missing productName" }, { status: 400 })
        }

        const prompt = `Actúas como un experto en marketing digital y copywriting. 
Genera los textos para un anuncio publicitario de alto rendimiento para el siguiente producto: "${productName}".

Debes devolver un objeto JSON con exactamente estos 4 campos (sin markdown, solo el JSON):
{
  "cleanTitle": "Un título corto y de impacto, máximo 28 caracteres.",
  "adSubtitle": "Un subtítulo que resalte la calidad o la experiencia (en mayúsculas).",
  "adDescription": "Una descripción persuasiva y vendedora, máximo 150 caracteres.",
  "callToAction": "Un llamado a la acción claro y urgente (en mayúsculas)."
}

Reglas:
- No uses markdown en la respuesta.
- Devuelve SOLO el objeto JSON válido.
- Los textos deben ser en español.`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                }
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Gemini API error:", errorText)
            return NextResponse.json({ error: "Failed to call Gemini API" }, { status: 500 })
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
            return NextResponse.json({ error: "Empty response from Gemini" }, { status: 500 })
        }

        // Parse the JSON from the response
        const adCopy = JSON.parse(text)

        return NextResponse.json(adCopy)

    } catch (err: any) {
        console.error("Error in generate-ad route:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
