import { prisma } from "@/lib/prisma"
import { 
    generateVerificationCode, 
    sendVerificationEmail, 
    createOrUpdateRegistrationDraft, 
    verifyUserCode,
    RegistrationDraft 
} from "@/lib/auth/verification"
import { sendWhatsAppMessage } from "@/lib/whatsapp/service"

export interface BotContext {
    senderId: string // phone number for WhatsApp, or userId/sessionToken for Web
    senderName?: string
    channel: "WHATSAPP" | "WEB"
    userSession?: any
}

export interface BotProcessResult {
    handled: boolean
    replyText: string
    suggestions?: string[]
    quoteCreated?: any
    userCreated?: any
}

// In-Memory state store with 2 hour TTL for multi-step conversations
interface UserConversationState {
    stage: 
        | "IDLE"
        | "REG_AWAITING_ROLE"
        | "REG_AWAITING_DATA"
        | "REG_AWAITING_CODE"
        | "QUOTE_AWAITING_PIN"
        | "QUOTE_AWAITING_DATA"
    data: any
    updatedAt: number
}

const CONVERSATION_STATES = new Map<string, UserConversationState>()

function getState(senderId: string): UserConversationState {
    const existing = CONVERSATION_STATES.get(senderId)
    if (existing && Date.now() - existing.updatedAt < 2 * 60 * 60 * 1000) {
        return existing
    }
    const fresh: UserConversationState = { stage: "IDLE", data: {}, updatedAt: Date.now() }
    CONVERSATION_STATES.set(senderId, fresh)
    return fresh
}

function setState(senderId: string, stage: UserConversationState["stage"], data: any = {}) {
    CONVERSATION_STATES.set(senderId, {
        stage,
        data,
        updatedAt: Date.now()
    })
}

function clearState(senderId: string) {
    CONVERSATION_STATES.delete(senderId)
}

// Precios de referencia del catálogo oficial de ATOMIC
const REFERENCE_PRICES: Record<string, number> = {
    "videoportero": 285.00,
    "videoporteros": 285.00,
    "portero": 285.00,
    "hikvision": 92.40,
    "ds-kis212": 92.40,
    "kocom": 149.00,
    "citofono": 149.00,
    "citofonia": 149.00,
    "collective": 134.20,
    "intelbras": 134.20,
    "collective 8i": 134.20,
    "collective 4i": 121.81,
    "collective 12i": 143.00,
    "torniquete": 720.00,
    "ts1000": 720.00,
    "fbl4000": 1850.00,
    "fht2300": 2950.00,
    "biometrico": 175.00,
    "senseface": 175.00,
    "zkteco": 175.00,
    "cerco": 89.00,
    "jfl": 89.00,
    "hagroy": 98.00,
    "imou": 45.40,
    "camara": 45.40,
    "camaras": 45.40,
    "antena": 499.96,
    "antenas": 499.96,
    "antihurto": 499.96,
    "antipanico": 98.00,
    "barra": 98.00,
    "barra antipanico": 98.00
}

/**
 * Motor central de lógica conversacional para Registro de Usuarios y Cotizaciones 1111
 */
export async function processConversationalBotMessage(
    rawText: string,
    context: BotContext
): Promise<BotProcessResult> {
    const text = (rawText || "").trim()
    const lower = text.toLowerCase()
    const state = getState(context.senderId)

    // =========================================================================
    // 1. FLUJO DE VERIFICACIÓN DE CÓDIGO (6 DÍGITOS)
    // =========================================================================
    const codeMatch = text.match(/\b\d{6}\b/)
    if (codeMatch && (state.stage === "REG_AWAITING_CODE" || !state.stage.startsWith("QUOTE"))) {
        const inputCode = codeMatch[0]
        const emailToVerify = state.data?.email

        // Si tenemos el email en memoria o podemos buscar un usuario pendiente
        let userPending = null
        if (emailToVerify) {
            userPending = await prisma.user.findFirst({ where: { email: emailToVerify } })
        } else {
            userPending = await prisma.user.findFirst({
                where: {
                    status: "PENDING_VERIFICATION",
                    tempResetCode: inputCode
                }
            })
        }

        if (userPending && (userPending.tempResetCode === inputCode || userPending.status === "PENDING_VERIFICATION")) {
            const verifyRes = await verifyUserCode(userPending.email, inputCode)
            if (verifyRes.success) {
                clearState(context.senderId)
                const exactMessage = `✅ ¡Código verificado con éxito!\n\n**Administración está revisando tu solicitud y en un máximo de 1 hora se activará tu perfil.**\nTe llegará una notificación a tu correo o puedes probar iniciar sesión en unos minutos.`
                return {
                    handled: true,
                    replyText: exactMessage,
                    userCreated: verifyRes.user,
                    suggestions: ["Iniciar Sesión", "Catálogo de Productos", "Soporte WhatsApp"]
                }
            }
        }
    }

    // =========================================================================
    // 2. DETECCIÓN DE INTENCIÓN DE REGISTRO
    // =========================================================================
    const isRegisterIntent = 
        lower.includes("quiero registrarme") || 
        lower.includes("como me registro") || 
        lower.includes("deseo registrarme") || 
        lower.includes("registrarme en el sistema") || 
        lower.includes("crear cuenta") || 
        lower.includes("inscribirme") ||
        (lower.includes("registro") && (lower.includes("nuevo") || lower.includes("vendedor") || lower.includes("tecnico") || lower.includes("usuario") || lower.includes("cuenta")))

    if (isRegisterIntent) {
        // Verificar si ya especificó el rol en el mismo mensaje
        let detectedRole: string | null = null
        if (lower.includes("vendedor") || lower.includes("ventas") || lower.includes("asesor")) {
            detectedRole = "SALESPERSON"
        } else if (lower.includes("tecnico") || lower.includes("técnico") || lower.includes("instalad")) {
            detectedRole = "TECNICO"
        } else if (lower.includes("usuario") || lower.includes("cliente") || lower.includes("comprador")) {
            detectedRole = "CONSUMIDOR"
        } else if (lower.includes("academ") || lower.includes("curso") || lower.includes("capacit")) {
            detectedRole = "ACADEMIA"
        }

        if (detectedRole) {
            const roleLabels: Record<string, string> = {
                SALESPERSON: "Vendedor (Asesor Comercial)",
                TECNICO: "Técnico (Instalación & Soporte)",
                CONSUMIDOR: "Usuario (Cliente / Comprador)",
                ACADEMIA: "Académico (Cursos y Certificaciones)"
            }
            setState(context.senderId, "REG_AWAITING_DATA", { role: detectedRole })
            return {
                handled: true,
                replyText: `¡Excelente! Para procesar tu registro oficial como **${roleLabels[detectedRole]}**, por favor envíame los siguientes datos:\n\n• **Nombres**\n• **Apellidos**\n• **Cédula de Ciudadanía**\n• **Ciudad de Origen**\n• **Ciudad de Residencia**\n• **Correo Electrónico Activo**\n• **Teléfono / WhatsApp**\n\n💡 *Tip: Mándame los datos separados con guion bajo \`_\`, puntos \`.\` o saltos de línea tratando de poner en orden los datos (el resto lo identifico yo).*`,
                suggestions: ["Ejemplo de formato", "Cambiar de perfil", "Ayuda"]
            }
        }

        // Si no especificó el rol, preguntar como pidió el usuario:
        setState(context.senderId, "REG_AWAITING_ROLE", {})
        return {
            handled: true,
            replyText: `¡Con gusto te ayudo a registrarte! 🚀\n\n¿Cómo deseas registrarte en ATOMIC?:\n1️⃣ **Vendedor** (Asesor Comercial)\n2️⃣ **Técnico** (Instalación & Soporte)\n3️⃣ **Usuario** (Cliente / Comprador)\n4️⃣ **Académico** (Para cursos y certificaciones)\n\nPor favor indícame cuál de estos perfiles deseas.`,
            suggestions: ["Vendedor", "Técnico", "Usuario", "Académico"]
        }
    }

    // =========================================================================
    // 3. ESTADO: ESPERANDO ROL DE REGISTRO
    // =========================================================================
    if (state.stage === "REG_AWAITING_ROLE") {
        let role = "SALESPERSON"
        let roleName = "Vendedor"
        if (lower.includes("1") || lower.includes("vendedor") || lower.includes("asesor")) {
            role = "SALESPERSON"
            roleName = "Vendedor"
        } else if (lower.includes("2") || lower.includes("tecnico") || lower.includes("técnico")) {
            role = "TECNICO"
            roleName = "Técnico"
        } else if (lower.includes("3") || lower.includes("usuario") || lower.includes("cliente")) {
            role = "CONSUMIDOR"
            roleName = "Usuario"
        } else if (lower.includes("4") || lower.includes("academ") || lower.includes("curso")) {
            role = "ACADEMIA"
            roleName = "Académico"
        }

        setState(context.senderId, "REG_AWAITING_DATA", { role })
        return {
            handled: true,
            replyText: `¡Excelente elección! Para completar tu registro como **${roleName}**, por favor envíame los siguientes datos:\n\n• **Nombres**\n• **Apellidos**\n• **Cédula de Ciudadanía**\n• **Ciudad de Origen**\n• **Ciudad de Residencia**\n• **Correo Electrónico Activo**\n• **Teléfono / WhatsApp**\n\n💡 *Mándame los datos separados con guion bajo \`_\`, puntos \`.\` o saltos de línea tratando de poner en orden los datos (el resto lo identifico yo).*`,
            suggestions: ["Enviar mis datos"]
        }
    }

    // =========================================================================
    // 4. ESTADO: ESPERANDO DATOS DE REGISTRO
    // =========================================================================
    if (state.stage === "REG_AWAITING_DATA") {
        const role = state.data?.role || "SALESPERSON"
        const prevData = state.data || {}

        // Intentar parsear los datos separados por _, ., o saltos de línea
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
        const phoneMatch = text.match(/(?:\+?593|0)9\d{8}\b|\b0\d{8,9}\b/)
        const cedulaMatch = text.match(/\b\d{10}\b|\b\d{13}\b/)

        const rawParts = text
            .split(/[_.\n]+/)
            .map(p => p.trim())
            .filter(p => p.length > 0 && !p.includes("@") && !p.match(/^\d{9,13}$/))

        let name = prevData.name || ""
        let lastName = prevData.lastName || ""
        let cityOrigin = prevData.cityOrigin || ""
        let cityResidence = prevData.cityResidence || ""
        let email = emailMatch ? emailMatch[0].toLowerCase().trim() : (prevData.email || "")
        let phone = phoneMatch ? phoneMatch[0].trim() : (prevData.phone || "")
        let cedula = cedulaMatch ? cedulaMatch[0].trim() : (prevData.cedula || "")

        // Asignar partes restantes si vienen en orden
        if (rawParts.length >= 1 && !name) {
            const fullNameParts = rawParts[0].split(/\s+/)
            if (fullNameParts.length >= 3) {
                name = fullNameParts.slice(0, 2).join(" ")
                lastName = fullNameParts.slice(2).join(" ")
            } else if (fullNameParts.length === 2) {
                name = fullNameParts[0]
                lastName = fullNameParts[1]
            } else {
                name = rawParts[0]
            }
        }
        if (rawParts.length >= 2 && !lastName && rawParts[1] !== name) {
            lastName = rawParts[1]
        }
        if (rawParts.length >= 3 && !cityOrigin) {
            cityOrigin = rawParts[2]
        }
        if (rawParts.length >= 4 && !cityResidence) {
            cityResidence = rawParts[3]
        }

        // Si solo se identificó una ciudad, usarla para ambas
        if (cityOrigin && !cityResidence) cityResidence = cityOrigin
        if (!cityOrigin && cityResidence) cityOrigin = cityResidence

        const missing: string[] = []
        if (!name) missing.push("Nombres y Apellidos")
        if (!cedula) missing.push("Cédula de Ciudadanía (10 dígitos)")
        if (!cityResidence) missing.push("Ciudad de Residencia")
        if (!email) missing.push("Correo Electrónico Activo")
        if (!phone) missing.push("Teléfono / WhatsApp")

        // Guardar progreso acumulado
        setState(context.senderId, "REG_AWAITING_DATA", {
            role, name, lastName, cedula, cityOrigin, cityResidence, email, phone
        })

        if (missing.length > 0) {
            return {
                handled: true,
                replyText: `He registrado parte de tu información:\n` +
                    (name ? `• Nombre: **${name} ${lastName}**\n` : '') +
                    (cedula ? `• Cédula: **${cedula}**\n` : '') +
                    (cityResidence ? `• Ciudad: **${cityResidence}**\n` : '') +
                    (email ? `• Correo: **${email}**\n` : '') +
                    (phone ? `• Teléfono: **${phone}**\n` : '') +
                    `\n⚠️ **Aún me faltan estos datos para completar tu registro:**\n${missing.map(m => `• ${m}`).join("\n")}\n\nPor favor envíamelos para generar tu código de verificación.`,
                suggestions: ["Completar datos"]
            }
        }

        // Todos los datos están completos: Generar código de verificación de 6 dígitos
        const verificationCode = generateVerificationCode()

        const draft: RegistrationDraft = {
            name,
            lastName: lastName || "Registrado",
            cedula,
            cityOrigin: cityOrigin || cityResidence || "Ecuador",
            cityResidence: cityResidence || "Ecuador",
            email,
            phone,
            role
        }

        await createOrUpdateRegistrationDraft(draft, verificationCode)
        await sendVerificationEmail(email, verificationCode, name)

        // Cambiar a estado esperando código
        setState(context.senderId, "REG_AWAITING_CODE", { email, name, role })

        return {
            handled: true,
            replyText: `¡Excelente, ${name}! Hemos registrado tu solicitud preliminar. 📩\n\nTe acabamos de enviar un **código de confirmación de 6 dígitos** a tu correo: **${email}** (tiene una validez de 24 horas).\n\n👉 **Por favor escribe el código de 6 dígitos aquí en el chat para verificar tu cuenta.**`,
            suggestions: ["Reenviar código"]
        }
    }

    // =========================================================================
    // 5. FLUJO DE GENERACIÓN DE CONTRATO / COTIZACIÓN (CÓDIGO DE TRABAJADOR 1111)
    // =========================================================================
    const isQuoteIntent = 
        lower.includes("ayudame a generar un contrato") ||
        lower.includes("ayúdame a generar un contrato") ||
        lower.includes("ayudame a generar una cotizacion") ||
        lower.includes("ayúdame a generar una cotización") ||
        lower.includes("generar contrato") ||
        lower.includes("generar cotizacion") ||
        lower.includes("generar cotización") ||
        lower.includes("crear cotizacion") ||
        lower.includes("hacer cotizacion") ||
        lower.includes("cotizar contrato")

    if (isQuoteIntent) {
        setState(context.senderId, "QUOTE_AWAITING_PIN", {})
        return {
            handled: true,
            replyText: `Con gusto, ayúdame con tu código de trabajador.`,
            suggestions: ["1111"]
        }
    }

    // Validar Código de Trabajador (1111)
    if (state.stage === "QUOTE_AWAITING_PIN") {
        if (text === "1111" || text.includes("1111")) {
            setState(context.senderId, "QUOTE_AWAITING_DATA", {})
            return {
                handled: true,
                replyText: `Listo te ayudo dame los siguientes datos:\n\n• **Nombre o Razón Social del Cliente**\n• **Cédula o RUC**\n• **Ciudad o Dirección de Entrega**\n• **Teléfono / WhatsApp**\n• **Producto(s) con cantidad**\n• **Observaciones o Garantía**\n\nMándame los datos y separa cada dato del otro con un guion bajo \`_\` tratando de poner en orden los datos . espacio aparte o por un punto el resto lo identifico yo.`,
                suggestions: ["Ejemplo de cotización"]
            }
        } else {
            return {
                handled: true,
                replyText: `❌ Código de trabajador no autorizado. Por favor ingresa tu código de trabajador correcto para continuar.`,
                suggestions: ["1111"]
            }
        }
    }

    // Parsear Datos de Cotización y Generar Proforma Oficial PROP
    if (state.stage === "QUOTE_AWAITING_DATA") {
        // Dividir por guion bajo `_`, saltos de línea o puntos
        const rawSegments = text
            .split(/[_|\n]+/)
            .map(s => s.trim())
            .filter(Boolean)

        const phoneMatch = text.match(/(?:\+?593|0)9\d{8}\b|\b0\d{8,9}\b/)
        const cedulaMatch = text.match(/\b\d{10}\b|\b\d{13}\b/)

        let clientName = ""
        let cedula = cedulaMatch ? cedulaMatch[0] : ""
        let phone = phoneMatch ? phoneMatch[0] : ""
        let city = ""
        let productsText = ""
        let observations = ""

        if (rawSegments.length >= 1) clientName = rawSegments[0].replace(/^(cliente:|nombre:)/i, "").trim()
        if (rawSegments.length >= 2 && !cedula) cedula = rawSegments[1].replace(/^(cedula:|ruc:)/i, "").trim()
        if (rawSegments.length >= 3) city = rawSegments[2].replace(/^(ciudad:|direccion:)/i, "").trim()
        if (rawSegments.length >= 4 && !phone) phone = rawSegments[3].replace(/^(telefono:|celular:)/i, "").trim()
        if (rawSegments.length >= 5) productsText = rawSegments[4].replace(/^(productos?:|items?:)/i, "").trim()
        if (rawSegments.length >= 6) observations = rawSegments.slice(5).join(" ").trim()

        // Si no se dividió por guion bajo, buscar en texto completo
        if (!productsText) {
            // Intentar detectar si el usuario escribió productos en el texto
            const potentialProducts = text.replace(clientName, "").replace(cedula, "").replace(phone, "").trim()
            if (potentialProducts.length > 5) {
                productsText = potentialProducts
            }
        }

        // Si faltan datos indispensables (nombre o productos)
        if (!clientName || !productsText) {
            return {
                handled: true,
                replyText: `He recibido parte de la información, pero necesito al menos el **Nombre del Cliente** y los **Productos con cantidad** para armar el contrato.\n\nPor favor mándame los datos separando cada dato del otro con un guion bajo \`_\` (ejemplo: *Juan Pérez _ 1723456789 _ Quito _ 0991234567 _ 2 Videoporteros 2 Pantallas _ Garantía 1 año*).`,
                suggestions: ["Reintentar datos"]
            }
        }

        // Parsear productos y calcular precios
        const itemsList: Array<{ name: string; quantity: number; price: number; subtotal: number }> = []
        const productLines = productsText.split(/[,;\n]+/).map(p => p.trim()).filter(Boolean)

        for (const line of productLines) {
            const qtyMatch = line.match(/^(\d+)\s+(.+)/) || line.match(/(.+?)\s+(\d+)$/)
            const qty = qtyMatch ? parseInt(qtyMatch[1] || qtyMatch[2]) : 1
            const pName = qtyMatch ? (qtyMatch[2] || qtyMatch[1]).trim() : line

            // Buscar precio de referencia
            let unitPrice = 120.00 // Default razonable si es totalmente desconocido
            const lowerP = pName.toLowerCase()
            for (const [key, price] of Object.entries(REFERENCE_PRICES)) {
                if (lowerP.includes(key)) {
                    unitPrice = price
                    break
                }
            }

            // También verificar si el usuario incluyó precio explícito (ej: "$250" o "a 250")
            const explicitPriceMatch = line.match(/\$?(\d+(?:\.\d{2})?)\s*(?:usd|dolares|c\/u|\$)?/i)
            if (explicitPriceMatch && parseFloat(explicitPriceMatch[1]) > 5) {
                unitPrice = parseFloat(explicitPriceMatch[1])
            }

            itemsList.push({
                name: pName,
                quantity: qty,
                price: unitPrice,
                subtotal: qty * unitPrice
            })
        }

        if (itemsList.length === 0) {
            itemsList.push({
                name: productsText,
                quantity: 1,
                price: 150.00,
                subtotal: 150.00
            })
        }

        const subtotal = itemsList.reduce((acc, it) => acc + it.subtotal, 0)
        const tax = subtotal * 0.15 // IVA 15% Ecuador
        const total = subtotal + tax

        // Obtener usuario administrador para asignar la cotización
        let salesperson = await prisma.user.findFirst({
            where: { OR: [{ role: "ADMIN" }, { role: "MANAGEMENT" }] }
        })
        if (!salesperson) {
            salesperson = await prisma.user.findFirst()
        }

        if (!salesperson) {
            return {
                handled: true,
                replyText: `Error al emitir cotización: No se encontró usuario del sistema.`,
            }
        }

        // Buscar o crear cliente en CRM
        let client = await prisma.client.findFirst({
            where: {
                OR: [
                    ...(phone ? [{ phone }] : []),
                    ...(cedula ? [{ cedula }] : []),
                    { name: clientName }
                ]
            }
        })

        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: clientName,
                    firstName: clientName.split(" ")[0],
                    lastName: clientName.split(" ").slice(1).join(" ") || "",
                    phone: phone || null,
                    cedula: cedula || null,
                    city: city || "Ecuador",
                    salespersonId: salesperson.id,
                    source: "BOT_CONVERSATIONAL_1111",
                    status: "COTIZANDO"
                }
            })
        }

        const quoteNumber = `PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`

        const createdQuote = await prisma.quote.create({
            data: {
                quoteNumber,
                clientId: client.id,
                salespersonId: salesperson.id,
                subtotal,
                tax,
                discount: 0,
                total,
                clientName,
                deliveryAddress: city || "A convenir con el cliente",
                warrantyComments: observations || "Garantía oficial ATOMIC de 1 año con soporte técnico.",
                advisorName: "ASESOR ATOMIC AUTORIZADO (CÓD 1111)",
                itemsData: JSON.stringify(itemsList.map(it => ({
                    name: it.name,
                    quantity: it.quantity,
                    price: it.price,
                    subtotal: it.subtotal
                }))),
                status: "PROPUESTA_EMITIDA"
            }
        })

        clearState(context.senderId)

        const pdfUrl = `https://atomiccotizador.shop/c/${quoteNumber}`
        const itemsSummary = itemsList.map(it => `• **${it.quantity}x** ${it.name} — *$${it.subtotal.toFixed(2)} USD*`).join("\n")

        const responseText = 
`📄 **¡PROPUESTA COMERCIAL GENERADA CON ÉXITO!**

🔢 **Número Oficial:** \`${quoteNumber}\`
👤 **Cliente:** ${clientName}
🪪 **Cédula / RUC:** ${cedula || "Consumidor Final"}
📍 **Ciudad:** ${city || "Ecuador"}
📱 **Contacto:** ${phone || "Registrado"}

📦 **Detalle de Equipos:**
${itemsSummary}

💰 **Subtotal:** $${subtotal.toFixed(2)} USD
📈 **IVA (15%):** $${tax.toFixed(2)} USD
💳 **TOTAL A PAGAR:** **$${total.toFixed(2)} USD**

🔗 **Enlace PDF & Proforma Oficial:**
${pdfUrl}

📲 *Puedes reenviar este mensaje o el link directamente a tu cliente por WhatsApp para que descargue el documento formal.*`

        return {
            handled: true,
            replyText: responseText,
            quoteCreated: createdQuote,
            suggestions: ["Generar otra cotización", "Ver catálogo", "Panel de Cotizaciones"]
        }
    }

    return {
        handled: false,
        replyText: ""
    }
}
