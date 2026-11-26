import axios from 'axios';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage, sendWhatsAppMedia } from '@/lib/whatsapp/service';
import { formatRetryMetadata } from '@/lib/whatsapp/auto-retry';
import { detectArticleAndCategory } from '@/lib/whatsapp/pauta-assets';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
const NVIDIA_MODEL = "meta/llama-3.2-90b-vision-instruct";

const HR_GROUP_LINK = "https://chat.whatsapp.com/EYwCyfg0mF99nmNEhBPCFt";
const HR_PAGE_LINK = "https://atomiccotizador.shop/web/contrataciones";

export type CrmCategoryKey =
    | 'residencial'
    | 'empresarial'
    | 'consolas'
    | 'postulante'
    | 'soporte'
    | 'sin_especificar'
    | 'envios'
    | 'general';

export interface CrmClassificationResult {
    roleType: 'EMPLEO' | 'CLIENTE';
    category: CrmCategoryKey;
}

const CRM_TAG_META: Record<string, { color: string }> = {
    EMPLEO: { color: '#F59E0B' },
    CLIENTE: { color: '#10B981' },
    'CAT:RESIDENCIAL': { color: '#3B82F6' },
    'CAT:EMPRESARIAL': { color: '#6366F1' },
    'CAT:CONSOLAS': { color: '#A855F7' },
    'CAT:POSTULANTE': { color: '#F59E0B' },
    'CAT:SOPORTE': { color: '#EF4444' },
    'CAT:ENVIOS': { color: '#06B6D4' },
    'CAT:SIN_ESPECIFICAR': { color: '#64748B' },
    'CAT:GENERAL': { color: '#0EA5E9' }
};

/**
 * Portafolio conciso oficial de ATOMIC Ecuador para Karen (Asesora Comercial Senior)
 */
const CATALOGO_RESUMIDO_ATOMIC = `
PORTAFOLIO ATOMIC ECUADOR (https://atomiccotizador.shop/web):
1. SEGURIDAD RESIDENCIAL & DOMÓTICA:
   - Cámaras Wi-Fi hogar: IMOU Ranger 360° $35.80 + IVA, IMOU Mini PT Color $39.10 + IVA, Doble Lente 360° $42.50 + IVA, EZVIZ H6C $43.99 + IVA (Envío Gratis). Web: /web/camaras-hogar
   - Cámaras exterior IP66: Wi-Fi $47.82 + IVA, Doble Lente IP81 $63.77 + IVA, Kit NVR $95 + IVA, IMOU Cruiser Triple 11MP $135 + IVA. Web: /web/camaras-exterior
   - Videoporteros: Residencial 2 Pantallas HD $285 (Envío Gratis), Hikvision DS-KIS212 $92.40 + IVA, Kit LCD 10" Antivandálico, Centrales Intelbras edificios (4 a 24 deptos desde $104.50 + IVA), Kocom 3 deptos $149. Web: /web/videoporteros
   - Cercos Eléctricos (solo kit, materiales/mano de obra aparte): JFL Plata $89 + IVA, JFL Oro $109 + IVA, JFL Platino App $137 + IVA, Hagroy i8 $98 + IVA, Yanex $90 + IVA. Visita técnica Quito centro/norte/sur gratis; valles $25-$45; provincias $50-$100. Web: /web/cercos-electricos
   - Cerraduras Smart & Biométricos: ZKTeco SenseFace 2A (facial/huella/App gratis) $175, Portero Multifunción ZKTeco $198.99 + IVA. Web: /web/cerraduras-smart y /web/portero-multifuncion

2. EMPRESAS, ACCESO & FERRETERÍA INDUSTRIAL:
   - Torniquetes ZKTeco: Trípode TS1000 $720, Flap FBL4000 $1,850, Molinete FHT2300 $2,950. Web: /web/torniquetes
   - Barreras Vehiculares Dítec 2027: $1,928.90 + IVA (motor brushless 24V, hasta 6m). Web: /web/barreras-ditec
   - Antenas Antihurto Retail: RF Dual $576 + IVA, Acrílico Crystal $745 + IVA, Dahua Mercury $499.96 + IVA. Barra antipánico $98 + IVA. Web: /web/antenas-antihurto
   - Energía & Respaldo Urbano: Paneles/transferencia ATS, líneas alta capacidad edificios, generadores y mantenimiento preventivo desde $50 (básico) / $180+ (diésel/ATS). Web: /web/generadores y /web/mantenimiento-generadores
   - Ferretería & Acabados: Carros de carga/herramientas hasta 200kg (/web/carros-industriales), planchas mármol PVC desde $27 y paneles WPC $9.09 (/web/paneles-ranurados), plantas bloqueras.

3. DISTRIBUCIÓN MAYORISTA (PAQUETES DESDE 6 UNIDADES + ASESORÍA):
   - Repuestos laptop (pantallas, baterías, cargadores, teclados), Raspberry Pi/placas lógicas/relés, cables, audífonos, drones, mini cámaras espía y electrónica económica masiva. Web: /web/repuestos y /web/precios-vendedor
   - Importación directa verificada multi-país bajo pedido: /web/bajo-pedido

4. ELECTRÓNICA PRO, SOFTWARE IA, HOGAR & ENTRETENIMIENTO:
   - Apple, Samsung, teléfonos, tablets, laptops, mini PCs y servidores TI (/web/apple, /web/laptops, /web/servidores)
   - Software administrativo a medida con Agentes de IA operados por voz o texto (/web/software)
   - Hogar: Encimeras, hornos, campanas, luminarias LED (/web/cocinas, /web/iluminacion)
   - Entretenimiento: Barra Gamer 1 HORA BOC241N $28.90 + IVA, parlantes pro y gama habitual, consolas PS4/PS5/Switch, mini consolas, mandos, drones y cámaras deportivas (/web/barra-de-sonido, /web/consolas, /web/mandos)
`;

const STOP_WORDS = new Set([
    'hola', 'buenas', 'buenos', 'tardes', 'dias', 'días', 'noches', 'precio', 'precios',
    'tienen', 'costo', 'cotizar', 'amigo', 'para', 'cuanto', 'cuánto', 'vale', 'quiero',
    'necesito', 'busco', 'con', 'una', 'uno', 'unos', 'unas', 'casa', 'empresa',
    'oficina', 'local', 'favor', 'informacion', 'información', 'info', 'gracias', 'mas', 'más'
]);

const SYNONYMS: Record<string, string[]> = {
    torniquete: ['torniquete', 'molinete', 'ts1000', 'fbl4000', 'fht2300'],
    torniquetes: ['torniquete', 'molinete', 'ts1000', 'fbl4000', 'fht2300'],
    timbre: ['videoportero', 'portero', 'kocom', 'ds-kis212'],
    citofono: ['citofono', 'citofonía', 'kocom', 'collective'],
    citofonos: ['citofono', 'citofonía', 'kocom', 'collective'],
    videoportero: ['videoportero', 'kocom', 'hikvision', 'collective'],
    videoporteros: ['videoportero', 'kocom', 'hikvision', 'collective'],
    camara: ['imou', 'hikvision', 'ranger', 'ezviz'],
    camaras: ['imou', 'hikvision', 'ranger', 'ezviz'],
    cerco: ['cerco', 'jfl', 'hagroy', 'electrificador'],
    cercos: ['cerco', 'jfl', 'hagroy', 'electrificador'],
    biometrico: ['senseface', 'zkteco', 'facial'],
    antena: ['mercury', 'antihurto', 'rf mono', 'dahua'],
    antihurto: ['mercury', 'antihurto', 'rf mono'],
    parlante: ['parlante', 'boc241n', 'barra', 'sonido'],
    consola: ['playstation', 'ps4', 'ps5', 'nintendo', 'switch', 'consola'],
    mando: ['mando', 'dualsense', 'control']
};

/**
 * Clasifica de forma exacta la conversación en las categorías oficiales del CRM (EMPLEO vs CLIENTE + categoría)
 */
export function classifyMessageForCrm(fullText: string): CrmClassificationResult {
    const cleanText = fullText
        .replace(/\[PAUTA_META:[\s\S]*?\]/g, (m) => m.toLowerCase())
        .toLowerCase()
        .trim();

    const isStrictRecruitment =
        /\b(empleo|vacante|postular|postulacion|postulación|hoja de vida|curriculum|cv|trabajar con ustedes|quiero trabajar|busco trabajo|puesto de trabajo|plan laboral|aspirante|me interesa el puesto|me interesa trabajar|contrataciones)\b/i.test(cleanText) ||
        (/\b(asesor comercial|vendedor|asesor de ventas)\b/i.test(cleanText) && /\b(postular|aplicar|vacante|trabajar|cv|sueldo|comisi[oó]n|interesado)\b/i.test(cleanText)) ||
        (/\b(ingresos extra|trabajo desde casa|teletrabajo|empleo remoto|hay trabajo|hay vacantes|ofrecen trabajo|oferta laboral)\b/i.test(cleanText)) ||
        /^(info empleo|info trabajo|info vacante|info postulaci[oó]n|postulo|me postulo)\.?$/i.test(cleanText) ||
        cleanText.includes('pauta-reclutamiento') ||
        cleanText.includes('convocatoria oficial');

    if (isStrictRecruitment) {
        return { roleType: 'EMPLEO', category: 'postulante' };
    }

    const isGreetingOnly = /^(hola|buenas|buen d[ií]a|buenas tardes|buenas noches|informaci[oó]n|info|saludos|que tal|qu[eé] tal|ayuda|me ayuda|precio|precios|cat[aá]logo|catalogo)\.?$/i.test(cleanText);
    const hasProductSignal = /(c[aá]mara|videoportero|portero|citofon|ditec|barrera|antena|antihurto|torniquet|cerco|generador|laptop|iphone|apple|samsung|tablet|servidor|raspberry|rel[eé]|placa|repuesto|pantalla|parlante|barra|dron|consola|ps4|ps5|nintendo|mando|cocina|encimera|horno|campana|m[aá]rmol|wpc|cerradura|biom[eé]tric|ferreter|herramienta|carro|software|agente|ia\b|mayorista|6 unidades|garant[ií]a|soporte|reparaci[oó]n|falla|env[ií]o|domicilio)/i.test(cleanText);

    if (!cleanText || isGreetingOnly || (cleanText.length < 28 && !hasProductSignal)) {
        return { roleType: 'CLIENTE', category: 'sin_especificar' };
    }

    if (/(playstation|ps4|ps5|xbox|nintendo|switch|consola|consolas|mini consola|mando|mandos|gamepad|videojuego|joystick|joy-con|gamer|parlante|barra de sonido|dron|c[aá]mara deportiva)/i.test(cleanText)) {
        return { roleType: 'CLIENTE', category: 'consolas' };
    }

    if (/(garant[ií]a|da[ñn]o|falla|no funciona|roto|reparaci[oó]n|averiado|soporte|servicio t[eé]cnico|mantenimiento)/i.test(cleanText)) {
        return { roleType: 'CLIENTE', category: 'soporte' };
    }

    if (/(empresa|local|negocio|bodega|oficina|antena|antihurto|torniquete|barrera|ditec|control de acceso|establecimiento|sucursal|mayorista|6 unidades|emprendimiento|distribuci[oó]n|servidor|software|agente ia|ferreter|edificio|alto voltaje|panel de abastecimiento)/i.test(cleanText)) {
        return { roleType: 'CLIENTE', category: 'empresarial' };
    }

    if (/(c[aá]mara|videoportero|portero|citofono|citofon[ií]a|hogar|casa|conjunto|residencial|alarma|cerco|domicilio|apartamento|departamento|cerradura|cocina|encimera|horno|campana|m[aá]rmol|wpc|dom[oó]tica)/i.test(cleanText)) {
        return { roleType: 'CLIENTE', category: 'residencial' };
    }

    if (/(env[ií]o|servientrega|domicilio|quito|guayaquil|cuenca|ambato|machala|manta|portoviejo|loja|ibarra|entrega|sector)/i.test(cleanText)) {
        return { roleType: 'CLIENTE', category: 'envios' };
    }

    return { roleType: 'CLIENTE', category: 'general' };
}

/**
 * Guarda de manera atómica la clasificación (EMPLEO vs CLIENTE y Categoría CRM) en PostgreSQL
 */
async function persistCrmClassification(conversationId: string, classification: CrmClassificationResult) {
    try {
        const categoryTagName = `CAT:${classification.category.toUpperCase()}`;
        const desiredTagNames = [classification.roleType, categoryTagName];

        const existingConv = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: { tags: true }
        });
        if (!existingConv) return;

        // Preservar etiquetas manuales ajenas a clasificación automática, reemplazando solo EMPLEO/CLIENTE y CAT:*
        const staleTagIds = existingConv.tags
            .filter(t => (t.name === 'EMPLEO' || t.name === 'CLIENTE' || t.name.startsWith('CAT:')) && !desiredTagNames.includes(t.name))
            .map(t => ({ id: t.id }));

        const tagRecords = await Promise.all(
            desiredTagNames.map(name =>
                prisma.wATag.upsert({
                    where: { name },
                    update: {},
                    create: {
                        name,
                        color: CRM_TAG_META[name]?.color || '#3B82F6'
                    }
                })
            )
        );

        let nextStatus = existingConv.status;
        if (classification.roleType === 'EMPLEO') {
            nextStatus = 'AUTO_REGISTER';
        } else if (existingConv.status === 'AUTO_REGISTER' || existingConv.status === 'NEW') {
            nextStatus = 'OPEN';
        }

        await prisma.wAConversation.update({
            where: { id: conversationId },
            data: {
                status: nextStatus,
                priority: classification.roleType === 'EMPLEO' || classification.category === 'empresarial' ? 'HIGH' : existingConv.priority,
                tags: {
                    ...(staleTagIds.length > 0 ? { disconnect: staleTagIds } : {}),
                    connect: tagRecords.map(t => ({ id: t.id }))
                }
            }
        });
    } catch (e: any) {
        console.warn('[KAREN_CRM_CLASSIFY_WARN]', e?.message || e);
    }
}

async function searchLiveProducts(text: string) {
    const rawWords = text
        .toLowerCase()
        .replace(/[^a-záéíóúüñ0-9\s]/gi, '')
        .split(/\s+/)
        .filter(w => w.length > 2);

    const keywords: string[] = [];
    for (const w of rawWords) {
        if (STOP_WORDS.has(w)) continue;
        if (SYNONYMS[w]) {
            keywords.push(...SYNONYMS[w]);
        } else {
            keywords.push(w);
        }
    }

    const uniqueKeywords = Array.from(new Set(keywords)).slice(0, 8);
    if (uniqueKeywords.length === 0) return [];

    try {
        return await prisma.product.findMany({
            where: {
                isActive: true,
                price: { gt: 1 },
                OR: uniqueKeywords.map(term => ({
                    name: { contains: term, mode: 'insensitive' }
                }))
            },
            take: 5,
            orderBy: { stock: 'desc' },
            select: {
                id: true,
                sku: true,
                name: true,
                price: true,
                stock: true
            }
        });
    } catch {
        return [];
    }
}

/**
 * Fallback natural, amigable y conciso si las APIs externas de IA no responden
 */
function generateNaturalConsultantFallback(
    messageText: string,
    contactName: string,
    classification: CrmClassificationResult
): string {
    const textLower = (messageText || '').toLowerCase();
    const firstName = contactName && contactName !== 'Cliente WhatsApp' ? contactName.split(' ')[0] : '';
    const greeting = firstName ? `¡Hola ${firstName}!` : '¡Hola!';

    if (classification.roleType === 'EMPLEO') {
        return `${greeting} 👋 Qué gusto saludarte. Recibimos tu interés para postular como *Asesor Comercial en ATOMIC Electronics*.\n\n✅ Tenemos cupos disponibles esta semana. Puedes revisar todo el plan salarial y detalles aquí:\n🌐 ${HR_PAGE_LINK}\n\nY únete directo a nuestro grupo de bienvenida para iniciar tu inducción:\n📲 ${HR_GROUP_LINK}`;
    }

    if (classification.category === 'sin_especificar') {
        return `${greeting} Qué gusto saludarte 👋 Bienvenido a *ATOMIC Electronics Ecuador*.\n\nCuéntame qué estás buscando hoy (cámaras, videoporteros, cercos, cerraduras, laptops, repuestos, audio/consolas o proyectos para tu hogar/negocio) y con mucho gusto te asesoro al instante.`;
    }

    if (textLower.includes('generador') || textLower.includes('mantenimiento')) {
        return `${greeting} ⚡ En *ATOMIC* hacemos mantenimiento preventivo básico desde *$50* (limpieza, aceite y calibración) e industrial/ATS desde *$180*, además de proyectos de respaldo eléctrico.\n\nRevisa detalles en: https://atomiccotizador.shop/web/mantenimiento-generadores\n¿Qué capacidad o modelo de generador tienes para ayudarte?`;
    }

    if (textLower.includes('ditec') || (textLower.includes('barrera') && textLower.includes('vehicular'))) {
        return `${greeting} 🚧 Las *Barreras Vehiculares Dítec Serie 2027* están en *$1,928.90 + IVA* (motor 24V de uso continuo y apertura desde 2s).\n\nPuedes ver la ficha aquí: https://atomiccotizador.shop/web/barreras-ditec\n¿Para cuántas entradas o qué urbanización/empresa la necesitas?`;
    }

    if (textLower.includes('antena') || textLower.includes('antihurto')) {
        return `${greeting} 🚨 Para proteger tu local disponemos de *Antenas Antihurto RF* desde *$499.96 + IVA* (Dahua Mercury), *$576 + IVA* (Dual Estándar) y *$745 + IVA* (Crystal transparente).\n\nCatálogo: https://atomiccotizador.shop/web/antenas-antihurto\n¿Cuántos metros mide la entrada de tu local?`;
    }

    if (textLower.includes('torniquet') || textLower.includes('molinete')) {
        return `${greeting} 🔒 Trabajamos torniquetes *ZKTeco* con garantía oficial:\n• Trípode TS1000 Pro: *$720*\n• Flap Barrier FBL4000: *$1,850*\n• Molinete FHT2300: *$2,950*\n\n¿Es para oficina, gimnasio o acceso corporativo?`;
    }

    if (textLower.includes('cerco') || textLower.includes('jfl') || textLower.includes('hagroy')) {
        return `${greeting} ⚡ En cercos eléctricos tenemos kits desde *$89 + IVA* (JFL Plata), *$90 + IVA* (Hagroy Yanex), *$98 + IVA* (Hagroy i8) y *$137 + IVA* (JFL Platino con App). *(No incluye materiales ni mano de obra).* \n\nOpciones aquí: https://atomiccotizador.shop/web/cercos-electricos\n¿Necesitas solo el kit o también visita técnica?`;
    }

    if (textLower.includes('videoportero') || textLower.includes('portero') || textLower.includes('citofon')) {
        return `${greeting} 🚪 Tenemos desde el *Kit Hikvision DS-KIS212* (*$92.40 + IVA*), el *Kit Residencial 2 Pantallas HD* (*$285* con envío gratis), el *Portero Biométrico ZKTeco App* (*$198.99 + IVA*) y centrales *Intelbras Collective* para edificios desde *$104.50 + IVA*.\n\nVer modelos: https://atomiccotizador.shop/web/videoporteros\n¿Lo buscas para casa o edificio?`;
    }

    if (textLower.includes('camara') || textLower.includes('cámara') || textLower.includes('imou') || textLower.includes('ezviz')) {
        return `${greeting} 📹 En cámaras Wi-Fi para hogar tenemos desde la *IMOU Ranger 360°* (*$35.80 + IVA*), *Mini PT Full Color* (*$39.10 + IVA*) y *EZVIZ H6C* (*$43.99 + IVA* envío gratis); y para exterior IP66 desde *$47.82 + IVA*.\n\nOpciones: https://atomiccotizador.shop/web/camaras-hogar\n¿Las necesitas para interior o exterior y en qué ciudad te encuentras?`;
    }

    if (textLower.includes('mayorista') || textLower.includes('6 unidades') || textLower.includes('distribu')) {
        return `${greeting} 📦 Contamos con plan de distribución desde *paquetes de 6 unidades* en cables, audífonos, drones, mini cámaras espía, repuestos de laptop y electrónica técnica (Raspberry, placas, relés).\n\nPortal de precios: https://atomiccotizador.shop/web/precios-vendedor\n¿Qué línea te gustaría distribuir para enviarte opciones y asesoría?`;
    }

    return `${greeting} Con mucho gusto te ayudo en *ATOMIC Electronics Ecuador* 😊\n\nPuedes revisar nuestro catálogo completo con precios actualizados aquí:\n🌐 https://atomiccotizador.shop/web\n\n¿Qué producto o solución específica te gustaría cotizar y para qué ciudad sería el envío?`;
}

export async function handleIncomingWhatsAppBot(params: {
    whatsappId: string;
    contactName: string;
    messageText: string;
    mediaUrl?: string | null;
    conversationId: string;
}) {
    try {
        const { whatsappId, contactName, messageText, conversationId } = params;

        // Respetar exclusivamente si un asesor tomó el chat manualmente en el CRM
        const currentConv = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: { tags: true }
        });

        if (currentConv?.status === 'MANUAL' || currentConv?.tags?.some(t => t.name === 'BOT_OFF')) {
            console.log(`[BOT_MUTED_CHAT] Chat ${conversationId} silenciado manualmente por asesor.`);
            return null;
        }

        // 1. Historial reciente para contexto natural
        const recentMessages = await prisma.wAMessage.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'desc' },
            take: 6
        });

        const historyLines = recentMessages
            .slice()
            .reverse()
            .map(m => `${m.direction === 'INBOUND' ? 'Contacto' : 'Karen ATOMIC'}: ${m.body}`);

        // 2. Identificar y persistir en CRM si es EMPLEO o CLIENTE + categoría CRM exacta
        const recentInboundCombined = recentMessages
            .filter(m => m.direction === 'INBOUND')
            .map(m => m.body)
            .join(' ');
        const classification = classifyMessageForCrm(`${recentInboundCombined} ${messageText}`);
        await persistCrmClassification(conversationId, classification);

        // 3. Buscar productos vivos relacionados si es cliente
        const dbProducts = classification.roleType === 'CLIENTE'
            ? await searchLiveProducts(messageText)
            : [];

        const liveInventorySnippet = dbProducts.length > 0
            ? `\nPRODUCTOS EN STOCK EN BASE DE DATOS:\n${dbProducts
                  .map(p => `- ${p.name} | $${p.price.toFixed(2)} USD | Stock: ${p.stock} | https://atomiccotizador.shop/web/product/${p.id}`)
                  .join('\n')}`
            : '';

        const firstName = contactName && contactName !== 'Cliente WhatsApp' ? contactName.split(' ')[0] : '';

        const systemPrompt =
            classification.roleType === 'EMPLEO'
                ? `Eres Karen, asistente de ATOMIC Electronics Ecuador. Acabas de detectar que quien escribe busca EMPLEO / postular como asesor comercial.
TU ESTILO: Muy natural, amigable, directo y BREVE (máximo 5 líneas cortas). Sin rodeos ni discursos largos.
DATOS OFICIALES A DAR:
- Saluda amablemente${firstName ? ` a ${firstName}` : ''} y confirma que hay cupos activos esta semana.
- Enlace con toda la info del plan salarial: ${HR_PAGE_LINK}
- Enlace al grupo oficial de bienvenida: ${HR_GROUP_LINK}
- Dile brevemente que ahí le asignarán línea de productos y guía inicial.
NO inventes otros precios ni metas cháchara corporativa.`
                : `Eres Karen, asesora comercial senior especialista en ventas de ATOMIC Electronics Ecuador (https://atomiccotizador.shop/web).
Atiendes por igual a cualquier persona que te escriba desde cualquier número, siempre como una vendedora profesional de élite.

PERSONALIDAD Y REGLAS ESTRICTAS DE RESPUESTA:
1. SÉ MEGA NATURAL, AMIGABLE Y DIRECTA: Habla como una persona real experta y cercana en WhatsApp. Cero discursos robotizados o frases repetitivas de plantilla.
2. PROHIBIDO EXTENDERSE: Respuestas cortas y precisas de máximo 3 a 5 líneas claras (aprox. 40 a 95 palabras), fáciles de leer en celular. Solo da una lista breve si el cliente pide varios modelos.
3. ENFOQUE 100% EN VENDER Y CERRAR: Resuelve la duda con precio real en USD y enlace exacto si aplica, destaca un beneficio concreto (garantía directa, envío a todo Ecuador, paquetes mayoristas desde 6 uds) y termina con UNA sola pregunta natural para avanzar (ciudad, uso o cantidad).
4. CATEGORIA CRM DETECTADA: ${classification.roleType} -> ${classification.category.toUpperCase()}.
5. REGLAS CLAVE DE PRODUCTOS:
   - Cercos eléctricos: aclara en una línea corta que el precio del kit NO incluye materiales ni mano de obra de instalación.
   - Si pide info muy general ("hola", "info"): saluda súper cordial y pregúntale qué busca proteger, equipar o comprar.
${CATALOGO_RESUMIDO_ATOMIC}
${liveInventorySnippet}`;

        let botReply: string | null = null;

        try {
            const completion = await axios.post(
                "https://integrate.api.nvidia.com/v1/chat/completions",
                {
                    model: NVIDIA_MODEL,
                    messages: [
                        { role: "system", content: systemPrompt },
                        {
                            role: "user",
                            content: `Historial reciente:\n${historyLines.join('\n')}\n\nMensaje actual de ${contactName}:\n"${messageText}"\n\nResponde directo, natural y breve:`
                        }
                    ],
                    temperature: 0.55,
                    max_tokens: 240
                },
                {
                    headers: {
                        Authorization: `Bearer ${NVIDIA_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 18000
                }
            );

            botReply = completion.data.choices?.[0]?.message?.content?.trim() || null;
        } catch (nvidiaErr: any) {
            console.warn('[BOT_NVIDIA_UNAVAILABLE]', nvidiaErr?.message);

            if (process.env.DEEPSEEK_API_KEY) {
                try {
                    const deepseekRes = await axios.post(
                        "https://api.deepseek.com/v1/chat/completions",
                        {
                            model: "deepseek-chat",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: `Historial:\n${historyLines.join('\n')}\n\nMensaje actual:\n"${messageText}"` }
                            ],
                            temperature: 0.55,
                            max_tokens: 240
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                                "Content-Type": "application/json"
                            },
                            timeout: 12000
                        }
                    );
                    botReply = deepseekRes.data.choices?.[0]?.message?.content?.trim() || null;
                } catch (dsErr: any) {
                    console.warn('[BOT_DEEPSEEK_FAILED]', dsErr?.message);
                }
            }
        }

        if (!botReply) {
            botReply = generateNaturalConsultantFallback(messageText, contactName, classification);
        }

        // Adjuntar foto oficial solo cuando aporta valor directo en consultas de producto específicas
        const textLower = (messageText || '').toLowerCase();
        const detectedAsset = detectArticleAndCategory({ messagesText: messageText });
        const targetImagePath = classification.roleType === 'CLIENTE' ? (detectedAsset.imagePath || null) : null;
        const shouldSendImage = Boolean(
            targetImagePath &&
            (/foto|fotos|imagen|im[aá]genes|modelo|mu[eé]strame/i.test(textLower) ||
                ['barra-sonido', 'cercos-electricos', 'camaras-hogar', 'camaras-exterior', 'portero-multifuncion', 'barreras-ditec', 'antenas-antihurto', 'mantenimiento-generadores'].includes(detectedAsset.id || ''))
        );

        try {
            let sentType = 'text';
            let sentMediaUrl: string | null = null;

            if (shouldSendImage && targetImagePath && botReply.length <= 950) {
                await sendWhatsAppMedia(whatsappId, targetImagePath, 'image', botReply);
                sentType = 'image';
                sentMediaUrl = targetImagePath;
            } else {
                await sendWhatsAppMessage(whatsappId, botReply);
            }

            await prisma.wAMessage.create({
                data: {
                    conversationId,
                    whatsappMessageId: `bot-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: sentType,
                    mediaUrl: sentMediaUrl,
                    body: botReply,
                    status: 'SENT',
                    senderId: 'KAREN_SALES_CLASSIFIER'
                }
            });

            await prisma.wAConversation.update({
                where: { id: conversationId },
                data: { updatedAt: new Date(), lastMessageAt: new Date() }
            }).catch(() => {});

            console.log(`[KAREN_SALES_OK] ${whatsappId} -> ${classification.roleType}/${classification.category} (${sentType})`);
        } catch (sendErr: any) {
            const errMsg = sendErr?.response?.data?.error?.message || sendErr?.message || 'Error al entregar por WhatsApp';
            console.error(`[KAREN_SEND_FAILED] ${whatsappId}:`, errMsg);

            await prisma.wAMessage.create({
                data: {
                    conversationId,
                    whatsappMessageId: `bot-failed-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: shouldSendImage ? 'image' : 'text',
                    mediaUrl: shouldSendImage ? targetImagePath : null,
                    body: botReply,
                    status: 'FAILED',
                    errorMessage: formatRetryMetadata(0, Date.now() + 15000, errMsg),
                    senderId: 'KAREN_SALES_CLASSIFIER'
                }
            }).catch(() => {});
        }

        return botReply;
    } catch (error: any) {
        console.error('[KAREN_BOT_ERROR]', error?.response?.data || error?.message);
        try {
            const fallbackClass = classifyMessageForCrm(params.messageText || '');
            const emergencyReply = generateNaturalConsultantFallback(params.messageText, params.contactName, fallbackClass);
            await sendWhatsAppMessage(params.whatsappId, emergencyReply);

            await prisma.wAMessage.create({
                data: {
                    conversationId: params.conversationId,
                    whatsappMessageId: `bot-emergency-${Date.now()}`,
                    direction: 'OUTBOUND',
                    type: 'text',
                    body: emergencyReply,
                    status: 'SENT',
                    senderId: 'KAREN_SALES_EMERGENCY'
                }
            });
            return emergencyReply;
        } catch {
            return null;
        }
    }
}
