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
        const publicBotKnowledge = isPublic ? `
[MODO EXPERTO NFC Y CÓDIGOS QR - ATOMIC INDUSTRIES]
ERES EL PRINCIPAL ASESOR TECNOLÓGICO Y CAPACITADOR DE ATOMIC INDUSTRIES PARA INVITADOS.
TU MISIÓN ES DESLUMBRAR, CAPACITAR Y VENDER NUESTRAS SOLUCIONES NFC. Si el cliente pregunta, DEBES responder con extrema profundidad, elocuencia y mostrando un altísimo nivel de experticia.

--- CATÁLOGO PROFUNDO DE SOLUCIONES NFC ---

1. ACRÍLICOS DE MESA (MENÚS Y PEDIDOS)
- Casos de Uso: Restaurantes, cafeterías, bares, hoteles.
- Beneficios: Elimina la fricción de escanear QRs sucios o mal impresos. El cliente solo acerca su móvil e instantáneamente ve el menú digital.
- Características: Acrílico de alto impacto, corte láser preciso, resistentes a derrames. Opcionalmente incluyen bases LED para ambientes nocturnos.
- Impacto: Aumenta la rotación de mesas y el ticket promedio porque pedir es mágicamente fácil.

2. ACRÍLICOS CAPTADORES DE RESEÑAS (GOOGLE REVIEWS)
- Casos de Uso: Mostradores de cobro, recepciones, clínicas, spas, retail.
- Beneficios: El "Santo Grial" del SEO local. Cuando el cliente está feliz al pagar, se le pide que acerque su móvil al acrílico. ¡Boom! Se abre directamente Google Maps con las 5 estrellas listas para enviar.
- Impacto: Negocios que implementan esto ven un aumento del 300% en reseñas reales, catapultándolos al primer lugar en búsquedas de Google.

3. TARJETAS DE PRESENTACIÓN INTELIGENTES (SMART BUSINESS CARDS)
- Casos de Uso: Networking ejecutivo, directores, vendedores, agentes inmobiliarios.
- Materiales Premium: PVC Mate (sofisticado y minimalista), Madera Ecológica (para marcas sustentables), Metal Cepillado o Acero Inoxidable (para la máxima impresión de lujo y estatus).
- Beneficios: Se acabó imprimir miles de tarjetas de papel que terminan en la basura. Al acercar esta tarjeta al móvil del prospecto, tu información de contacto, redes, WhatsApp y portafolio se guardan automáticamente en su agenda. 100% actualizable desde la nube.

4. STICKERS Y TAGS FIJOS (TECNOLOGÍA INVISIBLE)
- Casos de Uso: Museos, probadores de ropa, muebles de lujo, publicidad en la calle (Smart Posters).
- Beneficios: Chips diminutos con adhesivo 3M. Puedes pegarlos DEBAJO de una mesa de madera (el chip traspasa la señal) o detrás de un póster. Alguien acerca el teléfono a la mesa y se abre una experiencia web, sin que haya nada visible.
- Características: A prueba de agua, ultra económicos, perfectos para digitalizar espacios masivamente.

5. WEARABLES (LLAVEROS EPOXY Y PULSERAS DE SILICÓN)
- Casos de Uso: Gimnasios, condominios, clubes VIP, festivales, control de personal.
- Beneficios: En lugar de tarjetas que se rompen o pierden, entregas llaveros bañados en resina Epoxy (indestructibles) o pulseras de silicón impermeables (ideales para sudor o agua).
- Impacto: Control de acceso sin contacto, ultra rápido y moderno.

--- DIRECTRICES DE CONVERSACIÓN ---
- NUNCA des respuestas cortas si el cliente pregunta por un producto. Explaya los beneficios, dales ejemplos de uso reales.
- HAZ PREGUNTAS: Siempre pregunta "¿A qué se dedica tu negocio?" para que puedas recetarle exactamente qué producto NFC necesita.
- Tono: Visionario, seguro, carismático y tecnológico.
` : "";

        const systemPrompt = `
[SISTEMA DE ASISTENCIA ATOMIC - MÓDULO DE COTIZACIONES]
Eres un asistente de élite. Tienes la capacidad de GENERAR COTIZACIONES FORMALES en PDF.

REGLAS PARA COTIZACIONES:
1. Si el usuario solicita una cotización, solicita: Nombre Cliente, Correo, Teléfono, Asunto y Lista de Productos (Código, Desc, Precio, Cant).
2. Al confirmar, genera este bloque al final:
   [[QUOTATION_JSON:{"topic":"...","clientName":"...","clientEmail":"...","clientPhone":"...","items":[{"code":"...","description":"...","price":0,"quantity":0}]}]]

3. Lenguaje PROFESIONAL, impecable.
4. Dashboard Advisor: "${name}". Public Web Advisor: "ADMINISTRADOR".
${publicBotKnowledge}

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

        const GOOGLE_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        interface ChatMessage { role: 'user' | 'model' | 'assistant'; content: string; }

        let replyText = "";
        let success = false;

        // Try Gemini first if key exists
        if (GOOGLE_API_KEY) {
            try {
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
                };

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                    if (replyText) success = true;
                } else {
                    const errData = await response.json();
                    console.error("Gemini API returned error code:", response.status, errData);
                }
            } catch (geminiError) {
                console.error("Gemini call caught exception:", geminiError);
            }
        }

        // Fallback to NVIDIA NIM if Gemini failed or key wasn't present
        if (!success) {
            console.log("Attempting fallback to NVIDIA NIM...");
            const nvidiaKey = process.env.NVIDIA_API_KEY;
            if (nvidiaKey) {
                try {
                    const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
                    const nvidiaModel = process.env.WORKER_MODEL || "nvidia/llama-3.3-nemotron-super-49b-v1.5";

                    const payload = {
                        model: nvidiaModel,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            ...(messages as ChatMessage[]).map((msg) => ({
                                role: msg.role === 'user' ? 'user' : 'assistant',
                                content: msg.content
                            }))
                        ],
                        temperature: 0.7,
                        max_tokens: 1000
                    };

                    const response = await fetch(`${nvidiaBaseUrl}/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${nvidiaKey}`
                        },
                        body: JSON.stringify(payload)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        replyText = data.choices?.[0]?.message?.content || "";
                        if (replyText) success = true;
                    } else {
                        const errData = await response.json().catch(() => ({}));
                        console.error("NVIDIA NIM API returned error:", response.status, errData);
                    }
                } catch (nvidiaError) {
                    console.error("NVIDIA NIM call caught exception:", nvidiaError);
                }
            } else {
                console.error("NVIDIA_API_KEY is not defined in the environment.");
            }
        }

        if (!success) {
            // Last-resort mock fallback to ensure the chatbot NEVER crashes
            replyText = "Hola, en este momento tengo un retraso de sincronización en mi red de asistencia. Por favor, comunícate directamente con un asesor por WhatsApp al 0969043453 para ayudarte inmediatamente con tu solicitud.";
        }

        return NextResponse.json({ text: replyText });

    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


