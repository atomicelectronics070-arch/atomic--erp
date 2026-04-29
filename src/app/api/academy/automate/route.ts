import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import axios from "axios"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execAsync = promisify(exec)

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL
const WORKER_MODEL = process.env.WORKER_MODEL

export async function POST(req: Request) {
    try {
        const { action, videoPath, segments, courseData } = await req.json()

        if (action === "PLAN") {
            const prompt = `
            Eres un experto en pedagogía técnica para el ecosistema tecnológico ATOMIC. 
            Analiza el concepto de un curso basado en un video de entrenamiento (asume que el video es de alta calidad técnica).
            Genera una estructura de 5 módulos para el curso.
            Responde ÚNICAMENTE en formato JSON válido con este esquema:
            {
                "title": "Título del Curso",
                "description": "Descripción profesional del curso",
                "segments": [
                    { "title": "Nombre del Módulo 1", "start": "00:00:00", "end": "00:03:30", "content": "Detalle del contenido..." },
                    ... hasta 5 segmentos
                ]
            }
            `

            const response = await axios.post(
                `${NVIDIA_BASE_URL}/chat/completions`,
                {
                    model: WORKER_MODEL,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.2,
                    max_tokens: 1024,
                    response_format: { type: "json_object" }
                },
                {
                    headers: {
                        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            const plan = JSON.parse(response.data.choices[0].message.content)
            return NextResponse.json(plan)
        }

        if (action === "CUT") {
            const outputDir = path.join(process.cwd(), "public", "courses", "temp")
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

            for (let i = 0; i < segments.length; i++) {
                const s = segments[i]
                const outputName = `module_${i + 1}.mp4`
                const outputPath = path.join(outputDir, outputName)
                
                // ffmpeg -i input.mp4 -ss start -to end -c copy output.mp4
                const cmd = `ffmpeg -y -i "${videoPath}" -ss ${s.start} -to ${s.end} -c copy "${outputPath}"`
                await execAsync(cmd)
            }
            return NextResponse.json({ success: true })
        }

        if (action === "PUBLISH") {
            // Create Category if not exists
            const category = await prisma.academyCategory.upsert({
                where: { slug: "automatizacion-inteligente" },
                update: {},
                create: {
                    name: "Automatización Inteligente",
                    slug: "automatizacion-inteligente",
                    description: "Cursos generados por el núcleo de automatización Atomic."
                }
            })

            const course = await prisma.course.create({
                data: {
                    title: courseData.title,
                    slug: courseData.title.toLowerCase().replace(/ /g, "-") + "-" + Date.now(),
                    description: courseData.description,
                    categoryId: category.id,
                    published: true,
                    lessons: {
                        create: courseData.segments.map((s: any, i: number) => ({
                            title: s.title,
                            slug: s.title.toLowerCase().replace(/ /g, "-"),
                            content: s.content,
                            order: i,
                            videoUrl: `/courses/temp/module_${i + 1}.mp4`
                        }))
                    }
                }
            })

            return NextResponse.json({ success: true, courseId: course.id })
        }

        return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    } catch (error: any) {
        console.error("ERROR EN AUTOMATIZACIÓN:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
