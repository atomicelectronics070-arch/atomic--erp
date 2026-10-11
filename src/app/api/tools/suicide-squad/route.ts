export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Category mapping definition for each Suicide Squad
export const SQUADS_CONFIG = [
    {
        id: "squad-1",
        code: "S-01",
        name: "EL GUARDIÁN URBANO",
        subtitle: "Seguridad Electrónica & CCTV Anti-Robo",
        priority: "P1 - CRÍTICA",
        priorityLevel: 1,
        viralScore: "9.8 / 10",
        ticketAvg: "$50 - $650",
        colorTheme: "rose" as const,
        categories: [
            "Cámaras de Seguridad",
            "Camaras de Seguridad",
            "Alarmas",
            "Seguridad LC"
        ],
        mission: "Prevenir asaltos e intrusiones antes de que sucedan en Ecuador mediante disuasión activa con luces, sirenas y visión a color 24/7.",
        viralHook: "Seguridad Activa vs Pasiva: 'Tu cámara vieja solo sirve para ver cómo te robaron. Esta cámara los saca corriendo.'",
        whatsappKeyword: "CAMARA",
        flagships: [
            { name: "Cámara Wi-Fi Bombilla Doble Lente Monitoreo 360°", price: 40.41, stock: 10, img: "/images/products/camara-bombilla.jpg" },
            { name: "Cámara IP Tubo Sellada con Luz Híbrida ColorVu 4MP", price: 51.45, stock: 5, img: "/images/products/camara-ip-colorvu.jpg" },
            { name: "Cámara IP SK Tipo Antivandálica 4MP IR 30m Metal", price: 124.81, stock: 10, img: "/images/products/camara-sk-4mp.jpg" },
            { name: "Kit CCTV Profesional 16 Cámaras HD 20 MP + NVR", price: 650.78, stock: 5, img: "/images/products/kit-cctv-16ch.jpg" }
        ],
        scriptTeleprompter: `[0-3s | GANCHO]: "¿Tu cámara de seguridad en Ecuador es de las que solo graban para cuando el robo ya ocurrió? Estás perdiendo tu tiempo."
[4-12s | DEMO]: "Esta cámara inteligente Atomic tiene visión nocturna a full color y cuando detecta silueta humana enciende luz led cegadora y hace sonar una sirena potente."
[13-20s | PRECIO]: "Cero mensualidades. La instalas tú mismo en 5 minutos por solo $40 con factura y garantía nacional."
[21-25s | CTA]: "Comenta 'CÁMARA' o escribe al WhatsApp en el perfil para enviarte el catálogo con precios de mayorista hoy mismo."`
    },
    {
        id: "squad-2",
        code: "S-02",
        name: "LLAVE CERO",
        subtitle: "Cerraduras Inteligentes & Control de Acceso",
        priority: "P2 - ALTA RENTABILIDAD",
        priorityLevel: 2,
        viralScore: "9.4 / 10",
        ticketAvg: "$80 - $800",
        colorTheme: "emerald" as const,
        categories: [
            "Control de Acceso",
            "Cerraduras Smart y Accesos",
            "Cerraduras Inteligentes",
            "Torniquetes y Control Peatonal",
            "Barreras Vehiculares",
            "Videoporteros e Intercomunicadores",
            "Kit Video Portero",
            "Portero Eléctrico",
            "Citófonos",
            "Video Botoneras",
            "Porteria Electronica"
        ],
        mission: "Eliminar las llaves físicas tradicionales en casas, oficinas y Airbnb de Ecuador. Control biométrico, códigos temporales y apertura remota.",
        viralHook: "El Fin de las Llaves Perdidas: 'Salí a trotar sin nada en los bolsillos y le abrí la puerta a un invitado desde mi trabajo.'",
        whatsappKeyword: "CERRADURA",
        flagships: [
            { name: "Cerradura Digital Manija N191A Diel (Económica)", price: 57.73, stock: 10, img: "/images/products/cerradura-n191a.jpg" },
            { name: "Cerradura Inteligente Wi-Fi Tuya OS956 (5 Métodos)", price: 234.12, stock: 10, img: "/images/products/cerradura-tuya-os956.jpg" },
            { name: "Control de Acceso Biométrico ZKTeco SenseFace 2A", price: 249.99, stock: 15, img: "/images/products/zkteco-senseface.jpg" },
            { name: "Kit Video Portero 7 Pulgadas Touch Diel IP", price: 169.73, stock: 10, img: "/images/products/kit-videoportero-7.jpg" }
        ],
        scriptTeleprompter: `[0-3s | GANCHO]: *(Tira llaves a la mesa)* "En pleno 2026 y todavía sigues cargando este montón de fierro como si vivieras en los 90."
[4-12s | DEMO]: "Mira esto: un toque con mi pulgar y la puerta se abre en 0.3 segundos. Si viene una visita o el repartidor, le genero una clave temporal desde el celular que dura 1 hora y se borra sola."
[13-20s | OBJECIÓN]: "¿Y si se acaba la batería? Te avisa 1 mes antes y tiene puerto USB-C de auxilio para emergencias."
[21-25s | CTA]: "Escríbenos al enlace de WhatsApp en el perfil con la palabra 'CERRADURA' y recibe tu cotización en 2 minutos con envío a todo el país."`
    },
    {
        id: "squad-3",
        code: "S-03",
        name: "ANTI-APAGONES",
        subtitle: "Energía de Respaldo, Paneles Solares & Movilidad EV",
        priority: "P3 - ALTA URGENCIA",
        priorityLevel: 3,
        viralScore: "9.1 / 10",
        ticketAvg: "$120 - $2,500",
        colorTheme: "amber" as const,
        categories: [
            "UPS y Energía",
            "UPS y Reguladores",
            "Paneles Solares",
            "Movilidad Eléctrica & Cargadores EV",
            "Fuentes de Poder"
        ],
        mission: "Blindar negocios, routers, cámaras y hogares de los cortes de luz en Ecuador. Autonomía solar y estaciones de carga rápida.",
        viralHook: "Independencia Eléctrica Total: 'Todo mi barrio se quedó a oscuras, pero mi negocio sigue facturando y mis luces siguen prendidas.'",
        whatsappKeyword: "ENERGIA",
        flagships: [
            { name: "UPS con Regulador Forza NT-512U 500VA 250W (Routers)", price: 74.99, stock: 10, img: "/images/products/ups-forza.jpg" },
            { name: "Panel Solar Monocristalino Longi 555W Bifacial", price: 105.00, stock: 50, img: "/images/products/panel-longi-555w.jpg" },
            { name: "Kit Paneles Solares 1000 W (5-8 Horas Respaldo)", price: 1242.00, stock: 10, img: "/images/products/kit-solar-1000w.jpg" },
            { name: "Cargador Portátil Multiconector EV Pro ATOMIC 7.4kW", price: 380.00, stock: 30, img: "/images/products/wallbox-ev.jpg" }
        ],
        scriptTeleprompter: `[0-3s | GANCHO]: *(Baja breaker de luz, habitación queda iluminada por respaldo)* "¿Se fue la luz en tu sector otra vez? Mira mi escritorio."
[4-12s | DEMO]: "Con este sistema de respaldo inteligente Atomic, la transferencia ocurre en 4 milisegundos. Tu internet, tus computadoras y tus cámaras ni siquiera pestañean."
[13-20s | SOLUCIÓN]: "Desde un UPS de $75 para que nunca se te corte el Wi-Fi en llamadas, hasta kits solares completos para no depender de la empresa eléctrica nunca más."
[21-25s | CTA]: "Haz clic en el enlace del perfil o escribe 'ENERGIA' por WhatsApp para calcular el consumo exacto de tu casa o negocio gratis."`
    },
    {
        id: "squad-4",
        code: "S-04",
        name: "CASA FUTURISTA",
        subtitle: "Domótica, Smart Home & Audio Conectado",
        priority: "P4 - VIRAL RÁPIDO",
        priorityLevel: 4,
        viralScore: "9.6 / 10",
        ticketAvg: "$20 - $200",
        colorTheme: "cyan" as const,
        categories: [
            "Domótica",
            "Iluminacion",
            "Audio y Sonido",
            "Audio y Video",
            "Automatización Inteligente",
            "MT-Hogar",
            "Sensores y Módulos"
        ],
        mission: "Democratizar la domótica de lujo en Ecuador. Automatización por voz con Alexa, escenas de iluminación y control de electrodomésticos.",
        viralHook: "Lujo Accesible: 'Convertí mi departamento común en una mansión inteligente de película por menos de $50.'",
        whatsappKeyword: "DOMOTICA",
        flagships: [
            { name: "Foco LED Wi-Fi RGB+W 10W Inteligente Tuya / Steren", price: 14.98, stock: 10, img: "/images/products/foco-rgb-smart.jpg" },
            { name: "Relé Wi-Fi Inteligente PST-TY-DIYS01 para Enchufes", price: 23.67, stock: 3, img: "/images/products/rele-wifi.jpg" },
            { name: "Parlante Alexa Echo Dot (5th Gen) Amazon Sonido HD", price: 111.36, stock: 10, img: "/images/products/alexa-echo-dot.jpg" },
            { name: "JBL GO 3 Parlante Bluetooth Sumergible Portátil", price: 62.36, stock: 10, img: "/images/products/jbl-go3.jpg" }
        ],
        scriptTeleprompter: `[0-3s | GANCHO]: "Alexa, modo cine." *(Las luces bajan a púrpura, se enciende la pantalla y suena música ambiental)*
[4-12s | DEMO]: "La gente cree que para tener esto tienes que ser millonario. Esto se hace con dos focos inteligentes de $14 y un módulo Wi-Fi que conectas a cualquier lámpara."
[13-20s | COMODIDAD]: "Puedes programar que el café se caliente solo, o apagar todas las luces de la casa sin levantarte de la cama."
[21-25s | CTA]: "Comenta 'DOMOTICA' y te mandamos por WhatsApp el paquete exacto para automatizar tu cuarto o sala hoy mismo."`
    },
    {
        id: "squad-5",
        code: "S-05",
        name: "SETUP MÁXIMO",
        subtitle: "High-Tech, Gaming & Productividad Empresarial",
        priority: "P5 - TRÁFICO MASIVO",
        priorityLevel: 5,
        viralScore: "8.9 / 10",
        ticketAvg: "$150 - $1,300",
        colorTheme: "violet" as const,
        categories: [
            "Celulares, Tablets y Computacion",
            "Celulares y Tablets",
            "Celulares",
            "Computadores",
            "Laptops",
            "Monitores",
            "Monitores LC",
            "Gaming & Consolas",
            "Gaming",
            "Consolas de Video Juegos",
            "Mandos para Consolas",
            "Tarjetas de Video",
            "Procesadores",
            "Motherboards",
            "Discos Duros",
            "Memorias RAM",
            "Componentes de PC"
        ],
        mission: "Equipar a gamers, programadores, creadores y oficinas con hardware de última generación al mejor precio directo de importación.",
        viralHook: "Unboxing Satisfactorio & Rendimiento Real: 'Compré esta laptop creyendo que era una básica de oficina y me dejó con la boca abierta editando 4K.'",
        whatsappKeyword: "GAMING",
        flagships: [
            { name: "Monitor Gaming ASRock 24.5\" IPS 192Hz Ultra Rápido", price: 277.73, stock: 10, img: "/images/products/monitor-192hz.jpg" },
            { name: "Tarjeta de Video ASUS Dual RTX-5060 EVO OC 8GB GDDR7", price: 687.17, stock: 10, img: "/images/products/rtx-5060.jpg" },
            { name: "Laptop Lenovo ThinkBook 14 G7 AMD Ryzen 5 16GB 512GB", price: 1039.49, stock: 10, img: "/images/products/laptop-lenovo.jpg" },
            { name: "PlayStation Portal Remote Player (Blanco)", price: 350.00, stock: 10, img: "/images/products/ps-portal.jpg" }
        ],
        scriptTeleprompter: `[0-3s | GANCHO]: *(ASMR arrancando plástico de pantalla gamer)* "La sensación de estrenar un monitor de 192 Hertz no se compara con nada en el mundo."
[4-12s | DEMO]: "Panel IPS, respuesta de 1 milisegundo, colores calibrados. Si pasas más de 8 horas al día trabajando o jugando, tus ojos van a notar la diferencia en el primer segundo."
[13-20s | CONFIANZA]: "Garantía local directa en Ecuador, factura autorizada con IVA y entrega inmediata sin intermediarios."
[21-25s | CTA]: "Escríbenos 'GAMING' por WhatsApp para enviarte las promociones especiales con envío express."`
    }
]

// Taxonomy rules for Subcategory drilldown
export interface SubcategoryRule {
    id: string
    name: string
    keywords: string[]
    description: string
}

function normalizeStr(text: string) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

export const CATEGORY_TAXONOMY: Record<string, SubcategoryRule[]> = {
    // Escuadra 1: Guardián Urbano
    "camaras de seguridad": [
        { id: "tubo-bala", name: "Cámaras Tubo / Bala Exterior", keywords: ["bala", "tubo", "exterior"], description: "Para fachadas, postes y exteriores resistentes a lluvia IP67" },
        { id: "domo", name: "Cámaras Domo Interior / Techo", keywords: ["domo", "interior"], description: "Diseño discreto para cielo raso en oficinas y salas" },
        { id: "wifi-ptz", name: "Cámaras Wi-Fi & Robóticas PTZ 360°", keywords: ["wifi", "wi-fi", "ptz", "bombilla", "robotica", "robótica", "inalambrica", "inalámbrica"], description: "Conexión a celular sin cables, seguimiento inteligente y rotación" },
        { id: "nvr-dvr", name: "Grabadores NVR, DVR & Almacenamiento", keywords: ["nvr", "dvr", "xvr", "grabador", "hdd"], description: "Sistemas de grabación continua 24/7 y servidores de video" },
        { id: "kits-accesorios", name: "Kits CCTV & Accesorios de Conexión", keywords: ["balun", "conector", "cable", "rack", "gabinete", "soporte", "kit", "probador"], description: "Baluns pasivos, conectores de corriente, cables siameses y racks" },
        { id: "especiales", name: "Cámaras Especiales & Ojo de Pez", keywords: ["ojo de pez", "fisheye", "termica", "térmica", "antivand", "antiband"], description: "Monitoreo panorámico 360° y lentes antivandálicos reforzados" }
    ],
    "alarmas": [
        { id: "sensores", name: "Sensores de Movimiento & Magnéticos", keywords: ["sensor", "pir", "magnetico", "magnético", "detector"], description: "Detección de apertura de puertas y presencia de intrusos" },
        { id: "sirenas", name: "Sirenas de Alta Potencia & Estrobos", keywords: ["sirena", "bocina", "estrobo", "luz"], description: "Disuasión auditiva y luminosa de alto impacto sonoro" },
        { id: "centrales", name: "Centrales de Alarma & Paneles", keywords: ["panel", "central", "kit alarma", "dsc"], description: "Cerebros de control con comunicación GSM y celular" },
        { id: "panico", name: "Botones de Pánico & Controles", keywords: ["panico", "pánico", "pulsador", "control"], description: "Activación inmediata ante emergencias y asaltos" }
    ],
    // Escuadra 2: Llave Cero
    "control de acceso": [
        { id: "biometricos", name: "Biométricos Faciales & Huella Digital", keywords: ["biometr", "huella", "facial", "face", "zkteco"], description: "Registro biométrico sin contacto de alta velocidad" },
        { id: "chapas", name: "Cerraduras Electromagnéticas & Chapas", keywords: ["cerradura", "chapa", "electroim", "destrab"], description: "Fuerza de sujeción para puertas de madera, vidrio o metal" },
        { id: "rfid", name: "Tarjetas RFID & Tags de Proximidad", keywords: ["tarjeta", "rfid", "tag", "llavero", "proxim"], description: "Credenciales seguras para residentes y empleados" },
        { id: "botones", name: "Pulsadores & Botones de Salida Touch", keywords: ["boton", "botón", "pulsador", "salida", "exit", "touch"], description: "Apertura sin contacto / liberación rápida" },
        { id: "fuentes-acceso", name: "Fuentes & Respaldo para Accesos", keywords: ["fuente", "respaldo", "bater", "cargador"], description: "Suministro eléctrico con batería para no quedar bloqueado" }
    ],
    "cerraduras smart y accesos": [
        { id: "cerraduras-wifi", name: "Cerraduras Inteligentes Wi-Fi / Bluetooth", keywords: ["wifi", "wi-fi", "smart", "bluetooth", "tuya"], description: "Apertura remota desde celular y contraseñas temporales" },
        { id: "manijas-digitales", name: "Manijas Digitales con Huella y Clave", keywords: ["manija", "huella", "teclado", "digital"], description: "Sustituto directo de cerraduras convencionales" },
        { id: "vidrio-aluminio", name: "Cerraduras para Puertas de Vidrio y Aluminio", keywords: ["vidrio", "cristal", "aluminio"], description: "Diseñadas para locales comerciales y puertas corredizas" }
    ],
    "cerraduras inteligentes": [
        { id: "cerraduras-wifi", name: "Cerraduras Inteligentes Wi-Fi / Bluetooth", keywords: ["wifi", "wi-fi", "smart", "bluetooth", "tuya"], description: "Apertura remota desde celular y contraseñas temporales" },
        { id: "manijas-digitales", name: "Manijas Digitales con Huella y Clave", keywords: ["manija", "huella", "teclado", "digital"], description: "Sustituto directo de cerraduras convencionales" }
    ],
    "videoporteros e intercomunicadores": [
        { id: "kits-video", name: "Kits de Videoportero IP & Pantallas Touch", keywords: ["kit", "pantalla", "monitor", "touch", "ip", "7"], description: "Pantalla a color en sala o cocina con llamada al celular" },
        { id: "frentes-calle", name: "Frentes de Calle & Video Botoneras", keywords: ["frente", "placa", "botonera", "timbre"], description: "Unidad exterior resistente a lluvia con cámara HD" },
        { id: "citofonos", name: "Citófonos & Intercomunicadores de Audio", keywords: ["citofon", "citófon", "audio", "intercom"], description: "Comunicación clásica y económica para condominios" }
    ],
    "barreras vehiculares": [
        { id: "barreras-auto", name: "Barreras Vehiculares Automáticas", keywords: ["barrera", "pluma", "motor"], description: "Apertura rápida para control de estacionamientos" },
        { id: "accesorios-vehicular", name: "Plumas, Sensores de Masa & Controles", keywords: ["brazo", "lazo", "sensor", "control"], description: "Mástiles articulados y sensores inductivos anti-aplastamiento" }
    ],
    "torniquetes y control peatonal": [
        { id: "torniquetes-tripode", name: "Torniquetes Trípode & Pasarelas Flap", keywords: ["torniquete", "tripode", "trípode", "pasarela", "peatonal"], description: "Control estricto de entrada uno a uno para empresas y gimnasios" }
    ],
    // Escuadra 3: Anti-Apagones
    "ups y energia": [
        { id: "ups-hogar", name: "UPS para Routers, Cámaras & Home Office", keywords: ["router", "mini ups", "500va", "650va", "800va", "nt-512"], description: "Mantiene el Wi-Fi y laptops encendidos durante apagones" },
        { id: "ups-industrial", name: "UPS Online Corporativos & Servidores", keywords: ["1000va", "1500va", "2000va", "3000va", "online", "forza", "rack"], description: "Cero milisegundos de corte para servidores y equipos críticos" },
        { id: "reguladores", name: "Reguladores de Voltaje Automáticos (AVR)", keywords: ["regulador", "avr", "estabilizador"], description: "Protección contra picos de voltaje y variaciones bruscas" },
        { id: "baterias-respaldo", name: "Baterías de Ciclo Profundo & Reemplazo", keywords: ["bateria", "batería", "12v", "7ah", "9ah", "gel"], description: "Repuestos certificados para UPS y bancos de energía" }
    ],
    "ups y reguladores": [
        { id: "ups-hogar", name: "UPS para Routers, Cámaras & Home Office", keywords: ["router", "mini ups", "500va", "650va", "800va", "nt-512"], description: "Mantiene el Wi-Fi y laptops encendidos durante apagones" },
        { id: "reguladores", name: "Reguladores de Voltaje Automáticos (AVR)", keywords: ["regulador", "avr", "estabilizador"], description: "Protección contra picos de voltaje y variaciones bruscas" }
    ],
    "paneles solares": [
        { id: "paneles-mono", name: "Paneles Solares Monocristalinos & Bifaciales", keywords: ["panel", "solar", "longi", "trina", "550w"], description: "Generación fotovoltaica de alta eficiencia garantizada" },
        { id: "controladores-inversores", name: "Inversores & Controladores de Carga MPPT", keywords: ["inversor", "controlador", "mppt", "hibrido", "híbrido"], description: "Conversión de energía solar a corriente 110V/220V" }
    ],
    "movilidad electrica & cargadores ev": [
        { id: "wallbox-ev", name: "Cargadores EV Portátiles & Wallbox", keywords: ["cargador", "ev", "wallbox", "7.4kw", "tipo 2", "j1772"], description: "Carga rápida para vehículos eléctricos en casa o negocio" }
    ],
    "fuentes de poder": [
        { id: "fuentes-switching", name: "Fuentes Switching 12V / 24V Reguladas", keywords: ["fuente", "12v", "24v", "2a", "5a", "10a", "20a", "30a"], description: "Alimentación estable para cámaras, tiras LED y biométricos" },
        { id: "fuentes-cctv", name: "Fuentes Centralizadas con Caja de Fusibles", keywords: ["centralizada", "caja", "fusible", "canal"], description: "Unifica la energía de 4, 8 o 16 cámaras en un solo gabinete" }
    ],
    // Escuadra 4: Casa Futurista
    "domotica": [
        { id: "interruptores-smart", name: "Interruptores Inteligentes Touch Wi-Fi", keywords: ["interruptor", "switch", "touch", "gang"], description: "Control de luces por voz con Alexa o desde la app" },
        { id: "enchufes-reles", name: "Enchufes Smart & Relés Ocultos", keywords: ["enchufe", "rele", "relé", "smart plug", "sonoff", "mini"], description: "Automatiza cualquier electrodoméstico o cafetera" },
        { id: "motores-smart", name: "Motores para Cortinas & Persianas", keywords: ["cortina", "persiana", "motor"], description: "Apertura y cierre automático programado por horario" }
    ],
    "iluminacion": [
        { id: "focos-rgb", name: "Focos LED Inteligentes RGB+CCT", keywords: ["foco", "rgb", "bombillo", "e27", "dicroico"], description: "16 millones de colores y luz blanca cálida / fría regulable" },
        { id: "tiras-led", name: "Tiras LED Neón & Perfiles de Iluminación", keywords: ["tira", "neon", "neón", "perfil", "rgbic"], description: "Iluminación indirecta moderna para salas y dormitorios" },
        { id: "paneles-techo", name: "Paneles & Lámparas LED de Techo", keywords: ["panel", "lampara", "lámpara", "plafon", "plafón", "downlight"], description: "Iluminación principal de bajo consumo" }
    ],
    "audio y sonido": [
        { id: "parlantes-smart", name: "Parlantes Inteligentes & Asistentes de Voz", keywords: ["alexa", "echo", "google", "smart speaker"], description: "Controla toda tu casa con comandos de voz" },
        { id: "parlantes-bt", name: "Parlantes Bluetooth Portátiles & Acuáticos", keywords: ["jbl", "bluetooth", "portatil", "portátil", "go"], description: "Sonido potente para llevar a cualquier lugar" },
        { id: "audio-ambiental", name: "Audio Ambiental & Parlantes de Cielo Raso", keywords: ["ambiental", "techo", "amplificador", "perifoneo"], description: "Música de fondo distribuida para casas u oficinas" }
    ],
    "sensores y modulos": [
        { id: "sensores-hogar", name: "Sensores de Puertas, Ventanas & Presencia", keywords: ["puerta", "ventana", "sensor", "pir", "presencia"], description: "Automatiza luces al entrar o recibe alertas de intrusión" },
        { id: "sensores-clima", name: "Sensores de Temperatura, Humedad & Humo", keywords: ["temperatura", "humedad", "humo", "gas", "agua"], description: "Monitoreo preventivo del confort y la seguridad del hogar" }
    ],
    // Escuadra 5: Setup Máximo
    "celulares y tablets": [
        { id: "smartphones", name: "Smartphones & Celulares", keywords: ["samsung", "xiaomi", "redmi", "honor", "realme", "infinix", "iphone"], description: "Teléfonos inteligentes de última generación con garantía" },
        { id: "tablets", name: "Tablets para Trabajo & Estudio", keywords: ["tablet", "tab", "ipad", "lenovo"], description: "Pantallas portátiles ideales para lectura, trabajo y clases" },
        { id: "accesorios-movil", name: "Cargadores Rápidos, Cables & Soportes", keywords: ["cargador", "cable", "soporte", "tipo c", "lightning"], description: "Carga turbo y conectividad para dispositivos móviles" }
    ],
    "computadores": [
        { id: "laptops-gamer", name: "Laptops Gamer & Alto Rendimiento", keywords: ["gamer", "gaming", "rtx", "tuf", "victus", "legion", "i7", "ryzen 7"], description: "Potencia gráfica para renderizado 3D y videojuegos" },
        { id: "laptops-oficina", name: "Laptops Ejecutivas & Oficina", keywords: ["laptop", "thinkpad", "ideapad", "dell", "hp", "vivobook", "i3", "i5", "ryzen 5"], description: "Portabilidad, rapidez y batería de larga duración" },
        { id: "pcs-aio", name: "Computadoras All in One & Escritorio", keywords: ["pc", "all in one", "aio", "desktop", "computador"], description: "Soluciones completas de cómputo para puestos de trabajo" }
    ],
    "laptops": [
        { id: "laptops-gamer", name: "Laptops Gamer & Alto Rendimiento", keywords: ["gamer", "gaming", "rtx", "tuf", "victus", "legion", "i7", "ryzen 7"], description: "Potencia gráfica para renderizado 3D y videojuegos" },
        { id: "laptops-oficina", name: "Laptops Ejecutivas & Oficina", keywords: ["laptop", "thinkpad", "ideapad", "dell", "hp", "vivobook", "i3", "i5", "ryzen 5"], description: "Portabilidad, rapidez y batería de larga duración" }
    ],
    "monitores": [
        { id: "monitores-gamer", name: "Monitores Gamer 144Hz - 240Hz", keywords: ["144hz", "165hz", "180hz", "192hz", "240hz", "curvo"], description: "Tasa de refresco ultra fluida para gaming competitivo" },
        { id: "monitores-diseno", name: "Monitores IPS para Oficina & Diseño", keywords: ["ips", "24", "27", "fhd", "4k", "led"], description: "Precisión de color y confort visual para largas jornadas" }
    ],
    "gaming & consolas": [
        { id: "consolas", name: "Consolas de Videojuegos & Portátiles", keywords: ["playstation", "ps5", "nintendo", "switch", "xbox", "portal"], description: "Consolas originales con garantía y stock inmediato" },
        { id: "mandos", name: "Mandos, Controles & Joysticks", keywords: ["mando", "control", "dualsense", "joystick"], description: "Mandos inalámbricos oficiales y de alto rendimiento" }
    ],
    "gaming": [
        { id: "consolas", name: "Consolas de Videojuegos", keywords: ["playstation", "ps5", "nintendo", "switch", "xbox"], description: "Consolas originales con garantía" },
        { id: "mandos", name: "Mandos & Periféricos Gamer", keywords: ["mando", "control", "teclado", "mouse", "auricular"], description: "Control y accesorios gamer" }
    ],
    "tarjetas de video": [
        { id: "rtx-series", name: "Tarjetas Gráficas NVIDIA GeForce RTX", keywords: ["rtx", "geforce", "nvidia", "3050", "3060", "4060", "5060"], description: "Ray tracing e IA para gráficos de máxima fidelidad" }
    ],
    "discos duros": [
        { id: "ssd-nvme", name: "Discos Sólidos SSD NVMe & SATA", keywords: ["ssd", "nvme", "m.2", "solido", "sólido", "kingston", "western"], description: "Velocidad extrema de arranque y carga de programas" }
    ],
    "memorias ram": [
        { id: "ram-ddr4-ddr5", name: "Memorias RAM DDR4 & DDR5", keywords: ["ddr4", "ddr5", "ram", "8gb", "16gb", "32gb"], description: "Fluidez para multitarea pesada y creación de contenido" }
    ],
    "procesadores": [
        { id: "cpu-intel-amd", name: "Procesadores Intel Core & AMD Ryzen", keywords: ["intel", "core", "ryzen", "amd", "i5", "i7", "i9"], description: "El motor de procesamiento para armar o actualizar tu PC" }
    ]
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const action = searchParams.get("action")

        // ── ACTION: GET SUBCATEGORIES FOR A SPECIFIC CATEGORY ──
        if (action === "subcategories") {
            const categoryName = (searchParams.get("categoryName") || "").trim()
            if (!categoryName) {
                return NextResponse.json({ success: false, error: "categoryName es requerido" }, { status: 400 })
            }

            // Find category in DB
            const dbCategory = await prisma.category.findFirst({
                where: {
                    name: { equals: categoryName, mode: "insensitive" }
                },
                include: {
                    subcategories: {
                        select: {
                            id: true,
                            name: true,
                            _count: { select: { products: true } }
                        }
                    }
                }
            })

            // Get total products in this category
            const total = await prisma.product.count({
                where: {
                    isDeleted: false,
                    isActive: true,
                    category: { name: { equals: categoryName, mode: "insensitive" } }
                }
            })

            const normalizedKey = normalizeStr(categoryName)
            const rules = CATEGORY_TAXONOMY[normalizedKey] || []

            // If category has DB subcategories with products, format those first
            const formattedSubs: any[] = []

            // Always add the "Todas las Referencias" master card
            formattedSubs.push({
                id: "all",
                name: `⭐ Todos los Modelos (${total})`,
                description: `Explorar catálogo completo de ${categoryName}`,
                count: total,
                keywords: [],
                isAll: true
            })

            // If taxonomy rules exist, evaluate product count for each rule
            for (const rule of rules) {
                const count = await prisma.product.count({
                    where: {
                        isDeleted: false,
                        isActive: true,
                        category: { name: { equals: categoryName, mode: "insensitive" } },
                        OR: rule.keywords.map(kw => ({
                            name: { contains: kw, mode: "insensitive" }
                        }))
                    }
                })

                if (count > 0) {
                    formattedSubs.push({
                        id: rule.id,
                        name: rule.name,
                        description: rule.description,
                        count,
                        keywords: rule.keywords,
                        isAll: false
                    })
                }
            }

            // Include any DB-defined subcategories if they exist
            if (dbCategory?.subcategories && dbCategory.subcategories.length > 0) {
                for (const sub of dbCategory.subcategories) {
                    if (sub._count.products > 0 && !formattedSubs.some(s => s.name.toLowerCase() === sub.name.toLowerCase())) {
                        formattedSubs.push({
                            id: sub.id,
                            name: sub.name,
                            description: `Subcategoría oficial registrada en el sistema`,
                            count: sub._count.products,
                            keywords: [sub.name.toLowerCase()],
                            isAll: false
                        })
                    }
                }
            }

            return NextResponse.json({
                success: true,
                categoryName,
                total,
                subcategories: formattedSubs
            })
        }

        // ── ACTION: GET PRODUCTS (Hierarchical Level 3 & Drawer) ──
        if (action === "products") {
            const squadId = searchParams.get("squadId")
            const categoryName = (searchParams.get("categoryName") || "").trim()
            const subcategoryKeywords = (searchParams.get("keywords") || "").trim()
            const query = (searchParams.get("query") || "").trim()
            const sortBy = searchParams.get("sortBy") || "price_asc" // price_asc, price_desc, name_asc
            const page = parseInt(searchParams.get("page") || "1", 10)
            const limit = parseInt(searchParams.get("limit") || "40", 10)

            const whereClause: any = {
                isDeleted: false,
                isActive: true
            }

            // Category filter
            if (categoryName) {
                whereClause.category = { name: { equals: categoryName, mode: "insensitive" } }
            } else if (squadId) {
                const squadConfig = SQUADS_CONFIG.find(s => s.id === squadId) || SQUADS_CONFIG[0]
                whereClause.category = { name: { in: squadConfig.categories } }
            }

            // Subcategory keywords filter
            if (subcategoryKeywords && subcategoryKeywords !== "all") {
                const kwArray = subcategoryKeywords.split(",").map(k => k.trim()).filter(Boolean)
                if (kwArray.length > 0) {
                    whereClause.AND = [
                        ...(whereClause.AND || []),
                        {
                            OR: kwArray.map(kw => ({
                                name: { contains: kw, mode: "insensitive" }
                            }))
                        }
                    ]
                }
            }

            // Free text search
            if (query) {
                whereClause.AND = [
                    ...(whereClause.AND || []),
                    {
                        OR: [
                            { name: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } },
                            { sku: { contains: query, mode: "insensitive" } },
                            { keywords: { contains: query, mode: "insensitive" } }
                        ]
                    }
                ]
            }

            // Determine sort order
            let orderBy: any = { price: "asc" }
            if (sortBy === "price_desc") orderBy = { price: "desc" }
            else if (sortBy === "name_asc") orderBy = { name: "asc" }

            const total = await prisma.product.count({ where: whereClause })
            const rawProducts = await prisma.product.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    compareAtPrice: true,
                    sku: true,
                    stock: true,
                    images: true,
                    specSheetUrl: true,
                    category: { select: { name: true, slug: true } }
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit
            })

            // Format with explicit PVP Público and public product URL
            const products = rawProducts.map(p => {
                const pvp = p.price
                const distributorPrice = p.compareAtPrice && p.compareAtPrice > 0 ? p.compareAtPrice : null
                const publicUrl = `https://atomiccotizador.shop/web/product/${p.id}`

                return {
                    ...p,
                    pvp,
                    distributorPrice,
                    publicUrl,
                    whatsappPitch: `*${p.name}*\n🏷️ *PVP Público:* $${pvp.toFixed(2)} (Inc. IVA)\n📦 Stock: ${p.stock > 0 ? `${p.stock} unid.` : 'Bajo Pedido'}\n🔗 Comprar aquí: ${publicUrl}`
                }
            })

            return NextResponse.json({
                success: true,
                products,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            })
        }

        // ── ACTION: DEFAULT (GET MAIN SQUADS METADATA & PERSISTED ASSIGNMENTS) ──
        // 1. Get all system users available for assignment
        const systemUsers = await prisma.user.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profileData: true,
                cedula: true
            },
            orderBy: [{ role: "asc" }, { name: "asc" }]
        })

        // 2. Query real product count per category and per squad in parallel
        const allCategories = await prisma.category.findMany({
            select: { id: true, name: true }
        })
        const nameById = Object.fromEntries(allCategories.map(c => [c.id, c.name]))

        const groupCounts = await prisma.product.groupBy({
            by: ['categoryId'],
            where: { isDeleted: false, isActive: true },
            _count: { id: true }
        })

        const categoryCountsMap: Record<string, number> = {}
        for (const gc of groupCounts) {
            if (gc.categoryId && nameById[gc.categoryId]) {
                categoryCountsMap[nameById[gc.categoryId]] = gc._count.id
            }
        }

        // 3. Retrieve saved squad assignments from SystemSetting
        let savedAssignments: Record<string, any[]> = {}
        try {
            const setting = await prisma.systemSetting.findUnique({
                where: { key: "SUICIDE_SQUAD_ASSIGNMENTS" }
            })
            if (setting && setting.value) {
                savedAssignments = JSON.parse(setting.value)
            }
        } catch (e) {}

        // Combine squads configuration with live counts and categorized details
        const squadsWithData = SQUADS_CONFIG.map(s => {
            const members = savedAssignments[s.id] || []
            let squadTotal = 0

            const categoryDetails = s.categories.map(catName => {
                const count = categoryCountsMap[catName] || 0
                squadTotal += count
                return {
                    name: catName,
                    count
                }
            })

            return {
                ...s,
                productCount: squadTotal,
                categoryDetails,
                members
            }
        })

        return NextResponse.json({
            success: true,
            totalProductsInCatalog: 9736,
            squads: squadsWithData,
            systemUsers
        })

    } catch (error: any) {
        console.error("Error in /api/tools/suicide-squad:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { assignments } = body

        if (!assignments || typeof assignments !== "object") {
            return NextResponse.json({ success: false, error: "Estructura de asignaciones inválida" }, { status: 400 })
        }

        // Persist to SystemSetting
        await prisma.systemSetting.upsert({
            where: { key: "SUICIDE_SQUAD_ASSIGNMENTS" },
            create: {
                key: "SUICIDE_SQUAD_ASSIGNMENTS",
                value: JSON.stringify(assignments),
                description: "Asignación de miembros y roles en las 5 escuadras de Suicide Squad"
            },
            update: {
                value: JSON.stringify(assignments)
            }
        })

        return NextResponse.json({
            success: true,
            message: "Asignaciones de Suicide Squad guardadas y sincronizadas exitosamente en el sistema."
        })
    } catch (error: any) {
        console.error("Error saving suicide squad assignments:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
