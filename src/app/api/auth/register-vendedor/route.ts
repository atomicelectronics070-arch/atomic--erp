export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { 
    generateVerificationCode, 
    sendVerificationEmail, 
    createOrUpdateRegistrationDraft, 
    RegistrationDraft 
} from "@/lib/auth/verification";
import { sendWhatsAppMessage, sanitizeToE164 } from "@/lib/whatsapp/service";

const HR_GROUP_LINK = "https://chat.whatsapp.com/EYwCyfg0mF99nmNEhBPCFt";

/**
 * Endpoint de Registro Automático para Vendedores / Asesores Comerciales
 * - Paso 1 (send_code): Envía código OTP de 6 dígitos al correo electrónico
 * - Paso 2 (verify_code): Valida código, aprueba automáticamente como SALESPERSON activo,
 *   registra en WhatsApp CRM y envía bienvenida inmediata por WhatsApp.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action } = body;

        // ─────────────────────────────────────────────────────────────────────
        // PASO 1: ENVIAR CÓDIGO DE CONFIRMACIÓN POR CORREO
        // ─────────────────────────────────────────────────────────────────────
        if (action === "send_code") {
            const { name, email, phone, password, modality } = body;

            if (!name?.trim()) {
                return NextResponse.json({ error: "El nombre completo es obligatorio." }, { status: 400 });
            }
            if (!email || !email.includes("@")) {
                return NextResponse.json({ error: "Ingresa un correo electrónico válido." }, { status: 400 });
            }
            if (!phone || phone.replace(/\D/g, "").length < 9) {
                return NextResponse.json({ error: "Ingresa un número de teléfono/WhatsApp válido para coordinar tus actividades." }, { status: 400 });
            }
            if (!password || password.length < 6) {
                return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
            }

            const cleanEmail = email.toLowerCase().trim();
            const cleanPhone = sanitizeToE164(phone.trim());

            // Verificar si el usuario ya está aprobado
            const existing = await prisma.user.findFirst({
                where: { email: cleanEmail }
            });

            if (existing && existing.status === "APPROVED") {
                return NextResponse.json({ 
                    error: "Ya existe una cuenta activa con este correo electrónico. Por favor inicia sesión directamente." 
                }, { status: 400 });
            }

            const code = generateVerificationCode();
            const selectedModality = modality === "COMISIONISTA_AFILIADO" ? "COMISIONISTA_AFILIADO" : "PLAN_LABORAL_30D";

            const draftData: RegistrationDraft = {
                name: name.trim(),
                lastName: "",
                cedula: `VEND-${Date.now().toString().slice(-6)}`,
                cityOrigin: selectedModality,
                cityResidence: "Ecuador",
                email: cleanEmail,
                phone: cleanPhone,
                role: "SALESPERSON"
            };

            const userDraft = await createOrUpdateRegistrationDraft(draftData, code);

            // Guardar hash de contraseña y modalidad seleccionada
            const passwordHash = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: userDraft.id },
                data: { 
                    passwordHash,
                    phoneNumber: cleanPhone,
                    aspirations: selectedModality,
                    profileData: JSON.stringify({
                        verificationCode: code,
                        modality: selectedModality,
                        registeredAt: new Date().toISOString()
                    })
                }
            });

            // Enviar correo con el código de 6 dígitos
            await sendVerificationEmail(cleanEmail, code, name.trim());

            return NextResponse.json({
                success: true,
                message: `Código de confirmación de 6 dígitos enviado exitosamente a ${cleanEmail}.`,
                email: cleanEmail,
                phone: cleanPhone,
                modality: selectedModality
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // PASO 2: VERIFICAR CÓDIGO Y ACTIVAR AUTOMÁTICAMENTE AL VENDEDOR
        // ─────────────────────────────────────────────────────────────────────
        if (action === "verify_code") {
            const { email, code } = body;

            if (!email || !code) {
                return NextResponse.json({ error: "Email y código de verificación son requeridos." }, { status: 400 });
            }

            const cleanEmail = email.toLowerCase().trim();
            const cleanCode = code.toString().trim();

            const user = await prisma.user.findFirst({
                where: { email: cleanEmail }
            });

            if (!user) {
                return NextResponse.json({ error: "No se encontró ningún registro pendiente con este correo electrónico." }, { status: 400 });
            }

            let parsedMeta: any = {};
            try {
                if (user.profileData) parsedMeta = JSON.parse(user.profileData);
            } catch (_) {}

            const expectedCode = user.tempResetCode || parsedMeta.verificationCode;

            if (!expectedCode || expectedCode !== cleanCode) {
                return NextResponse.json({ error: "El código ingresado es incorrecto. Verifica los 6 dígitos que te enviamos al correo." }, { status: 400 });
            }

            // ACTIVACIÓN AUTOMÁTICA EN VENDEDOR OFICIAL
            parsedMeta.isCodeVerified = true;
            parsedMeta.activatedAt = new Date().toISOString();

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    status: "APPROVED",
                    role: "SALESPERSON",
                    isActive: true,
                    tempResetCode: null,
                    profileData: JSON.stringify(parsedMeta)
                }
            });

            const modality = user.aspirations || parsedMeta.modality || "PLAN_LABORAL_30D";
            const phone = user.phoneNumber || "";

            // Registrar o actualizar contacto en WhatsApp CRM
            if (phone) {
                try {
                    const waContact = await prisma.wAContact.upsert({
                        where: { whatsappId: phone },
                        update: { name: `${user.name} (Vendedor)` },
                        create: { whatsappId: phone, name: `${user.name} (Vendedor)` }
                    });

                    let conversation = await prisma.wAConversation.findFirst({
                        where: { contactId: waContact.id },
                        orderBy: { updatedAt: "desc" }
                    });

                    if (!conversation) {
                        conversation = await prisma.wAConversation.create({
                            data: {
                                contactId: waContact.id,
                                status: "OPEN",
                                priority: "HIGH"
                            }
                        });
                    }

                    // Mensaje de bienvenida oficial por WhatsApp
                    let welcomeMsg = "";
                    if (modality === "COMISIONISTA_AFILIADO") {
                        welcomeMsg = 
`¡Hola ${user.name}! 👋 Te saluda el Asistente Oficial de ATOMIC Electronics Ecuador. 🚀

¡Bienvenido al equipo de Asesores Comerciales Afiliados! Tu cuenta ha sido activada con éxito.

💼 *Tu Modalidad: Vendedor Bajo Comisión (100% Flexible)*
• Ganas comisiones directas y agresivas (10% a 25% por cierre).
• Vendes a tu propio ritmo sin horarios forzosos.
• Puedes cotizar videoporteros 2 pantallas ($285), barreras Dítec 2027 ($1,928.90 + IVA), antenas antihurto y cámaras.

📲 *Tus Primeros Pasos:*
1. Accede a tu plataforma para ver precios y material:
👉 https://atomiccotizador.shop/login
2. Únete a nuestro grupo oficial de bienvenida e inducción:
👉 ${HR_GROUP_LINK}

Yo seré tu copiloto aquí en WhatsApp. Si necesitas precios, fichas técnicas o ayuda para cerrar un cliente, solo escríbeme. ¡A romperla con las ventas! 🌟`;
                    } else {
                        welcomeMsg = 
`¡Hola ${user.name}! 👋 Te saluda el Asistente Oficial de ATOMIC Electronics Ecuador. 🚀

¡Felicidades! Tu registro ha sido aprobado y ya eres Asesor Comercial oficial en nuestro Plan Laboral.

💼 *Tu Modalidad: Plan Laboral de 30 Días*
• Ingreso base ($100 a $450 según cumplimiento) + comisiones por venta.
• Horario sugerido: 2 a 4 horas diarias.
• *Mes 2 (Escalamiento):* Aumento del sueldo base a $450 - $650 fijo mensual + 5% - 8% de comisión neta + contrato indefinido formal.

⏰ *Requisito Clave para Liquidación:*
Para que el sistema compute tus días trabajados y tus beneficios se liquiden puntualmente, recuerda registrar tu asistencia cada día en:
👉 https://atomiccotizador.shop/dashboard/attendance

📲 *Tus Pasos de Inicio Hoy:*
1. Únete al grupo oficial de bienvenida con tu coordinadora:
👉 ${HR_GROUP_LINK}
2. Accede a tu portal de trabajo:
👉 https://atomiccotizador.shop/login

Te estaré acompañando todos los días con recordatorios amigables al mediodía, a las 3 PM y a las 5 PM para guiarte en tus publicaciones y visitas. ¡Mucho éxito en tu jornada! 💼✨`;
                    }

                    await sendWhatsAppMessage(phone, welcomeMsg);

                    await prisma.wAMessage.create({
                        data: {
                            conversationId: conversation.id,
                            whatsappMessageId: `onboarding-vendedor-${Date.now()}`,
                            direction: "OUTBOUND",
                            type: "text",
                            body: welcomeMsg,
                            status: "SENT",
                            senderId: "BOT_ASESORES_ONBOARDING"
                        }
                    });

                    console.log(`[ONBOARDING_WHATSAPP_SENT] Bienvenida enviada a asesor ${user.name} (${phone})`);
                } catch (waErr: any) {
                    console.warn("[ONBOARDING_WHATSAPP_WARN]", waErr.message);
                }
            }

            return NextResponse.json({
                success: true,
                message: "¡Registro exitoso! Ya eres vendedor oficial de ATOMIC.",
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    status: updatedUser.status
                }
            });
        }

        return NextResponse.json({ error: "Acción no válida." }, { status: 400 });

    } catch (error: any) {
        console.error("[REGISTER_VENDEDOR_ERR]", error);
        return NextResponse.json({ error: "Error en el servidor: " + error.message }, { status: 500 });
    }
}
