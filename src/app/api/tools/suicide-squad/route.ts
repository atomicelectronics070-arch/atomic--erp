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
        colorTheme: "rose",
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
        colorTheme: "emerald",
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
        colorTheme: "amber",
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
        colorTheme: "cyan",
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
        colorTheme: "violet",
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

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const action = searchParams.get("action")

        // ── ACTION 1: GET ALL PRODUCTS FOR A SPECIFIC SQUAD (Scroll Drawer) ──
        if (action === "products") {
            const squadId = searchParams.get("squadId") || "squad-1"
            const query = (searchParams.get("query") || "").trim()
            const sortBy = searchParams.get("sortBy") || "price_asc" // price_asc, price_desc, name_asc
            const page = parseInt(searchParams.get("page") || "1", 10)
            const limit = parseInt(searchParams.get("limit") || "40", 10)

            const squadConfig = SQUADS_CONFIG.find(s => s.id === squadId) || SQUADS_CONFIG[0]

            // Find categories in DB matching names
            const categories = await prisma.category.findMany({
                where: {
                    name: { in: squadConfig.categories }
                },
                select: { id: true, name: true }
            })

            const categoryIds = categories.map(c => c.id)

            // Build where filter
            const whereClause: any = {
                isDeleted: false,
                isActive: true
            }

            if (categoryIds.length > 0) {
                whereClause.categoryId = { in: categoryIds }
            }

            if (query) {
                whereClause.OR = [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { sku: { contains: query, mode: "insensitive" } },
                    { keywords: { contains: query, mode: "insensitive" } }
                ]
            }

            // Determine sort order
            let orderBy: any = { price: "asc" }
            if (sortBy === "price_desc") orderBy = { price: "desc" }
            else if (sortBy === "name_asc") orderBy = { name: "asc" }

            const total = await prisma.product.count({ where: whereClause })
            const products = await prisma.product.findMany({
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

            return NextResponse.json({
                success: true,
                squadId,
                squadName: squadConfig.name,
                products,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            })
        }

        // ── ACTION 2: GET MAIN SQUADS METADATA & PERSISTED ASSIGNMENTS ──
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

        // 2. Query real product count per squad
        const squadStats: Record<string, number> = {}
        for (const squad of SQUADS_CONFIG) {
            const count = await prisma.product.count({
                where: {
                    isDeleted: false,
                    isActive: true,
                    category: {
                        name: { in: squad.categories }
                    }
                }
            })
            squadStats[squad.id] = count
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

        // Combine squads configuration with live counts and assignments
        const squadsWithData = SQUADS_CONFIG.map(s => {
            const members = savedAssignments[s.id] || []
            return {
                ...s,
                productCount: squadStats[s.id] || 0,
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
