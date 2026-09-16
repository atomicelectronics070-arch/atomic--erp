export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendWhatsAppMessage } from "@/lib/whatsapp/service"

export async function POST(req: Request) {
    try {
        const body: any = await req.json()
        const { name, lastName, password, referredBy, phone } = body
        const email = body.email?.trim().toLowerCase()
        const role = (body.role || "SALESPERSON").toUpperCase()
        const cedula = body.cedula?.trim() || `ID-${Date.now().toString().slice(-8)}`

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Nombre, email y contraseña son obligatorios" }, { status: 400 })
        }

        // Check if user already exists by email
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    ...(body.cedula ? [{ cedula: body.cedula.trim() }] : [])
                ]
            },
        })

        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Cédula"
            return NextResponse.json({ error: `Ya existe un usuario con este ${field}` }, { status: 400 })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        // Sellers and clients are auto-approved
        const initialStatus = "APPROVED"

        const user = await prisma.user.create({
            data: {
                name,
                lastName: lastName || "",
                cedula,
                email,
                passwordHash,
                status: initialStatus,
                role: role === "CONSUMIDOR" ? "CONSUMIDOR" : "SALESPERSON",
                phoneNumber: phone || null,
                profileData: body.profileData || `Celular: ${phone || 'N/A'} | Referido por: ${referredBy || 'N/A'}`,
            },
        })

        // Notify Admin via WhatsApp
        try {
            await sendWhatsAppMessage(
                process.env.ADMIN_PHONE || "593984252528",
                `🔔 *NUEVO REGISTRO ATOMIC*\n\n👤 *Usuario:* ${name} ${lastName || ''}\n📧 *Email:* ${email}\n🎭 *Rol:* ${user.role}\n📱 *Teléfono:* ${phone || 'N/A'}\n\nEstado asignado: ✅ APROBADO AUTOMÁTICAMENTE.`
            )
        } catch (e) { console.error("WhatsApp Admin Notify Error", e) }

        return NextResponse.json({
            message: "¡Cuenta creada y aprobada exitosamente! Ya puede iniciar sesión.",
            user: { id: user.id, email: user.email, name: user.name, status: initialStatus },
        }, { status: 201 })
    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
