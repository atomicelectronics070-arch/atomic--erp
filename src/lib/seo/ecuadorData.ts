export interface EcuadorCity {
    slug: string;
    name: string;
    province: string;
    region: 'Sierra' | 'Costa' | 'Amazonía' | 'Insular';
    phoneCode: string;
    estimatedDeliveryHours: number;
    popularZones: string[];
}

export interface PseoCategory {
    slug: string;
    name: string;
    headline: string;
    description: string;
    metaTitleTemplate: string;
    metaDescriptionTemplate: string;
    warrantyYears: number;
    keywords: string[];
    faqs: Array<{ q: string; a: string }>;
    matchKeywords: string[];
}

export const ECUADOR_CITIES: EcuadorCity[] = [
    // ── PICHINCHA ────────────────────────────────────────────────────────
    { slug: 'quito', name: 'Quito', province: 'Pichincha', region: 'Sierra', phoneCode: '02', estimatedDeliveryHours: 24, popularZones: ['Norte', 'Centro', 'Sur', 'La Carolina', 'Ponceano', 'El Condado'] },
    { slug: 'cumbaya', name: 'Cumbayá', province: 'Pichincha', region: 'Sierra', phoneCode: '02', estimatedDeliveryHours: 24, popularZones: ['San Juan', 'Lumbisí', 'La Primavera', 'Miravalle'] },
    { slug: 'tumbaco', name: 'Tumbaco', province: 'Pichincha', region: 'Sierra', phoneCode: '02', estimatedDeliveryHours: 24, popularZones: ['Chiche', 'La Cerámica', 'Hilacril'] },
    { slug: 'sangolqui', name: 'Sangolquí', province: 'Pichincha', region: 'Sierra', phoneCode: '02', estimatedDeliveryHours: 24, popularZones: ['San Rafael', 'El Choclo', 'Capelo'] },
    { slug: 'cayambe', name: 'Cayambe', province: 'Pichincha', region: 'Sierra', phoneCode: '02', estimatedDeliveryHours: 48, popularZones: ['Centro', 'Juan Montalvo', 'Ayora'] },

    // ── GUAYAS ──────────────────────────────────────────────────────────
    { slug: 'guayaquil', name: 'Guayaquil', province: 'Guayas', region: 'Costa', phoneCode: '04', estimatedDeliveryHours: 24, popularZones: ['Urdesa', 'Ceibos', 'Puerto Santa Ana', 'Kennedy', 'Alborada', 'Via a la Costa'] },
    { slug: 'samborondon', name: 'Samborondón', province: 'Guayas', region: 'Costa', phoneCode: '04', estimatedDeliveryHours: 24, popularZones: ['La Puntilla', 'Ciudad Celeste', 'Entreríos', 'Buijo Histórico'] },
    { slug: 'daule', name: 'Daule', province: 'Guayas', region: 'Costa', phoneCode: '04', estimatedDeliveryHours: 24, popularZones: ['La Joya', 'Villa Club', 'Villa del Rey', 'Matices'] },
    { slug: 'duran', name: 'Durán', province: 'Guayas', region: 'Costa', phoneCode: '04', estimatedDeliveryHours: 24, popularZones: ['El Recreo', 'Primavera', 'Abel Gilbert'] },
    { slug: 'milagro', name: 'Milagro', province: 'Guayas', region: 'Costa', phoneCode: '04', estimatedDeliveryHours: 48, popularZones: ['Centro', 'Las Piñas', 'Los Troncos'] },

    // ── AZUAY ───────────────────────────────────────────────────────────
    { slug: 'cuenca', name: 'Cuenca', province: 'Azuay', region: 'Sierra', phoneCode: '07', estimatedDeliveryHours: 24, popularZones: ['El Vergel', 'Totoracocha', 'Ricaurte', 'San Joaquín', 'Challuabamba'] },
    { slug: 'gualaceo', name: 'Gualaceo', province: 'Azuay', region: 'Sierra', phoneCode: '07', estimatedDeliveryHours: 48, popularZones: ['Centro', 'San Juan', 'Bullcay'] },
    { slug: 'paute', name: 'Paute', province: 'Azuay', region: 'Sierra', phoneCode: '07', estimatedDeliveryHours: 48, popularZones: ['Centro', 'Pirincay', 'El Cabo'] },

    // ── MANABÍ ──────────────────────────────────────────────────────────
    { slug: 'manta', name: 'Manta', province: 'Manabí', region: 'Costa', phoneCode: '05', estimatedDeliveryHours: 24, popularZones: ['Barbasquillo', 'Tarqui', 'Los Esteros', 'Manta 2000', 'Umiña'] },
    { slug: 'portoviejo', name: 'Portoviejo', province: 'Manabí', region: 'Costa', phoneCode: '05', estimatedDeliveryHours: 24, popularZones: ['Picoazá', 'Colón', '18 de Octubre', 'Los Tamarindos'] },
    { slug: 'montecristi', name: 'Montecristi', province: 'Manabí', region: 'Costa', phoneCode: '05', estimatedDeliveryHours: 48, popularZones: ['Centro', 'La Pila', 'Aníbal San Andrés'] },
    { slug: 'chone', name: 'Chone', province: 'Manabí', region: 'Costa', phoneCode: '05', estimatedDeliveryHours: 48, popularZones: ['Santa Rita', 'San Antonio', 'Canuto'] },

    // ── EL ORO ──────────────────────────────────────────────────────────
    { slug: 'machala', name: 'Machala', province: 'El Oro', region: 'Costa', phoneCode: '07', estimatedDeliveryHours: 24, popularZones: ['Puerto Bolívar', 'La Providencia', 'El Cambio', 'Las Brisas'] },
    { slug: 'pasaje', name: 'Pasaje', province: 'El Oro', region: 'Costa', phoneCode: '07', estimatedDeliveryHours: 48, popularZones: ['Ochoa León', 'Bolívar', 'Loma de Franco'] },
    { slug: 'santa-rosa', name: 'Santa Rosa', province: 'El Oro', region: 'Costa', phoneCode: '07', estimatedDeliveryHours: 48, popularZones: ['Puerto Jelí', 'Jambelí', 'Bellamaría'] },

    // ── TUNGURAHUA ──────────────────────────────────────────────────────
    { slug: 'ambato', name: 'Ambato', province: 'Tungurahua', region: 'Sierra', phoneCode: '03', estimatedDeliveryHours: 24, popularZones: ['Ficoa', 'Atocha', 'Miraflores', 'Huachi Chico', 'Ingahurco'] },
    { slug: 'banos', name: 'Baños de Agua Santa', province: 'Tungurahua', region: 'Sierra', phoneCode: '03', estimatedDeliveryHours: 48, popularZones: ['Centro', 'Agoyán', 'Río Verde'] },

    // ── IMBABURA ────────────────────────────────────────────────────────
    { slug: 'ibarra', name: 'Ibarra', province: 'Imbabura', region: 'Sierra', phoneCode: '06', estimatedDeliveryHours: 24, popularZones: ['Los Ceibos', 'Yacucalle', 'San Antonio', 'Caranqui'] },
    { slug: 'otavalo', name: 'Otavalo', province: 'Imbabura', region: 'Sierra', phoneCode: '06', estimatedDeliveryHours: 48, popularZones: ['San Juan', 'El Jordán', 'San Pablo'] },

    // ── LOJA ────────────────────────────────────────────────────────────
    { slug: 'loja', name: 'Loja', province: 'Loja', region: 'Sierra', phoneCode: '07', estimatedDeliveryHours: 48, popularZones: ['San Sebastián', 'El Sagrario', 'El Valle', 'Vilcabamba'] },
    { slug: 'catamayo', name: 'Catamayo', province: 'Loja', region: 'Sierra', phoneCode: '07', estimatedDeliveryHours: 48, popularZones: ['Centro', 'San José', 'La Vega'] },

    // ── SANTO DOMINGO ───────────────────────────────────────────────────
    { slug: 'santo-domingo', name: 'Santo Domingo', province: 'Santo Domingo de los Tsáchilas', region: 'Costa', phoneCode: '02', estimatedDeliveryHours: 24, popularZones: ['Zaracay', 'Río Verde', 'Chiguilpe', 'Bombolí'] },

    // ── CHIMBORAZO ──────────────────────────────────────────────────────
    { slug: 'riobamba', name: 'Riobamba', province: 'Chimborazo', region: 'Sierra', phoneCode: '03', estimatedDeliveryHours: 24, popularZones: ['Lizarzaburu', 'Maldonado', 'Velasco', 'Bellavista'] },

    // ── COTOPAXI ────────────────────────────────────────────────────────
    { slug: 'latacunga', name: 'Latacunga', province: 'Cotopaxi', region: 'Sierra', phoneCode: '03', estimatedDeliveryHours: 24, popularZones: ['San Felipe', 'La Matriz', 'Eloy Alfaro', 'Ignacio Flores'] },

    // ── SANTA ELENA ─────────────────────────────────────────────────────
    { slug: 'salinas', name: 'Salinas', province: 'Santa Elena', region: 'Costa', phoneCode: '04', estimatedDeliveryHours: 24, popularZones: ['Chipipe', 'San Lorenzo', 'Punta Carnero'] },
    { slug: 'la-libertad', name: 'La Libertad', province: 'Santa Elena', region: 'Costa', phoneCode: '04', estimatedDeliveryHours: 24, popularZones: ['Centro', '28 de Mayo', 'General Enríquez'] },

    // ── ESMERALDAS ──────────────────────────────────────────────────────
    { slug: 'esmeraldas', name: 'Esmeraldas', province: 'Esmeraldas', region: 'Costa', phoneCode: '06', estimatedDeliveryHours: 48, popularZones: ['Las Palmas', 'Bartolomé Ruiz', 'Tonsupa'] },
];

export const TECH_CATEGORIES: PseoCategory[] = [
    {
        slug: 'videoporteros',
        name: 'Videoporteros Residenciales & Edificios',
        headline: 'Videoporteros HD y Citofonía Inteligente con Apertura Remota',
        description: 'Instalación y venta de kits de videoportero con 2 pantallas HD a color, frentes metálicos anti-vandalismo, visión nocturna y centrales colectivas Intelbras para edificios y conjuntos.',
        metaTitleTemplate: 'Videoporteros en {city}, Ecuador | Kits 2 Pantallas HD e Instalación',
        metaDescriptionTemplate: 'Venta e instalación de videoporteros para casas y edificios en {city}, {province}. Kits con 2 pantallas HD, apertura remota y garantía oficial de ATOMIC.',
        warrantyYears: 3,
        keywords: ['videoportero', 'citofono', 'portero electrico', 'intelbras', 'hikvision'],
        matchKeywords: ['videoportero', 'portero', 'citofon', 'pantalla', 'collective', 'kocom'],
        faqs: [
            { q: '¿El kit incluye la instalación en {city}?', a: 'En {city} contamos con técnicos certificados para visita de inspección y coordinación de instalación completa con cerradura eléctrica.' },
            { q: '¿Puedo contestar el videoportero desde el celular?', a: 'Sí, disponemos de modelos con conectividad Wi-Fi y App móvil para abrir la puerta y hablar con el visitante desde cualquier lugar.' },
            { q: '¿Qué garantía tienen los videoporteros de ATOMIC?', a: 'Todos nuestros videoporteros cuentan con 3 años de garantía oficial y soporte de repuestos permanente.' }
        ]
    },
    {
        slug: 'camaras-de-seguridad',
        name: 'Cámaras de Seguridad Wi-Fi & CCTV',
        headline: 'Cámaras de Seguridad 360°, Visión Nocturna y Audio Bidireccional',
        description: 'Sistemas de videovigilancia inteligente para hogares, fincas, locales y empresas. Cámaras interiores robóticas IMOU y exteriores con protección IP66 contra intemperie.',
        metaTitleTemplate: 'Cámaras de Seguridad en {city} | Vigilancia Wi-Fi y CCTV IP66',
        metaDescriptionTemplate: 'Protege tu hogar o negocio en {city} con cámaras de seguridad Wi-Fi 360°, alertas al celular en tiempo real y visión nocturna a todo color. Envíos directos.',
        warrantyYears: 3,
        keywords: ['camaras de seguridad', 'camara wifi', 'imou', 'ezviz', 'cctv'],
        matchKeywords: ['camara', 'camaras', 'cctv', 'imou', 'ezviz', 'vision nocturna', 'dvr', 'nvr'],
        faqs: [
            { q: '¿Funcionan las cámaras exteriores con las lluvias de {city}?', a: 'Absolutamente. Nuestras cámaras de intemperie cuentan con certificación IP66/IP67 hermética, diseñada para climas exigentes de {province}.' },
            { q: '¿Debo pagar mensualidad para ver las cámaras en el celular?', a: 'No. La App móvil es 100% gratuita de por vida, sin contratos ni suscripciones obligatorias.' },
            { q: '¿Cuánto tiempo tardan en enviar a {city}?', a: 'El envío llega a tu domicilio en {city} en aproximadamente {estimatedHours} horas mediante Servientrega o transporte directo.' }
        ]
    },
    {
        slug: 'barreras-vehiculares',
        name: 'Barreras Vehiculares Automáticas',
        headline: 'Barreras Automáticas de Alto Tráfico Dítec Serie 2027',
        description: 'Control de acceso vehicular para conjuntos residenciales, urbanizaciones cerradas, parques industriales y peajes. Motores Brushless 24V de ciclo continuo 100% y mástiles hasta 6m.',
        metaTitleTemplate: 'Barreras Vehiculares en {city} | Motores Brushless 24V Dítec 2027',
        metaDescriptionTemplate: 'Barreras automáticas de acceso vehicular para urbanizaciones y empresas en {city}. Tecnología europea Dítec con apertura ultra rápida de 2 segundos.',
        warrantyYears: 3,
        keywords: ['barrera vehicular', 'brazo automatico', 'control vehicular', 'ditec', 'tag rfid'],
        matchKeywords: ['barrera', 'barreras', 'vehicular', 'ditec', 'mastil', 'peaje'],
        faqs: [
            { q: '¿Qué mantenimiento requieren las barreras en {city}?', a: 'Gracias al motor Brushless sin escobillas, el mantenimiento es mínimo y resiste más de 2 millones de ciclos sin recalentamiento.' },
            { q: '¿Se pueden integrar con TAGs adhesivos en el parabrisas?', a: 'Sí, se integran con antenas lectoras de TAG RFID para apertura automática de residentes sin necesidad de abrir la ventana.' }
        ]
    },
    {
        slug: 'cercos-electricos',
        name: 'Cercos Eléctricos Perimetrales',
        headline: 'Protección Perimetral de Alto Voltaje con Alarma y Monitoreo Móvil',
        description: 'Electrificadores perimetrales certificados JFL y Hagroy con batería de respaldo anti-apagones, sirenas de 30W y control remoto para armar/desarmar desde el celular.',
        metaTitleTemplate: 'Cercos Eléctricos en {city} | Electrificadores JFL y Hagroy',
        metaDescriptionTemplate: 'Instalación de cercos eléctricos en {city}, {province}. Seguridad perimetral perimetral con batería de respaldo y activación por App móvil.',
        warrantyYears: 2,
        keywords: ['cerco electrico', 'electrificador', 'jfl', 'hagroy', 'seguridad perimetral'],
        matchKeywords: ['cerco', 'cercos', 'electrico', 'jfl', 'hagroy', 'electrificador'],
        faqs: [
            { q: '¿Qué pasa con el cerco si hay un apagón en {city}?', a: 'Todos nuestros kits incluyen batería sellada de respaldo de 12V 4Ah que mantiene activo el cerco entre 12 y 24 horas continuas sin luz.' },
            { q: '¿Es legal tener un cerco eléctrico en {city}?', a: 'Sí, siempre que cumpla con la normativa técnica vigente (letreros de peligro a 2.20m de altura mínima).' }
        ]
    },
    {
        slug: 'cerraduras-inteligentes',
        name: 'Cerraduras Inteligentes & Biometría',
        headline: 'Cerraduras Digitales con Reconocimiento Facial, Huella y App',
        description: 'Sistemas de biometría facial ZKTeco SenseFace 2A y cerraduras smart con desbloqueo por huella digital, tarjeta RFID, clave numérica y videollamada a tu smartphone.',
        metaTitleTemplate: 'Cerraduras Inteligentes en {city} | Biometría Facial y Huella',
        metaDescriptionTemplate: 'Olvídate de las llaves en {city}. Cerraduras smart con apertura por huella, reconocimiento facial en 0.3s y control de accesos desde el celular.',
        warrantyYears: 2,
        keywords: ['cerradura inteligente', 'chapa digital', 'biometrico', 'zkteco', 'senseface'],
        matchKeywords: ['cerradura', 'cerraduras', 'chapa', 'biometrico', 'facial', 'senseface', 'zkteco', 'smart lock'],
        faqs: [
            { q: '¿Se pueden colocar en puertas de madera o metal en {city}?', a: 'Nuestros modelos son compatibles con el 95% de puertas batientes residenciales y comerciales de madera, metal y aluminio.' },
            { q: '¿Cómo se alimenta la cerradura?', a: 'Utilizan baterías recargables de litio de larga duración (6 a 10 meses por carga) con puerto de emergencia USB-C exterior.' }
        ]
    },
    {
        slug: 'antenas-antihurto',
        name: 'Antenas Antihurto para Negocios',
        headline: 'Antenas de Seguridad Comercial Radiofrecuencia y Acustomagnéticas',
        description: 'Sistemas de detección de robos para boutiques, farmacias, minimarkets y tiendas de retail en Ecuador. Incluye tags rígidos, desactivadores y etiquetas adhesivas.',
        metaTitleTemplate: 'Antenas Antihurto en {city} | Prevención de Pérdidas Retail',
        metaDescriptionTemplate: 'Reduce las pérdidas por robo en tu local de {city}. Antenas antihurto con alta sensibilidad, tags reutilizables y etiquetas adhesivas.',
        warrantyYears: 2,
        keywords: ['antenas antihurto', 'antirrobo', 'tags ropa', 'desactivador tags', 'retail'],
        matchKeywords: ['antena', 'antenas', 'antihurto', 'tags', 'alarma ropa', 'retail'],
        faqs: [
            { q: '¿Qué distancia de pasillo cubren las antenas?', a: 'Nuestros pedestales cubren pasillos desde 0.90m hasta 1.80m de ancho con detección de 360 grados.' }
        ]
    }
];

export function getCityBySlug(slug: string): EcuadorCity | undefined {
    return ECUADOR_CITIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
}

export const getAllPseoParams = () => {
    const params: Array<{ categoria: string; ciudad: string }> = [];
    for (const cat of TECH_CATEGORIES) {
        for (const city of ECUADOR_CITIES) {
            params.push({ categoria: cat.slug, ciudad: city.slug });
        }
    }
    return params;
};
