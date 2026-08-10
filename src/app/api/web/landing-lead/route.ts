export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const email: string = body.email || ""
        const name: string = body.name || ""
        const phone: string = body.phone || ""
        const city: string = body.city || ""
        const source: string = body.source || "LANDING_PROVEEDORES"
        const requirement: string = body.requirement || "Solicitud de Guía de Proveedores Estratégicos."

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email inválido" }, { status: 400 })
        }

        // Buscar si ya existe el cliente con este correo
        const existingClient = await prisma.client.findFirst({
            where: { email: email.toLowerCase().trim() }
        })

        if (existingClient) {
            await prisma.client.update({
                where: { id: existingClient.id },
                data: {
                    phone: phone.trim() || existingClient.phone,
                    city: city.trim() || existingClient.city,
                    requirement: (existingClient.requirement || "") + ` | Guía Proveedores (${new Date().toLocaleDateString('es-EC')})`
                }
            })
            return NextResponse.json({ success: true, message: "Lead actualizado" })
        }

        const defaultSalesperson = await prisma.user.findFirst({
            where: { isActive: true },
            select: { id: true }
        })

        if (!defaultSalesperson) {
            return NextResponse.json({ error: "No hay vendedores activos para asignar" }, { status: 500 })
        }

        const clientName = name
            ? name.toUpperCase()
            : email.split("@")[0].toUpperCase()

        await prisma.client.create({
            data: {
                name: clientName,
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                city: city.trim(),
                source: source as any,
                requirement,
                status: "PROSPECTO",
                salespersonId: defaultSalesperson.id
            }
        })

        return NextResponse.json({ success: true, message: "Lead registrado exitosamente" })
    } catch (err) {
        console.error("[landing-lead] Error registering lead:", err)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
