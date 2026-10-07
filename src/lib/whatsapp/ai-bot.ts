import axios from 'axios';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp/service';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
const NVIDIA_MODEL = "meta/llama-3.2-90b-vision-instruct";

const HR_GROUP_LINK = "https://chat.whatsapp.com/EYwCyfg0mF99nmNEhBPCFt";
const HR_PAGE_LINK = "https://atomiccotizador.shop/web/contrataciones";

/**
 * Motor Autónomo de Inteligencia Artificial para WhatsApp Cloud API
 * Discierne con precisión quirúrgica entre:
 * 1) Aspirantes a Empleo / Reclutamiento de Asesores Comerciales
 * 2) Clientes de Compra / Consultas de Catálogo y Cotizaciones
 */
export async function handleIncomingWhatsAppBot(params: {
    whatsappId: string;
    contactName: string;
    messageText: string;
    mediaUrl?: string | null;
    conversationId: string;
}) {
    try {
        const { whatsappId, contactName, messageText, mediaUrl, conversationId } = params;

        // 1. Obtener los últimos 6 mensajes para contexto conversacional
        const recentMessages = await prisma.wAMessage.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'desc' },
            take: 6
        });

        const history = recentMessages.reverse().map(m => 
            `${m.direction === 'INBOUND' ? 'Cliente' : 'Asesor ATOMIC'}: ${m.body}`
        ).join('\n');

        // 2. Clasificación de Intención (RECLUTAMIENTO vs COMERCIAL)
        const textLower = (messageText || '').toLowerCase();
        const isRecruitment = 
            textLower.includes('empleo') ||
            textLower.includes('trabajo') ||
            textLower.includes('vacante') ||
            textLower.includes('postul') ||
            textLower.includes('contrat') ||
            textLower.includes('aspirant') ||
            textLower.includes('laboral') ||
            textLower.includes('curriculum') ||
            textLower.includes('hoja de vida') ||
            textLower.includes('asesor comercial') ||
            textLower.includes('vender') ||
            textLower.includes('sueldo') ||
            textLower.includes('remuneracion') ||
            textLower.includes('comision') ||
            textLower.includes('[pauta_meta:') && (
                textLower.includes('empleo') ||
                textLower.includes('trabajo') ||
                textLower.includes('contrat') ||
                textLower.includes('asesor')
            );

        let systemPrompt = "";
        let relevantProductsContext = "";

        if (isRecruitment) {
            // === MUNDO RECLUTAMIENTO / RECURSOS HUMANOS ===
            systemPrompt = `
Eres la Asistente de Selección y Talento Humano de ATOMIC Electronics Ecuador.
Tu misión es recibir con máxima calidez, profesionalismo y naturalidad a los postulantes y aspirantes a Asesores Comerciales.

INFORMACIÓN OFICIAL DE LA CONVOCATORIA (Plan Laboral 30 Días):
- Dedicación: 2 horas diarias flexibles (100% digital/remoto o presencial).
- Remuneración: Escalonada de $100 a $450 fijos mensuales + comisiones directas por venta.
- Especialización: Asignación a categorías específicas (Tecnología, Seguridad, Gaming, etc.).
- 7 actividades prácticas sencillas guiadas por coordinación.
- Página explicativa oficial con todos los detalles del plan: ${HR_PAGE_LINK}
- Grupo de inducción y bienvenida en WhatsApp: ${HR_GROUP_LINK}

INSTRUCCIÓN CLAVE DE RESPUESTA:
1. Saluda amablemente usando el nombre del aspirante si está disponible (${contactName}).
2. Confirma con entusiasmo que su mensaje fue recibido para la vacante de Asesor Comercial.
3. Bríndale de forma muy clara y estructurada:
   - El enlace donde puede leer todo el Plan Laboral detallado: ${HR_PAGE_LINK}
   - El enlace para unirse de inmediato al grupo oficial de WhatsApp: ${HR_GROUP_LINK}
4. Indícale con total naturalidad que **una vez que ingrese al grupo, su coordinadora asignada se pondrá en contacto directo con él/ella para explicarle el plan laboral, resolver dudas y asignarle su categoría de productos**.
5. Mantén un tono motivador, seguro y sumamente humano (usa emojis sobrios como 💼, 🚀, 📲).
`;
        } else {
            // === MUNDO COMERCIAL / VENTAS DE PRODUCTOS ===
            // Búsqueda en vivo de productos en la base de datos de Supabase
            const queryWords = textLower
                .replace(/[^a-záéíóúüñ0-9\s]/gi, '')
                .split(/\s+/)
                .filter(w => w.length > 3 && !['hola', 'buenas', 'precio', 'tienen', 'costo', 'cotizar', 'amigo'].includes(w));

            let matchedProducts: any[] = [];
            if (queryWords.length > 0) {
                matchedProducts = await prisma.product.findMany({
                    where: {
                        isActive: true,
                        isDeleted: false,
                        OR: queryWords.map(word => ({
                            OR: [
                                { name: { contains: word, mode: 'insensitive' } },
                                { description: { contains: word, mode: 'insensitive' } }
                            ]
                        }))
                    },
                    take: 5,
                    select: {
                        id: true,
                        sku: true,
                        name: true,
                        price: true,
                        stock: true,
                        description: true
                    }
                });
            }

            if (matchedProducts.length > 0) {
                relevantProductsContext = `
INVENTARIO ENCONTRADO EN TIEMPO REAL:
${matchedProducts.map(p => `- ${p.name} (SKU: ${p.sku || 'N/A'}) | Precio: $${p.price.toFixed(2)} USD | Stock: ${p.stock} unidades | Link: https://atomiccotizador.shop/web/product/${p.id}`).join('\n')}
`;
            }

            systemPrompt = `
Eres el Asesor Comercial Senior de ATOMIC Electronics Ecuador (especialistas en tecnología, torniquetes peatonales, barreras, seguridad, laptops y soluciones residenciales e industriales).
Tu objetivo es asesorar con precisión técnica, empatía y efectividad comercial para cerrar ventas o cotizaciones.

${relevantProductsContext}

PAUTAS DE RESPUESTA:
1. Responde de forma concisa, educada y profesional.
2. Si el cliente pregunta por un producto que está en el inventario anterior, da el precio exacto en dólares ($USD), resalta su disponibilidad y beneficios.
3. Si requiere cotización formal o envío, indica que realizamos envíos a todo Ecuador y asesoría técnica.
4. Si no tenemos el producto exacto, ofrece una alternativa cercana de la tienda o invita a revisar https://atomiccotizador.shop/web.
5. Invita siempre a dar el siguiente paso de compra o cotización formal.
`;
        }

        // 3. Consulta al modelo NVIDIA Llama-3.2-90B Vision
        const completion = await axios.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                model: NVIDIA_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { 
                        role: "user", 
                        content: `Historial de la conversación:\n${history}\n\nÚltimo mensaje recibido de ${contactName}:\n"${messageText}"`
                    }
                ],
                temperature: 0.6,
                max_tokens: 350
            },
            {
                headers: {
                    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const botReply = completion.data.choices?.[0]?.message?.content?.trim();

        if (botReply) {
            // 4. Enviar mensaje por WhatsApp Cloud API
            await sendWhatsAppMessage(whatsappId, botReply);

            // 5. Guardar el mensaje OUTBOUND en la base de datos
            await prisma.wAMessage.create({
                data: {
                    conversationId,
                    whatsappMessageId: `bot-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: 'text',
                    body: botReply,
                    status: 'SENT',
                    senderId: 'BOT_NEMOTRON_90B'
                }
            });

            console.log(`[BOT_SUCCESS] Respondió automáticamente a ${whatsappId}`);
        }

        return botReply;
    } catch (error: any) {
        console.error('[BOT_PROCESSING_ERROR]', error.response?.data || error.message);
        return null;
    }
}
