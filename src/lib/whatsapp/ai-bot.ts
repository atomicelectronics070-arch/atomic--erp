import axios from 'axios';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage, sendWhatsAppMedia } from '@/lib/whatsapp/service';
import { formatRetryMetadata } from '@/lib/whatsapp/auto-retry';
import { detectArticleAndCategory } from '@/lib/whatsapp/pauta-assets';
import { processConversationalBotMessage } from '@/lib/bot/botBrain';
import { 
    isJuan, 
    processJuanCommand, 
    karenState, 
    notifyJuanIncomingBurst, 
    notifyJuanHotOpportunity, 
    notifyJuanUncatalogedChat 
} from '@/lib/karen/karenBrain';

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
- Catálogo web oficial: https://atomiccotizador.shop/web/cercos-electricos
- Foto de pauta oficial: /images/cercos/kits-cercos-electricos-pauta.jpg
- Kit Plata JFL (Cód 15023): $89.00 + IVA (Electrificador JFL, control remoto, batería 12V 4Ah, sirena 20W, letrero peligro).
- Kit Oro JFL (Cód 11207): $109.00 + IVA (Electrificador JFL, control, batería, sirena 20W con caja metálica protectora).
- Kit Platino JFL con App Móvil (Cód 11208): $137.00 + IVA (Electrificador JFL, módulo Ethernet ME-05 para armar/desarmar desde celular con notificaciones, sirena 30W con caja, batería 12V 4Ah, control, letrero).
- Kit Platino Hagroy i8 (Cód 15083): $98.00 + IVA (Electrificador Hagroy i8 alto voltaje, control, batería 12V 4Ah, letrero, sirena 20W).
- Kit Hagroy Yanex (Cód 11258): $90.00 + IVA (Electrificador Yanex, control, batería 12V 4Ah, letrero, sirena 20W).
- AVISO OBLIGATORIO: El precio de materiales (alambrado, postes, aisladores) y mano de obra de instalación NO está incluido en el valor del kit electrificador.
- VISITA TÉCNICA: Quito (centro, norte, sur) GRATIS. Valles $25-$45. Provincia $50-$100.

4. CÁMARAS DE SEGURIDAD PARA EL HOGAR Y FAMILIA (100% Wi-Fi Interiores):
- Catálogo web oficial: https://atomiccotizador.shop/web/camaras-hogar
- Fotos oficiales disponibles: IMOU Ranger (10899), IMOU Mini PT Color (13067), Doble Lente 360° (21045), EZVIZ H6C.
- Enfoque: Amas de casa, mamás, cuidado de bebés/niños, mascotas y adultos mayores.
- Características clave: 100% Wi-Fi, audio bidireccional (habla y escucha desde el celular), visión nocturna, modo privacidad con 1 toque en app, sin mensualidades.
- 1. IMOU Ranger 360° 3MP (Cód 10899): $35.80 + IVA (La opción más accesible y querida. Cobertura panorámica 360°, detección humana IA, modo privado, audio 2 vías).
- 2. IMOU Mini PT Ranger 360° 3MP Full Color (Cód 13067): $39.10 + IVA (¡NUEVA! Visión nocturna a todo color con focos cálidos, sirena disuasiva activa, detección humana IA).
- 3. Cámara Robótica Doble Lente 360° (Cód 21045): $42.50 + IVA (Doble cámara simultánea: un lente fijo a la puerta/cuna + un lente giratorio 360°, sin puntos ciegos).
- 4. EZVIZ H6C 3MP Panorámica (Cód H6C-3MP): $43.99 + IVA (Seguimiento automático de movimiento, modo suspensión, audio bidireccional, ¡Envío Gratis a todo el país!).
- Accesorios opcionales: Tarjeta MicroSD Kingston Original 64GB ($11.50) o 128GB ($18.00) para semanas de grabación continua.
- Facilidad: Plug & Play fácil en 2 minutos (no requiere técnico obligatorio, pero si el cliente desea instalación técnica en pared/techo se puede coordinar).

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

        // A. Verificar si el remitente es Juan (Administrador / Dueño) interactuando con Karen
        if (isJuan(whatsappId)) {
            const karenReply = await processJuanCommand(messageText, conversationId);
            await sendWhatsAppMessage(whatsappId, karenReply);
            await prisma.wAMessage.create({
                data: {
                    conversationId,
                    whatsappMessageId: `karen-juan-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: 'text',
                    body: karenReply,
                    status: 'SENT',
                    senderId: 'KAREN_CHIEF_DIRECT'
                }
            });
            console.log(`[KAREN_JUAN_INTERACTION] Karen respondió comando a Juan en WhatsApp`);
            return karenReply;
        }

        // Registrar timestamp de actividad entrante para control de inactividad de Karen
        karenState.lastIncomingAt = Date.now();

        // B. Verificar si Karen puso el sistema en MODO MANUAL (🔴) o si este chat específico está en MODO MANUAL por asesor
        if (karenState.mode === "MANUAL") {
            console.log(`[KAREN_MANUAL_MODE] WhatsApp en modo manual global: se omite respuesta automática para ${whatsappId}`);
            return null;
        }

        const currentConv = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: { tags: true }
        });

        if (currentConv?.status === 'MANUAL' || currentConv?.tags?.some(t => t.name === 'BOT_OFF')) {
            console.log(`[BOT_MUTED_CHAT] Chat ${conversationId} silenciado: atención 100% manual por asesor.`);
            return null;
        }

        // C. Interceptar flujos conversacionales de Registro y Cotizador 1111 con botBrain
        const brainRes = await processConversationalBotMessage(messageText, {
            senderId: whatsappId,
            senderName: contactName,
            channel: 'WHATSAPP'
        });

        if (brainRes.handled) {
            // Marcar conversación explícitamente como AUTO_REGISTER para el tercer apartado del CRM
            await prisma.wAConversation.update({
                where: { id: conversationId },
                data: { status: 'AUTO_REGISTER', priority: 'HIGH' }
            }).catch(() => {});

            karenState.burstCounters.autoRegister++;
            notifyJuanIncomingBurst().catch(() => {});

            await sendWhatsAppMessage(whatsappId, brainRes.replyText);
            await prisma.wAMessage.create({
                data: {
                    conversationId,
                    whatsappMessageId: `bot-brain-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: 'text',
                    body: brainRes.replyText,
                    status: 'SENT',
                    senderId: 'BOT_ATOMIC_BRAIN'
                }
            });
            console.log(`[BOT_BRAIN_WHATSAPP_SUCCESS] Respondió flujo conversacional a ${whatsappId}`);
            return brainRes.replyText;
        }

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
            karenState.burstCounters.recruitment++;
            notifyJuanIncomingBurst().catch(() => {});

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
            const isCommercial = 
                textLower.includes('precio') || 
                textLower.includes('cuanto') || 
                textLower.includes('cuánto') || 
                textLower.includes('cotiz') || 
                textLower.includes('compr') || 
                textLower.includes('vend') || 
                textLower.includes('proforma') || 
                textLower.includes('camara') || 
                textLower.includes('cámara') || 
                textLower.includes('portero') || 
                textLower.includes('torniquet') || 
                textLower.includes('citofon') || 
                textLower.includes('cerco') || 
                textLower.includes('antena') || 
                textLower.includes('seguridad') || 
                textLower.includes('hola') || 
                textLower.includes('buenas') || 
                textLower.includes('catalogo') || 
                textLower.includes('catálogo') ||
                textLower.includes('info');

            if (isCommercial) {
                karenState.burstCounters.sales++;
                const isHotOpportunity = 
                    textLower.includes('torniquet') || 
                    textLower.includes('molinete') || 
                    textLower.includes('collective') || 
                    textLower.includes('edificio') || 
                    textLower.includes('conjunto') || 
                    textLower.includes('antihurto') || 
                    textLower.includes('biometric') || 
                    textLower.includes('mayorista');

                if (isHotOpportunity) {
                    notifyJuanHotOpportunity(contactName, whatsappId, messageText).catch(() => {});
                }
                notifyJuanIncomingBurst().catch(() => {});
            } else {
                karenState.burstCounters.uncataloged++;
                notifyJuanUncatalogedChat(contactName, whatsappId, messageText, conversationId).catch(() => {});
                notifyJuanIncomingBurst().catch(() => {});
            }

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
   - Termina SIEMPRE con una pregunta abierta o un llamado a la acción concreto.

5. PROTOCOLO OBLIGATORIO PARA CERCOS ELÉCTRICOS (CUADERNO OFICIAL DE VENTAS ATOMIC):
   Siempre que el cliente pregunte por cercos eléctricos, electrificadores, o kits de pauta, DEBES seguir estrictamente esta estructura:

   A) SALUDO DE CONEXIÓN OBLIGATORIO:
      Inicia diciendo: "Hola un gusto, somos Atomic, cuéntame más cómo podemos ayudar." (si se dispone del nombre del cliente: "Hola un gusto ${contactName}, somos Atomic, cuéntame más cómo podemos ayudar.").

   B) DIFERENCIACIÓN OBLIGATORIA: SERVICIO (INSTALACIÓN/OBRA) vs PRODUCTO (KITS ELECTRIFICADORES):
      - Si el cliente pregunta por INSTALACIÓN, VISITA TÉCNICA, SERVICIO, o CERCO COMPLETO CON MANO DE OBRA:
        Ofrece la visita técnica con un técnico especialista para evaluar dificultad y cotizar:
        "Claro, tenemos modelos con instalación. Si gusta podemos enviarle un técnico para que le ayude con una visita técnica para asesoría, precios y ver la dificultad de la instalación.
        Por favor envíenos su ubicación para verificar la zona de cobertura de nuestra visita técnica:
        • En Quito (centro, centro norte, centro sur): Sin costo (gratis).
        • En Valles o alrededores de Quito: Entre $25 y $45 según el sector.
        • Fuera de provincia: A convenir entre $50 y $100.
        (Aclarar que también se puede brindar un precio aproximado sin visita si lo prefieren)."

      - Si el cliente pregunta por KITS, PRECIOS, EQUIPOS, FOTOS, o información general de cercos:
        Detalla los 5 kits oficiales:
        ⚡ Kit Plata JFL (Cód 15023): $89.00 + IVA (Electrificador JFL, Control remoto, Batería 12V-4A, Letrero peligro, Sirena 20W).
        ⚡ Kit Oro JFL (Cód 11207): $109.00 + IVA (Electrificador JFL, Control remoto, Batería 12V-4A, Letrero, Sirena 20W, Caja metálica de protección para sirena).
        📱 Kit Platino JFL con App Celular (Cód 11208): $137.00 + IVA (Electrificador JFL, Módulo Ethernet ME-05 para armar/desarmar desde smartphone con alertas en tiempo real, Sirena 30W con caja metálica, Batería 12V-4A, Control, Letrero).
        ⚡ Kit Platino Hagroy i8 (Cód 15083): $98.00 + IVA (Electrificador Hagroy i8 alto voltaje, Control, Batería 12V-4A, Letrero, Sirena 20W).
        ⚡ Kit Yanex (Cód 11258): $90.00 + IVA (Electrificador Hagroy Yanex, Control, Batería 12V-4A, Letrero, Sirena 20W).

        * ADVERTENCIA OBLIGATORIA (MANDATORIA, NUNCA OMITIR):
        "⚠️ Nota importante: El precio de materiales (alambrado, postes, aisladores) y mano de obra de instalación NO está incluido en el valor del kit electrificador."

        * ENLACE OFICIAL:
        "🌐 Opciones y especificaciones en nuestra página web: https://atomiccotizador.shop/web/cercos-electricos"

   C) CIERRE COMERCIAL:
      - Pregunta la ubicación (sector o ciudad) para coordinar entrega o confirmar si aplica visita técnica sin costo.
      - Ofrece entrega a domicilio con pago contraentrega o retiro en oficina.
      - Si pide cotización formal: solicita Nombres/RUC, Razón Social y Correo electrónico.
      - Si confirma compra directa: solicita Nombre, Apellido, Dirección exacta, Teléfono y Cédula.

6. PROTOCOLO OBLIGATORIO PARA CÁMARAS DE SEGURIDAD PARA EL HOGAR (ESTRUCTURA DE VENTAS CONSULTIVAS):
   Siempre que el cliente pregunte por cámaras de seguridad, cámaras para el hogar, cuidar al bebé, niños, mascotas o pauta de cámaras interiores, DEBES seguir estrictamente esta estructura:

   A) SALUDO DE CONEXIÓN OBLIGATORIO:
      Inicia diciendo: "Hola un gusto, somos Atomic, cuéntame más cómo podemos ayudar." (o "Hola un gusto ${contactName}, somos Atomic, cuéntame más cómo podemos ayudar.").

   B) DESCUBRIMIENTO EMPÁTICO DEL HOGAR:
      - Pregunta con calidez y cercanía qué espacio o a quién desea cuidar: "¿Para qué espacio de tu casa la necesitas? (¿Para cuidar a tu bebé o niños pequeños, acompañar a un adulto mayor, vigilar a tus mascotas o seguridad general de la casa?)".
      - Resalta que son cámaras 100% Wi-Fi, muy fáciles de instalar en 2 minutos (Plug & Play enchufándolas a la corriente) y con aplicación gratuita en tu celular en español sin pagos mensuales.

   C) LAS 4 OPCIONES OFICIALES DISPONIBLES:
      Presenta las 4 alternativas con precios claros y transparentes:
      1. 💡 *IMOU Ranger 360° 3MP (Cód 10899):* $35.80 + IVA
         (La opción más económica y querida por familias. Cobertura panorámica 360°, detección humana inteligente que no se activa con sombras, audio bidireccional para hablar y escuchar, y modo privado que oculta la lente).
      2. 🌟 *IMOU Mini PT Ranger 360° 3MP Full Color (Cód 13067 - ¡NUEVA!):* $39.10 + IVA
         (Visión nocturna a TODO COLOR en la oscuridad, sirena disuasiva activa integrada, detección humana por IA y rotación 360°).
      3. 🛡️ *Cámara Robótica Inteligente Doble Lente 360° (Cód 21045):* $42.50 + IVA
         (Doble cámara en una sola: un lente fijo enfocado a la puerta/cuna y un lente giratorio 360° que sigue el movimiento en pantalla dividida en tu celular).
      4. 🚚 *EZVIZ H6C 3MP Panorámica 360° (Oficial ATOMIC):* $43.99 + IVA
         (Seguimiento inteligente automático de personas, modo suspensión de privacidad, audio bidireccional y ¡ENVÍO GRATIS a todo el Ecuador!).

   D) ACLARACIONES IMPORTANTES:
      - Memoria opcional: Puedes añadir tarjeta MicroSD Kingston Original de 64GB ($11.50) o 128GB ($18.00) para grabar semanas sin pagar nube.
      - Enlace a la página web:
        "🌐 Puedes ver las fotos y opciones para cada espacio en nuestra página: https://atomiccotizador.shop/web/camaras-hogar"

   E) CIERRE COMERCIAL:
      - Pregunta en qué ciudad o sector se encuentra para coordinar el despacho o retiro.
      - Recuerda ofrecer pago contraentrega a domicilio o retiro en oficina.
`;
        }

/**
 * Generador de respuesta de contingencia inteligente de alta fidelidad.
 * Garantiza que NINGÚN chat quede muerto o sin respuesta si la API de IA externa tiene problemas.
 */
function generateExpertConsultantFallback(messageText: string, contactName: string, isRecruitment: boolean): string {
    const textLower = (messageText || '').toLowerCase();
    const namePart = contactName && contactName !== 'Cliente WhatsApp' ? ` ${contactName}` : '';

    if (isRecruitment) {
        return `¡Hola${namePart}! 👋 Qué gusto saludarte. Tu postulación para Asesor Comercial en ATOMIC Electronics ha sido recibida con éxito. 🚀\n\nPuedes revisar todos los detalles del Plan Laboral de 30 días aquí:\n👉 ${HR_PAGE_LINK}\n\nY únete de inmediato a nuestro grupo oficial de bienvenida e inducción en WhatsApp:\n📲 ${HR_GROUP_LINK}\n\nUna vez dentro, tu coordinadora asignada se pondrá en contacto contigo para explicarte el paso a paso y resolver cualquier duda. ¡Bienvenido al equipo! 💼✨`;
    }

    if (textLower.includes('torniquet') || textLower.includes('molinete') || textLower.includes('ts1000') || textLower.includes('fbl4000') || textLower.includes('fht2300')) {
        return `¡Hola${namePart}! 👋 En ATOMIC Electronics somos distribuidores autorizados de torniquetes peatonales ZKTeco en Ecuador:\n\n🔹 *Torniquete Trípode TS1000 Pro:* $720 USD (Acero inoxidable 304 de alta durabilidad)\n🔹 *Torniquete Flap Barrier FBL4000 Pro:* $1,850 USD (Aletas retráctiles de lujo)\n🔹 *Molinete Cuerpo Entero FHT2300:* $2,950 USD (Máxima seguridad anti-intrusión)\n\n¿Para qué tipo de espacio o empresa lo necesitas (oficina, gimnasio, industria o edificio corporativo)? Con gusto te comparto la ficha técnica completa. 📋🔒`;
    }

    if (textLower.includes('portero') || textLower.includes('videoportero') || textLower.includes('citofon') || textLower.includes('collective') || textLower.includes('kocom')) {
        return `¡Hola${namePart}! 👋 Con mucho gusto te asesoramos con nuestros sistemas de videoporteros y citofonía para residencias y edificios:\n\n🏠 *Kit Residencial 2 Pantallas HD:* $285.00 USD (Frente exterior HD + 2 pantallas interiores a color + ¡Envío Gratis!).\n🏢 *Kit Hikvision DS-KIS212:* $92.40 + IVA (Monitor 7", audio nítido y apertura remota).\n🏢 *Centrales Colectivas INTELBRAS (Edificios):* Desde 4 hasta 24 departamentos (desde $104.50 + IVA) con desvío de llamadas a celulares.\n\n¿Para cuántos departamentos o para qué tipo de propiedad lo estás buscando? 📲`;
    }

    if (textLower.includes('cerco') || textLower.includes('jfl') || textLower.includes('hagroy') || textLower.includes('electrificad') || textLower.includes('yanex') || textLower.includes('xpower')) {
        const isAskingInstallation = /instalaci|instalar|servicio|mano de obra|visita|tecnico|t[eé]cnico|obra|puesto/i.test(textLower);

        if (isAskingInstallation) {
            return `Hola un gusto${namePart}, somos Atomic, cuéntame más cómo podemos ayudar.\n\nClaro, disponemos de modelos con instalación. Si gusta podemos enviarle un técnico para que le ayude con una visita técnica para asesoría, verificar la dificultad de la instalación y brindarle los precios exactos.\n\nPor favor indícanos o envíanos tu ubicación para verificar la zona de cobertura de nuestra visita técnica:\n📍 *Quito (centro, centro norte, centro sur):* Visita técnica SIN COSTO (gratis).\n📍 *Valles o alrededores de Quito:* Entre $25 y $45 según el sector.\n📍 *Fuera de provincia:* A convenir entre $50 y $100.\n\n(También si lo prefieres, podemos brindarte un valor referencial aproximado sin necesidad de visita técnica).\n\n¿En qué sector se encuentra tu propiedad para coordinar? 📲`;
        }

        return `Hola un gusto${namePart}, somos Atomic, cuéntame más cómo podemos ayudar.\n\nDisponemos de los siguientes kits oficiales de cercos eléctricos perimetrales con garantía directa:\n\n⚡ *Kit Plata JFL (Cód 15023):* $89.00 + IVA\n(Electrificador JFL, Control remoto, Batería 12V-4A, Letrero peligro, Sirena 20W).\n\n⚡ *Kit Oro JFL (Cód 11207):* $109.00 + IVA\n(Electrificador JFL, Control, Batería 12V-4A, Letrero, Sirena 20W con caja metálica protectora).\n\n📱 *Kit Platino JFL con App Celular (Cód 11208):* $137.00 + IVA\n(Electrificador JFL, Módulo Ethernet ME-05 para armar/desarmar desde smartphone y recibir notificaciones, Sirena 30W con caja metálica, Batería 12V-4A, Control, Letrero).\n\n⚡ *Kit Platino Hagroy i8 (Cód 15083):* $98.00 + IVA\n(Electrificador Hagroy i8 alto voltaje, Control, Batería 12V-4A, Letrero, Sirena 20W).\n\n⚡ *Kit Yanex (Cód 11258):* $90.00 + IVA\n(Electrificador Hagroy Yanex, Control, Batería 12V-4A, Letrero, Sirena 20W).\n\n⚠️ *NOTA IMPORTANTE:* El precio de materiales (alambrado, postes, aisladores) y mano de obra de instalación NO está incluido en el valor del kit electrificador.\n\n🌐 Puedes ver todas las opciones y especificaciones en nuestra página web:\n👉 https://atomiccotizador.shop/web/cercos-electricos\n\n¿En qué sector o ciudad te encuentras para coordinar tu entrega o verificar la cobertura? 📦`;
    }

    if (textLower.includes('camara') || textLower.includes('cámara') || textLower.includes('imou') || textLower.includes('ezviz') || textLower.includes('h6c') || textLower.includes('ranger') || textLower.includes('bebe') || textLower.includes('bebé') || textLower.includes('mascota') || textLower.includes('doble lente')) {
        return `Hola un gusto${namePart}, somos Atomic, cuéntame más cómo podemos ayudar.\n\nDisponemos de 4 opciones oficiales de cámaras inteligentes 100% Wi-Fi para interiores de casa (fáciles de instalar en 2 minutos sin romper paredes y con app en tu celular sin mensualidades):\n\n💡 *1. IMOU Ranger 360° 3MP (Cód 10899):* $35.80 + IVA\n(La opción más económica y querida por familias. Detección humana IA, modo privacidad que cubre la lente, audio 2 vías para hablar y escuchar, visión nocturna).\n\n🌟 *2. IMOU Mini PT Ranger 360° Full Color (Cód 13067 - ¡NUEVA!):* $39.10 + IVA\n(Visión nocturna a TODO COLOR en la oscuridad, sirena disuasiva activa integrada, detección humana IA y rotación 360°).\n\n🛡️ *3. Cámara Robótica Doble Lente 360° (Cód 21045):* $42.50 + IVA\n(Doble cámara simultánea: un lente fijo vigilando la puerta/cuna + un lente giratorio 360° que sigue el movimiento en tu celular).\n\n🚚 *4. EZVIZ H6C 3MP Panorámica 360° (Oficial ATOMIC):* $43.99 + IVA\n(Seguimiento automático de personas, modo suspensión, audio bidireccional y ¡ENVÍO GRATIS a todo el país!).\n\n💾 *Memoria MicroSD opcional:* 64GB ($11.50) o 128GB ($18.00) para semanas de grabación.\n\n🌐 Puedes ver todas las opciones para cada espacio en nuestra página:\n👉 https://atomiccotizador.shop/web/camaras-hogar\n\n¿En qué sector o ciudad te encuentras para coordinar tu entrega o indicarte tiempos de despacho? 📦`;
    }

    if (textLower.includes('biometric') || textLower.includes('biométric') || textLower.includes('senseface') || textLower.includes('facial')) {
        return `¡Hola${namePart}! 👋 El equipo estrella para control de asistencia y acceso es el *ZKTeco SenseFace 2A con Videoportero por App* por solo $175.00 USD:\n\n✨ Reconocimiento facial ultra veloz (menos de 0.3s)\n✨ Lector de huella digital + tarjetas RFID + PIN numérico\n✨ Conexión 100% WiFi y llamada directa a la App móvil\n✨ Apertura de puerta remota para oficinas y departamentos\n\n¿Te gustaría ver un video de cómo funciona o la ficha técnica detallada? 🚀`;
    }

    if (textLower.includes('antena') || textLower.includes('antihurto') || textLower.includes('antipanico') || textLower.includes('antipánico') || textLower.includes('barra')) {
        return `¡Hola${namePart}! 👋 Para seguridad comercial y normativas de emergencia disponemos de:\n\n🚨 *Par Antenas Antihurto RF Mono Dahua Mercury:* $499.96 + IVA (Detección de etiquetas y tags duros, alta resistencia para boutiques, farmacias y minimarkets).\n🚪 *Cerradura Barra Antipánico Reforzada:* $98.00 + IVA (Acero inoxidable certificado para salidas de emergencia con 10 años de durabilidad + ¡Envío Gratis!).\n\n¿Para qué tipo de local comercial o proyecto lo requieres? Con gusto te preparamos la proforma. 📄`;
    }

    return `¡Hola${namePart}! 👋 Qué gusto saludarte. Bienvenido a *ATOMIC Electronics Ecuador*.\n\nSomos especialistas en:\n🔹 Videoporteros y citofonía para casas y edificios\n🔹 Control de acceso y torniquetes peatonales ZKTeco\n🔹 Cercos eléctricos perimetrales JFL y Hagroy\n🔹 Cámaras de seguridad inteligentes IMOU y CCTV\n🔹 Laptops, domótica y más de 9,000 productos con garantía\n\n🛒 Puedes ver todo nuestro catálogo en línea aquí: https://atomiccotizador.shop/web\n\n¿Qué producto o requerimiento te gustaría cotizar hoy? Te respondo de inmediato. 📲`;
}

        // 3. Consulta de IA con Cascada Resiliente (NVIDIA -> DeepSeek/OpenAI -> Consultor Experto Nativo)
        let botReply: string | null = null;

        try {
            // Intento 1 con NVIDIA Llama-3.2-90B Vision
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
                    },
                    timeout: 22000
                }
            );

            botReply = completion.data.choices?.[0]?.message?.content?.trim();
        } catch (nvidiaErr: any) {
            console.warn('[BOT_NVIDIA_UNAVAILABLE] Falló NVIDIA API, activando motor secundario...', nvidiaErr.message);

            // Fallback secundario si existe DeepSeek u OpenAI en entorno
            if (process.env.DEEPSEEK_API_KEY) {
                try {
                    const deepseekRes = await axios.post(
                        "https://api.deepseek.com/v1/chat/completions",
                        {
                            model: "deepseek-chat",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: `Último mensaje recibido de ${contactName}:\n"${messageText}"` }
                            ],
                            temperature: 0.6,
                            max_tokens: 350
                        },
                        {
                            headers: {
                                "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                                "Content-Type": "application/json"
                            },
                            timeout: 15000
                        }
                    );
                    botReply = deepseekRes.data.choices?.[0]?.message?.content?.trim();
                } catch (dsErr: any) {
                    console.warn('[BOT_DEEPSEEK_FAILED]', dsErr.message);
                }
            }

            // Fallback Maestro Determinista: Si ninguna API externa responde, NUNCA dejar el chat muerto
            if (!botReply) {
                console.log('[BOT_ENGAGING_RESILIENT_CONSULTANT] Empleando respuesta de consultor experto nativo.');
                botReply = generateExpertConsultantFallback(messageText, contactName, isRecruitment);
            }
        }

        if (botReply) {
            // Detección autónoma: Si el cliente solicita fotos o si es consulta sobre cercos eléctricos o cámaras de hogar
            const textLowerForDetection = messageText.toLowerCase();
            const isAskingForVisuals = /foto|fotos|imagen|imagenes|imágenes|cat[aá]logo|modelo|ver|mu[eé]strame/i.test(textLowerForDetection);
            const isCercosInquiry = /cerco|cercos|electrificad|hagroy|jfl|yanex|xpower/i.test(textLowerForDetection);
            const isCamarasInquiry = /camara|c[aá]mara|imou|ezviz|h6c|ranger|bebe|bebé|mascota|doble lente/i.test(textLowerForDetection);
            const detectedAsset = detectArticleAndCategory({ messagesText: messageText });
            
            let targetImagePath: string | null = detectedAsset.imagePath || null;
            let shortCaption = '';

            if (isCercosInquiry || detectedAsset.id === 'cercos-electricos') {
                targetImagePath = '/images/cercos/kits-cercos-electricos-pauta.jpg';
                shortCaption = `⚡ *Kits Oficiales de Cercos Eléctricos ATOMIC* 🛡️\n🌐 Opciones en: https://atomiccotizador.shop/web/cercos-electricos\n⚠️ *Nota:* Materiales y mano de obra NO incluidos en el kit.`;
            } else if (isCamarasInquiry || detectedAsset.id === 'camaras-hogar') {
                if (textLowerForDetection.includes('10899') || textLowerForDetection.includes('ranger 3mp')) {
                    targetImagePath = '/images/camaras/camara-imou-ranger-3mp-10899.jpg';
                } else if (textLowerForDetection.includes('13067') || textLowerForDetection.includes('color') || textLowerForDetection.includes('mini pt')) {
                    targetImagePath = '/images/camaras/camara-imou-mini-pt-fullcolor-13067.jpg';
                } else if (textLowerForDetection.includes('doble') || textLowerForDetection.includes('lente') || textLowerForDetection.includes('21045')) {
                    targetImagePath = '/images/camaras/camara-doble-lente-360-interior.jpg';
                } else {
                    targetImagePath = '/images/camaras/camara-ezviz-h6c-3mp-pauta.jpg';
                }
                shortCaption = `🌸 *Cámaras Inteligentes para el Hogar ATOMIC* 🏡\n🌐 Catálogo y opciones en: https://atomiccotizador.shop/web/camaras-hogar\n📲 Monitoreo en vivo desde tu celular sin cuotas mensuales.`;
            }

            const shouldSendImage = (isAskingForVisuals || isCercosInquiry || isCamarasInquiry || detectedAsset.id === 'cercos-electricos' || detectedAsset.id === 'camaras-hogar') && Boolean(targetImagePath);

            try {
                let sentType = 'text';
                let sentMediaUrl: string | null = null;

                if (shouldSendImage && targetImagePath) {
                    console.log(`[BOT_AUTONOMOUS_IMAGE] Despachando foto oficial para ${whatsappId}: ${targetImagePath}`);
                    
                    // Meta WhatsApp API restringe captions a 1024 caracteres
                    if (botReply.length <= 1000) {
                        await sendWhatsAppMedia(whatsappId, targetImagePath, 'image', botReply);
                        sentType = 'image';
                        sentMediaUrl = targetImagePath;
                    } else {
                        const fallbackCaption = shortCaption || `✨ *Catálogo Oficial ATOMIC*\n🌐 https://atomiccotizador.shop/web`;
                        await sendWhatsAppMedia(whatsappId, targetImagePath, 'image', fallbackCaption);
                        await sendWhatsAppMessage(whatsappId, botReply);
                        sentType = 'image';
                        sentMediaUrl = targetImagePath;
                    }
                } else {
                    // Enviar mensaje por WhatsApp Cloud API con auto-reintentos
                    await sendWhatsAppMessage(whatsappId, botReply);
                }

                // 5. Guardar el mensaje OUTBOUND en la base de datos con status SENT
                await prisma.wAMessage.create({
                    data: {
                        conversationId,
                        whatsappMessageId: `bot-${Date.now()}`,
                        direction: 'OUTBOUND',
                        type: sentType,
                        mediaUrl: sentMediaUrl,
                        body: botReply,
                        status: 'SENT',
                        senderId: 'BOT_ATOMIC_RESILIENT'
                    }
                });

                // Actualizar timestamp de conversación
                await prisma.wAConversation.update({
                    where: { id: conversationId },
                    data: { updatedAt: new Date(), lastMessageAt: new Date() }
                }).catch(() => {});

                console.log(`[BOT_SUCCESS] Respondió automáticamente (${sentType}) de forma resiliente a ${whatsappId}`);
            } catch (sendErr: any) {
                const errMsg = sendErr?.response?.data?.error?.message || sendErr.message || 'Error al entregar por WhatsApp';
                console.error(`[BOT_SEND_FAILED] Recipiente: ${whatsappId}. Detalle:`, errMsg);

                // Registrar en BD con metadatos de reintento inteligente para que el motor de auto-retry lo entregue
                await prisma.wAMessage.create({
                    data: {
                        conversationId,
                        whatsappMessageId: `bot-failed-${Date.now()}`,
                        direction: 'OUTBOUND',
                        type: shouldSendImage ? 'image' : 'text',
                        mediaUrl: shouldSendImage ? detectedAsset.imagePath : null,
                        body: botReply,
                        status: 'FAILED',
                        errorMessage: formatRetryMetadata(0, Date.now() + 15000, errMsg),
                        senderId: 'BOT_ATOMIC_RESILIENT'
                    }
                }).catch(() => {});

                // Marcar la conversación con alta prioridad y estado de atención
                await prisma.wAConversation.update({
                    where: { id: conversationId },
                    data: { priority: 'URGENT', status: 'LEAD_PAUTA' }
                }).catch(() => {});
            }
        }

        return botReply;
    } catch (error: any) {
        const errorDetail = error.response?.data || error.message;
        console.error('[BOT_PROCESSING_ERROR]', errorDetail);

        // Si ocurre una excepción inesperada, enviar la respuesta de emergencia al cliente
        try {
            const emergencyReply = generateExpertConsultantFallback(params.messageText, params.contactName, false);
            await sendWhatsAppMessage(params.whatsappId, emergencyReply);

            await prisma.wAMessage.create({
                data: {
                    conversationId: params.conversationId,
                    whatsappMessageId: `bot-emergency-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: 'text',
                    body: emergencyReply,
                    status: 'SENT',
                    senderId: 'BOT_EMERGENCY_RESCUE'
                }
            });
            console.log(`[BOT_EMERGENCY_SUCCESS] Chat rescatado exitosamente para ${params.whatsappId}`);
            return emergencyReply;
        } catch (rescueErr: any) {
            console.error('[BOT_RESCUE_FAILED]', rescueErr.message);
            return null;
        }
    }
}
