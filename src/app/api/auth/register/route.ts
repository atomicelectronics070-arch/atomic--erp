import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, lastName, cedula, password, role, referredBy } = body
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

        // Find the referring user if name provided (optional simplified check)
        let referredById = null
        if (referredBy) {
            const referrer = await prisma.user.findFirst({
                where: {
                    OR: [
                        { name: { contains: referredBy, mode: 'insensitive' } },
                        { lastName: { contains: referredBy, mode: 'insensitive' } }
                    ]
                }
            })
            if (referrer) referredById = referrer.id
        }

        const user = await prisma.user.create({
            data: {
                name,
                lastName,
                cedula,
                email,
                passwordHash,
                status: "PENDING",
                role: role.toUpperCase(), // AFILIADO, DISTRIBUIDOR, or CONSUMIDOR
                referredById,
                receivePromotions: !!body.receivePromotions,
                profileData: body.profileData || `Referido por: ${referredBy || 'N/A'}`,
            },
        })

        return NextResponse.json({
            message: "Solicitud enviada exitosamente. Un administrador revisará su cuenta.",
            user: { id: user.id, email: user.email, name: user.name },
        }, { status: 201 })
    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}


