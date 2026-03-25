import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId')
        const type = searchParams.get('type') || 'CAPACITADOR'

        // Get saved Historical Prompts
        const savedPrompts = await prisma.savedPrompt.findMany({
            orderBy: { createdAt: 'desc' }
        })

        // Get Users for the dropdown
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' }
        })

        // Get active assigned Prompts across all users
        const activeConfigs = await prisma.userPromptConfig.findMany({
            include: { user: { select: { id: true, name: true, email: true } } },
            orderBy: { updatedAt: 'desc' }
        })

        if (userId) {
            const config = await prisma.userPromptConfig.findUnique({
                where: { userId_type: { userId, type } }
            })

            return NextResponse.json({
                prompt: config?.prompt || "",
                savedPrompts,
                users,
                activeConfigs
            })
        }

        return NextResponse.json({
            prompt: "",
            savedPrompts,
            users,
            activeConfigs
        })
    } catch (error) {
        console.error("Admin prompt GET error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { userId, type, prompt, saveAsTemplate, templateName } = body

        if (!userId || !type || !prompt) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Upsert the specific user config
        const config = await prisma.userPromptConfig.upsert({
            where: { userId_type: { userId, type } },
            update: { prompt },
            create: { userId, type, prompt }
        })

        // Optionally save to history
        let newTemplate = null
        if (saveAsTemplate && templateName) {
            newTemplate = await prisma.savedPrompt.create({
                data: {
                    name: templateName,
                    type,
                    content: prompt
                }
            })
        }

        // Create a notification for the advisor
        await prisma.notification.create({
            data: {
                userId,
                title: "🤖 Nueva Programación de IA",
                message: `Tu configuración cognitiva tipo ${type} ha sido actualizada por el administrador.`,
                type: "SYSTEM",
                relatedId: config.id
            }
        })

        return NextResponse.json({ message: "Prompt updated successfully", config, newTemplate })
    } catch (error) {
        console.error("Admin prompt POST error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

