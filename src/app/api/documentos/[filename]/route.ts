import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ filename: string }> }
) {
    const { filename } = await context.params

    // 1. Sanitize filename
    const safeFilename = path.basename(filename)

    // Rutas conocidas en el servidor y máquina local
    const downloadsDir = "C:\\Users\\SANTIAGO\\Downloads"
    const brainDir = "C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\9ce93935-4804-41b7-a54b-256f7ab20e4e"
    const publicDir = path.join(process.cwd(), "public", "documentos")

    let fileBuffer: Buffer | null = null

    // Caso A: Solicitud de PLAN DE PROPUESTAS
    if (safeFilename.toLowerCase().includes("plan") || safeFilename.toLowerCase().includes("propuesta")) {
        const candidates = [
            path.join(brainDir, "PLAN DE PROPUESTAS.pdf"),
            path.join(downloadsDir, "PLAN DE PROPUESTAS.pdf"),
            path.join(publicDir, "PLAN_DE_PROPUESTAS_DITEC.pdf"),
        ]

        for (const candidate of candidates) {
            try {
                if (fs.existsSync(candidate)) {
                    fileBuffer = fs.readFileSync(candidate)
                    // Sync a public si no está o es distinto
                    const targetPublic = path.join(publicDir, "PLAN_DE_PROPUESTAS_DITEC.pdf")
                    if (candidate !== targetPublic) {
                        try {
                            fs.copyFileSync(candidate, targetPublic)
                            const desktopTarget = "C:\\Users\\SANTIAGO\\Desktop\\PLAN_DE_PROPUESTAS_DITEC.pdf"
                            fs.copyFileSync(candidate, desktopTarget)
                        } catch {}
                    }
                    break
                }
            } catch {}
        }
    } 
    // Caso B: Solicitud de INFORME TECNICO OFICIAL
    else if (safeFilename.toLowerCase().includes("informe")) {
        const candidates = [
            path.join(publicDir, "INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf"),
            path.join(brainDir, "INFORME_TECNICO_DOMUM_DITEC_2026.pdf"),
            "C:\\Users\\SANTIAGO\\Desktop\\INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf"
        ]

        for (const candidate of candidates) {
            try {
                if (fs.existsSync(candidate)) {
                    fileBuffer = fs.readFileSync(candidate)
                    break
                }
            } catch {}
        }
    } 
    // Caso C: Cualquier otro documento en public/documentos
    else {
        const targetPath = path.join(publicDir, safeFilename)
        try {
            if (fs.existsSync(targetPath)) {
                fileBuffer = fs.readFileSync(targetPath)
            }
        } catch {}
    }

    if (!fileBuffer) {
        return new NextResponse("Documento no encontrado", { status: 404 })
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${safeFilename}"`,
            "Cache-Control": "public, max-age=3600, s-maxage=3600"
        }
    })
}
