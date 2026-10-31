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
        imagePath: '/images/cercos/cerco-hagroy-xpower-i8-15083.jpg',
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
        keywords: ['antena', 'antenas', 'antihurto', 'eas', 'alarma ropa', 'tienda', 'sensor ropa'],
        category: 'Protección Comercial',
        productName: 'Sistemas Antihurto y Antenas EAS para Tiendas',
        imagePath: '/images/promociones/apple-portada.jpg',
        defaultPrice: 'Desde $499.96 USD',
        bulletPoints: [
            'Detección precisa de tags rígidos y etiquetas adhesivas',
            'Alarma sonora y lumínica de alta potencia',
            'Instalación lista para retail y locales comerciales'
        ]
    },
    {
        id: 'camaras-cctv',
        keywords: ['camara', 'camaras', 'cctv', 'imou', 'dahua', 'hikvision', 'seguridad', 'vigilancia'],
        category: 'Seguridad Electrónica',
        productName: 'Cámaras de Seguridad HD / 4K con Visión Nocturna y Audio',
        imagePath: '/images/promociones/cercos-electricos-portada.jpg',
        defaultPrice: 'Desde $45.40 USD',
        bulletPoints: [
            'Visualización remota en vivo en tu celular 24/7 sin pagos mensuales',
            'Detección de movimiento y audio bidireccional',
            'Modelos para interior y exterior con resistencia climática'
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
    }
];

/**
 * Detecta el artículo y la categoría asociada a partir de la pauta o mensajes previos.
 */
export function detectArticleAndCategory(input: {
    headline?: string;
    messagesText?: string;
}): {
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
            articleName: input.headline.trim(),
            category: 'Equipos y Soluciones',
            imagePath: undefined
        };
    }

    return {
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
