import { prisma } from "@/lib/prisma";
import { karenState } from "@/lib/karen/karenBrain";

/**
 * ALFRED — Inteligencia Artificial Ejecutiva de Supervisión y Dirección
 * Diseñado exclusivamente para Juan Guzmán (Supervisor / Gerencia)
 * Color temático: ESMERALDA (#10B981)
 * 
 * Contexto Nuclear Cargado:
 * - Proyecto Manta: Catálogo de 84 fotos y videos personales organizados y servibles.
 * - WhatsApp Extracciones & Inteligencia: Stefy, Giovanni (+593 98 777 6149), Martha (+593 99 320 0967),
 *   TecnoMega, TecnoGlobal, Ramiro Verdesoto, Yosvel Zamora, Pautas y Comercial.
 * - Softres ERP / Rómulo: Credenciales, endpoints de producción, redes sociales y 43+ días de mora.
 * - Matriz de Credenciales Corporativas Atomic (Admin, Tech Lead, Sys Lead, Coordinación, Media).
 */

export interface ContactIntelligence {
    name: string;
    phone: string;
    role: string;
    summary: string;
    keyDetails: string[];
}

export interface AlfredContext {
    soft3Status: {
        client: string;
        debtor: string;
        planModules: number;
        modulesRemaining: number;
        paymentPromisedDate: string;
        daysOverdue: number;
        totalEstimatedModules: number;
        notes: string;
        actionItem: string;
        productionUrls: {
            portal: string;
            entregas: string;
            webhookDeploy: string;
            webhookCachePurge: string;
        };
        credentialsFile: string;
        socialAccounts: string;
    };
    corporateCredentials: Array<{
        role: string;
        email: string;
        pass: string;
        label: string;
    }>;
    keyDeals: Array<{
        name: string;
        type: string;
        amount: number;
        date: string;
        status: string;
        details: string;
    }>;
    contacts: ContactIntelligence[];
    suppliers: Array<{
        name: string;
        contact: string;
        ruc?: string;
        deals: string[];
    }>;
    proyectoManta: {
        totalFiles: number;
        photosCount: number;
        videosCount: number;
        basePath: string;
    };
}

export const ALFRED_SUPERVISOR_CONTEXT: AlfredContext = {
    soft3Status: {
        client: "SOFTRES SISTEMAS / AB INGENIEROS",
        debtor: "Sr. Rómulo",
        planModules: 12,
        modulesRemaining: 11,
        paymentPromisedDate: "Miércoles 7 de Octubre de 2026",
        daysOverdue: 43, // Más de 6 semanas de mora calculadas al 19/11/2026
        totalEstimatedModules: 12,
        notes: "El Sr. Rómulo debe pagar el valor acordado destinado a compra de servidores y dominios para la migración multi-tenant. En la conversación del 17/11/2026 afirmó: 'finalicemos ahí tenemos que cobrar para pagarle a ust'.",
        actionItem: "Exigir el abono en cada requerimiento técnico (bancos, ventas, facturación) y activar rendimiento comercial para captar nuevos clientes para Soft 3.",
        productionUrls: {
            portal: "https://softres.abingenieros.com",
            entregas: "https://softres.abingenieros.com/comercio/ventas/entregas",
            webhookDeploy: "https://softres.abingenieros.com/comercio/force-update-softres",
            webhookCachePurge: "https://softres.abingenieros.com/comercio/purge-all-caches"
        },
        credentialsFile: "DESCRIPCION_RESPONSABILIDADES_Y_CREDENCIALES_SOFT3_ROMULO.pdf",
        socialAccounts: "Cuentas de Facebook, Instagram y TikTok creadas por Juan Guzmán para Soft 3 con credenciales provistas por Rómulo. Workspace en Flow con canal 'soft3' para creativos."
    },
    corporateCredentials: [
        { role: "ADMINISTRACION CENTRAL", email: "atomic@administrador.com", pass: "Admin123@", label: "ADMIN_ROOT" },
        { role: "JEFE DE TECNOLOGIA", email: "atomic@techman.com", pass: "Patynico2019", label: "TECH_LEAD" },
        { role: "JEFE DE SISTEMAS & IA", email: "atomic@softman.com", pass: "Blanca2026", label: "SYS_LEAD" },
        { role: "COORDINACION GENERAL", email: "atomic@cordinacion.com", pass: "Admin123@", label: "COORD_LEAD" },
        { role: "DEPARTAMENTO MEDIA", email: "atomic@media.com", pass: "Admin123@", label: "MEDIA_LEAD" }
    ],
    keyDeals: [
        {
            name: "DOMUM CONSTRUCCIONES (DOMUN-CONS CIA.LTDA)",
            type: "Implementación Sistema Asistencia Vehicular",
            amount: 4229.00,
            date: "26/10/2026",
            status: "Registrado en Finanzas para Aprobación Técnica",
            details: "Cotización TMIT-00056: 2 Barreras vehiculares Dítec 3m ($3,300), fotoceldas anticierre ($165), tótems de soporte ($600), puntos de trabajo Costa ($788), breaker, materiales y red."
        }
    ],
    contacts: [
        {
            name: "Stefy (Coordinación Operativa)",
            phone: "Directo WhatsApp",
            role: "Coordinadora de Asistencias & Publicaciones",
            summary: "Gestión estricta de asistencias de asesores, revisión de capturas diarias a las 5:00 PM y publicación de anuncios semanales.",
            keyDetails: [
                "Control salarial: $100 base ($80+$20 acordados en septiembre/octubre), con escala proyectada a $150 y $200 para el cuarto y quinto mes según desempeño.",
                "Recibió el documento 'DESCRIPCION_RESPONSABILIDADES_Y_CREDENCIALES_SOFT3_ROMULO.pdf' con la asignación para operar redes sociales de Soft 3.",
                "Maneja el espacio corporativo en Flow con el chat 'soft3' para la generación de creativos diarios.",
                "Coordina publicaciones fijas (15 semanales / 5 pasando un día) para el personal administrativo (Cristina, Nicolás, Juan)."
            ]
        },
        {
            name: "Señor Giovanni",
            phone: "+593 98 777 6149",
            role: "Técnico Especialista en Antenas Antirrobo",
            summary: "Técnico para calibración, configuración e instalación física de antenas antirrobo / antihurto en locales comerciales.",
            keyDetails: [
                "Juan Pablo lo contactó el 12/11/2026 para configurar antenas antirrobo.",
                "Coordinación de visita al local físico para inspección y puesta a punto."
            ]
        },
        {
            name: "Señora Martha",
            phone: "+593 99 320 0967",
            role: "Cliente - Instalación Antenas Antihurto",
            summary: "Cliente comercial con alta urgencia para instalación de sistema de antenas antihurto.",
            keyDetails: [
                "Conexión requerida por canaleta a través de la mampara.",
                "Solicitud urgente de fecha de visita: '¿Disculpe cuándo puede venir...?' (13/11/2026)."
            ]
        },
        {
            name: "Yosvel Zamora",
            phone: "WhatsApp Directo",
            role: "Técnico Instalador & Herrero / Montajes",
            summary: "Colaborador clave en el montaje físico de barreras vehiculares, soportes y pasadores metálicos.",
            keyDetails: [
                "Fabricación de pasadores y soportes para proyectos de control de acceso.",
                "Instalación de barreras vehiculares perimetrales en 3 lados."
            ]
        },
        {
            name: "Ramiro Verdesoto",
            phone: "WhatsApp Directo",
            role: "Cliente - Servicio Técnico de Seguridad",
            summary: "Cliente interesado en servicios de seguridad electrónica. Juan le derivó el contacto de su técnico de zona para confirmar cobertura.",
            keyDetails: [
                "En espera de confirmación y visita técnica según zona de cobertura."
            ]
        },
        {
            name: "Sr. Rómulo (Softres)",
            phone: "+593 99 868 6590",
            role: "Socio / Cliente Software Softres ERP (AB Ingenieros)",
            summary: "43+ días en mora de pagos comprometidos ($850 USD para dominios y servidores). Se le brinda soporte técnico en módulos de bancos, ventas y entregas.",
            keyDetails: [
                "Afirmó el 17/11/2026: 'finalicemos ahí tenemos que cobrar para pagarle a ust'.",
                "Se le crearon redes sociales (TikTok, Facebook, Instagram) para captación de clientes de su ERP."
            ]
        },
        {
            name: "Abg. Cristhian Arellano",
            phone: "+593 99 690 0777",
            role: "Cliente Residencial Cámaras",
            summary: "Instalación de cámaras Wansview en conjunto residencial, calibración de red WiFi y mantenimiento mecánico de rodamientos.",
            keyDetails: ["Mantenimiento preventivo y enlace a app móvil."]
        },
        {
            name: "David Cabrera (Adm. Conjunto María Belén)",
            phone: "+593 99 852 4034",
            role: "Administrador de Conjunto Residencial",
            summary: "Control de accesos y apertura de puerta peatonal por app móvil. Sincronización de residentes (Casa 1: Fernando Villafuerte, Alicia Bermúdez, Luis Enrique Villafuerte).",
            keyDetails: ["Gestión comunitaria de accesos y enrolamiento."]
        }
    ],
    suppliers: [
        {
            name: "TecnoMega Mayorista (La Granja, Quito)",
            contact: "Ventas Distribuidor WhatsApp",
            ruc: "1709540478001",
            deals: [
                "Compra de 4 tablets Samsung Galaxy A11 sin chip: $653.20 (precio distribuidor con transferencia/efectivo).",
                "Proyecto de 16 pantallas para edificio: 1x Soporte móvil con ruedas (formato grande), 15x Soportes fijos reforzados para pared, 16x Instalación y montaje.",
                "Consulta de monitor vertical 43\" y TV 85\"."
            ]
        },
        {
            name: "TecnoGlobal Importadora Tech",
            contact: "WhatsApp Distribuidor",
            deals: [
                "Ninebot Kickscooter F40: $593 + IVA.",
                "Monitores Tureon 19\" 1440x900 60Hz: $50 + IVA.",
                "Cerraduras inteligentes: No disponen para exterior con manija estándar de 4cm, únicamente para áreas bajo techo."
            ]
        },
        {
            name: "Lesly IDC MAYORISTA",
            contact: "+593 98 010 1091",
            deals: [
                "Abastecimiento de hardware, tablets Samsung, iPhone 16 Pro Max ($934.13) y monitores para proyectos de Atomic."
            ]
        }
    ],
    proyectoManta: {
        totalFiles: 84,
        photosCount: 76,
        videosCount: 8,
        basePath: "/proyectomanta"
    }
};

/**
 * Obtener catálogo clasificado de Proyecto Manta
 */
export function getProyectoMantaCatalog() {
    const p = ALFRED_SUPERVISOR_CONTEXT.proyectoManta;
    return {
        summary: `📸 **Proyecto Manta — Archivo Multimedia Personal de Juan**\n` +
            `• **Total de Archivos:** ${p.totalFiles} elementos analizados y preservados.\n` +
            `• 🖼️ **Fotografías:** ${p.photosCount} imágenes en alta resolución (.jpeg).\n` +
            `• 🎥 **Videos:** ${p.videosCount} grabaciones y secuencias (.mp4).\n` +
            `• 🌐 **Directorio Web Público:** \`${p.basePath}/\`\n\n` +
            `*Categorías disponibles por fecha:*\n` +
            `1. **Noviembre 07 (Sesión Principal):** 50+ fotos y videos de alta calidad.\n` +
            `2. **Noviembre 08 (Videos HD):** WhatsApp Video 8.53 PM & 8.55 PM.\n` +
            `3. **Noviembre 09 (Secuencia Nocturna):** WhatsApp Image 8.44 PM - 8.47 PM.\n` +
            `4. **Noviembre 11 (Obras y Barreras):** Secuencia técnica 3.18 AM & 3.22 AM.\n` +
            `5. **Noviembre 12 (Personal y Proyectos):** WhatsApp Image 5.13 PM (1 al 6).`
    };
}

/**
 * Obtener lista de contactos globales de WhatsApp CRM sin distinción
 */
export async function getGlobalWhatsAppContacts() {
    try {
        const contacts = await prisma.wAContact.findMany({
            take: 100,
            orderBy: { createdAt: "desc" },
            include: {
                conversations: {
                    take: 1,
                    orderBy: { updatedAt: "desc" },
                    include: {
                        messages: {
                            take: 1,
                            orderBy: { createdAt: "desc" }
                        }
                    }
                }
            }
        });

        return contacts.map(c => {
            const lastConv = c.conversations?.[0];
            const lastMsg = lastConv?.messages?.[0];
            return {
                id: c.id,
                name: c.name || "Sin nombre registrado",
                whatsappId: c.whatsappId,
                status: lastConv?.status || "NEW",
                priority: lastConv?.priority || "MEDIUM",
                lastMessage: lastMsg?.body ? (lastMsg.body.length > 70 ? lastMsg.body.slice(0, 67) + "..." : lastMsg.body) : "Sin mensajes aún",
                lastDate: lastMsg?.createdAt || c.createdAt
            };
        });
    } catch (e: any) {
        console.error("Error fetching global contacts in Alfred:", e);
        return [];
    }
}

/**
 * Obtener estado de supervisión diario consolidado
 */
export async function getDailyAlfredBriefing() {
    const now = new Date();
    const todayStr = now.toLocaleDateString("es-EC", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    // 1. Estado en Finanzas / Ventas de hoy
    const recentTrx = await prisma.transaction.findMany({
        take: 5,
        orderBy: { date: "desc" },
        select: { client: true, amount: true, status: true, trxId: true, type: true }
    }).catch(() => []);

    // 2. Estado en WhatsApp / Karen
    const unreadConvs = await prisma.wAConversation.count({
        where: { status: { in: ["NEW", "LEAD_PAUTA", "OPEN"] } }
    }).catch(() => 0);

    const totalContactsCount = await prisma.wAContact.count().catch(() => 0);

    return {
        date: todayStr,
        soft3: {
            client: ALFRED_SUPERVISOR_CONTEXT.soft3Status.client,
            debtor: ALFRED_SUPERVISOR_CONTEXT.soft3Status.debtor,
            daysOverdue: ALFRED_SUPERVISOR_CONTEXT.soft3Status.daysOverdue,
            promisedDate: ALFRED_SUPERVISOR_CONTEXT.soft3Status.paymentPromisedDate,
            actionItem: ALFRED_SUPERVISOR_CONTEXT.soft3Status.actionItem,
            portal: ALFRED_SUPERVISOR_CONTEXT.soft3Status.productionUrls.portal
        },
        finances: {
            recentTransactions: recentTrx,
            highlightDeal: "DOMUM CONSTRUCCIONES ($4,229.00) — Sistema Asistencia Vehicular"
        },
        karen: {
            mode: karenState.mode,
            activeChatsCount: unreadConvs,
            totalContacts: totalContactsCount,
            burstCounters: karenState.burstCounters
        },
        contactsSummary: {
            totalRegistered: ALFRED_SUPERVISOR_CONTEXT.contacts.length,
            suppliersCount: ALFRED_SUPERVISOR_CONTEXT.suppliers.length,
            mantaFiles: ALFRED_SUPERVISOR_CONTEXT.proyectoManta.totalFiles
        }
    };
}

/**
 * Procesador de mensajes exclusivo para ALFRED (Modo Supervisor Esmeralda)
 */
export async function processAlfredSupervisorMessage(message: string): Promise<string> {
    const lower = (message || "").toLowerCase().trim();

    // 1. Skill: Proyecto Manta / Fotos Personales de Juan
    if (
        lower.includes("manta") || 
        lower.includes("proyecto manta") || 
        lower.includes("proyectomanta") || 
        lower.includes("foto") || 
        lower.includes("fotos") || 
        lower.includes("fotos mias") || 
        lower.includes("fotos mías") || 
        lower.includes("mis fotos") ||
        lower.includes("fotos personales") ||
        lower.includes("videos personales") ||
        lower.includes("archivos personales")
    ) {
        const cat = getProyectoMantaCatalog();
        let reply = `👑 **ALFRED — Skill Ejecutiva: Proyecto Manta (Archivos Personales de Juan)**\n\n`;
        reply += `${cat.summary}\n\n`;
        reply += `🔗 **Muestra Destacada para Acceso Directo:**\n`;
        reply += `• 🖼️ [Foto 09 Nov 8:44 PM](/proyectomanta/WhatsApp%20Image%202026-11-09%20at%208.44.48%20PM.jpeg)\n`;
        reply += `• 🖼️ [Foto 09 Nov 8:45 PM](/proyectomanta/WhatsApp%20Image%202026-11-09%20at%208.45.04%20PM.jpeg)\n`;
        reply += `• 🖼️ [Foto 12 Nov 5:13 PM Principal](/proyectomanta/WhatsApp%20Image%202026-11-12%20at%205.13.26%20PM.jpeg)\n`;
        reply += `• 🎥 [Video 08 Nov 8:53 PM](/proyectomanta/WhatsApp%20Video%202026-11-08%20at%208.53.38%20PM.mp4)\n`;
        reply += `• 🎥 [Video 08 Nov 8:55 PM](/proyectomanta/WhatsApp%20Video%202026-11-08%20at%208.55.16%20PM.mp4)\n\n`;
        reply += `💡 _Todos los 84 archivos están disponibles y servidos en la carpeta pública \`/proyectomanta\`. Puedes pedirme ver fotos de una fecha específica o usarlas en tus propuestas y perfiles._`;
        return reply;
    }

    // 2. Skill: Stefy & Credenciales Soft 3 / Rómulo
    if (
        lower.includes("stefy") || 
        lower.includes("credencial") || 
        lower.includes("credenciales") || 
        lower.includes("contraseña") || 
        lower.includes("contrasena") || 
        lower.includes("clave") || 
        lower.includes("usuario") || 
        lower.includes("login") || 
        lower.includes("cuenta de romulo") || 
        lower.includes("cuenta romulo") ||
        lower.includes("redes soft 3") ||
        lower.includes("redes de soft3")
    ) {
        const s3 = ALFRED_SUPERVISOR_CONTEXT.soft3Status;
        const creds = ALFRED_SUPERVISOR_CONTEXT.corporateCredentials;
        const stefyInfo = ALFRED_SUPERVISOR_CONTEXT.contacts.find(c => c.name.includes("Stefy"))!;

        let reply = `👑 **ALFRED — Inteligencia Nuclear: Stefy, Rómulo y Credenciales Soft 3**\n\n`;
        reply += `📑 **1. Contexto del Chat con Stefy:**\n`;
        reply += `• **Documento enviado por Juan el 16/10/2026:** \`${s3.credentialsFile}\`.\n`;
        reply += `• **Directiva de Redes:** Juan creó cuentas oficiales de **Facebook, Instagram y TikTok** para el sistema Soft 3 con contraseñas provistas por el Sr. Rómulo.\n`;
        reply += `• **Espacio Creativo:** Se estructuró un chat corporativo en Flow llamado **'soft3'** donde Stefy genera el material publicitario.\n`;
        reply += `• **Acuerdo Salarial Stefy:** Base de **$100** ($80+$20 pagados en agosto/septiembre), con plan de ascenso a **$150** en el mes 4 y **$200** en el mes 5 tras capacitaciones.\n\n`;

        reply += `🌐 **2. Entornos de Producción Softres ERP:**\n`;
        reply += `• **Portal Web:** [${s3.productionUrls.portal}](${s3.productionUrls.portal})\n`;
        reply += `• **Módulo Entregas:** [${s3.productionUrls.entregas}](${s3.productionUrls.entregas})\n`;
        reply += `• **Webhook Actualización:** \`${s3.productionUrls.webhookDeploy}\`\n`;
        reply += `• **Webhook Purga de Caché:** \`${s3.productionUrls.webhookCachePurge}\`\n\n`;

        reply += `🔑 **3. Matriz de Credenciales Corporativas Atomic (Acceso Maestro):**\n`;
        creds.forEach(c => {
            reply += `• **${c.role}** (\`${c.label}\`):\n`;
            reply += `   📧 Correo: \`${c.email}\` | 🔑 Clave: \`${c.pass}\`\n`;
        });
        reply += `\n`;

        reply += `⚠️ **4. Estado Financiero Rómulo:** ${s3.daysOverdue} días de atraso ($850 USD para servidores multi-tenant). Rómulo indicó: _"finalicemos ahí tenemos que cobrar para pagarle a ust"_.\n`;
        return reply;
    }

    // 3. Skill: Contactos de WhatsApp y Detalle de Chats
    if (
        lower.includes("giovanni") || 
        lower.includes("martha") || 
        lower.includes("antena") || 
        lower.includes("antenas") || 
        lower.includes("antihurto") || 
        lower.includes("antirrobo") ||
        lower.includes("yosvel") || 
        lower.includes("barrera") || 
        lower.includes("barreras") || 
        lower.includes("ramiro") || 
        lower.includes("verdesoto")
    ) {
        let reply = `👑 **ALFRED — Inteligencia de Chats y Operaciones Técnicas**\n\n`;

        if (lower.includes("giovanni") || lower.includes("martha") || lower.includes("antena") || lower.includes("antihurto") || lower.includes("antirrobo")) {
            const giovanni = ALFRED_SUPERVISOR_CONTEXT.contacts.find(c => c.name.includes("Giovanni"))!;
            const martha = ALFRED_SUPERVISOR_CONTEXT.contacts.find(c => c.name.includes("Martha"))!;

            reply += `📡 **Frente Antenas Antirrobo & Antihurto:**\n\n`;
            reply += `🔹 **Técnico Giovanni (${giovanni.phone}):**\n`;
            reply += `• ${giovanni.summary}\n`;
            giovanni.keyDetails.forEach(d => reply += `  - ${d}\n`);
            reply += `\n`;

            reply += `🔹 **Cliente Señora Martha (${martha.phone}):**\n`;
            reply += `• ${martha.summary}\n`;
            martha.keyDetails.forEach(d => reply += `  - ${d}\n`);
            reply += `  - Estado: Pendiente de confirmación de día de visita para conectar la canaleta.\n\n`;
        }

        if (lower.includes("yosvel") || lower.includes("barrera") || lower.includes("barreras") || lower.includes("ramiro") || lower.includes("verdesoto")) {
            const yosvel = ALFRED_SUPERVISOR_CONTEXT.contacts.find(c => c.name.includes("Yosvel"))!;
            const ramiro = ALFRED_SUPERVISOR_CONTEXT.contacts.find(c => c.name.includes("Ramiro"))!;

            reply += `🏗️ **Frente Herrería, Barreras y Soporte Técnico:**\n\n`;
            reply += `🔹 **Técnico Instalador Yosvel Zamora:**\n`;
            reply += `• ${yosvel.summary}\n`;
            yosvel.keyDetails.forEach(d => reply += `  - ${d}\n`);
            reply += `\n`;

            reply += `🔹 **Contacto Ramiro Verdesoto:**\n`;
            reply += `• ${ramiro.summary}\n`;
            ramiro.keyDetails.forEach(d => reply += `  - ${d}\n`);
            reply += `\n`;
        }

        return reply;
    }

    // 4. Skill: Proveedores Mayoristas (TecnoMega, TecnoGlobal, IDC)
    if (
        lower.includes("proveedor") || 
        lower.includes("proveedores") || 
        lower.includes("tecnomega") || 
        lower.includes("tecno mega") || 
        lower.includes("tecnoglobal") || 
        lower.includes("tecno global") ||
        lower.includes("mayorista")
    ) {
        let reply = `👑 **ALFRED — Matriz de Proveedores Mayoristas & Cotizaciones**\n\n`;
        ALFRED_SUPERVISOR_CONTEXT.suppliers.forEach(s => {
            reply += `🏢 **${s.name}**\n`;
            if (s.ruc) reply += `• RUC Registrado: \`${s.ruc}\`\n`;
            reply += `• Contacto: ${s.contact}\n`;
            reply += `• Negociaciones y Precios:\n`;
            s.deals.forEach(d => reply += `   - ${d}\n`);
            reply += `\n`;
        });
        return reply;
    }

    // 5. Skill: Contactos Globales / Mensajes Globales CRM
    if (
        lower.includes("contactos globales") || 
        lower.includes("mensajes globales") || 
        lower.includes("lista de contactos") ||
        lower.includes("contactos de whatsapp") ||
        lower.includes("contactos crm") ||
        lower.includes("todos los contactos") ||
        (lower.includes("contacto") && !lower.includes("giovanni") && !lower.includes("martha"))
    ) {
        const contacts = await getGlobalWhatsAppContacts();
        let reply = `👑 **ALFRED — Lista Maestra de Contactos Globales (${contacts.length} en CRM)**\n\n`;

        // 1. Contactos Estratégicos Extraídos de los Nuevos Chats
        reply += `⭐ **Contactos Clave de Operaciones Recientes:**\n`;
        ALFRED_SUPERVISOR_CONTEXT.contacts.forEach((c, idx) => {
            reply += `${idx + 1}. **${c.name}** (${c.phone}) — _${c.role}_\n   📌 ${c.summary}\n`;
        });
        reply += `\n`;

        // 2. Contactos Registrados en Base de Datos
        if (contacts.length > 0) {
            reply += `📱 **Contactos en Base de Datos WhatsApp CRM:**\n`;
            contacts.slice(0, 15).forEach((c, idx) => {
                const cleanPhone = c.whatsappId.replace(/\D/g, "");
                reply += `• **${c.name}** | [${c.whatsappId}](https://wa.me/${cleanPhone}) | Estado: \`${c.status}\`\n`;
                reply += `  💬 _"${c.lastMessage}"_\n`;
            });
            if (contacts.length > 15) {
                reply += `\nℹ️ _Mostrando los primeros 15 de ${contacts.length} contactos. Accede a /dashboard/whatsapp/crm para ver la totalidad._\n`;
            }
        }

        return reply;
    }

    // 6. Skill: Soft 3 / Sr. Rómulo y Cobranza
    if (
        lower.includes("soft 3") || 
        lower.includes("soft3") || 
        lower.includes("softres") || 
        lower.includes("rómulo") || 
        lower.includes("romulo") ||
        lower.includes("ciclo de pago") ||
        lower.includes("atraso") ||
        lower.includes("deuda")
    ) {
        const s3 = ALFRED_SUPERVISOR_CONTEXT.soft3Status;
        return `👑 **ALFRED — Informe Estratégico: Soft 3 & Sr. Rómulo**\n\n` +
            `📊 **Estado del Cliente:** ${s3.client}\n` +
            `👤 **Responsable:** ${s3.debtor}\n` +
            `🗓️ **Compromiso de Pago:** ${s3.promisedDate}\n` +
            `⏳ **Tiempo Atrasado:** ⚠️ **${s3.daysOverdue} días de mora (más de 6 semanas)**\n` +
            `📦 **Plan de Trabajo:** Cupo de ${s3.planModules} módulos (${s3.modulesRemaining} disponibles). Módulos trabajados: Kardex y gestión de bancos, facturación en efectivo/transferencias y entregas.\n` +
            `🎯 **Motivo del Pago Pendiente:** Fondos requeridos para adquisición de dominios y servidor para consolidar la migración y arquitectura multi-tenant.\n` +
            `🌐 **Producción:** [${s3.productionUrls.portal}](${s3.productionUrls.portal})\n` +
            `💬 **Última conversación:** El Sr. Rómulo indicó: _"finalicemos ahí tenemos que cobrar para pagarle a ust"_ (17/11/2026).\n\n` +
            `⚡ **Directiva de Supervisión:**\n` +
            `>${s3.actionItem}\n\n` +
            `¿Deseas que preparemos un borrador de notificación formal de cobro o que audite el código en producción de Softres?`;
    }

    // 7. Skill: Briefing Diario (Hoy en Soft 3, Ventas y Karen)
    if (
        lower.includes("hoy") || 
        lower.includes("briefing") || 
        lower.includes("resumen del dia") || 
        lower.includes("resumen diario") || 
        lower.includes("estado hoy") ||
        lower.includes("que tenemos")
    ) {
        const b = await getDailyAlfredBriefing();
        let reply = `👑 **ALFRED — Estado Ejecutivo Diario | ${b.date}**\n\n`;
        reply += `Estimado Juan, este es el resumen consolidado de nuestras tres líneas de mando:\n\n`;

        reply += `🔹 **1. EN SOFT 3 (Sistemas & Desarrollo):**\n`;
        reply += `• Cliente: **${b.soft3.client}** (${b.soft3.debtor})\n`;
        reply += `• Mora de Pago: **${b.soft3.daysOverdue} días atrasado** (Comprometido: ${b.soft3.promisedDate}).\n`;
        reply += `• Acción: Mantener presión de cobranza ante cada ticket de soporte en bancos o facturación y captar clientes para él.\n\n`;

        reply += `🔹 **2. EN VENTAS & FINANZAS:**\n`;
        reply += `• Proyecto Bandera: **${b.finances.highlightDeal}**.\n`;
        if (b.finances.recentTransactions.length > 0) {
            reply += `• Transacciones recientes en base de datos:\n`;
            b.finances.recentTransactions.forEach(t => {
                reply += `   - \`${t.trxId}\`: ${t.client} ($${t.amount.toLocaleString()}) — [${t.status}]\n`;
            });
        }
        reply += `\n`;

        reply += `🔹 **3. CON KAREN (WhatsApp IA):**\n`;
        reply += `• Modo actual: **${b.karen.mode === "AUTOMATIC" ? "🟢 100% Automático" : "🟡 Supervisado"}**\n`;
        reply += `• Total Contactos CRM: **${b.karen.totalContacts} clientes registrados**\n`;
        reply += `• Conversaciones activas: **${b.karen.activeChatsCount} chats en bandeja**\n`;
        reply += `• Atenciones: Ventas (${b.karen.burstCounters.sales}), Empleo (${b.karen.burstCounters.recruitment}), Registro (${b.karen.burstCounters.autoRegister})\n\n`;

        reply += `🔹 **4. ACTIVOS & ARCHIVOS PERSONALES:**\n`;
        reply += `• Proyecto Manta: **${b.contactsSummary.mantaFiles} fotos y videos organizados** en \`/proyectomanta\`.\n\n`;

        reply += `💡 _Escribe "proyecto manta", "stefy", "soft 3", "proveedores" o "contactos globales" para profundizar._`;
        return reply;
    }

    // 8. Skill: Contexto de lo que hace Karen / Auditoría
    if (lower.includes("karen") || lower.includes("auditoria") || lower.includes("bot de whatsapp")) {
        return `👑 **ALFRED — Monitor Maestro de Karen IA**\n\n` +
            `Karen está operando en WhatsApp en modo **${karenState.mode === "AUTOMATIC" ? "🟢 AUTOMÁTICO ACTIVO" : "🟡 REVISIÓN"}**.\n\n` +
            `📊 **Rendimiento Reciente de Karen:**\n` +
            `• Consultas de Ventas procesadas: ${karenState.burstCounters.sales}\n` +
            `• Postulaciones laborales orientadas: ${karenState.burstCounters.recruitment}\n` +
            `• Registros automáticos de asesores: ${karenState.burstCounters.autoRegister}\n` +
            `• Chats sin catalogar: ${karenState.burstCounters.uncataloged}\n\n` +
            `🛡️ **Mejoras Aplicadas a Karen:**\n` +
            `1. Auto-rescate activo: Si la API de NVIDIA tarda más de 8 segundos, responde con el motor nativo de ATOMIC sin dejar al cliente esperando.\n` +
            `2. Envío de fotos oficiales garantizado para cercos, cámaras IMOU/EZVIZ, videoporteros y barras de sonido.\n` +
            `3. Tienes el botón de acceso directo rosa en la barra lateral para revisar su historial o pausarla.\n\n` +
            `¿Deseas que le envíe una directiva o consulte los últimos leads de Karen?`;
    }

    // 9. Skill: Proyecto Domum Construcciones
    if (lower.includes("domum") || lower.includes("domun")) {
        const deal = ALFRED_SUPERVISOR_CONTEXT.keyDeals[0];
        return `👑 **ALFRED — Proyecto DOMUM CONSTRUCCIONES**\n\n` +
            `🏗️ **Cliente:** ${deal.name}\n` +
            `💰 **PVP Total:** **$${deal.amount.toLocaleString()} USD** | Fecha: ${deal.date}\n` +
            `📋 **Objeto:** ${deal.type}\n` +
            `📦 **Equipos y Alcance:** ${deal.details}\n` +
            `📌 **Estado Actual:** ${deal.status}\n\n` +
            `¿Deseas emitir la orden de instalación o coordinar con Yosvel Zamora los anclajes y tótems de soporte?`;
    }

    // Default: Asistente Ejecutivo Esmeralda de Juan
    return `👑 **ALFRED — A tus órdenes, Juan.**\n\n` +
        `Como tu asistente ejecutivo esmeralda, tengo acceso y contexto total de tus operaciones diarias:\n\n` +
        `• 📸 **"proyecto manta" / "fotos"**: Catálogo de 84 fotos y videos personales listos para visualización.\n` +
        `• 🔑 **"stefy" / "credenciales"**: Credenciales maestras Atomic, cuentas de Rómulo y redes Soft 3.\n` +
        `• 📋 **"hoy" / "briefing"**: Resumen diario de Soft 3, Ventas y Karen.\n` +
        `• 📱 **"contactos globales"**: Listado completo sin distinción de todos los contactos del CRM y chats.\n` +
        `• 🏢 **"soft 3"**: Ciclo de pago, 43 días de atraso del Sr. Rómulo y plan de trabajo.\n` +
        `• 📡 **"antenas" / "giovanni" / "martha"**: Seguimiento del técnico de antenas y clientes.\n` +
        `• 🏢 **"proveedores"**: Precios y tratos con TecnoMega y TecnoGlobal.\n` +
        `• 🏗️ **"domum"**: Cotización de barreras vehiculares de $4,229.\n\n` +
        `¿En qué frente estratégico deseas que nos enfoquemos en este momento?`;
}
