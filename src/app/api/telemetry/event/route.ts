import { NextResponse } from "next/server"
import { recordVisitorHit } from "@/lib/telemetry/service"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}))
        const userAgent = req.headers.get("user-agent") || ""
        const forwardedFor = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || ""
        const ip = forwardedFor.split(",")[0]?.trim() || "127.0.0.1"

        // Dispositivo básico
        const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
        const isTablet = /tablet|ipad/i.test(userAgent)
        const device = isTablet ? "tablet" : (isMobile ? "mobile" : "desktop")

        // Navegador
        let browser = "Other"
        if (/chrome|crios/i.test(userAgent)) browser = "Chrome"
        else if (/safari/i.test(userAgent)) browser = "Safari"
        else if (/firefox/i.test(userAgent)) browser = "Firefox"
        else if (/edg/i.test(userAgent)) browser = "Edge"

        // Sistema Operativo
        let os = "Other"
        if (/windows/i.test(userAgent)) os = "Windows"
        else if (/android/i.test(userAgent)) os = "Android"
        else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS"
        else if (/mac os/i.test(userAgent)) os = "macOS"
        else if (/linux/i.test(userAgent)) os = "Linux"

        if (!body.visitorId || !body.path) {
            return NextResponse.json({ ok: false, message: "Missing visitorId or path" }, { status: 400 })
        }

        await recordVisitorHit({
            visitorId: body.visitorId,
            path: body.path,
            referrer: body.referrer || null,
            utmSource: body.utmSource || null,
            utmMedium: body.utmMedium || null,
            utmCampaign: body.utmCampaign || null,
            utmContent: body.utmContent || null,
            device: body.device || device,
            browser: body.browser || browser,
            os: body.os || os,
            ip: ip !== "127.0.0.1" ? ip.slice(0, 16) : null,
            city: body.city || null,
            userId: body.userId || null,
            userEmail: body.userEmail || null,
            userName: body.userName || null,
            userRole: body.userRole || "GUEST"
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
    }
}
