import { NextResponse } from "next/server"
import { recordCartTelemetry } from "@/lib/telemetry/service"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}))

        if (!body.visitorId) {
            return NextResponse.json({ ok: false, message: "Missing visitorId" }, { status: 400 })
        }

        await recordCartTelemetry({
            visitorId: body.visitorId,
            items: Array.isArray(body.items) ? body.items : [],
            totalAmount: Number(body.totalAmount) || 0,
            itemsCount: Number(body.itemsCount) || 0,
            sourceUrl: body.sourceUrl || null,
            userId: body.userId || null,
            userEmail: body.userEmail || null,
            userName: body.userName || null,
            userPhone: body.userPhone || null,
            status: body.status || "ABANDONADO",
            lastAction: body.lastAction || "Actualización de carrito"
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
    }
}
