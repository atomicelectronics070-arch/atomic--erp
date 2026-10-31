/**
 * Registro Maestro de Pautas y Activos Multimedia para WhatsApp & Bot
 * Permite emparejar pautas publicitarias de Meta con fotos oficiales y
 * generar mensajes inteligentes de reactivación y disculpa personalizada.
 */

export interface PautaDefinition {
    id: string;
    keywords: string[];
    category: string;
    productName: string;
    imagePath?: string;
    defaultPrice?: string;
    bulletPoints: string[];
}

export const PAUTA_CATALOG_REGISTRY: PautaDefinition[] = [
    {
        id: 'cercos-electricos',
        keywords: ['cerco', 'cercos', 'hagroy', 'jfl', 'perimetro', 'xpower', 'yanex', 'eos', 'electrificador'],
        category: 'Seguridad Perimetral',
        productName: 'Cercos Eléctricos de Alta Seguridad (Hagroy / JFL)',
        imagePath: '/images/cercos/kits-cercos-electricos-pauta.jpg',
        defaultPrice: 'Desde $89.00 USD',
        bulletPoints: [
            'Disuasión activa con choque de alto voltaje regulado',
            'Sirena de alarma integrada y soporte para batería de respaldo',
            'Garantía directa e instalación profesional en todo el Ecuador'
        ]
    },
    {
        id: 'laptops-computacion',
        keywords: ['laptop', 'laptops', 'computador', 'computadora', 'dell', 'hp', 'lenovo', 'thinkpad', 'asus', 'core i5', 'core i7'],
        category: 'Cómputo & Portátiles',
        productName: 'Laptops Corporativas y de Alto Rendimiento',
        imagePath: '/images/promociones/laptops-portada.jpg',
        defaultPrice: 'Desde $320.00 USD',
        bulletPoints: [
            'Procesadores Intel Core i5 / i7 y AMD Ryzen de última generación',
            'Almacenamiento ultra rápido SSD NVMe y memoria ampliable',
            'Garantía oficial y entrega inmediata'
        ]
    },
    {
        id: 'videoporteros-citofonia',
        keywords: ['videoportero', 'videoporteros', 'portero', 'citofono', 'citofonia', 'hikvision', 'dahua', 'kis212', 'collective'],
        category: 'Videoporteros & Citofonía',
        productName: 'Videoporteros IP y Sistemas de Citofonía Inteligente',
        imagePath: '/images/promociones/cercos-electricos-portada.jpg',
        defaultPrice: 'Desde $92.40 USD',
        bulletPoints: [
            'Apertura remota de cerradura desde la pantalla o celular',
            'Cámara HD con visión nocturna infrarroja',
            'Ideal para casas, oficinas y edificios residenciales'
        ]
    },
    {
        id: 'cargadores-wallbox-ev',
        keywords: ['cargador', 'wallbox', 'mevo', 'auto electrico', 'ev', 'vehiculo electrico', 'electrolinera', 'tipo 2', '7.3kw'],
        category: 'Movilidad Eléctrica',
        productName: 'Cargadores Wallbox Mevo 7.3kW / 11kW para Vehículos Eléctricos',
        imagePath: '/img/cargadores/cargador-wallbox-mevo.jpg',
        defaultPrice: 'Desde $450.00 USD',
        bulletPoints: [
            'Carga rápida Tipo 2 compatible con BYD, Tesla, Kia, Hyundai y más',
            'Protección IP65 apto para exteriores e interiores',
            'Monitoreo inteligente de consumo y gestión de energía'
        ]
    },
    {
        id: 'scooters-electricos',
        keywords: ['scooter', 'scooters', 'ninebot', 'segway', 'f25', 'es1l', 'patineta', 'movilidad'],
        category: 'Movilidad Urbana',
        productName: 'Scooters Eléctricos Segway Ninebot Oficiales',
        imagePath: '/images/scooters/scooter-ninebot-f25.jpg',
        defaultPrice: 'Desde $380.00 USD',
        bulletPoints: [
            'Autonomía de hasta 25-40 km por carga completa',
            'Frenos regenerativos y llantas neumáticas antivibración',
            'Plegado rápido en 3 segundos'
        ]
    },
    {
        id: 'antenas-antihurto',
        keywords: ['antena', 'antenas', 'antihurto', 'no dejes que te roben', 'eas', 'alarma ropa', 'tienda de ropa', 'sensor ropa', 'tags ropa', 'desactivador', 'antenas 576', 'antenas 745'],
        category: 'Protección Comercial Retail',
        productName: 'Sistemas y Antenas Anti-Hurto para Tiendas y Locales Comerciales',
        imagePath: '/images/antihurto/antenas-antihurto-par-576.jpg',
        defaultPrice: 'Desde $576.00 + IVA (Kit Acrílico $745.00)',
        bulletPoints: [
            'Par de antenas de alta detección RF 8.2MHz con alarma de 95dB',
            'Reduce más del 98% de pérdidas por robo hormiga en tiendas',
            '3 Años de Garantía Directa Oficial ATOMIC'
        ]
    },
    {
        id: 'camaras-hogar',
        keywords: ['camara', 'camaras', 'cámara', 'cámaras', 'imou', 'ezviz', 'h6c', 'ranger', 'bebe', 'bebé', 'mascota', 'hogar', 'familia', '10899', '13067', 'doble lente'],
        category: 'Seguridad para el Hogar',
        productName: 'Cámaras de Seguridad Inteligentes para Hogar y Familia (IMOU / EZVIZ / Doble Lente)',
        imagePath: '/images/camaras/camara-ezviz-h6c-3mp-pauta.jpg',
        defaultPrice: 'Desde $35.80 + IVA',
        bulletPoints: [
            'Monitoreo en vivo 24/7 en tu celular sin pagos mensuales',
            'Audio bidireccional (habla y escucha a tus hijos y mascotas)',
            'Visión nocturna automática y modo de privacidad con 1 toque'
        ]
    },
    {
        id: 'barra-sonido',
        keywords: ['barra de sonido', 'barra sonido', 'soundbar', 'boc241n', '1 hora', '1hora', 'parlante gamer', 'audio gamer', 'parlante bluetooth', 'altavoz pc'],
        category: 'Audio & Gaming',
        productName: 'Barra de Sonido Gamer Bluetooth 1 HORA BOC241N con Luces RGB',
        imagePath: '/images/audio/barra-sonido-boc241n-1hora-precio-28.jpg',
        defaultPrice: '$28.90 + IVA',
        bulletPoints: [
            '10W de potencia con sonido cristalino y bajos profundos',
            '8 modos dinámicos de iluminación LED RGB para gaming y setups',
            'Batería recargable 2000 mAh (+5h de música) y 3 años de garantía oficial'
        ]
    },
    {
        id: 'luminarias-solares',
        keywords: ['luminaria', 'luminarias', 'solar', 'panel solar', 'foco solar', 'alumbrado', 'led'],
        category: 'Energía Solar',
        productName: 'Luminarias LED Solares de Alta Potencia con Sensor',
        imagePath: '/images/luminarias/luminarias-solares-atomeca.jpg',
        defaultPrice: 'Desde $65.00 USD',
        bulletPoints: [
            '0% costo en planilla eléctrica, se carga con el sol',
            'Sensor de movimiento y encendido automático nocturno',
            'Carcasa hermética resistente a lluvias y polvo'
        ]
    },
    {
        id: 'camaras-exterior',
        keywords: ["camara exterior","cámaras exterior","camaras intemperie","ip66","cruiser","titan pro","aurora","doble lente exterior","ip81","nks4223wbth","10115","12759"],
        category: 'Seguridad Exterior',
        productName: 'Cámaras de Seguridad Exterior Wi-Fi e Intemperie IP66 (Doble Lente / IMOU / NVR)',
        imagePath: '/images/camaras-exterior/camara-imou-cruiser-triple-11mp.jpg',
        defaultPrice: 'Desde $47.82 + IVA',
        bulletPoints: ["Protección hermética IP66 contra lluvias torrenciales y calor","Visión nocturna Full-Color a color las 24 horas y audio bidireccional","3 Años de Garantía Directa Oficial ATOMIC"]
    },
    {
        id: 'portero-multifuncion',
        keywords: ["portero multifuncion","portero zkteco","zkbio","zlink","portero inteligente","portero facial","portero huella","portero 198","videoportero app"],
        category: 'Control de Acceso & Citofonía',
        productName: 'Portero Eléctrico Multifunción ZKTeco con App ZKBio Zlink',
        imagePath: '/images/porteros/portero-inteligente-app-movil-198.jpg',
        defaultPrice: '$198.99 + IVA',
        bulletPoints: ["6 métodos de acceso: 1500 rostros, 3000 huellas, 3000 tarjetas, app, PIN y llave","App ZKBio Zlink 100% GRATIS de por vida sin cuotas mensuales","Videollamada en vivo al celular y apertura remota de cerradura"]
    },
    {
        id: 'barreras-ditec',
        keywords: ["barrera ditec","barreras ditec","ditec 2027","ditec","talanquera ditec","barrera vehicular ditec","1928"],
        category: 'Automatización Vehicular',
        productName: 'Barreras Vehiculares Automáticas Dítec Serie 2027 (Ingeniería Europea)',
        imagePath: '/images/barreras/barrera-ditec-tecnologia-2027-precio.jpg',
        defaultPrice: '$1,928.90 + IVA',
        bulletPoints: ["Motor Brushless 24V de uso continuo intensivo (100% duty cycle)","Apertura ultra veloz desde 2.0 segundos con mástiles de hasta 6 metros","3 Años de Garantía Oficial e integración con TAGs RFID y placas LPR"]
    },
    {
        id: 'mantenimiento-generadores',
        keywords: ["mantenimiento generador","mantenimiento generadores","reparacion generador","generador electrico","planta electrica","cambio de aceite generador","generador 50"],
        category: 'Servicios Energéticos',
        productName: 'Mantenimiento Preventivo y Reparación de Generadores Eléctricos',
        imagePath: '/images/generadores/mantenimiento-generadores-electricos-50.jpg',
        defaultPrice: 'Desde $50.00 Promocional',
        bulletPoints: ["Limpieza profunda, cambio de aceite y revisión integral de voltaje","Servicio técnico calificado para generadores a gasolina y plantas diésel","Atención en taller o a domicilio en Quito y valles"]
    }
];

/**
 * Detecta el artículo y la categoría asociada a partir de la pauta o mensajes previos.
 */
export function detectArticleAndCategory(input: {
    headline?: string;
    messagesText?: string;
}): {
    id?: string;
    articleName: string;
    category: string;
    imagePath?: string;
    defaultPrice?: string;
} {
    const rawText = `${input.headline || ''} ${input.messagesText || ''}`.toLowerCase();

    for (const pauta of PAUTA_CATALOG_REGISTRY) {
        const matches = pauta.keywords.some(kw => rawText.includes(kw));
        if (matches) {
            return {
                id: pauta.id,
                articleName: pauta.productName,
                category: pauta.category,
                imagePath: pauta.imagePath,
                defaultPrice: pauta.defaultPrice
            };
        }
    }

    // Si tiene headline específico de anuncio de Meta
    if (input.headline && input.headline.trim()) {
        return {
            id: 'meta-ad',
            articleName: input.headline.trim(),
            category: 'Equipos y Soluciones',
            imagePath: undefined
        };
    }

    return {
        id: 'catalogo-general',
        articleName: 'los equipos y soluciones de nuestro catálogo',
        category: 'Tecnología & Seguridad',
        imagePath: undefined
    };
}

/**
 * Extrae un nombre de pila amigable a partir del contacto.
 */
export function extractClientFirstName(rawName?: string, phone?: string): string {
    if (!rawName) return 'amig@';
    const trimmed = rawName.trim();
    // Si el nombre son solo dígitos (ej. el número telefónico)
    if (/^\+?\d+$/.test(trimmed.replace(/\s/g, ''))) {
        return 'amig@';
    }
    const parts = trimmed.split(/\s+/);
    const first = parts[0];
    // Capitalizar
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

/**
 * Genera el mensaje de disculpa inteligente y reactivación según el artículo y cliente.
 */
export function generateIntelligentApologyMessage(params: {
    clientName?: string;
    phone?: string;
    headline?: string;
    messagesText?: string;
}): {
    messageText: string;
    clientFirstName: string;
    detectedArticle: string;
    suggestedImage?: string;
} {
    const firstName = extractClientFirstName(params.clientName, params.phone);
    const detected = detectArticleAndCategory({
        headline: params.headline,
        messagesText: params.messagesText
    });

    const isGenericGreeting = firstName === 'amig@';
    const greeting = isGenericGreeting ? '¡Hola! Qué gusto saludarte 👋' : `¡Hola ${firstName}! Qué gusto saludarte 👋`;

    const messageText = 
`${greeting}

Te ofrecemos una sincera disculpa por la demora involuntaria en responderte estos días; tuvimos un inconveniente técnico temporal con nuestra plataforma de mensajería que nos impidió responderte oportunamente. Afortunadamente el sistema ya está 100% restablecido y operativo.

Estuvimos revisando tu consulta sobre *${detected.articleName}*. Nos interesa mucho ayudarte con la mejor asesoría técnica y precio directo de fábrica:

¿Cómo podemos ayudarte hoy con tu requerimiento? Cuéntanos qué dudas o inquietudes tienes, o si deseas que te compartamos la cotización formal y ficha técnica de inmediato. 🤝`;

    return {
        messageText,
        clientFirstName: firstName,
        detectedArticle: detected.articleName,
        suggestedImage: detected.imagePath
    };
}
