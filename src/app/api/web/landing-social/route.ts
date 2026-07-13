import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

const SOCIAL_KEYS = {
    instagram: "landing_social_instagram",
    facebook: "landing_social_facebook",
    youtube: "landing_social_youtube",
}

export async function GET() {
    try {
        const settings = await prisma.systemSetting.findMany({
            where: { key: { in: Object.values(SOCIAL_KEYS) } }
        })
        const result: Record<string, string> = {
            instagram: "",
            facebook: "",
            youtube: "",
        }
        for (const s of settings) {
            const key = Object.entries(SOCIAL_KEYS).find(([, v]) => v === s.key)?.[0]
            if (key) result[key] = s.value
        }
        return NextResponse.json(result)
    } catch {
        return NextResponse.json({ instagram: "", facebook: "", youtube: "" })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }
        const body = await req.json()

        for (const [field, key] of Object.entries(SOCIAL_KEYS)) {
            if (body[field] !== undefined) {
                await prisma.systemSetting.upsert({
                    where: { key },
                    update: { value: body[field] },
                    create: { key, value: body[field], description: `Landing Social: ${field}` }
                })
            }
        }
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("[landing-social] Error:", err)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
