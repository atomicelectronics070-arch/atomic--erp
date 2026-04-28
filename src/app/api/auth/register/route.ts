import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendWhatsAppMessage } from "@/lib/whatsapp/service"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, lastName, cedula, password, role, referredBy, phone } = body
        const email = body.email?.trim().toLowerCase()

        if (!name || !lastName || !cedula || !email || !password || !role) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
        }

        // Check if user already exists by email or cedula
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { cedula }
                ]
            },
        })

        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Cédula"
            return NextResponse.json({ error: `Ya existe un usuario con este ${field}` }, { status: 400 })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                lastName,
                cedula,
                email,
                phone,
                passwordHash,
                status: "PENDING",
                role: role.toUpperCase(),
                profileData: body.profileData || `Referido por: ${referredBy || 'N/A'}`,
            },
        })

        // Notify Admin via WhatsApp
        try {
            await sendWhatsAppMessage(
                process.env.ADMIN_PHONE || "593984252528",
                `🔔 *NUEVO REGISTRO ATOMIC*\n\n👤 *Usuario:* ${name} ${lastName}\n📧 *Email:* ${email}\n🎭 *Rol Solicitado:* ${role}\n🆔 *Cédula:* ${cedula}\n\nAcción requerida: Aprobar en el dashboard.`
            )
        } catch (e) { console.error("WhatsApp Admin Notify Error", e) }

        return NextResponse.json({
            message: "Solicitud enviada exitosamente. Un administrador revisará su cuenta.",
            user: { id: user.id, email: user.email, name: user.name },
        }, { status: 201 })
    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
