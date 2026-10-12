export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendWhatsAppMessage } from "@/lib/whatsapp/service"

export async function POST(req: Request) {
    try {
        const body: any = await req.json()
        const { name, email: rawEmail, password, role } = body
        const email = rawEmail?.trim().toLowerCase()

        // Validaciones básicas — solo Nombre, Email, Contraseña
        if (!name?.trim()) {
            return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
        }
        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Ingresa un correo electrónico válido" }, { status: 400 })
        }
        if (!password || password.length < 6) {
            return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
        }

        // Verificar si ya existe el email
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: "Ya existe una cuenta con ese correo electrónico" }, { status: 400 })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        // Todos los nuevos registros son SALESPERSON y APPROVED automáticamente
        const assignedRole = "SALESPERSON"
        const initialStatus = "APPROVED"

        // Generar cédula única interna — sin pedirla al usuario
        const cedula = `AUTO-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                lastName: "",
                cedula,
                email,
                passwordHash,
                status: initialStatus,
                role: assignedRole,
                isActive: true,
                profileData: `Registro automático | Rol: Asesor de Ventas`,
            },
        })

        // ── Notificación al Admin por WhatsApp con links de acción ──────────────
        const baseUrl = process.env.NEXTAUTH_URL || "https://atomic-erp.vercel.app"
        const approveUrl = `${baseUrl}/api/auth/manage-user?action=approve&userId=${user.id}&token=${process.env.ADMIN_ACTION_TOKEN || "atomic-admin-2026"}`
        const rejectUrl = `${baseUrl}/api/auth/manage-user?action=reject&userId=${user.id}&token=${process.env.ADMIN_ACTION_TOKEN || "atomic-admin-2026"}`

        const adminPhone = process.env.ADMIN_PHONE || "593984252528"
        const adminMsg =
            `🔔 *NUEVO REGISTRO ATOMIC ERP*\n\n` +
            `👤 *Nombre:* ${user.name}\n` +
            `📧 *Email:* ${user.email}\n` +
            `🎭 *Rol:* Asesor de Ventas\n` +
            `✅ *Estado:* Aprobado automáticamente\n\n` +
            `━━━━━━━━━━━━━━━\n` +
            `🟢 *MANTENER CUENTA:*\n${approveUrl}\n\n` +
            `🔴 *RECHAZAR Y ELIMINAR:*\n${rejectUrl}\n` +
            `━━━━━━━━━━━━━━━\n` +
            `_El usuario ya puede acceder al sistema._`

        try {
            await sendWhatsAppMessage(adminPhone, adminMsg)
        } catch (e) {
            console.error("WhatsApp Admin Notify Error:", e)
            // No fallar el registro si WhatsApp falla
        }

        return NextResponse.json({
            message: "¡Cuenta creada exitosamente! Bienvenido a ATOMIC.",
            user: { id: user.id, email: user.email, name: user.name, status: initialStatus },
        }, { status: 201 })

    } catch (error: any) {
        console.error("Registration error:", error)
        // Error de constraint único de Prisma
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "Ya existe una cuenta con ese correo electrónico." }, { status: 400 })
        }
        return NextResponse.json({ error: "Error al crear la cuenta. Intenta de nuevo." }, { status: 500 })
    }
}
