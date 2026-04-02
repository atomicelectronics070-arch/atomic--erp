import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File | null
        const bannerKey = formData.get("bannerKey") as string | null

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Tipo de archivo no permitido. Usa JPG, PNG o WebP." }, { status: 400 })
        }

        // Validate file size (max 8MB)
        if (file.size > 8 * 1024 * 1024) {
            return NextResponse.json({ error: "Archivo demasiado grande. Máximo 8MB." }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
        const safeName = bannerKey
            ? `${bannerKey}-${Date.now()}.${ext}`
            : `banner-${Date.now()}.${ext}`

        const uploadDir = path.join(process.cwd(), "public", "uploads", "banners")

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true })

        const filePath = path.join(uploadDir, safeName)
        await writeFile(filePath, buffer)

        const publicUrl = `/uploads/banners/${safeName}`

        return NextResponse.json({ success: true, url: publicUrl })
    } catch (error) {
        console.error("[BANNER_UPLOAD_ERROR]", error)
        return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 })
    }
}
