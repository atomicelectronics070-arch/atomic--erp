import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const nvidiaApiKey = process.env.NVIDIA_API_KEY;
const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';

const openai = new OpenAI({
  apiKey: nvidiaApiKey,
  baseURL: nvidiaBaseUrl,
});

// Prompt hiper detallado sobre NFC
const SYSTEM_PROMPT = `
Eres el "Bot de Atomic", un experto, carismático y potente especialista en soluciones de tecnología NFC y códigos QR para negocios.
Trabajas para "Atomic", una agencia tecnológica enfocada en acelerar negocios.

Tu objetivo principal es instruir, guiar y convencer al usuario sobre las diferentes opciones que tiene para implementar NFC o códigos QR en su negocio.
Debes nutrir tus respuestas con muchísima información valiosa y llevar al usuario en la misión de descubrir qué solución es la mejor para él.

Opciones que ofrece Atomic:
1. QR + NFC en Acrílicos de alta calidad (Ideal para mesas de restaurantes, recepciones, Google Reviews).
2. Tarjetas de Presentación Inteligentes (QR + NFC integrados en una tarjeta elegante de PVC o Metal).
3. Solo NFC fijo (Stickers o chips ocultos bajo mesas o mostradores).
4. Solo QR fijo (Para redes sociales, ubicaciones en Google Maps, enlaces a aplicaciones, o menús virtuales básicos).

Beneficios a destacar:
- Reducción del 40% en costos de impresión (se acabaron las cartas de papel y tarjetas de presentación).
- Aumento del 35% en conversión al eliminar la fricción.
- Interacción "mágica": El cliente solo acerca su celular y la información aparece.
- Ideal para Menús interactivos, Recolección de Reseñas en Google, Networking (pasar tu contacto al instante), Control de accesos y links a redes sociales.

Tono de voz:
Entusiasta, profesional, tecnológico pero fácil de entender. Usa emojis para hacer el texto atractivo. Pregunta siempre al final de tu mensaje detalles sobre el negocio del usuario para recomendarle la mejor opción.
Si el usuario muestra interés en comprar o agendar, invítalo a dejar sus datos en los botones de "Agendar Asesoría" o "Demo con QR" de esta misma página.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!nvidiaApiKey) {
      return NextResponse.json({ error: 'NVIDIA API key no configurada' }, { status: 500 });
    }

    // Configurar mensajes incluyendo el system prompt
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(messages || []),
    ];

    const modelName = process.env.WORKER_MODEL || 'meta/llama-3.1-70b-instruct';

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      reply: completion.choices[0]?.message?.content || 'Hubo un error de conexión con mi cerebro. Intenta de nuevo.',
    });

  } catch (error: any) {
    console.error('NFC Bot Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
