import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

let publicChatMessages: any[] = [
    {
        id: "msg-1",
        from: "Luis G.",
        text: "¡Hola equipo! Bienvenidos a la oficina virtual de ATOMIC. Todos los canales y estaciones están operativos.",
        time: "09:00",
        role: "COORDINATOR"
    },
    {
        id: "msg-2",
        from: "Supervisor QC",
        text: "Buenos días. Recordar registrar el ingreso antes de las 8:45 AM para calificación óptima.",
        time: "09:05",
        role: "COORD_ASSISTANT"
    }
]

export async function GET() {
    return NextResponse.json({ success: true, messages: publicChatMessages })
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    try {
        const { text } = await req.json()
        if (!text || !text.trim()) return NextResponse.json({ error: "Texto requerido" }, { status: 400 })

        const now = new Date()
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

        const newMsg = {
            id: `msg-${Date.now()}`,
            from: (session.user as any)?.name || session.user?.email || "Usuario",
            text: text.trim(),
            time: timeStr,
            role: (session.user as any)?.role || "USER"
        }

        publicChatMessages.push(newMsg)
        if (publicChatMessages.length > 50) publicChatMessages.shift()

        return NextResponse.json({ success: true, message: newMsg, messages: publicChatMessages })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
