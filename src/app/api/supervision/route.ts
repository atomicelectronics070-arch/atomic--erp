import { NextRequest, NextResponse } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// In-memory fallback stores for supervision items with persistent structure
let supervisionStore = {
    supervisorAttendance: [
        { id: 'att-1', date: '2026-08-28', time: '05:48', score: 10.0, status: 'PUNTUAL_EXCELENTE', note: 'Ingreso anticipado 12 min antes' },
        { id: 'att-2', date: '2026-08-29', time: '05:55', score: 10.0, status: 'PUNTUAL_EXCELENTE', note: 'Ingreso puntual' },
        { id: 'att-3', date: '2026-08-30', time: '06:00', score: 10.0, status: 'PUNTUAL', note: 'Hora exacta 6:00 AM' },
        { id: 'att-4', date: '2026-08-31', time: '06:08', score: 9.2, status: 'LEVE_RETRASO', note: 'Retraso de 8 minutos' },
        { id: 'att-5', date: '2026-09-01', time: '05:50', score: 10.0, status: 'PUNTUAL_EXCELENTE', note: 'Ingreso 10 min antes' },
        { id: 'att-6', date: '2026-09-02', time: '06:15', score: 8.5, status: 'RETRASO', note: 'Retraso de 15 minutos' },
    ],
    checks: {
        personalFinance: { income: 1250, expenses: 430, balance: 820, updatedAt: new Date().toISOString() },
        companyFinance: { income: 8450, expenses: 3120, updatedAt: new Date().toISOString() },
        debtsToPay: [
            { id: 'd-1', creditor: 'Proveedor Fibra Óptica & Enlaces', amount: 450, dueDate: '2026-09-15', status: 'PENDIENTE', category: 'Telecom' },
            { id: 'd-2', creditor: 'Importadora Hikvision/Dahua Lote Cámaras', amount: 1850, dueDate: '2026-09-20', status: 'PENDIENTE', category: 'Equipamiento' },
        ],
        invoicesToCollect: [
            { id: 'c-1', client: 'Condominio Bella Vista (Sistema CCTV 4K)', amount: 1200, issueDate: '2026-08-28', status: 'POR_COBRAR' },
            { id: 'c-2', client: 'Constructora Alfa (Cerraduras Smart Lote)', amount: 2400, issueDate: '2026-08-30', status: 'POR_COBRAR' },
        ],
        marketing: { income: 4300, expenses: 720, debt: 180, adAccountId: 'act_492019482019842', platform: 'Meta Ads Manager', updatedAt: new Date().toISOString() }
    },
    workCycles: [
        {
            id: 'wc-1',
            employeeEmail: 'ventas@atomic.com.ec',
            employeeName: 'Asesor Comercial Ventas',
            role: 'Asesor de Ventas',
            cycleDays: 30,
            cycleStart: '2026-08-15',
            cycleEnd: '2026-09-15',
            daysRemaining: 12,
            bankAccount: 'Banco Pichincha - Ahorros: 2205849102',
            monetaryBenefit: '$650.00 Base + 5% Comisiones',
            contractType: 'INDEFINIDO',
            modality: 'HIBRIDO',
            workHours: '40 Horas Semanales',
            isFreelancer: false,
            freelanceAgreement: '',
            freelancePercentage: 0,
            contractUrl: '/contracts/contrato_ventas_atomic.pdf',
            hasNoContract: false
        },
        {
            id: 'wc-2',
            employeeEmail: 'edicion@atomic.com.ec',
            employeeName: 'Ian Editor (Multimedia)',
            role: 'Editor Audiovisual & Media',
            cycleDays: 15,
            cycleStart: '2026-09-01',
            cycleEnd: '2026-09-15',
            daysRemaining: 12,
            bankAccount: 'Banco Guayaquil - Corriente: 004928174',
            monetaryBenefit: '$550.00 Base + Bono por Entrega',
            contractType: 'DEFINIDO',
            modality: 'REMOTO',
            workHours: '35 Horas Semanales',
            isFreelancer: true,
            freelanceAgreement: 'Creación de 12 Reels semanales y 4 spots comerciales 4K',
            freelancePercentage: 15,
            contractUrl: '/contracts/contrato_edicion_atomic.pdf',
            hasNoContract: false
        },
        {
            id: 'wc-3',
            employeeEmail: 'desarrollo@atomic.com.ec',
            employeeName: 'Nicolás (Dev Software)',
            role: 'Ingeniero de Software & ERP',
            cycleDays: 30,
            cycleStart: '2026-08-01',
            cycleEnd: '2026-08-31',
            daysRemaining: 28,
            bankAccount: 'Produbanco - Ahorros: 1204918293',
            monetaryBenefit: '$950.00 Base + Bonos de Despliegue',
            contractType: 'INDEFINIDO',
            modality: 'REMOTO',
            workHours: '40 Horas Semanales',
            isFreelancer: false,
            freelanceAgreement: '',
            freelancePercentage: 0,
            contractUrl: '',
            hasNoContract: true
        }
    ],
    delegatedClients: [
        {
            id: 'del-1',
            clientName: 'Ing. Carlos Mendoza (Hospital Metropolitano)',
            phone: '593987654321',
            assignedTo: 'ventas@atomic.com.ec',
            assignedName: 'Asesor Comercial Ventas',
            objective: 'Cerrar Venta Kit Cámaras 4K',
            requirementText: 'Cliente interesado en 16 cámaras IP con switch PoE y 2 controles de acceso biométricos. Requiere proforma formal hoy.',
            audioUrl: '',
            photoUrls: ['/images/categories/tecnologia-residencial.jpg'],
            status: 'PENDIENTE',
            createdAt: '2026-09-02T18:30:00Z',
            resolution: null
        }
    ]
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        // Return full supervision data
        return NextResponse.json({
            success: true,
            data: supervisionStore
        })
    } catch (error: any) {
        console.error("[SUPERVISION_GET_ERROR]", error)
        return NextResponse.json({ error: error.message || "Error al obtener datos" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { action, payload } = body

        if (action === "REGISTER_SUPERVISOR_ATTENDANCE") {
            const now = new Date()
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()
            const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`
            const dateStr = now.toISOString().split('T')[0]

            // Cálculo de calificación sobre 10 con base a las 6:00 AM
            let score = 10.0
            let status = 'PUNTUAL_EXCELENTE'
            let note = 'Ingreso dentro del horario de excelencia'

            const targetMinutes = 6 * 60 // 360 min (6:00 AM)
            const actualMinutes = currentHour * 60 + currentMinute

            if (actualMinutes <= targetMinutes) {
                // Si ingresa a las 6:00 AM o antes -> 10/10
                score = 10.0
                status = actualMinutes < targetMinutes ? 'PUNTUAL_EXCELENTE' : 'PUNTUAL'
                const earlyMins = targetMinutes - actualMinutes
                note = earlyMins > 0 ? `Ingreso anticipado con mérito (${earlyMins} min antes)` : 'Hora exacta 6:00 AM'
            } else {
                // Si ingresa después de las 6:00 AM -> Menor a 10 proporcional
                const lateMins = actualMinutes - targetMinutes
                // Descuento de 0.1 puntos por cada 2 minutos de retraso, mínimo 1.0
                const penalty = Math.min(9.0, (lateMins / 2) * 0.1)
                score = Math.max(1.0, parseFloat((10.0 - penalty).toFixed(1)))
                status = lateMins <= 15 ? 'LEVE_RETRASO' : 'RETRASO'
                note = `Retraso de ${lateMins} minutos tras las 6:00 AM`
            }

            const newRecord = {
                id: `att-${Date.now()}`,
                date: dateStr,
                time: timeStr,
                score,
                status,
                note
            }

            // Evitar duplicados por día si ya registró
            supervisionStore.supervisorAttendance = supervisionStore.supervisorAttendance.filter(a => a.date !== dateStr)
            supervisionStore.supervisorAttendance.push(newRecord)

            return NextResponse.json({
                success: true,
                record: newRecord,
                message: `✅ Ingreso registrado a las ${timeStr}. Calificación: ${score}/10`
            })
        }

        if (action === "SAVE_PERSONAL_FINANCE") {
            supervisionStore.checks.personalFinance = {
                income: Number(payload.income) || 0,
                expenses: Number(payload.expenses) || 0,
                balance: (Number(payload.income) || 0) - (Number(payload.expenses) || 0),
                updatedAt: new Date().toISOString()
            }
            return NextResponse.json({ success: true, message: "Finanzas personales guardadas" })
        }

        if (action === "SAVE_COMPANY_FINANCE") {
            supervisionStore.checks.companyFinance = {
                income: Number(payload.income) || 0,
                expenses: Number(payload.expenses) || 0,
                updatedAt: new Date().toISOString()
            }
            return NextResponse.json({ success: true, message: "Finanzas de empresa guardadas" })
        }

        if (action === "ADD_DEBT_TO_PAY") {
            const newDebt = {
                id: `debt-${Date.now()}`,
                creditor: payload.creditor || 'Acreedor General',
                amount: Number(payload.amount) || 0,
                dueDate: payload.dueDate || new Date().toISOString().split('T')[0],
                status: 'PENDIENTE',
                category: payload.category || 'Operativo'
            }
            supervisionStore.checks.debtsToPay.push(newDebt)
            return NextResponse.json({ success: true, debt: newDebt })
        }

        if (action === "ADD_INVOICE_TO_COLLECT") {
            const newInvoice = {
                id: `inv-${Date.now()}`,
                client: payload.client || 'Cliente General',
                amount: Number(payload.amount) || 0,
                issueDate: payload.issueDate || new Date().toISOString().split('T')[0],
                status: 'POR_COBRAR'
            }
            supervisionStore.checks.invoicesToCollect.push(newInvoice)
            return NextResponse.json({ success: true, invoice: newInvoice })
        }

        if (action === "SAVE_MARKETING_CHECK") {
            supervisionStore.checks.marketing = {
                income: Number(payload.income) || 0,
                expenses: Number(payload.expenses) || 0,
                debt: Number(payload.debt) || 0,
                adAccountId: payload.adAccountId || '',
                platform: payload.platform || 'Meta Ads Manager',
                updatedAt: new Date().toISOString()
            }
            return NextResponse.json({ success: true, message: "Marketing guardado correctamente" })
        }

        if (action === "ADD_WORK_CYCLE") {
            const newCycle = {
                id: `wc-${Date.now()}`,
                employeeEmail: payload.employeeEmail,
                employeeName: payload.employeeName,
                role: payload.role || 'Colaborador',
                cycleDays: Number(payload.cycleDays) || 30,
                cycleStart: payload.cycleStart || new Date().toISOString().split('T')[0],
                cycleEnd: payload.cycleEnd || new Date().toISOString().split('T')[0],
                daysRemaining: Number(payload.cycleDays) || 30,
                bankAccount: payload.bankAccount || '',
                monetaryBenefit: payload.monetaryBenefit || '',
                contractType: payload.contractType || 'DEFINIDO',
                modality: payload.modality || 'PRESENCIAL',
                workHours: payload.workHours || '40 Horas',
                isFreelancer: Boolean(payload.isFreelancer),
                freelanceAgreement: payload.freelanceAgreement || '',
                freelancePercentage: Number(payload.freelancePercentage) || 0,
                contractUrl: payload.contractUrl || '',
                hasNoContract: Boolean(payload.hasNoContract)
            }
            supervisionStore.workCycles.push(newCycle)
            return NextResponse.json({ success: true, cycle: newCycle })
        }

        if (action === "DELEGATE_CLIENT") {
            const newDelegated = {
                id: `del-${Date.now()}`,
                clientName: payload.clientName,
                phone: payload.phone,
                assignedTo: payload.assignedTo,
                assignedName: payload.assignedName || payload.assignedTo,
                objective: payload.objective || 'Atención Comercial',
                requirementText: payload.requirementText || '',
                audioUrl: payload.audioUrl || '',
                photoUrls: payload.photoUrls || [],
                status: 'PENDIENTE',
                createdAt: new Date().toISOString(),
                resolution: null
            }
            supervisionStore.delegatedClients.unshift(newDelegated)
            return NextResponse.json({ success: true, client: newDelegated })
        }

        return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 })
    } catch (error: any) {
        console.error("[SUPERVISION_POST_ERROR]", error)
        return NextResponse.json({ error: error.message || "Error al procesar acción" }, { status: 500 })
    }
}
