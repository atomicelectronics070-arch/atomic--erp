export interface CategoryProduct {
    id: string;
    sku: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    stock: number;
    imageUrl: string;
    tag?: string;
    specs: string[];
}

export interface CategoryScope {
    title: string;
    description: string;
    icon: string;
    examples: string[];
}

export interface SuicideSquadCategoryLanding {
    slug: string;
    squadId: string;
    squadCode: string;
    squadName: string;
    colorTheme: "rose" | "emerald" | "amber" | "cyan" | "violet";
    name: string;
    badge: string;
    subtitle: string;
    heroHeadline: string;
    heroPitch: string;
    mission: string;
    targetAudience: string;
    priceRange: {
        min: number;
        avg: string;
        max: number;
        currency: string;
        note: string;
    };
    scopes: CategoryScope[];
    featuredProducts: CategoryProduct[];
    whatsappPitch: string;
    faq: {
        question: string;
        answer: string;
    }[];
}

export const SUICIDE_SQUAD_CATEGORIES: SuicideSquadCategoryLanding[] = [
    {
        slug: "camaras-de-seguridad",
        squadId: "squad-1",
        squadCode: "S-01",
        squadName: "EL GUARDIÁN URBANO",
        colorTheme: "rose",
        name: "Cámaras de Seguridad & CCTV",
        badge: "Seguridad Anti-Robo P1",
        subtitle: "Monitoreo 24/7 con Disuasión Activa y Visión Nocturna a Color",
        heroHeadline: "Tu Seguridad Activa: Previene el Robo Antes de que Suceda",
        heroPitch: "Cámaras inteligentes con alerta a tu celular en tiempo real, sirena incorporada, luces estroboscópicas disuasivas y resolución Ultra HD. Cero pagos mensuales.",
        mission: "Proteger hogares, locales comerciales y bodegas en Ecuador con tecnología de videovigilancia disuasiva sin mensualidades abusivas.",
        targetAudience: "Hogares, condominios, locales comerciales, farmacias, bodegas y oficinas en las 24 provincias del Ecuador.",
        priceRange: {
            min: 40.41,
            avg: "$45 - $220",
            max: 650.78,
            currency: "USD",
            note: "Precios oficiales de venta al público (PVP) con IVA incluido y factura electrónica oficial SRI."
        },
        scopes: [
            {
                title: "Residencial & Hogar",
                description: "Cámaras Wi-Fi 360° para interiores y exteriores. Visualiza tu sala, patio y entrada principal desde cualquier lugar del mundo.",
                icon: "Home",
                examples: ["Cámaras robóticas Wi-Fi", "Bombillas con cámara 360°", "Detección de mascotas y niños"]
            },
            {
                title: "Comercios & Puntos de Venta",
                description: "Control de cajas, vitrinas y atención al cliente. Detección de intrusos en horarios de cierre con alerta sonora.",
                icon: "Store",
                examples: ["Cámaras domo antivandálicas", "Micrófono bidireccional", "Grabación continua 24/7 en NVR"]
            },
            {
                title: "Perímetros & Fachadas",
                description: "Cámaras tipo bala selladas IP67 resistentes a lluvia torrencial con tecnología ColorVu para ver a full color en la noche.",
                icon: "ShieldAlert",
                examples: ["Visión nocturna ColorVu 30m-50m", "Luces led blancas disuasivas", "Carcasas metálicas de alta resistencia"]
            },
            {
                title: "Sistemas Corporativos",
                description: "Grabadores NVR/DVR de 4, 8 y 16 canales con discos duros especializados Seagate SkyHawk o WD Purple.",
                icon: "Building",
                examples: ["Kits completos de 4 a 16 cámaras", "Acceso multiusuario por App", "Exportación de video en alta definición"]
            }
        ],
        featuredProducts: [
            {
                id: "CAM-IMOU-360-1080P",
                sku: "CAM-IMOU-360-FHD",
                name: "Cámara Robótica IMOU 360° Wi-Fi Full HD 1080P",
                description: "Giro 360°, audio de dos vías (habla y escucha), visión nocturna clara y alertas inmediatas a tu celular. Fácil instalación.",
                price: 45.40,
                comparePrice: 59.00,
                stock: 25,
                imageUrl: "/images/products/camara_imou_360.jpg",
                tag: "Más Vendido",
                specs: ["Full HD 1080p", "Giro 360° Pan/Tilt", "Audio Bidireccional", "App Móvil Gratis"]
            },
            {
                id: "CAM-IMOU-RANGER-3MP",
                sku: "CAM-RANGER-3MP",
                name: "Cámara IMOU PT Ranger 360° Mini 3MP Alta Definición",
                description: "Resolución 3 Megapíxeles ultra nítida, seguimiento inteligente de siluetas humanas, visión nocturna 30m y almacenamiento híbrido.",
                price: 95.00,
                comparePrice: 115.00,
                stock: 18,
                imageUrl: "/images/products/camara_imou_ranger_3mp.jpg",
                tag: "Envío Gratis",
                specs: ["3 Megapíxeles Ultra HD", "Visión Nocturna 30m", "Seguimiento Inteligente", "Micro SD hasta 256GB"]
            },
            {
                id: "CAM-SK-4MP-METAL",
                sku: "CAM-SK-IP-4MP",
                name: "Cámara IP SK Tipo Antivandálica 4MP Metal IR 30m",
                description: "Cuerpo de aleación metálica antivandálica con protección impermeable IP67 para exteriores severos.",
                price: 124.81,
                comparePrice: 145.00,
                stock: 10,
                imageUrl: "/images/products/camara-sk-4mp.jpg",
                specs: ["4MP Resolución QHD", "Carcasa Metálica IP67", "PoE Integrado", "Visión Nocturna IR"]
            },
            {
                id: "KIT-CCTV-16CH-HD",
                sku: "KIT-CCTV-16CH",
                name: "Kit CCTV Profesional 16 Cámaras HD 20MP + Grabador NVR",
                description: "Solución integral para empresas y condominios. Incluye grabador NVR de 16 canales, cámaras Full HD y fuentes centralizadas.",
                price: 650.78,
                comparePrice: 780.00,
                stock: 5,
                imageUrl: "/images/products/kit-cctv-16ch.jpg",
                tag: "Kit Pro",
                specs: ["16 Canales Simultáneos", "NVR 4K H.265+", "Visualización Remota", "Garantía Oficial 1 Año"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, vi la Landing de Cámaras de Seguridad y deseo cotizar un sistema con instalación y envío.",
        faq: [
            {
                question: "¿Tienen costo mensual o suscripción?",
                answer: "No. Todas nuestras cámaras funcionan con aplicaciones oficiales 100% gratuitas (IMOU Life, Tuya Smart, Hik-Connect) sin ningún cobro mensual."
            },
            {
                question: "¿Puedo ver las cámaras si estoy de viaje fuera de mi ciudad o país?",
                answer: "Sí, siempre que las cámaras tengan conexión a internet Wi-Fi o cableada, podrás ver el video en vivo y las grabaciones desde tu teléfono celular en cualquier parte del mundo."
            },
            {
                question: "¿Cómo es la entrega y la garantía?",
                answer: "Realizamos envíos asegurados a todo el Ecuador por Servientrega en 24-48 horas. Todos los equipos cuentan con 1 año de garantía oficial de fábrica y factura electrónica SRI."
            }
        ]
    },
    {
        slug: "alarmas-y-seguridad",
        squadId: "squad-1",
        squadCode: "S-01",
        squadName: "EL GUARDIÁN URBANO",
        colorTheme: "rose",
        name: "Cercos Eléctricos & Alarmas Perimetrales",
        badge: "Protección Perimetral Activa",
        subtitle: "Barreras de Alto Voltaje y Sirenas Potentes Anti-Intrusión",
        heroHeadline: "Blindaje Perimetral Total: Detén al Intruso Antes de que Pise tu Techo",
        heroPitch: "Electrificadores de alta energía disuasiva con sirena de 20W/30W, control remoto, batería de respaldo para cortes de luz y opción de conexión a tu celular por App.",
        mission: "Proteger el perímetro de casas, quintas, urbanizaciones y complejos industriales mediante descargas controladas no letales y alerta acústica inmediata.",
        targetAudience: "Propietarios de viviendas unifamiliares, conjuntos residenciales, bodegas y fincas en Ecuador.",
        priceRange: {
            min: 89.00,
            avg: "$89 - $140",
            max: 180.00,
            currency: "USD",
            note: "Kits completos de energizador listos para montaje con accesorios oficiales."
        },
        scopes: [
            {
                title: "Viviendas & Paredes Medianeras",
                description: "Kits de electrificación para muros de 4 a 6 líneas de alambre. Impide el escalamiento de paredes y techos.",
                icon: "Zap",
                examples: ["Electrificador JFL Plata / Oro", "Alambre acerado de alta tensión", "Aisladores templadores UV"]
            },
            {
                title: "Control por App Celular",
                description: "Módulos Ethernet que te permiten armar y desarmar el cerco desde tu smartphone, recibiendo alertas en caso de corte de alambre.",
                icon: "Smartphone",
                examples: ["Módulo Ethernet ME-05", "Notificación push inmediata", "Encendido de sirena a distancia"]
            },
            {
                title: "Respaldo Anti-Apagones",
                description: "Batería de gel 12V 4Ah que mantiene activo el cerco eléctrico incluso si cortan el suministro público de luz eléctrica.",
                icon: "BatteryCharging",
                examples: ["Batería 12V 4Ah incluida", "Caja metálica protectora", "Operatividad de 8 a 16 horas autónomas"]
            }
        ],
        featuredProducts: [
            {
                id: "CERCO-15023",
                sku: "KIT-JFL-PLATA",
                name: "Kit Cerco Eléctrico JFL Plata (Cód: 15023)",
                description: "Electrificador JFL de alto rendimiento, 1 control remoto, batería de respaldo 12V-4Ah, sirena de 20W y letrero de peligro reglamentario.",
                price: 89.00,
                comparePrice: 105.00,
                stock: 30,
                imageUrl: "/images/products/cercos_jfl.jpg",
                tag: "Más Vendido",
                specs: ["Electrificador JFL", "Batería 12V-4Ah", "Control Remoto", "Sirena 20W Potente"]
            },
            {
                id: "CERCO-11207",
                sku: "KIT-JFL-ORO",
                name: "Kit Cerco Eléctrico JFL Oro con Caja de Sirena (Cód: 11207)",
                description: "Kit completo que añade caja metálica protectora para la sirena contra sabotajes o lluvias severas.",
                price: 109.00,
                comparePrice: 125.00,
                stock: 20,
                imageUrl: "/images/products/cercos_jfl.jpg",
                specs: ["Caja Metálica de Sirena", "Electrificador JFL", "Batería 12V", "Letrero Oficial SRI"]
            },
            {
                id: "CERCO-11208",
                sku: "KIT-JFL-PLATINO",
                name: "Kit Cerco Eléctrico JFL Platino con App Móvil (Cód: 11208)",
                description: "Incluye módulo Ethernet ME-05 para controlar tu cerco desde tu celular, sirena de 30W de máxima potencia y caja metálica.",
                price: 137.00,
                comparePrice: 160.00,
                stock: 15,
                imageUrl: "/images/products/cercos_jfl.jpg",
                tag: "Control por Celular",
                specs: ["Módulo Ethernet App", "Sirena 30W Ultraruidosa", "Batería 12V", "Caja Metálica"]
            },
            {
                id: "CERCO-15083",
                sku: "KIT-HAGROY-I8",
                name: "Kit Cerco Eléctrico Platino Hagroy i8 (Cód: 15083)",
                description: "Electrificador Hagroy i8 de alta energía, control remoto y potente sirena de 20W para grandes perímetros.",
                price: 98.00,
                comparePrice: 115.00,
                stock: 12,
                imageUrl: "/images/products/cercos_jfl.jpg",
                specs: ["Electrificador Hagroy i8", "Batería 12V-4Ah", "Control Remoto", "Sirena 20W"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, deseo cotizar un Kit de Cerco Eléctrico para mi propiedad.",
        faq: [
            {
                question: "¿La descarga eléctrica es letal?",
                answer: "No. Los electrificadores JFL y Hagroy cumplen normas internacionales de seguridad: generan pulsos intermitentes de alto voltaje y bajísimo amperaje que provocan una contracción muscular disuasiva muy fuerte sin riesgo letal."
            },
            {
                question: "¿Sigue funcionando si se corta la luz en mi sector?",
                answer: "Sí. Todos nuestros kits incluyen su batería de respaldo recargable de 12V-4Ah que mantiene el sistema encendido y vigilante durante los cortes de luz."
            }
        ]
    },
    {
        slug: "cerraduras-smart",
        squadId: "squad-2",
        squadCode: "S-02",
        squadName: "LLAVE CERO",
        colorTheme: "emerald",
        name: "Cerraduras Inteligentes & Digitales",
        badge: "Fin de las Llaves Físicas P2",
        subtitle: "Apertura por Huella Dactilar, Código Táctil, Tarjeta y App Celular",
        heroHeadline: "Sal de Casa sin Llaves: Abre tu Puerta en 0.3 Segundos con tu Pulgar",
        heroPitch: "Cerraduras inteligentes de embutir y sobreponer para puertas de madera, metal y vidrio. Genera claves temporales para visitas o huéspedes de Airbnb desde tu celular.",
        mission: "Modernizar los accesos en hogares, departamentos y alojamientos turísticos en Ecuador con cerraduras biométricas seguras y elegantes.",
        targetAudience: "Propietarios de viviendas, departamentos, habitaciones Airbnb, oficinas ejecutivas y consultorios.",
        priceRange: {
            min: 57.73,
            avg: "$70 - $240",
            max: 249.99,
            currency: "USD",
            note: "Modelos certificados con llave mecánica de auxilio oculta y puerto de emergencia USB-C."
        },
        scopes: [
            {
                title: "Puertas Principales Residenciales",
                description: "Cerraduras robustas de embutir con cerrojo de acero multicapa, lector biométrico en la manija y teclado táctil.",
                icon: "Lock",
                examples: ["Cerradura Tuya OS956", "Reconocimiento de huella ultra rápido", "Bloqueo automático al cerrar"]
            },
            {
                title: "Alojamientos Airbnb & Alquileres",
                description: "Crea claves numéricas con fecha y hora de vencimiento exactas para tus huéspedes sin necesidad de entregar llaves en mano.",
                icon: "Key",
                examples: ["Generación de claves remotas", "Claves de un solo uso", "Historial de ingresos en tiempo real"]
            },
            {
                title: "Puertas de Emergencia & Antipánico",
                description: "Barreras de salida antipánico reforzadas en acero inoxidable para edificios, hospitales y centros comerciales.",
                icon: "DoorClosed",
                examples: ["Cerradura Barra Antipánico Americana", "Durabilidad de 10 años", "Normativa de seguridad contra incendios"]
            }
        ],
        featuredProducts: [
            {
                id: "CERR-MANIJA-N191A",
                sku: "CERR-N191A-DIEL",
                name: "Cerradura Digital Manija N191A Diel Económica",
                description: "La cerradura inteligente más accesible y confiable. Lector de huella en la manija, código PIN numérico y llaves de auxilio.",
                price: 57.73,
                comparePrice: 75.00,
                stock: 20,
                imageUrl: "/images/products/cerradura-n191a.jpg",
                tag: "Más Económica",
                specs: ["Lector de Huella 0.3s", "Teclado Táctil PIN", "Llave Mecánica Auxilio", "Fácil Instalación"]
            },
            {
                id: "CERR-BARRA-PANIC-USA",
                sku: "BARRA-ANTIPANICO",
                name: "Cerradura Barra Antipánico Reforzada Marca Americana",
                description: "Estructura de acero reforzado para puertas de escape de emergencia. 10 años de durabilidad garantizada con certificación.",
                price: 98.00,
                comparePrice: 120.00,
                stock: 14,
                imageUrl: "/images/products/barra_antipanico.jpg",
                tag: "Envío Gratis",
                specs: ["Acero Inoxidable Reforzado", "Certificación de Emergencia", "Durabilidad 10 Años", "Envío Gratis Nacional"]
            },
            {
                id: "CERR-TUYA-OS956",
                sku: "CERR-OS956-WIFI",
                name: "Cerradura Inteligente Wi-Fi Tuya OS956 (5 Métodos de Apertura)",
                description: "Cerradura premium con Wi-Fi directo: huella, código, tarjeta RFID, app móvil Tuya/SmartLife y llave física.",
                price: 234.12,
                comparePrice: 280.00,
                stock: 10,
                imageUrl: "/images/products/cerradura-tuya-os956.jpg",
                tag: "Tope de Gama",
                specs: ["Conexión Wi-Fi Directa", "5 Métodos de Acceso", "Apertura Remota", "Notificación a Celular"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, deseo información y asesoría para comprar una Cerradura Inteligente.",
        faq: [
            {
                question: "¿Qué pasa si se agotan las pilas de la cerradura?",
                answer: "La cerradura emite una alarma audible y visual semanas antes cuando las pilas están bajas. Si llegara a agotarse totalmente, cuenta con puerto USB-C frontal para conectarle una batería portátil y abrir al instante, además de sus llaves físicas ocultas."
            },
            {
                question: "¿Se adapta a mi puerta actual?",
                answer: "Sí, se adaptan a la gran mayoría de puertas de madera, metal y aluminio con grosor de 35mm a 65mm. Incluyen plantilla de perforación y manual detallado."
            }
        ]
    },
    {
        slug: "control-de-acceso",
        squadId: "squad-2",
        squadCode: "S-02",
        squadName: "LLAVE CERO",
        colorTheme: "emerald",
        name: "Control de Acceso, Biometría & Torniquetes",
        badge: "Control Peatonal y Flujo Corporativo",
        subtitle: "Terminales de Reconocimiento Facial, Huella y Torniquetes de Acero",
        heroHeadline: "Control Absoluto del Personal: Registros Exactos y Cero Accesos no Autorizados",
        heroPitch: "Biométricos ZKTeco con reconocimiento facial por infrarrojos, apertura remota por app y torniquetes peatonales de alto tráfico para empresas, edificios y gimnasios.",
        mission: "Garantizar la seguridad corporativa e institucional en Ecuador mediante sistemas avanzados de control de asistencia y torniquetes peatonales.",
        targetAudience: "Empresas, fábricas, instituciones educativas, gimnasios, hospitales y complejos comerciales.",
        priceRange: {
            min: 175.00,
            avg: "$175 - $1,850",
            max: 2950.00,
            currency: "USD",
            note: "Equipos certificados con software de reportería de asistencia laboral en Ecuador."
        },
        scopes: [
            {
                title: "Oficinas & Asistencia Laboral",
                description: "Relojes biométricos faciales y dactilares. Exporta reportes de atrasos, horas extra y marcaciones para nómina en Excel.",
                icon: "Users",
                examples: ["SenseFace 2A ZKTeco", "Reconocimiento facial sin contacto", "Software de gestión de turnos"]
            },
            {
                title: "Lobbies & Entradas Peatonales",
                description: "Torniquetes trípode y barreras abatibles Flap Barrier en acero inoxidable 304 para filtrado rápido de personas.",
                icon: "Activity",
                examples: ["Torniquete TS1000 Pro", "Flap Barrier FBL4000", "Paso bidireccional fluido"]
            },
            {
                title: "Seguridad Comercial Antihurto",
                description: "Antenas de radiofrecuencia para tiendas y farmacias que detectan mercancía no facturada al cruzar la puerta.",
                icon: "Radio",
                examples: ["Par Antenas Dahua Mercury", "Detección 70cm etiqueta / 95cm tag", "Alarma sonora y lumínica"]
            }
        ],
        featuredProducts: [
            {
                id: "ZK-SENSEFACE-2A",
                sku: "ZK-SENSEFACE-2A",
                name: "Biométrico ZKTeco SenseFace 2A con Videoportero por App",
                description: "Reconocimiento facial ultra veloz, huella dactilar, tarjetas RFID, teclado PIN, conexión Wi-Fi 100% inalámbrica y videollamada a app móvil.",
                price: 175.00,
                comparePrice: 220.00,
                stock: 15,
                imageUrl: "/images/products/senseface_2a.jpg",
                tag: "Estrella",
                specs: ["Reconocimiento Facial", "Lector Huella & RFID", "Wi-Fi Integrado", "Apertura por Celular"]
            },
            {
                id: "ANT-RS5003TR",
                sku: "DAHUA-MERCURY-RF",
                name: "Par de Antenas Antihurto RF Mono Dahua Mercury (ANT-RS5003TR)",
                description: "Antena de seguridad RF de alto rendimiento para tiendas y farmacias. Detección inteligente de etiquetas y tags duros.",
                price: 499.96,
                comparePrice: 580.00,
                stock: 8,
                imageUrl: "/images/products/antena_mercury.jpg",
                specs: ["Tubo Reforzado", "Detección 70cm/95cm", "Frecuencia RF 8.2MHz", "Alarma Acústica"]
            },
            {
                id: "ZK-TS1000-PRO",
                sku: "TORNIQUETE-TS1000",
                name: "Torniquete Trípode Peatonal ZKTeco TS1000 Pro",
                description: "Acero inoxidable 304 de alto tráfico, paso bidireccional, compatible con lectores faciales y dactilares.",
                price: 720.00,
                comparePrice: 850.00,
                stock: 6,
                imageUrl: "/images/products/torniquete_ts1000.jpg",
                tag: "Alto Tráfico",
                specs: ["Acero Inoxidable 304", "Paso Bidireccional", "Mecanismo Anticolapso", "Integración Biométrica"]
            },
            {
                id: "ZK-FBL4000-PRO",
                sku: "FLAP-BARRIER-FBL4000",
                name: "Torniquete Flap Barrier ZKTeco FBL4000 Pro Aletas Retráctiles",
                description: "Barrera peatonal motorizada de alta gama con aletas retráctiles en acrílico templado para lobbies corporativos.",
                price: 1850.00,
                comparePrice: 2100.00,
                stock: 3,
                imageUrl: "/images/products/flap_barrier.jpg",
                specs: ["Aletas Retráctiles", "Vidrio Templado", "Alta Velocidad de Paso", "Estética Corporativa"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, requiero una cotización de Control de Acceso / Torniquetes para mi empresa.",
        faq: [
            {
                question: "¿El software de asistencia tiene costo?",
                answer: "Incluye software oficial ZKTeco BioTime / ZKAccess sin costo de licencia periódica para la gestión y exportación de marcaciones a Excel."
            },
            {
                question: "¿Realizan la instalación en sitio?",
                answer: "Sí, disponemos de cuadrillas técnicas en Quito, Guayaquil, Cuenca y cobertura nacional con técnicos homologados."
            }
        ]
    },
    {
        slug: "videoporteros-y-citofonia",
        squadId: "squad-2",
        squadCode: "S-02",
        squadName: "LLAVE CERO",
        colorTheme: "emerald",
        name: "Videoporteros & Citofonía para Edificios",
        badge: "Comunicación & Apertura Remota",
        subtitle: "Intercomunicadores con Pantallas HD y Centrales Colectivas hasta 56 Deptos",
        heroHeadline: "Mira Quién Toca el Timbre Antes de Abrir la Puerta",
        heroPitch: "Sistemas de porteros de video con pantallas a color de 7 pulgadas, citófonos para conjuntos residenciales y centrales colectivas Intelbras con desvío de llamadas a celulares.",
        mission: "Facilitar la intercomunicación segura entre residentes, conserjería y visitantes en casas y edificios multifamiliares de Ecuador.",
        targetAudience: "Casas unifamiliares, urbanizaciones cerradas, edificios de departamentos y oficinas profesionales.",
        priceRange: {
            min: 15.40,
            avg: "$92 - $190",
            max: 285.00,
            currency: "USD",
            note: "Equipos originales KOCOM, Hikvision e Intelbras con garantía oficial."
        },
        scopes: [
            {
                title: "Residencias con 2 Plantas",
                description: "Portero de video con dos pantallas interiores para contestar cómodamente desde la planta baja o el dormitorio superior.",
                icon: "Video",
                examples: ["Portero Residencial 2 Pantallas HD", "Pantallas a color de 7 pulgadas", "Apertura de cerradura eléctrica"]
            },
            {
                title: "Edificios de 3 a 24 Departamentos",
                description: "Centrales Intelbras Collective y porteros Kocom con pulsadores individuales para cada departamento o departamento.",
                icon: "Building2",
                examples: ["Centrales Collective 4i, 8i, 12i, 24i", "Citófonos TDMI 300 2 hilos", "Desvío a celular del propietario"]
            }
        ],
        featuredProducts: [
            {
                id: "VP-2P-HD",
                sku: "VP-2P-RESIDENCIAL",
                name: "Portero de Video Residencial 2 Pantallas HD (Kit Completo)",
                description: "Seguridad y comodidad total: incluye frente exterior con cámara HD y visión nocturna + 2 monitores interiores a color de 7\". ¡Envío Gratis!",
                price: 285.00,
                comparePrice: 330.00,
                stock: 12,
                imageUrl: "/images/products/videoportero_2p.jpg",
                tag: "¡Envío Gratis!",
                specs: ["2 Pantallas LCD 7\"", "Cámara Exterior HD", "Audio Bidireccional", "Apertura de Chapa"]
            },
            {
                id: "DS-KIS212",
                sku: "HIKVISION-KIS212",
                name: "Kit de Videoportero Análogo Hikvision DS-KIS212 Pantalla 7\"",
                description: "Monitor LCD 7\", micrófono omnidireccional con supresión de ruido, cámara HD TVI y función Plug & Play.",
                price: 92.40,
                comparePrice: 110.00,
                stock: 20,
                imageUrl: "/images/products/videoportero_hikvision.jpg",
                tag: "Más Vendido",
                specs: ["Monitor 7 Pulgadas", "Calidad HD TVI", "Micrófono Reducción Ruido", "Apertura Remota"]
            },
            {
                id: "KIT-KOCOM-3DEP",
                sku: "KOCOM-KDP601A-3P",
                name: "Kit de Citofonía KOCOM 3 Departamentos (KDP-601A)",
                description: "Solución completa para 3 departamentos: 1 frente de calle metálico con 3 botones + 3 citófonos KDP-601A originales KOCOM.",
                price: 149.00,
                comparePrice: 175.00,
                stock: 15,
                imageUrl: "/images/products/citofono_kocom_3dep.jpg",
                specs: ["Frente Metálico 3 Botones", "3 Citófonos KOCOM", "Sonido Claro", "Fácil Cableado"]
            },
            {
                id: "INTELBRAS-COLLECTIVE-12I",
                sku: "COLLECTIVE-12I",
                name: "Central de Citofonía Intelbras Collective 12i (12 Departamentos)",
                description: "Central colectiva para 12 departamentos con comunicación limpia, teclado de marcación y desvío telefónico.",
                price: 143.00,
                comparePrice: 165.00,
                stock: 10,
                imageUrl: "/images/products/intelbras_collective.jpg",
                specs: ["Capacidad 12 Departamentos", "Desvío de Llamadas", "Acceso por Clave", "Marca Líder Intelbras"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, requiero cotizar un sistema de Videoportero / Citófonos para mi casa o edificio.",
        faq: [
            {
                question: "¿Puedo abrir la puerta desde las pantallas?",
                answer: "Sí, todos los videoporteros y citófonos disponen de un botón dedicado para liberar cerraduras eléctricas o cantoneras magnéticas al instante."
            }
        ]
    },
    {
        slug: "ups-y-energia",
        squadId: "squad-3",
        squadCode: "S-03",
        squadName: "ANTI-APAGONES",
        colorTheme: "amber",
        name: "UPS, Reguladores & Respaldo Eléctrico",
        badge: "Continuidad Eléctrica P3",
        subtitle: "Protege tus Equipos y Mantén tu Negocio Operativo Durante Cortes de Luz",
        heroHeadline: "Cero Apagones: Tu Internet, Computadoras y Negocio Siguen Encendidos",
        heroPitch: "UPS interactivos y online de marcas líderes (Forza, Powest, APC) con transferencia ultrarrápida en milisegundos y regulación automática de voltaje (AVR).",
        mission: "Blindar los hogares y empresas del Ecuador contra la inestabilidad de la red eléctrica, apagones programados y sobretensiones.",
        targetAudience: "Hogares en teletrabajo, servidores de datos, locales comerciales, farmacias, clínicas y cámaras de seguridad.",
        priceRange: {
            min: 74.99,
            avg: "$75 - $350",
            max: 850.00,
            currency: "USD",
            note: "Equipos con garantía directa de 1 a 2 años y baterías internas reemplazables."
        },
        scopes: [
            {
                title: "Routers Wi-Fi & Cámaras",
                description: "UPS compactos de 500VA a 850VA diseñados para que tu internet y tu sistema de vigilancia sigan transmitiendo durante el corte.",
                icon: "Wifi",
                examples: ["Forza NT-512U 500VA", "Autonomía de 2 a 4 horas para router", "Protección contra picos de luz"]
            },
            {
                title: "Puntos de Venta & Computadoras",
                description: "Respaldo para CPUs, pantallas, impresoras de facturación y sistemas POS para no perder ventas ni bases de datos.",
                icon: "Monitor",
                examples: ["Powest Micropoint 850VA", "Software de apagado automático", "Regulación AVR integrada"]
            },
            {
                title: "Servidores & Equipos Médicos",
                description: "UPS Online de Doble Conversión con onda senoidal pura y tiempo de transferencia de 0 milisegundos para cargas críticas.",
                icon: "Server",
                examples: ["UPS Online 1kVA - 3kVA", "Onda senoidal pura", "Tiempo de transferencia 0ms"]
            }
        ],
        featuredProducts: [
            {
                id: "UPS-FORZA-500VA",
                sku: "FORZA-NT-512U",
                name: "UPS con Regulador Forza NT-512U 500VA 250W (Ideal Routers)",
                description: "Protección económica y efectiva con 4 tomas reguladas con respaldo. Mantiene tu router Wi-Fi y laptop funcionando en apagones.",
                price: 74.99,
                comparePrice: 89.00,
                stock: 25,
                imageUrl: "/images/products/ups-forza.jpg",
                tag: "Más Vendido",
                specs: ["500VA / 250W", "Regulación Automática AVR", "4 Tomas de Salida", "Protección de Línea Telefónica"]
            },
            {
                id: "UPS-POWEST-850VA",
                sku: "POWEST-MICROPOINT-850",
                name: "UPS Interactivo Powest 850VA con Display Digital LCD",
                description: "Monitoreo en tiempo real del voltaje de entrada, salida y nivel de batería en su pantalla LCD frontal.",
                price: 88.50,
                comparePrice: 105.00,
                stock: 18,
                imageUrl: "/images/products/ups-forza.jpg",
                specs: ["850VA / 480W", "Pantalla Digital LCD", "6 Tomas Protegidas", "Batería de Alta Durabilidad"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, deseo cotizar un UPS de respaldo para mis equipos en casa o negocio.",
        faq: [
            {
                question: "¿Cuánto tiempo dura la batería de un UPS durante un apagón?",
                answer: "Depende de la carga conectada. Para un router Wi-Fi de internet, un UPS de 500VA-850VA puede brindar de 2 a 4 horas continuas de conexión. Para una computadora de escritorio con monitor, brinda entre 15 y 30 minutos para guardar tus archivos y apagar de forma segura."
            }
        ]
    },
    {
        slug: "paneles-solares",
        squadId: "squad-3",
        squadCode: "S-03",
        squadName: "ANTI-APAGONES",
        colorTheme: "amber",
        name: "Paneles Solares & Autonomía Fotovoltaica",
        badge: "Energía Renovable Ininterrumpida",
        subtitle: "Genera tu Propia Electricidad con Paneles Monocristalinos e Inversores",
        heroHeadline: "Independencia Energética: Produce tu Propia Luz y Olvídate de la Red Eléctrica",
        heroPitch: "Módulos solares de alta eficiencia Longi y kits completos con inversores híbridos y baterías de ciclo profundo para casas de campo, fincas y negocios.",
        mission: "Acercar la energía solar fotovoltaica a las familias y negocios de Ecuador con tecnología eficiente y accesible.",
        targetAudience: "Fincas, casas de campo, urbanizaciones, galpones industriales y usuarios con cortes frecuentes.",
        priceRange: {
            min: 105.00,
            avg: "$105 - $1,242",
            max: 2800.00,
            currency: "USD",
            note: "Paneles solares de marcas Tier 1 mundiales con 25 años de garantía de generación."
        },
        scopes: [
            {
                title: "Paneles Individuales de Alta Potencia",
                description: "Módulos fotovoltaicos Longi 555W con celdas partidas y tecnología bifacial que aprovecha la radiación directa y el reflejo.",
                icon: "Sun",
                examples: ["Longi 555W Bifacial", "Eficiencia superior al 21.5%", "Vidrio templado anti-granizo"]
            },
            {
                title: "Kits Solares Autónomos Completos",
                description: "Sistemas completos que incluyen paneles, inversor híbrido de onda pura, controlador MPPT y banco de baterías.",
                icon: "Cpu",
                examples: ["Kit Solar 1000W Autonomía 5-8h", "Inversor Onda Pura", "Baterías de Ciclo Profundo"]
            }
        ],
        featuredProducts: [
            {
                id: "PANEL-LONGI-555W",
                sku: "LONGI-HI-MO5-555W",
                name: "Panel Solar Monocristalino Longi 555W Bifacial Tier 1",
                description: "Panel de máxima potencia y rendimiento garantizado por 25 años. Ideal para techos residenciales y sistemas industriales.",
                price: 105.00,
                comparePrice: 125.00,
                stock: 50,
                imageUrl: "/images/products/panel-longi-555w.jpg",
                tag: "Tier 1 Mundial",
                specs: ["555 Watts de Potencia", "Tecnología Bifacial", "Celdas Monocristalinas", "Garantía de Potencia 25 Años"]
            },
            {
                id: "KIT-SOLAR-1000W",
                sku: "KIT-SOLAR-OFFGRID-1KW",
                name: "Kit Paneles Solares 1000W con Inversor Híbrido (5-8h Respaldo)",
                description: "Sistema completo listo para instalar: paneles solares, inversor cargador MPPT y banco de baterías para alimentar luces, TV e internet.",
                price: 1242.00,
                comparePrice: 1450.00,
                stock: 8,
                imageUrl: "/images/products/kit-solar-1000w.jpg",
                tag: "Kit Completo",
                specs: ["1000W Capacidad", "Inversor Híbrido Onda Pura", "Baterías Ciclo Profundo", "Autonomía de 5 a 8 Horas"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, requiero una cotización y asesoría técnica para un sistema de Paneles Solares.",
        faq: [
            {
                question: "¿Qué puedo alimentar con un kit solar de 1000W?",
                answer: "Puede alimentar simultáneamente iluminación completa de la casa en LED, refrigerador eficiente, televisor inteligente, computadoras, routers y cargadores de celular durante 5 a 8 horas continuas sin luz de la calle."
            }
        ]
    },
    {
        slug: "cargadores-ev",
        squadId: "squad-3",
        squadCode: "S-03",
        squadName: "ANTI-APAGONES",
        colorTheme: "amber",
        name: "Cargadores para Autos Eléctricos (EV)",
        badge: "Movilidad Eléctrica Inteligente",
        subtitle: "Carga Rápida y Segura para tu Vehículo Eléctrico o Híbrido Enchufable",
        heroHeadline: "Carga tu Auto en Casa al Máximo: Rápido, Seguro y Económico",
        heroPitch: "Cargadores portátiles multiconector de 7.4kW y estaciones Wallbox inteligentes con control de corriente ajustable y compatibilidad con BYD, GWM, Hyundai y Kia.",
        mission: "Impulsar la transición a la movilidad sostenible en Ecuador ofreciendo equipos de carga EV certificados y adaptadores multiconector.",
        targetAudience: "Dueños de vehículos eléctricos e híbridos enchufables, edificios residenciales, concesionarios y centros comerciales.",
        priceRange: {
            min: 75.00,
            avg: "$380 - $450",
            max: 650.00,
            currency: "USD",
            note: "Equipos con protecciones térmicas, sobrevoltaje y fugas a tierra integradas."
        },
        scopes: [
            {
                title: "Cargadores Portátiles de Emergencia",
                description: "Llévalo en la cajuela y conéctate a cualquier toma 110V o 220V industrial en tus viajes por todo el Ecuador.",
                icon: "Zap",
                examples: ["Cargador ATOMIC 7.4kW", "Pantalla OLED con voltaje y amperaje", "Amperaje regulable 8A a 32A"]
            },
            {
                title: "Estaciones Wallbox de Pared",
                description: "Instalación fija en tu parqueadero con activación por tarjetas RFID para evitar que terceros usen tu cargador.",
                icon: "Sliders",
                examples: ["Wallbox 7.4kW / 11kW", "Tarjetas RFID de seguridad", "Protección IP65 para intemperie"]
            }
        ],
        featuredProducts: [
            {
                id: "WALLBOX-EV-7KW",
                sku: "EV-CHARGER-PORTABLE-7KW",
                name: "Cargador Portátil Multiconector EV Pro ATOMIC 7.4kW (Ajustable)",
                description: "Carga rápida regulable de 8A a 32A con pantalla LCD informativa, cable reforzado de 5 metros y conector universal compatible.",
                price: 380.00,
                comparePrice: 450.00,
                stock: 15,
                imageUrl: "/images/products/wallbox-ev.jpg",
                tag: "Universal",
                specs: ["Potencia hasta 7.4kW", "Pantalla Informativa LCD", "Cable 5m Uso Rudo", "Protección IP66 Impermeable"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, deseo consultar compatibilidad y precio para un Cargador de Auto Eléctrico.",
        faq: [
            {
                question: "¿Es compatible con autos chinos como BYD o GWM?",
                answer: "Sí, disponemos de cargadores y adaptadores para conectores Tipo 1 (J1772), Tipo 2 (Mennekes) y GBT (estándar chino de BYD y GWM)."
            }
        ]
    },
    {
        slug: "domotica-y-smart-home",
        squadId: "squad-4",
        squadCode: "S-04",
        squadName: "CASA FUTURISTA",
        colorTheme: "cyan",
        name: "Domótica & Casas Inteligentes",
        badge: "Smart Home de Lujo Accesible P4",
        subtitle: "Automatización por Voz con Alexa, Iluminación RGB y Control de Aparatos",
        heroHeadline: "Convierte tu Hogar en una Mansión Inteligente de Película",
        heroPitch: "Focos Wi-Fi multicolores, interruptores táctiles, relés ocultos y asistentes de voz Alexa para encender luces, programar rutinas y ahorrar energía desde tu celular.",
        mission: "Democratizar la automatización del hogar en Ecuador haciéndola fácil de instalar, accesible y compatible con comandos de voz en español.",
        targetAudience: "Familias, jóvenes, oficinas modernas, diseñadores de interiores y amantes de la tecnología.",
        priceRange: {
            min: 14.98,
            avg: "$20 - $110",
            max: 180.00,
            currency: "USD",
            note: "Dispositivos compatibles con aplicaciones Tuya Smart y Smart Life sin servidores de pago."
        },
        scopes: [
            {
                title: "Iluminación Inteligente & Escenas",
                description: "Cambia el color de la habitación con tu voz para crear el ambiente perfecto: modo cine, lectura o fiesta con 16 millones de colores.",
                icon: "Sparkles",
                examples: ["Focos LED RGB+W Wi-Fi", "Tiras LED sincronizables con música", "Temporizadores de encendido y apagado"]
            },
            {
                title: "Control de Artefactos & Electrodomésticos",
                description: "Enchufes y relés ocultos para controlar calefactores, cafeteras, ventiladores y bombas de agua desde cualquier sitio.",
                icon: "ToggleLeft",
                examples: ["Relés Wi-Fi para interruptores existentes", "Enchufes con medición de consumo eléctrico", "Escenarios automatizados por hora"]
            }
        ],
        featuredProducts: [
            {
                id: "FOCO-RGB-WIFI-10W",
                sku: "SMART-BULB-RGB-10W",
                name: "Foco LED Wi-Fi RGB+W 10W Inteligente Tuya / Steren",
                description: "16 millones de colores + luz blanca cálida y fría. Compatible con Alexa y Google Home sin necesidad de hub adicional.",
                price: 14.98,
                comparePrice: 19.99,
                stock: 40,
                imageUrl: "/images/products/foco-rgb-smart.jpg",
                tag: "Más Económico",
                specs: ["10W Bajo Consumo", "16 Millones de Colores", "Control por Voz Alexa/Google", "Conexión Wi-Fi Directa"]
            },
            {
                id: "RELE-WIFI-DIYS01",
                sku: "RELE-SMART-PST-TY",
                name: "Relé Wi-Fi Inteligente PST-TY-DIYS01 para Cajas Eléctricas",
                description: "Módulo diminuto que se oculta detrás de tus interruptores de pared convencionales para volverlos inteligentes sin cambiar tus placas.",
                price: 23.67,
                comparePrice: 30.00,
                stock: 25,
                imageUrl: "/images/products/rele-wifi.jpg",
                specs: ["Tamaño Miniatura", "Conserva el interruptor manual", "Soporta hasta 10A", "Compatible con SmartLife"]
            },
            {
                id: "ALEXA-ECHO-DOT-5",
                sku: "ECHO-DOT-5TH-GEN",
                name: "Asistente Inteligente Parlante Alexa Echo Dot (5ta Gen) Amazon",
                description: "El cerebro de tu casa inteligente. Sonido con bajos mejorados, sensor de temperatura y respuestas instantáneas por voz en español.",
                price: 111.36,
                comparePrice: 130.00,
                stock: 12,
                imageUrl: "/images/products/alexa-echo-dot.jpg",
                tag: "Cerebro Smart",
                specs: ["Sonido HD con Bajos Profundos", "Sensor de Temperatura", "Comandos de Voz en Español", "Control de Toda la Casa"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, deseo armar un paquete de Domótica y Focos Inteligentes para mi casa.",
        faq: [
            {
                question: "¿Necesito cableado especial para instalar focos inteligentes?",
                answer: "No. Los focos se enroscan exactamente igual que cualquier foco común en tu lámpara actual y se conectan a tu red Wi-Fi en 2 minutos con la app en tu celular."
            }
        ]
    },
    {
        slug: "computadores-y-laptops",
        squadId: "squad-5",
        squadCode: "S-05",
        squadName: "SETUP MÁXIMO",
        colorTheme: "violet",
        name: "Laptops, Computadores & Productividad",
        badge: "Alto Rendimiento Ejecutivo P5",
        subtitle: "Equipos Garantizados con Procesadores Intel y AMD para Trabajo Pesado",
        heroHeadline: "Potencia de Trabajo sin Pausas: Laptops y PCs de Alto Desempeño",
        heroPitch: "Laptops empresariales y computadoras armadas para diseño gráfico, programación, administración y teletrabajo con almacenamiento SSD ultrarrápido y garantía.",
        mission: "Equipar a profesionales, estudiantes y empresas en Ecuador con herramientas de computación de alto rendimiento y durabilidad comprobada.",
        targetAudience: "Empresarios, profesionales independientes, diseñadores, estudiantes universitarios y teletrabajadores.",
        priceRange: {
            min: 280.00,
            avg: "$450 - $850",
            max: 1400.00,
            currency: "USD",
            note: "Equipos nuevos y certificados con Windows original, garantía de 1 año y factura SRI."
        },
        scopes: [
            {
                title: "Laptops de Oficina & Teletrabajo",
                description: "Diseño delgado, batería de larga duración y pantallas antirreflejo para jornadas productivas sin fatiga visual.",
                icon: "Laptop",
                examples: ["HP / Lenovo Intel Core i5", "16GB Memoria RAM", "Discos de estado sólido SSD NVMe"]
            },
            {
                title: "Computadores de Escritorio & Mini PCs",
                description: "Estaciones de trabajo de escritorio diseñadas para durar años sin ralentizaciones en tareas administrativas y contables.",
                icon: "Cpu",
                examples: ["Mini PCs Beelink compactos", "Torres corporativas de alto flujo", "Soporte multi-monitor"]
            }
        ],
        featuredProducts: [
            {
                id: "LAPTOP-HP-I5-16GB",
                sku: "HP-15-I5-16GB-512SSD",
                name: "Laptop HP 15.6\" FHD Intel Core i5 16GB RAM 512GB SSD NVMe",
                description: "Rendimiento multitarea veloz para oficina, contabilidad y estudios. Teclado numérico completo y Windows 11.",
                price: 560.00,
                comparePrice: 650.00,
                stock: 10,
                imageUrl: "/images/products/laptop-hp-15.jpg",
                tag: "Recomendada",
                specs: ["Intel Core i5 10 Núcleos", "16GB RAM DDR4", "512GB SSD NVMe", "Pantalla 15.6\" FHD Antirreflejo"]
            },
            {
                id: "MINI-PC-BEELINK",
                sku: "MINI-PC-BEELINK-N100",
                name: "Mini PC Beelink Intel 12va Gen 16GB RAM 500GB SSD 4K Dual",
                description: "Ultracompacto (cabe en la palma de tu mano) y consume 10 veces menos luz que una torre tradicional. Soporta 2 pantallas 4K.",
                price: 280.00,
                comparePrice: 340.00,
                stock: 8,
                imageUrl: "/images/products/mini-pc-beelink.jpg",
                tag: "Ahorro de Espacio",
                specs: ["Intel 12va Generación", "16GB RAM", "Salida Dual HDMI 4K", "Ultra Silencioso"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, deseo cotizar una Laptop o Computador para mi trabajo.",
        faq: [
            {
                question: "¿Entregan con garantía y factura?",
                answer: "Sí, todos los equipos se entregan con factura autorizada por el SRI que desglosa el IVA 15% y garantía directa legal de 1 año con respaldo técnico en Ecuador."
            }
        ]
    },
    {
        slug: "gaming-y-consolas",
        squadId: "squad-5",
        squadCode: "S-05",
        squadName: "SETUP MÁXIMO",
        colorTheme: "violet",
        name: "Gaming, Consolas & Accesorios Pro",
        badge: "Rendimiento Competitivo",
        subtitle: "Consolas PlayStation, Mandos Inalámbricos y Periféricos Gamer",
        heroHeadline: "Juega sin Límites: Experiencia Fluida, Cero Latencia y Sonido Envolvente",
        heroPitch: "Consolas PlayStation 5, periféricos Redragon, teclados mecánicos de respuesta táctil inmediata y audífonos 7.1 con cancelación de ruido para streaming.",
        mission: "Proveer equipamiento gamer original de alta gama con entrega inmediata y garantía oficial en todo el país.",
        targetAudience: "Gamers, streamers, creadores de contenido y entusiastas de los videojuegos en Ecuador.",
        priceRange: {
            min: 48.00,
            avg: "$65 - $520",
            max: 680.00,
            currency: "USD",
            note: "Productos 100% nuevos, sellados de fábrica con homologación."
        },
        scopes: [
            {
                title: "Consolas & Mandos Oficiales",
                description: "La nueva generación de consolas con gráficos en 4K hasta 120 FPS y gatillos adaptativos.",
                icon: "Gamepad2",
                examples: ["PlayStation 5 Slim Digital", "Controles DualSense oficiales", "Cargadores dobles de mandos"]
            },
            {
                title: "Periféricos & Audio Inmersivo",
                description: "Teclados mecánicos con switches intercambiables y audífonos con micrófono de estudio para comunicación clara en partidas.",
                icon: "Headphones",
                examples: ["Audífonos Redragon Zeus Pro", "Teclados mecánicos RGB Hot-Swap", "Mouse gamer con sensor óptico de alta precisión"]
            }
        ],
        featuredProducts: [
            {
                id: "CONSOLE-PS5-SLIM",
                sku: "SONY-PS5-SLIM-DIGITAL",
                name: "Consola Sony PlayStation 5 Slim Digital Edition 1TB SSD",
                description: "Gráficos ultra realistas con trazado de rayos, audio 3D inmersivo y almacenamiento SSD de 1TB de alta velocidad.",
                price: 520.00,
                comparePrice: 590.00,
                stock: 6,
                imageUrl: "/images/products/ps5-slim.jpg",
                tag: "Edición Nueva",
                specs: ["1TB SSD Ultrarrápido", "4K HDR a 120Hz", "Mando DualSense Incluido", "Garantía Oficial"]
            },
            {
                id: "HEADSET-REDRAGON-ZEUS",
                sku: "REDRAGON-ZEUS-PRO",
                name: "Audífonos Gamer Redragon Zeus Pro Inalámbricos 7.1 Surround",
                description: "Sonido envolvente 7.1 para ubicar pasos con precisión, almohadillas de memoria viscoelástica y micrófono desmontable con filtro antipop.",
                price: 65.00,
                comparePrice: 85.00,
                stock: 14,
                imageUrl: "/images/products/headset-zeus.jpg",
                specs: ["Conexión Inalámbrica 2.4GHz + BT", "Audio Envolvente 7.1", "Micrófono con Cancelación", "Almohadillas Memory Foam"]
            }
        ],
        whatsappPitch: "Hola ATOMIC, deseo comprar productos Gaming / PlayStation.",
        faq: [
            {
                question: "¿Los productos son originales y sellados?",
                answer: "100% originales en caja sellada de fábrica con sellos de garantía intactos de Sony y marcas oficiales."
            }
        ]
    }
];

export function getCategoryBySlug(slug: string): SuicideSquadCategoryLanding | undefined {
    return SUICIDE_SQUAD_CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
}
