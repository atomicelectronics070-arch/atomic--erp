import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getTelemetryReport } from "@/lib/telemetry/service"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    const role = (session?.user?.role || "").toUpperCase()
    
    // Solo personal administrativo, supervisores o dirección
    const isAuthorized = role.includes("ADMIN") || 
                         role.includes("MANAGEMENT") || 
                         role.includes("COORDINATOR") || 
                         role.includes("SUPERVISOR")

    if (!session || !isAuthorized) {
        return NextResponse.json({ error: "No autorizado para consultar telemetría directiva" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const days = parseInt(searchParams.get("days") || "7") || 7
        const report = await getTelemetryReport(days)
        return NextResponse.json(report)
    } catch (error) {
        console.error("Error en GET /api/admin/telemetry:", error)
        return NextResponse.json({ error: "Error al compilar reporte de telemetría" }, { status: 500 })
    }
}
