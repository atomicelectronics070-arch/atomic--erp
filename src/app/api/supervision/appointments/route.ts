import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// In-memory fallback for appointments
const appointmentsStore: any[] = [
    {
        id: "apt-demo-1",
        clientName: "Carlos Mendoza (Demo)",
        scheduledTime: "10:00",
        scheduledDate: new Date().toISOString().split("T")[0],
        purpose: "Consulta sobre sistema CCTV",
        status: "SCHEDULED",
        createdBy: "supervisor@atomic.com.ec",
        createdByName: "Supervisor Atomic",
        attentionData: null,
        createdAt: new Date().toISOString()
    }
]

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const dateFilter = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const filtered = appointmentsStore.filter(a => a.scheduledDate === dateFilter || !dateFilter)
    return NextResponse.json({ success: true, appointments: filtered })
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    try {
        const body = await req.json()
        const { action, payload } = body

        if (action === "CREATE_APPOINTMENT") {
            const newApt = {
                id: `apt-${Date.now()}`,
                clientName: payload.clientName || "Cliente",
                scheduledTime: payload.scheduledTime || "09:00",
                scheduledDate: payload.scheduledDate || new Date().toISOString().split("T")[0],
                purpose: payload.purpose || "",
                phone: payload.phone || "",
                status: "SCHEDULED",
                createdBy: session.user?.email || "",
                createdByName: (session.user as any)?.name || session.user?.email || "Operador",
                attentionData: null,
                createdAt: new Date().toISOString()
            }
            appointmentsStore.unshift(newApt)

            // Send notifications to all active users
            try {
                const allUsers = await prisma.user.findMany({
                    where: { isActive: true },
                    select: { id: true, email: true }
                })
                const notifData = JSON.stringify({ appointmentId: newApt.id })
                await Promise.all(allUsers.map(async (u) => {
                    try {
                        await prisma.notification.create({
                            data: {
                                userId: u.id,
                                title: "Cita Concretada",
                                type: "APPOINTMENT",
                                message: `🔔 CITA CONCRETADA — ${newApt.clientName} llegará a las ${newApt.scheduledTime} hoy. Motivo: ${newApt.purpose}`,
                                relatedId: newApt.id,
                                isRead: false
                            }
                        })
                    } catch (_) {}
                }))
            } catch (_) {}

            return NextResponse.json({ success: true, appointment: newApt })
        }

        if (action === "START_WAITING") {
            const apt = appointmentsStore.find(a => a.id === payload.appointmentId)
            if (!apt) return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
            apt.status = "WAITING"
            return NextResponse.json({ success: true, appointment: apt })
        }

        if (action === "ATTEND_CLIENT") {
            const apt = appointmentsStore.find(a => a.id === payload.appointmentId)
            if (!apt) return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
            apt.status = "ATTENDED"
            apt.attentionData = {
                summary: payload.summary || "",
                need: payload.need || "",
                urgency: payload.urgency || "MEDIA",
                budget: payload.budget || "",
                recontact: payload.recontact || false,
                contactMethod: payload.contactMethod || "Mensaje",
                location: payload.location || "",
                attendedBy: (session.user as any)?.name || session.user?.email || "Operador",
                attendedAt: new Date().toISOString()
            }
            return NextResponse.json({ success: true, appointment: apt })
        }

        if (action === "CANCEL_APPOINTMENT") {
            const apt = appointmentsStore.find(a => a.id === payload.appointmentId)
            if (!apt) return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
            apt.status = "CANCELLED"
            return NextResponse.json({ success: true, appointment: apt })
        }

        return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 })
    } catch (error: any) {
        console.error("[APPOINTMENTS_ERROR]", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
