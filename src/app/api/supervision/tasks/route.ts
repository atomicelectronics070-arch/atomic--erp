import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Global in-memory storage for directed tasks and employee deliveries
let tasksStore: any[] = [
    {
        id: 'task-101',
        title: 'Creación de 3 Reels para Campaña Cerraduras Smart Yale & BP',
        description: 'Grabar y editar 3 piezas de video verticales en 4K mostrando la apertura por huella biométrica y la app móvil. Incluir llamado a la acción al WhatsApp de Atomic.',
        targetArea: 'Edición',
        targetEmail: 'edicion@atomic.com.ec',
        targetName: 'Ian Editor (Multimedia)',
        duration: '24 horas',
        durationCategory: '24 horas',
        deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        requiredFormat: 'VIDEO',
        taskType: 'URGENTE',
        supervisorAttachments: ['/images/categories/tecnologia-residencial.jpg'],
        status: 'PENDIENTE',
        createdAt: new Date().toISOString(),
        delivery: null,
        feedback: null
    },
    {
        id: 'task-102',
        title: 'Llamada de Calificación & Cierre 5 Clientes de Pauta Meta CCTV',
        description: 'Contactar a los 5 prospectos de la campaña de cámaras 4K, enviar proforma formal en PDF y registrar resumen de interés en el CRM.',
        targetArea: 'Ventas',
        targetEmail: 'ventas@atomic.com.ec',
        targetName: 'Asesor Comercial Ventas',
        duration: '1.5 horas',
        durationCategory: '1.5 horas',
        deadline: new Date(Date.now() + 1.5 * 3600 * 1000).toISOString(),
        requiredFormat: 'CUESTIONARIO',
        taskType: 'ORDINARIA',
        supervisorAttachments: [],
        status: 'ENTREGADA',
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        delivery: {
            text: 'Se contactaron 4 de 5 prospectos. 2 clientes solicitaron visita técnica en Cumbayá y 1 cliente ya aprobó proforma PROP-2026-8491 por $840 USD.',
            fileUrl: '',
            format: 'CUESTIONARIO',
            submittedAt: new Date().toISOString()
        },
        feedback: null
    }
]

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const emailFilter = searchParams.get('email')
    const areaFilter = searchParams.get('area')

    let filtered = [...tasksStore]
    if (emailFilter) {
        filtered = filtered.filter(t => t.targetEmail === emailFilter || t.targetArea === 'Todos')
    }
    if (areaFilter && areaFilter !== 'Todos') {
        filtered = filtered.filter(t => t.targetArea === areaFilter || t.targetArea === 'Todos')
    }

    return NextResponse.json({
        success: true,
        tasks: filtered
    })
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { action, payload } = body

        if (action === "CREATE_DIRECTED_TASK") {
            const newTask = {
                id: `task-${Date.now()}`,
                title: payload.title || 'Nueva Tarea Dirigida',
                description: payload.description || '',
                targetArea: payload.targetArea || 'Todos',
                targetEmail: payload.targetEmail || 'todos@atomic.com.ec',
                targetName: payload.targetName || payload.targetArea,
                duration: payload.duration || '24 horas',
                durationCategory: payload.duration || '24 horas',
                deadline: payload.deadline || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
                requiredFormat: payload.requiredFormat || 'CUALQUIER_ARCHIVO',
                taskType: payload.taskType || 'URGENTE',
                supervisorAttachments: payload.supervisorAttachments || [],
                status: 'PENDIENTE',
                createdAt: new Date().toISOString(),
                delivery: null,
                feedback: null
            }

            tasksStore.unshift(newTask)
            return NextResponse.json({ success: true, task: newTask, message: "Tarea dirigida despachada con éxito" })
        }

        if (action === "SUBMIT_TASK_DELIVERY") {
            const task = tasksStore.find(t => t.id === payload.taskId)
            if (!task) {
                return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
            }

            task.status = 'ENTREGADA'
            task.delivery = {
                text: payload.deliveryText || '',
                fileUrl: payload.deliveryFileUrl || '',
                format: payload.deliveryFormat || task.requiredFormat,
                submittedAt: new Date().toISOString()
            }

            return NextResponse.json({ success: true, task, message: "Entrega subida correctamente para revisión" })
        }

        if (action === "APPROVE_TASK") {
            const task = tasksStore.find(t => t.id === payload.taskId)
            if (!task) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })

            task.status = 'APROBADA'
            task.feedback = {
                approved: true,
                comment: payload.comment || '¡Excelente trabajo! Entrega aprobada.',
                reviewedAt: new Date().toISOString()
            }

            return NextResponse.json({ success: true, task, message: "Tarea aprobada con éxito" })
        }

        if (action === "REJECT_TASK") {
            const task = tasksStore.find(t => t.id === payload.taskId)
            if (!task) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })

            task.status = 'RECHAZADA'
            task.feedback = {
                approved: false,
                comment: payload.comment || 'La entrega requiere correcciones. Por favor revisar requisitos.',
                reviewedAt: new Date().toISOString()
            }

            return NextResponse.json({ success: true, task, message: "Tarea devuelta para corrección" })
        }

        return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 })
    } catch (error: any) {
        console.error("[TASK_POST_ERROR]", error)
        return NextResponse.json({ error: error.message || "Error al procesar tarea" }, { status: 500 })
    }
}
