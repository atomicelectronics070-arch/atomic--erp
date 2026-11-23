export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { 
    generateVerificationCode, 
    sendVerificationEmail, 
    createOrUpdateRegistrationDraft, 
    verifyUserCode,
    RegistrationDraft
} from "@/lib/auth/verification";

/**
 * Endpoint para Registro Conversacional y Verificación en Dos Pasos (Web & Bot)
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action } = body;

        // ACCIÓN 1: Iniciar registro y enviar código de verificación al correo
        if (action === "start") {
            const { name, lastName, cedula, cityOrigin, cityResidence, email, phone, role, password } = body;

            if (!name || !cedula || !email || !cityResidence) {
                return NextResponse.json({ 
                    error: "Faltan campos obligatorios (nombres, cédula, ciudad de residencia o correo electrónico activo)." 
                }, { status: 400 });
            }

            const cleanEmail = email.toLowerCase().trim();

            // Verificar si el usuario ya está aprobado
            const existing = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: cleanEmail },
                        { cedula: cedula.trim() }
                    ]
                }
            });

            if (existing && existing.status === "APPROVED") {
                return NextResponse.json({ 
                    error: "Ya existe un usuario activo con esta cédula o correo electrónico. Por favor inicia sesión." 
                }, { status: 400 });
            }

            const code = generateVerificationCode();

            const draftData: RegistrationDraft = {
                name: name.trim(),
                lastName: (lastName || "").trim(),
                cedula: cedula.trim(),
                cityOrigin: (cityOrigin || cityResidence).trim(),
                cityResidence: cityResidence.trim(),
                email: cleanEmail,
                phone: (phone || "").trim(),
                role: role || "SALESPERSON"
            };

            // Guardar o actualizar registro en base de datos
            const userDraft = await createOrUpdateRegistrationDraft(draftData, code);

            // Activación automática inmediata: si se envió contraseña (registro web), activar como APPROVED
            if (password && password.length >= 6) {
                const passwordHash = await bcrypt.hash(password, 10);
                await prisma.user.update({
                    where: { id: userDraft.id },
                    data: { 
                        passwordHash,
                        status: "APPROVED",
                        isActive: true
                    }
                });

                // Notificación interna de nuevo vendedor activo
                try {
                    const adminUser = await prisma.user.findFirst({
                        where: { OR: [{ role: "ADMIN" }, { role: "SUPER_ADMIN" }] }
                    });
                    if (adminUser) {
                        await prisma.notification.create({
                            data: {
                                userId: adminUser.id,
                                title: `⚡ Asesor Activado: ${draftData.name} ${draftData.lastName}`,
                                message: `Registro comercial completado y auto-aprobado. Ciudad: ${draftData.cityResidence}. WhatsApp: ${draftData.phone || 'No indicado'}.`,
                                type: "SALES_OPPORTUNITY"
                            }
                        });
                    }
                } catch (_) {}

                return NextResponse.json({
                    success: true,
                    autoActivated: true,
                    message: `¡Cuenta activada automáticamente con éxito! Ya puedes iniciar sesión en el cotizador y catálogo comercial.`,
                    email: cleanEmail,
                    step: "ACTIVATED",
                    user: {
                        id: userDraft.id,
                        name: userDraft.name,
                        email: cleanEmail,
                        role: userDraft.role
                    }
                });
            }

            // Fallback (solo si no envió contraseña): intentar envío de código
            await sendVerificationEmail(cleanEmail, code, name);

            return NextResponse.json({
                success: true,
                message: `Código de confirmación generado para ${cleanEmail}.`,
                email: cleanEmail,
                step: "AWAITING_CODE"
            });
        }

        // ACCIÓN 2: Verificar el código de 6 dígitos ingresado por el usuario
        if (action === "verify") {
            const { email, code, password } = body;

            if (!email || !code) {
                return NextResponse.json({ error: "Email y código de verificación son requeridos." }, { status: 400 });
            }

            const result = await verifyUserCode(email, code);

            if (!result.success) {
                return NextResponse.json({ error: result.message }, { status: 400 });
            }

            // Si el usuario envió contraseña en este paso
            if (password && password.length >= 6 && result.user?.id) {
                const passwordHash = await bcrypt.hash(password, 10);
                await prisma.user.update({
                    where: { id: result.user.id },
                    data: { passwordHash }
                });
            }

            return NextResponse.json({
                success: true,
                autoActivated: true,
                message: "¡Tu cuenta ha sido activada automáticamente con éxito! Ya puedes iniciar sesión en la plataforma.",
                user: result.user
            });
        }

        return NextResponse.json({ error: "Acción no válida." }, { status: 400 });

    } catch (error: any) {
        console.error("[REGISTER_CONVERSATIONAL_ERR]", error);
        return NextResponse.json({ error: "Error al procesar la solicitud: " + error.message }, { status: 500 });
    }
}
