import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { whatsappId, firstName, lastName, email, city, category, requirement } = body

        if (!whatsappId) {
            return NextResponse.json({ error: "WhatsApp ID required" }, { status: 400 })
        }

        // Find or create the WAContact
        let waContact = await prisma.wAContact.findUnique({
            where: { whatsappId }
        })

        if (!waContact) {
            waContact = await prisma.wAContact.create({
                data: {
                    whatsappId,
                    name: `${firstName} ${lastName}`.trim()
                }
            })
        }

        // Create or update the Client
        const client = await prisma.client.upsert({
            where: { waContactId: waContact.id },
            update: {
                firstName,
                lastName,
                name: `${firstName} ${lastName}`.trim(),
                email,
                phone: whatsappId,
                city,
                category,
                requirement,
                updatedAt: new Date()
            } as any,
            create: {
                firstName,
                lastName,
                name: `${firstName} ${lastName}`.trim(),
                email,
                phone: whatsappId,
                city,
                category,
                requirement,
                salespersonId: session.user.id,
                waContactId: waContact.id,
                source: "WHATSAPP"
            } as any
        })

        return NextResponse.json(client)
    } catch (error) {
        console.error("Save to CRM Error:", error)
        return NextResponse.json({ error: "Failed to save contact to CRM" }, { status: 500 })
    }
}
