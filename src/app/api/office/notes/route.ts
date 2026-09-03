import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// In-memory fallback for Cartelera notes
let carteleraNotes: any[] = [
    {
        id: "note-1",
        title: "Meta Semanal de Ventas",
        message: "Finalizar promo y seguimiento de cotizaciones para mañana 9:00 AM.",
        from: "Luis G. (Coordinador)",
        targetDesk: "General",
        imageUrl: "/images/categories/tecnologia-residencial.jpg",
        createdAt: "Hace 15 min",
        pinned: true
    },
    {
        id: "note-2",
        title: "Revisión Quincenal",
        message: "Revisión quincenal de cotizaciones aprobadas e ingresos con supervisión.",
        from: "Supervisor QC",
        targetDesk: "General",
        imageUrl: null,
        createdAt: "Hace 1 hora",
        pinned: false
    }
]

export async function GET() {
    return NextResponse.json({ success: true, notes: carteleraNotes })
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    try {
        const body = await req.json()
        const { title, message, imageUrl, targetDesk } = body

        const newNote = {
            id: `note-${Date.now()}`,
            title: title || "Anuncio",
            message: message || "",
            imageUrl: imageUrl || null,
            from: (session.user as any)?.name || session.user?.email || "Colaborador",
            targetDesk: targetDesk || "General",
            createdAt: "Justo ahora",
            pinned: false
        }

        carteleraNotes.unshift(newNote)
        return NextResponse.json({ success: true, note: newNote, notes: carteleraNotes })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 })

        carteleraNotes = carteleraNotes.filter(n => n.id !== id)
        return NextResponse.json({ success: true, notes: carteleraNotes })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
