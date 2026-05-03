import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/auth/reset-request
export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email requerido" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        })

        if (!user) {
            // We return success anyway for security (to not reveal if email exists)
            // But we don't do anything
            return NextResponse.json({ success: true, message: "Si el correo existe, se ha enviado la solicitud al administrador." })
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { resetRequested: true }
        })

        return NextResponse.json({ 
            success: true, 
            message: "Solicitud enviada. Contacte a su administrador para obtener su código de acceso temporal." 
        })

    } catch (error) {
        console.error("Reset request error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
