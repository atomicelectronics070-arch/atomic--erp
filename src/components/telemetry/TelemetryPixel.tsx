"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

const VISITOR_ID_KEY = "atomic_vid"

/**
 * Obtiene o inicializa el UUID persistente del visitante
 */
function getOrCreateVisitorId(): string {
    if (typeof window === "undefined") return "server"
    try {
        let vid = localStorage.getItem(VISITOR_ID_KEY)
        if (!vid) {
            vid = "vid_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36)
            localStorage.setItem(VISITOR_ID_KEY, vid)
            document.cookie = `${VISITOR_ID_KEY}=${vid}; path=/; max-age=31536000; SameSite=Lax`
        }
        return vid
    } catch {
        return "anon_" + Date.now()
    }
}

export default function TelemetryPixel() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { data: session } = useSession()
    const lastTrackedRef = useRef<string>("")

    useEffect(() => {
        if (typeof window === "undefined") return

        const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
        if (lastTrackedRef.current === fullPath) return
        lastTrackedRef.current = fullPath

        const visitorId = getOrCreateVisitorId()
        const referrer = typeof document !== "undefined" ? document.referrer : ""

        // Extraer UTMs
        const utmSource = searchParams?.get("utm_source") || null
        const utmMedium = searchParams?.get("utm_medium") || null
        const utmCampaign = searchParams?.get("utm_campaign") || null
        const utmContent = searchParams?.get("utm_content") || null

        const payload = {
            visitorId,
            path: fullPath,
            referrer: referrer || null,
            utmSource,
            utmMedium,
            utmCampaign,
            utmContent,
            userId: session?.user?.id || null,
            userEmail: session?.user?.email || null,
            userName: session?.user?.name || null,
            userRole: (session?.user as any)?.role || "GUEST",
            timestamp: Date.now()
        }

        // Envío asíncrono no bloqueante
        try {
            fetch("/api/telemetry/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(() => {})
        } catch {}
    }, [pathname, searchParams, session])

    return null
}
