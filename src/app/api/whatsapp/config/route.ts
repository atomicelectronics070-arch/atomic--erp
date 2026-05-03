import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { key, value } = await req.json()

        if (!key || value === undefined) {
            return NextResponse.json({ error: "Key and value are required" }, { status: 400 })
        }

        const setting = await prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: {
                key,
                value,
                description: `Configuración de WhatsApp: ${key}`
            }
        })

        return NextResponse.json(setting)
    } catch (error) {
        console.error("[WHATSAPP_CONFIG_ERROR]", error)
        return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const settings = await prisma.systemSetting.findMany({
            where: {
                key: {
                    in: ['WHATSAPP_BOT_PLAN', 'WHATSAPP_NEURAL_MEMORY']
                }
            }
        })
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}
