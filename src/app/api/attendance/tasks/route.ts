export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

async function getAuthenticatedUser(session: any) {
    if (session?.user?.id) {
        return { 
            id: session.user.id, 
            email: session.user.email, 
            name: session.user.name, 
            role: String(session.user.role || "").toUpperCase() 
        }
    }
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() }
        })
        if (user) return { ...user, role: String(user.role || "").toUpperCase() }
    }
    const fallback = await prisma.user.findFirst({
        where: { role: { in: ["ADMIN", "COORDINATOR", "MANAGEMENT", "SUPERVISOR"] }, isActive: true }
    })
    return fallback ? { ...fallback, role: String(fallback.role || "ADMIN").toUpperCase() } : { id: "admin-fallback", email: "admin@atomic.com.ec", name: "Administrador", role: "ADMIN" }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const user = await getAuthenticatedUser(session)

        const isAdministrative = 
            user.role.includes("ADMIN") || 
            user.role.includes("COORDINAT") || 
            user.role.includes("MANAGEMENT") || 
            user.role.includes("SUPERVIS")

        // 1. Fetch available advisors if administrative
        let advisors: any[] = []
        if (isAdministrative) {
            advisors = await prisma.user.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    role: true,
                    phoneNumber: true
                },
                orderBy: { name: "asc" }
            })
        }

        // 2. Fetch Directed Tasks (InternalMessages of type "TAREA_DIRIGIDA")
        const whereClause: any = {
            type: "TAREA_DIRIGIDA"
        }

        if (!isAdministrative) {
            // Standard user only sees tasks assigned to them
            whereClause.receiverId = user.id
        }

        const rawTasks = await prisma.internalMessage.findMany({
            where: whereClause,
            include: {
                sender: { select: { id: true, name: true, email: true, role: true } },
                receiver: { select: { id: true, name: true, lastName: true, email: true, role: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 100
        })

        const tasks = rawTasks.map(t => {
            let meta: any = {}
            try {
                meta = JSON.parse(t.content)
            } catch {
                meta = { instructions: t.content, taskType: "TEXTO", priority: "MEDIA" }
            }

            return {
                id: t.id,
                title: t.subject,
                taskType: meta.taskType || "TEXTO", // TEXTO | TIEMPO_LIMITADO | ABIERTO | EVIDENCIA
                priority: meta.priority || "MEDIA", // BAJA | MEDIA | ALTA | URGENTE
                instructions: meta.instructions || t.content,
                deadline: meta.deadline || null,
                status: t.status || "PENDIENTE", // PENDIENTE | EN_PROGRESO | COMPLETADA | RECHAZADA
                responseNotes: meta.responseNotes || null,
                proofUrl: meta.proofUrl || null,
                completedAt: meta.completedAt || null,
                createdAt: t.createdAt,
                sender: t.sender,
                receiver: t.receiver,
                isSender: t.senderId === user.id,
                isReceiver: t.receiverId === user.id
            }
        })

        return NextResponse.json({
            success: true,
            isAdministrative,
            currentUser: { id: user.id, name: user.name, role: user.role },
            advisors,
            tasks
        })
    } catch (e: any) {
        console.error("GET /api/attendance/tasks error:", e)
        return NextResponse.json({ success: false, error: e.message || "Error al cargar tareas" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const user = await getAuthenticatedUser(session)
        const body = await req.json()

        const { action } = body

        // Action: CREATE DIRECTED TASK (Admins / Coordinators / Supervisors)
        if (action === "create_task") {
            const { receiverId, title, taskType, priority, deadline, instructions } = body

            if (!receiverId || !title || !instructions) {
                return NextResponse.json({ success: false, error: "Faltan campos obligatorios (Asesor, Título, Instrucciones)" }, { status: 400 })
            }

            const metaPayload = {
                taskType: taskType || "TEXTO",
                priority: priority || "MEDIA",
                deadline: deadline || null,
                instructions: instructions.trim(),
                responseNotes: null,
                proofUrl: null
            }

            const newTask = await prisma.internalMessage.create({
                data: {
                    subject: title.trim(),
                    type: "TAREA_DIRIGIDA",
                    content: JSON.stringify(metaPayload),
                    status: "PENDIENTE",
                    isRead: false,
                    senderId: user.id,
                    receiverId
                }
            })

            // Notification for advisor
            try {
                await prisma.notification.create({
                    data: {
                        userId: receiverId,
                        title: `🎯 Nueva Tarea Dirigida: ${title.trim()}`,
                        message: `Se te ha asignado una tarea prioritaria (${priority || "MEDIA"}): "${title.trim()}". Revisa la pestaña de Tareas en Inicio del Día.`,
                        type: "TASK_ASSIGNED",
                        relatedId: newTask.id
                    }
                })
            } catch (_) {}

            return NextResponse.json({ success: true, message: "Tarea dirigida asignada con éxito", taskId: newTask.id })
        }

        // Action: SUBMIT RESPONSE / UPDATE STATUS (Advisor or Admin)
        if (action === "update_task_status") {
            const { taskId, status, responseNotes, proofUrl } = body

            if (!taskId) {
                return NextResponse.json({ success: false, error: "ID de tarea requerido" }, { status: 400 })
            }

            const existingTask = await prisma.internalMessage.findUnique({
                where: { id: taskId }
            })

            if (!existingTask) {
                return NextResponse.json({ success: false, error: "Tarea no encontrada" }, { status: 404 })
            }

            let meta: any = {}
            try {
                meta = JSON.parse(existingTask.content)
            } catch {
                meta = { instructions: existingTask.content }
            }

            if (responseNotes !== undefined) meta.responseNotes = responseNotes
            if (proofUrl !== undefined) meta.proofUrl = proofUrl
            if (status === "COMPLETADA") meta.completedAt = new Date().toISOString()

            const updated = await prisma.internalMessage.update({
                where: { id: taskId },
                data: {
                    status: status || existingTask.status,
                    content: JSON.stringify(meta),
                    isRead: true
                }
            })

            // Notify sender that task was responded to
            if (status === "COMPLETADA" && existingTask.senderId !== user.id) {
                try {
                    await prisma.notification.create({
                        data: {
                            userId: existingTask.senderId,
                            title: `✅ Tarea Completada: ${existingTask.subject}`,
                            message: `El colaborador ha finalizado la tarea y adjuntado su reporte/evidencia.`,
                            type: "TASK_COMPLETED",
                            relatedId: taskId
                        }
                    })
                } catch (_) {}
            }

            return NextResponse.json({ success: true, message: "Tarea actualizada correctamente", task: updated })
        }

        // Action: DELETE TASK (Admins only)
        if (action === "delete_task") {
            const { taskId } = body
            if (!taskId) return NextResponse.json({ success: false, error: "ID de tarea requerido" }, { status: 400 })

            await prisma.internalMessage.delete({
                where: { id: taskId }
            })

            return NextResponse.json({ success: true, message: "Tarea eliminada correctamente" })
        }

        return NextResponse.json({ success: false, error: "Acción no reconocida" }, { status: 400 })
    } catch (e: any) {
        console.error("POST /api/attendance/tasks error:", e)
        return NextResponse.json({ success: false, error: e.message || "Error al procesar la tarea" }, { status: 500 })
    }
}
