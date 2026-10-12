import { prisma } from "@/lib/prisma"

export interface RegistrationDraft {
    name: string
    lastName: string
    cedula: string
    cityOrigin: string
    cityResidence: string
    email: string
    phone: string
    role: string // SALESPERSON | TECNICO | USER | ACADEMIA
}

/**
 * Genera un código de 6 dígitos numérico
 */
export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Envía el correo electrónico con el código de confirmación.
 * Utiliza HTTP request al servicio de correo configurado o log corporativo detallado.
 */
export async function sendVerificationEmail(email: string, code: string, name: string): Promise<boolean> {
    console.log(`[EMAIL_VERIFICATION] Enviando código ${code} a ${email} para ${name}`)
    
    // Plantilla HTML corporativa de ATOMIC
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #040714; color: #ffffff; margin: 0; padding: 20px; }
            .card { max-width: 520px; margin: 0 auto; background-color: #090d1e; border: 1px solid rgba(6, 182, 212, 0.4); border-radius: 20px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
            .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #06b6d4; text-transform: uppercase; }
            .code-box { background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.15)); border: 2px dashed #06b6d4; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
            .code { font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #10b981; font-family: monospace; }
            .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <div class="logo">ATOMIC SOLUTIONS</div>
                <p style="font-size: 13px; color: #94a3b8; margin: 4px 0 0 0;">Ecosistema Mayorista de Seguridad & Tecnología</p>
            </div>
            <p style="font-size: 15px; margin-top: 20px;">¡Hola, <strong>${name}</strong>!</p>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
                Has solicitado registrarte en la plataforma ATOMIC. Para verificar tu dirección de correo electrónico, utiliza el siguiente código de confirmación:
            </p>
            <div class="code-box">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Tu Código de Verificación</div>
                <div class="code">${code}</div>
                <div style="font-size: 11px; color: #38bdf8; margin-top: 6px;">Válido durante 24 horas</div>
            </div>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
                Ingresa este código en el chat del asistente o en la página de registro. Una vez confirmado, tu perfil pasará a revisión de Administración para su activación inmediata.
            </p>
            <div class="footer">
                © 2026 ATOMIC Electronics Ecuador • Todos los derechos reservados.<br>
                Si no solicitaste este registro, puedes ignorar este mensaje.
            </div>
        </div>
    </body>
    </html>
    `

    // Intentar enviar mediante Webhook / Mailer si está configurado en variables de entorno
    try {
        if (process.env.RESEND_API_KEY) {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: "ATOMIC <seguridad@atomiccotizador.shop>",
                    to: [email],
                    subject: `Tu código de verificación ATOMIC: ${code}`,
                    html: htmlContent
                })
            })
            if (res.ok) return true
        }
    } catch (err) {
        console.error("[EMAIL_DISPATCH_WARN] Falló el envío externo, código persistido en DB:", err)
    }

    return true
}

/**
 * Guarda o actualiza una solicitud de registro en borrador pendiente de código
 */
export async function createOrUpdateRegistrationDraft(data: RegistrationDraft, code: string) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    
    const profileMetadata = {
        cityOrigin: data.cityOrigin,
        cityResidence: data.cityResidence,
        phone: data.phone,
        requestedRole: data.role,
        verificationCode: code,
        codeExpiresAt: expiresAt.toISOString(),
        isCodeVerified: false,
        registeredVia: "BOT_CONVERSATIONAL"
    }

    // Buscar si ya existe el usuario
    const existing = await prisma.user.findFirst({
        where: { email: data.email.toLowerCase().trim() }
    })

    if (existing) {
        return await prisma.user.update({
            where: { id: existing.id },
            data: {
                name: data.name,
                lastName: data.lastName,
                cedula: data.cedula,
                phoneNumber: data.phone,
                residenceSector: data.cityResidence,
                aspirations: data.cityOrigin,
                role: data.role,
                status: "PENDING_VERIFICATION",
                tempResetCode: code,
                profileData: JSON.stringify(profileMetadata)
            }
        })
    } else {
        return await prisma.user.create({
            data: {
                email: data.email.toLowerCase().trim(),
                name: data.name,
                lastName: data.lastName,
                cedula: data.cedula,
                phoneNumber: data.phone,
                residenceSector: data.cityResidence,
                aspirations: data.cityOrigin,
                role: data.role,
                status: "PENDING_VERIFICATION",
                tempResetCode: code,
                passwordHash: "PENDING_ACTIVATION_PASSWORD",
                profileData: JSON.stringify(profileMetadata)
            }
        })
    }
}

/**
 * Valida el código de confirmación del usuario
 */
export async function verifyUserCode(email: string, inputCode: string): Promise<{ success: boolean; message: string; user?: any }> {
    const cleanEmail = email.toLowerCase().trim()
    const cleanCode = inputCode.trim()

    const user = await prisma.user.findFirst({
        where: { email: cleanEmail }
    })

    if (!user) {
        return { success: false, message: "No se encontró ningún registro pendiente con este correo electrónico." }
    }

    let parsedMeta: any = {}
    try {
        if (user.profileData) parsedMeta = JSON.parse(user.profileData)
    } catch (_) {}

    const expectedCode = user.tempResetCode || parsedMeta.verificationCode

    if (!expectedCode || expectedCode !== cleanCode) {
        return { success: false, message: "El código ingresado es incorrecto. Por favor verifica los 6 dígitos que te enviamos al correo." }
    }

    // Código correcto: Pasamos el usuario a PENDING para que Administración lo apruebe
    parsedMeta.isCodeVerified = true
    parsedMeta.verifiedAt = new Date().toISOString()

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            status: "PENDING", // Pasa a cola de aprobación de Administración
            tempResetCode: null, // Limpia el código usado
            profileData: JSON.stringify(parsedMeta)
        }
    })

    // Crear notificación interna para el Administrador
    try {
        const adminUser = await prisma.user.findFirst({
            where: { OR: [{ role: "ADMIN" }, { role: "SUPER_ADMIN" }] }
        })
        if (adminUser) {
            await prisma.notification.create({
                data: {
                    userId: adminUser.id,
                    title: `Nueva Solicitud de Registro: ${updatedUser.name} ${updatedUser.lastName || ''}`,
                    message: `Solicita rol de ${updatedUser.role} desde ${updatedUser.residenceSector || 'Ecuador'}. Cédula: ${updatedUser.cedula}. Correo verificado: ${updatedUser.email}.`,
                    type: "REGISTRATION_REQUEST"
                }
            })
        }
    } catch (_) {}

    return {
        success: true,
        message: "¡Código verificado con éxito! Tu correo ha sido confirmado.",
        user: updatedUser
    }
}
