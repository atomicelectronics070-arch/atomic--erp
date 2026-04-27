import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File
        
        if (!file) {
            return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 })
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Solo se permiten archivos PDF" }, { status: 400 })
        }

        // Crear directorio si no existe (seguridad extra)
        const uploadDir = join(process.cwd(), "public", "uploads", "contracts")
        await mkdir(uploadDir, { recursive: true })

        const timestamp = Date.now()
        const sanitizedFilename = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
        const fileName = `${session.user.id}_${timestamp}_${sanitizedFilename}`
        const filePath = join(uploadDir, fileName)
        const fileUrl = `/uploads/contracts/${fileName}`

        // Guardar archivo físico
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // Crear o actualizar ciclo laboral (Poner en espera de aprobación)
        // Buscamos si ya tiene un ciclo inactivo para no duplicar. 
        // Si ya tiene uno activo, quizás no debería poder subir otro sin haber terminado el anterior (aunque el user no lo pidió, es buena práctica).
        
        const existingActiveCycle = await prisma.workCycle.findFirst({
            where: {
                userId: session.user.id,
                isActive: true
            }
        })

        if (existingActiveCycle) {
            return NextResponse.json({ error: "Ya tienes un ciclo activo. Debes terminarlo antes de subir un nuevo contrato." }, { status: 400 })
        }

        const cycle = await prisma.workCycle.create({
            data: {
                userId: session.user.id,
                role: session.user.role || "SALESPERSON",
                contractUrl: fileUrl,
                isActive: false, // Espera aprobación admin
                functions: "[]"
            }
        })

        return NextResponse.json({ 
            success: true, 
            message: "Contrato subido con éxito, pendiente de aprobación administrativa.",
            cycle 
        })

    } catch (error) {
        console.error("Contract upload error:", error)
        return NextResponse.json({ error: "Error interno al procesar el archivo" }, { status: 500 })
    }
}


