import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET — returns current counters
export async function GET() {
    try {
        const settings = await prisma.systemSetting.findMany({
            where: {
                key: { in: ["visits_dashboard", "visits_web", "visits_total"] }
            }
        })
        const result: Record<string, number> = { visits_dashboard: 0, visits_web: 0, visits_total: 0 }
        for (const s of settings) result[s.key] = parseInt(s.value) || 0
        return NextResponse.json(result)
    } catch {
        return NextResponse.json({ visits_dashboard: 0, visits_web: 0, visits_total: 0 })
    }
}

// POST — increment a counter
export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}))
        const type = body.type === "web" ? "visits_web" : "visits_dashboard"

        const bumpKey = async (key: string) => {
            const existing = await prisma.systemSetting.findUnique({ where: { key } })
            const current = existing ? (parseInt(existing.value) || 0) : 0
            await prisma.systemSetting.upsert({
                where: { key },
                update: { value: String(current + 1) },
                create: { key, value: "1", description: `Contador de visitas: ${key}` }
            })
        }

        await Promise.all([bumpKey(type), bumpKey("visits_total")])
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false })
    }
}
