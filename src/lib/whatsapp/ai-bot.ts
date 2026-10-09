import axios from 'axios';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp/service';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
const NVIDIA_MODEL = "meta/llama-3.2-90b-vision-instruct";

const HR_GROUP_LINK = "https://chat.whatsapp.com/EYwCyfg0mF99nmNEhBPCFt";
const HR_PAGE_LINK = "https://atomiccotizador.shop/web/contrataciones";

/**
 * Matriz de Conocimiento Oficial de ATOMIC Electronics / ATOMIC Industrias
 * Contiene las líneas bandera, modelos, precios de referencia y casos de uso.
 */
const CATALOGO_MAESTRO_ATOMIC = `
PORTAFOLIO OFICIAL Y LÍNEAS PRINCIPALES DE ATOMIC ECUADOR:

1. VIDEOPORTEROS Y CITOFONÍA (Residencial y Edificios):
- Portero de Video Residencial 2 Pantallas HD: $285.00 (Incluye frente exterior HD + 2 monitores interiores a color + ¡Envío Gratis!). Para casas y oficinas.
- Kit Videoportero Hikvision DS-KIS212: $92.40 + IVA (Monitor LCD 7", audio supresión de ruido, calidad HD TVI, botón apertura).
- Kit Citofonía KOCOM 3 Departamentos: $149.00 (Frente metálico exterior + 3 citófonos KDP-601A originales KOCOM).
- Centrales Colectivas INTELBRAS Collective (Edificios y Condominios):
  * Collective 4i (4 deptos): $121.81 + IVA
  * Collective 8i (8 deptos): $134.20 + IVA
  * Collective 12 (12 deptos): $104.50 + IVA
  * Collective 12i (12 deptos): $143.00 + IVA
  * Collective 16i (16 deptos): $155.38 + IVA
  * Collective 20i (20 deptos): $176.46 + IVA
  * Collective 24i (24 deptos): $190.18 + IVA
  * Accesorios: Citófono CT-A1 ($11.55), TDMI 300 2 hilos ($15.40), Tags doble frecuencia ($3.85). Desvío a celular y apertura remota.

2. CONTROL DE ACCESO Y PEATONAL (Torniquetes y Biometría):
- Biométrico ZKTeco SenseFace 2A con Videoportero por App: $175.00 (Reconocimiento facial ultra rápido, huella dactilar, tarjetas RFID, PIN, videollamada a App móvil, WiFi 100% inalámbrico).
- Torniquete Trípode ZKTeco TS1000 Pro: $720.00 (Acero inoxidable 304, paso bidireccional, compatible con huella y facial).
- Torniquete Flap Barrier ZKTeco FBL4000 Pro: $1,850.00 (Aletas retráctiles de alta gama en acrílico/vidrio, paso fluido y elegante).
- Torniquete Molinete Cuerpo Entero ZKTeco FHT2300: $2,950.00 (Máxima seguridad industrial, reja rotativa anti-intrusión).
- Torniquete Horizontal 2 Puertas de Vidrio: $1,650.00 (Control peatonal para lobbies corporativos).
- Torniquete Swing Speed de Cristal: $2,100.00 (Puertas batientes de vidrio templado de alta velocidad).

3. SEGURIDAD PERIMETRAL Y CERCOS ELÉCTRICOS:
- Kit Plata JFL (Cód 15023): $89.00 + IVA (Electrificador JFL, control remoto, batería 12V 4Ah, sirena 20W, letrero peligro).
- Kit Oro JFL (Cód 11207): $109.00 + IVA (Electrificador JFL, control, batería, sirena 20W con caja metálica protectora).
- Kit Platino JFL con App Móvil (Cód 11208): $137.00 + IVA (Electrificador JFL, módulo Ethernet ME-05 para armar/desarmar desde celular, sirena 30W con caja, batería).
- Kit Platino Hagroy i8: $98.00 + IVA (Electrificador Hagroy i8 alto voltaje, control, batería, sirena 20W).
- Kit Hagroy Yanex: $90.00 + IVA (Electrificador Yanex, control, batería, sirena 20W).

4. CÁMARAS DE SEGURIDAD INTELIGENTES (CCTV y Smart Home):
- Cámara Robótica IMOU 360° WiFi: $45.40 + IVA (Full HD 1080p, audio bidireccional, visión nocturna 24/7, alertas a celular, garantía 3 años).
- Cámara IMOU PT Ranger 360° Mini 3MP: $95.00 + IVA (Sensor 3MP nítido, infrarrojo inteligente 30m, audio bidireccional, almacenamiento SD y nube, ¡Envío Gratis!).
- Sistemas CCTV Hikvision y Dahua completos (Kits de 4, 8 y 16 cámaras IP / HD).

5. SEGURIDAD COMERCIAL ANTIHURTO Y SALIDAS DE EMERGENCIA:
- Par de Antenas de Seguridad RF Mono Dahua Mercury (ANT-RS5003TR): $499.96 + IVA (Detección antihurto: 70cm etiquetas / 95cm tags duros. Tubo de alta resistencia. Ideal para boutiques, farmacias y minimarkets).
- Cerradura Barra Antipánico Reforzada Marca Americana: $98.00 + IVA (Acero inoxidable certificado para salidas de emergencia en edificios, centros comerciales, hospitales. 10 años durabilidad, ¡Envío Gratis!).

6. TECNOLOGÍA GLOBAL Y COMPUTACIÓN:
- Más de 9,000 productos en catálogo: Smartphones de alta gama (Honor Magic 7, etc.), Laptops y repuestos, UPS y respaldo eléctrico Powest/APC, Domótica y cerraduras digitales inteligentes.
- Tienda y catálogo completo en línea: https://atomiccotizador.shop/web
- Envíos a todo el Ecuador con entrega rápida y garantía oficial.
`;

const STOP_WORDS = new Set([
  'hola', 'buenas', 'buenos', 'tardes', 'dias', 'noches', 'precio', 'precios', 
  'tienen', 'costo', 'cotizar', 'amigo', 'para', 'cuanto', 'vale', 'quiero', 
  'necesito', 'busco', 'con', 'una', 'uno', 'unos', 'unas', 'casa', 'empresa', 
  'oficina', 'local', 'favor', 'informacion', 'info', 'gracias', 'mas', 'menos'
]);

const SYNONYMS: Record<string, string[]> = {
  'torniquete': ['torniquete', 'molinete', 'ts1000', 'fbl4000', 'fht2300'],
  'torniquetes': ['torniquete', 'molinete', 'ts1000', 'fbl4000', 'fht2300'],
  'timbre': ['videoportero', 'portero', 'kocom', 'ds-kis212'],
  'citofono': ['citofono', 'citofonía', 'kocom', 'collective'],
  'citofonos': ['citofono', 'citofonía', 'kocom', 'collective'],
  'videoportero': ['videoportero', 'kocom', 'hikvision', 'collective'],
  'videoporteros': ['videoportero', 'kocom', 'hikvision', 'collective'],
  'camara': ['imou', 'hikvision', 'ranger', '1080p'],
  'camaras': ['imou', 'hikvision', 'ranger', '1080p'],
  'cámara': ['imou', 'hikvision', 'ranger', '1080p'],
  'cámaras': ['imou', 'hikvision', 'ranger', '1080p'],
  'cerco': ['cerco', 'jfl', 'hagroy', 'electrificador'],
  'cercos': ['cerco', 'jfl', 'hagroy', 'electrificador'],
  'barra': ['antipanico', 'panico'],
  'antipanico': ['antipanico', 'barra', 'emergencia'],
  'antipánico': ['antipanico', 'barra', 'emergencia'],
  'biometrico': ['senseface', 'zkteco', 'facial'],
  'biométrico': ['senseface', 'zkteco', 'facial'],
  'antena': ['mercury', 'antihurto', 'rf mono', 'dahua'],
  'antenas': ['mercury', 'antihurto', 'rf mono', 'dahua'],
  'antihurto': ['mercury', 'antihurto', 'rf mono']
};

async function searchLiveProducts(text: string) {
    const rawWords = text.toLowerCase().replace(/[^a-záéíóúüñ0-9\s]/gi, '').split(/\s+/).filter(w => w.length > 2);
    const keywords: string[] = [];

    for (const w of rawWords) {
        if (STOP_WORDS.has(w)) continue;
        if (SYNONYMS[w]) {
            keywords.push(...SYNONYMS[w]);
        } else {
            keywords.push(w);
        }
    }

    const uniqueKeywords = Array.from(new Set(keywords));
    if (uniqueKeywords.length === 0) return [];

    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                price: { gt: 5 },
                OR: uniqueKeywords.map(term => ({
                    name: { contains: term, mode: 'insensitive' }
                }))
            },
            take: 6,
            orderBy: { price: 'desc' },
            select: {
                id: true,
                sku: true,
                name: true,
                price: true,
                stock: true,
                description: true
            }
        });
        return products;
    } catch (e) {
        return [];
    }
}

/**
 * Motor Autónomo de Inteligencia Artificial para WhatsApp Cloud API
 * Asesor Comercial Senior Consultivo + Reclutamiento de Talento
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

        // 1. Historial reciente para contexto
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
            // === MUNDO COMERCIAL: ASESOR CONSULTIVO EXPERTO DE VENTAS ===
            const dbProducts = await searchLiveProducts(messageText);
            let liveInventorySnippet = "";

            if (dbProducts.length > 0) {
                liveInventorySnippet = `
PRODUCTOS DESTACADOS ENCONTRADOS EN LA BASE DE DATOS:
${dbProducts.map(p => `- ${p.name} (SKU: ${p.sku || 'N/A'}) | Precio: $${p.price.toFixed(2)} USD | Stock: ${p.stock} | Link: https://atomiccotizador.shop/web/product/${p.id}`).join('\n')}
`;
            }

            systemPrompt = `
Eres el Asesor Comercial Senior de ATOMIC Electronics Ecuador (también conocidos como ATOMIC Industrias).
Eres un profesional de ventas consultivo de élite: sumamente conocedor de todo nuestro catálogo, educado, empático, directo, persuasivo y con excelente cierre comercial.

${CATALOGO_MAESTRO_ATOMIC}

${liveInventorySnippet}

METODOLOGÍA DE VENTA CONSULTIVA Y REGLAS DE ORO:
1. DEMUESTRA CONOCIMIENTO TOTAL DE INMEDIATO:
   - Si el cliente saluda o pregunta de forma general ("Hola", "Buenas tardes", "¿Qué venden?", "Busco seguridad"):
     * Salúdalo con calidez y energía.
     * Cuéntale de forma breve y atractiva qué tenemos en ATOMIC (Videoporteros/citofonía para casas y edificios, Control de acceso/torniquetes ZKTeco, Cercos eléctricos JFL/Hagroy, Cámaras inteligentes IMOU/Hikvision, Antenas antihurto y Barras antipánico).
     * Haz la primera pregunta consultiva natural: "¿Para qué tipo de espacio o proyecto lo estás buscando? (¿Una casa, un edificio/conjunto residencial, un local comercial o una empresa?)"

2. DESCUBRIMIENTO PROGRESIVO (NO AGRESIVO):
   - Nunca hagas un interrogatorio pesado. Pregunta 1 o máximo 2 detalles clave por mensaje de forma conversacional:
     a) NECESIDAD EXACTA: ¿Qué espacio buscan proteger o equipar? (¿Cuántos departamentos, cuántas puertas, qué quieren resolver?).
     b) UBICACIÓN: "¿En qué ciudad o provincia te encuentras para confirmarte el tiempo de despacho e instalación?".
     c) PRESUPUESTO / ENFOQUE: "¿Tienes en mente un modelo específico o un presupuesto aproximado para recomendarte la alternativa que mejor se ajuste?".

3. RECOMIENDA Y DA SUGERENCIAS CON ARGUMENTOS DE VALOR:
   - Sé proactivo: no esperes a que el cliente adivine. Si te da una pista, sugiérele la solución exacta:
     * Si es conjunto o edificio: recomiéndale la Central Intelbras Collective o Citofonía Kocom, explicando que es estable y desvía llamadas a celulares.
     * Si es tienda o boutique con pérdidas: recomiéndale las Antenas Antihurto RF Dahua ($499.96) que detectan etiquetas blandas y tags duros.
     * Si es casa o departamento: recomiéndale el Videoportero de 2 Pantallas ($285 con envío gratis) o la Cámara IMOU 360° ($45.40).
     * Si es control de personal u oficina: recomiéndale el ZKTeco SenseFace 2A ($175) con reconocimiento facial y WiFi.
     * Si es control de acceso masivo: recomiéndale nuestros torniquetes peatonales ZKTeco.

4. ESTILO DE COMUNICACIÓN EN WHATSAPP:
   - Respuestas directas, ágiles y eficaces (evita bloques enormes de texto).
   - Usa párrafos cortos (2 a 3 líneas), viñetas limpias y emojis sobrios (🏢, 🔒, 📦, 📲, ✅).
   - Precios claros en dólares americanos ($USD).
   - Recuerda que hacemos envíos a todo el Ecuador y brindamos asesoría técnica.
   - Termina SIEMPRE con una pregunta abierta o un llamado a la acción concreto (ej: "¿Te preparo una cotización formal detallada en PDF o prefieres ver las fotos y ficha técnica?").
`;
        }

        // 3. Consulta a NVIDIA Llama-3.2-90B Vision
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
                max_tokens: 380
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
            try {
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
            } catch (sendErr: any) {
                const errMsg = sendErr?.response?.data?.error?.message || sendErr.message || 'Error al entregar por WhatsApp';
                console.error(`[BOT_SEND_FAILED] Recipiente: ${whatsappId}. Detalle:`, errMsg);

                // Registrar en BD el mensaje fallido con su causa exacta para que el admin lo vea en CRM
                await prisma.wAMessage.create({
                    data: {
                        conversationId,
                        whatsappMessageId: `bot-failed-${Date.now()}`,
                        direction: 'OUTBOUND',
                        type: 'text',
                        body: `⚠️ [ERROR DE ENVÍO META]: ${botReply}\n\nMotivo del fallo: ${errMsg}`,
                        status: 'FAILED',
                        errorMessage: errMsg,
                        senderId: 'BOT_NEMOTRON_90B'
                    }
                }).catch(() => {});
            }
        }

        return botReply;
    } catch (error: any) {
        const errorDetail = error.response?.data || error.message;
        console.error('[BOT_PROCESSING_ERROR]', errorDetail);

        try {
            await prisma.wAMessage.create({
                data: {
                    conversationId: params.conversationId,
                    whatsappMessageId: `bot-err-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: 'text',
                    body: `⚠️ [FALLO DE IA / PROCESO]: No se pudo procesar la respuesta automática.`,
                    status: 'FAILED',
                    errorMessage: String(errorDetail),
                    senderId: 'BOT_SYSTEM'
                }
            });
        } catch (_) {}

        return null;
    }
}
