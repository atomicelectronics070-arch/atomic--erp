export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import crypto from "crypto"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Max 25MB to support any image format or Excel/Word/PDF document
        if (file.size > 25 * 1024 * 1024) {
            return NextResponse.json({ error: "Archivo demasiado grande. Máximo 25MB." }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const rawExt = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin"
        const uniqueId = crypto.randomBytes(6).toString("hex")
        const safeName = `flash-${Date.now()}-${uniqueId}.${rawExt}`

        const uploadDir = path.join(process.cwd(), "public", "uploads", "flash")
        await mkdir(uploadDir, { recursive: true })

        const filePath = path.join(uploadDir, safeName)
        await writeFile(filePath, buffer)

        const publicUrl = `/uploads/flash/${safeName}`
        return NextResponse.json({ success: true, url: publicUrl, fileName: file.name, size: file.size })
    } catch (error) {
        console.error("[FLASH_UPLOAD_ERROR]", error)
        return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 })
    }
}
