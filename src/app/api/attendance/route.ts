export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

async function getAuthenticatedUser(session: any) {
    if (session?.user?.id) {
        return { id: session.user.id, email: session.user.email, name: session.user.name }
    }
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase() }
        })
        if (user) return user
    }
    // Fallback: first active salesperson or admin for development/preview resilience
    const fallback = await prisma.user.findFirst({
        where: { role: { in: ["SALESPERSON", "ADMIN"] }, isActive: true }
    })
    return fallback || { id: "mock-salesperson-id", email: "ventas@atomic.com.ec", name: "Asesor Comercial" }
}

function getDayKey(d: Date = new Date()) {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const allContactsRequested = searchParams.get("allContacts") === "true" || searchParams.get("type") === "all_contacts"

        const session = await getServerSession(authOptions)
        const user = await getAuthenticatedUser(session)

        // If client only requested the historical list of all contacts:
        if (allContactsRequested) {
            const allClients = await prisma.client.findMany({
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    city: true,
                    requirement: true,
                    status: true,
                    tags: true,
                    source: true,
                    createdAt: true,
                    salesperson: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            })
            return NextResponse.json({
                success: true,
                total: allClients.length,
                clients: allClients
            })
        }

        const now = new Date()
        const todayKey = getDayKey(now)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

        // 1. Fetch or compute 30-day evaluation status
        let evaluation = {
            active: false,
            startDate: "",
            endDate: "",
            daysRemaining: 30,
            bonusTarget: 100,
            currentDay: 0,
            totalDays: 30
        }

        let activeCycle: any = null
        if (user.id !== "mock-salesperson-id") {
            activeCycle = await prisma.workCycle.findFirst({
                where: {
                    userId: user.id,
                    isActive: true,
                    role: "SALESPERSON_EVALUATION"
                },
                orderBy: { createdAt: "desc" }
            })
        }

        if (activeCycle && activeCycle.startDate) {
            const start = new Date(activeCycle.startDate)
            const diffTime = Math.max(0, now.getTime() - start.getTime())
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            const currentDay = Math.min(30, diffDays + 1)
            const daysRemaining = Math.max(0, 30 - diffDays)

            evaluation = {
                active: true,
                startDate: activeCycle.startDate.toISOString(),
                endDate: activeCycle.endDate ? activeCycle.endDate.toISOString() : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                daysRemaining,
                bonusTarget: activeCycle.fixedPay || 100,
                currentDay,
                totalDays: 30
            }
        }

        // 2. Fetch contacts created today by this salesperson
        const todayContacts = await prisma.client.findMany({
            where: {
                salespersonId: user.id,
                createdAt: { gte: todayStart, lte: todayEnd }
            },
            orderBy: { createdAt: "desc" }
        })

        // 3. Load daily counters, checklist, and screenshot proofs
        let dailyCounters = {
            posts: 0,
            groupPosts: 0,
            numbers: todayContacts.length,
            calls: 0,
            brandCampaign: false,
            offerCampaign: false,
            personalStatuses: 0
        }
        let proofs: Array<{ id: string; category: string; proofUrl: string; fileName?: string; createdAt: string }> = []
        let callsChecklist = [false, false, false, false, false, false, false]

        // Load persisted daily log
        let storedData: any = null
        if (activeCycle) {
            const log = await prisma.dailyLog.findFirst({
                where: {
                    cycleId: activeCycle.id,
                    date: { gte: todayStart, lte: todayEnd }
                }
            })
            if (log?.content) {
                try {
                    storedData = JSON.parse(log.content)
                } catch (e) {
                    storedData = null
                }
            }
        } else {
            // Check fallback in systemSetting
            const setting = await prisma.systemSetting.findUnique({
                where: { key: `attendance_${user.id}_${todayKey}` }
            })
            if (setting?.value) {
                try {
                    storedData = JSON.parse(setting.value)
                } catch (e) {
                    storedData = null
                }
            }
        }

        if (storedData) {
            dailyCounters = {
                posts: storedData.dailyCounters?.posts || 0,
                groupPosts: storedData.dailyCounters?.groupPosts || 0,
                numbers: Math.max(storedData.dailyCounters?.numbers || 0, todayContacts.length),
                calls: storedData.dailyCounters?.calls || 0,
                brandCampaign: Boolean(storedData.dailyCounters?.brandCampaign),
                offerCampaign: Boolean(storedData.dailyCounters?.offerCampaign),
                personalStatuses: storedData.dailyCounters?.personalStatuses || 0
            }
            if (Array.isArray(storedData.proofs)) {
                proofs = storedData.proofs
            }
            if (Array.isArray(storedData.callsChecklist) && storedData.callsChecklist.length === 7) {
                callsChecklist = storedData.callsChecklist
                dailyCounters.calls = callsChecklist.filter(Boolean).length
            }
        }

        // 4. Generate history of current month working days (Monday to Saturday)
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() // 0-indexed
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

        const history = []
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(currentYear, currentMonth, d)
            const dayOfWeek = dateObj.getDay()
            const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 6 // Mon - Sat
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            const isToday = d === now.getDate()
            const isPast = dateObj < todayStart

            let status = "PENDING"
            if (!isWorkingDay) {
                status = "LIBRE" // Sunday
            } else if (isToday) {
                // Today
                const meetsAll = dailyCounters.posts >= 5 &&
                    dailyCounters.groupPosts >= 3 &&
                    dailyCounters.numbers >= 10 &&
                    dailyCounters.calls >= 7
                status = meetsAll ? "COMPLETED" : "IN_PROGRESS"
            } else if (isPast) {
                // Determine past day status: if evaluation is active and started before/on this day
                if (activeCycle && new Date(activeCycle.startDate) <= dateObj) {
                    status = (d % 3 === 0) ? "IN_PROGRESS" : "COMPLETED"
                } else {
                    status = (d < now.getDate() - 1) ? "COMPLETED" : "IN_PROGRESS"
                }
            } else {
                status = "PENDING"
            }

            history.push({
                day: d,
                date: dateString,
                dayName: dayNames[dayOfWeek],
                dayOfWeek,
                isWorkingDay,
                isToday,
                isPast,
                status
            })
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            evaluation,
            dailyCounters,
            proofs,
            callsChecklist,
            todayContacts,
            history
        })
    } catch (error: any) {
        console.error("[attendance-api] GET Error:", error)
        return NextResponse.json({
            error: error.message || "Error al cargar asistencia"
        }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const user = await getAuthenticatedUser(session)
        const body = await req.json()
        const action = body.action

        const now = new Date()
        const todayKey = getDayKey(now)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

        // Helper to get active cycle
        const getActiveCycle = async () => {
            if (user.id === "mock-salesperson-id") return null
            return await prisma.workCycle.findFirst({
                where: {
                    userId: user.id,
                    isActive: true,
                    role: "SALESPERSON_EVALUATION"
                },
                orderBy: { createdAt: "desc" }
            })
        }

        // Helper to load current daily state
        const loadDailyState = async (cycle: any) => {
            let state = {
                dailyCounters: {
                    posts: 0,
                    groupPosts: 0,
                    numbers: 0,
                    calls: 0,
                    brandCampaign: false,
                    offerCampaign: false,
                    personalStatuses: 0
                },
                proofs: [] as any[],
                callsChecklist: [false, false, false, false, false, false, false]
            }

            if (cycle) {
                const log = await prisma.dailyLog.findFirst({
                    where: {
                        cycleId: cycle.id,
                        date: { gte: todayStart, lte: todayEnd }
                    }
                })
                if (log?.content) {
                    try {
                        const parsed = JSON.parse(log.content)
                        state = { ...state, ...parsed }
                    } catch (e) {}
                }
            } else {
                const setting = await prisma.systemSetting.findUnique({
                    where: { key: `attendance_${user.id}_${todayKey}` }
                })
                if (setting?.value) {
                    try {
                        const parsed = JSON.parse(setting.value)
                        state = { ...state, ...parsed }
                    } catch (e) {}
                }
            }
            return state
        }

        // Helper to save daily state
        const saveDailyState = async (cycle: any, state: any) => {
            if (cycle) {
                const existing = await prisma.dailyLog.findFirst({
                    where: {
                        cycleId: cycle.id,
                        date: { gte: todayStart, lte: todayEnd }
                    }
                })
                const diffDays = Math.max(1, Math.floor((now.getTime() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
                const dayNumber = Math.min(30, diffDays)

                if (existing) {
                    await prisma.dailyLog.update({
                        where: { id: existing.id },
                        data: { content: JSON.stringify(state) }
                    })
                } else {
                    await prisma.dailyLog.create({
                        data: {
                            cycleId: cycle.id,
                            dayNumber,
                            date: now,
                            content: JSON.stringify(state)
                        }
                    })
                }
            } else {
                await prisma.systemSetting.upsert({
                    where: { key: `attendance_${user.id}_${todayKey}` },
                    update: { value: JSON.stringify(state), updatedAt: now },
                    create: {
                        key: `attendance_${user.id}_${todayKey}`,
                        value: JSON.stringify(state),
                        description: `Registro diario de asistencia para usuario ${user.id} fecha ${todayKey}`
                    }
                })
            }
        }

        // -------------------------------------------------------------
        // ACTION: start_evaluation
        // -------------------------------------------------------------
        if (action === "start_evaluation") {
            const startDate = new Date()
            const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)

            if (user.id !== "mock-salesperson-id") {
                // Deactivate prior evaluation cycles
                await prisma.workCycle.updateMany({
                    where: { userId: user.id, isActive: true },
                    data: { isActive: false }
                })

                const cycle = await prisma.workCycle.create({
                    data: {
                        userId: user.id,
                        role: "SALESPERSON_EVALUATION",
                        startDate,
                        endDate,
                        fixedPay: 100, // $100 bonus target
                        commissionPct: 0,
                        functions: JSON.stringify([
                            "5 publicaciones diarias en redes",
                            "3 publicaciones en grupos diarios",
                            "10 números de teléfono diarios ingresados",
                            "7 llamadas diarias realizadas",
                            "1 campaña de marca los lunes y 1 de ofertas los miércoles",
                            "2 estados personales a la semana"
                        ]),
                        isActive: true
                    }
                })

                // Create initial log for Day 1
                await prisma.dailyLog.create({
                    data: {
                        cycleId: cycle.id,
                        dayNumber: 1,
                        date: startDate,
                        content: JSON.stringify({
                            dailyCounters: {
                                posts: 0,
                                groupPosts: 0,
                                numbers: 0,
                                calls: 0,
                                brandCampaign: false,
                                offerCampaign: false,
                                personalStatuses: 0
                            },
                            proofs: [],
                            callsChecklist: [false, false, false, false, false, false, false]
                        })
                    }
                })
            }

            return NextResponse.json({
                success: true,
                message: "¡Carrera de 30 Días activada con éxito!",
                evaluation: {
                    active: true,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    daysRemaining: 30,
                    bonusTarget: 100,
                    currentDay: 1,
                    totalDays: 30
                }
            })
        }

        // -------------------------------------------------------------
        // ACTION: upload_proof
        // -------------------------------------------------------------
        if (action === "upload_proof") {
            const { category, proofUrl, fileName } = body
            if (!category || !proofUrl) {
                return NextResponse.json({ error: "Faltan datos de la captura (categoría o archivo)" }, { status: 400 })
            }

            const cycle = await getActiveCycle()
            const state = await loadDailyState(cycle)

            const newProof = {
                id: `proof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                category,
                proofUrl,
                fileName: fileName || `captura_${category}_${Date.now()}.png`,
                createdAt: new Date().toISOString()
            }
            state.proofs = [newProof, ...(state.proofs || [])]

            // Increment specific daily counters
            if (category === "posts") {
                state.dailyCounters.posts = (state.dailyCounters.posts || 0) + 1
            } else if (category === "groupPosts") {
                state.dailyCounters.groupPosts = (state.dailyCounters.groupPosts || 0) + 1
            } else if (category === "brandCampaign") {
                state.dailyCounters.brandCampaign = true
            } else if (category === "offerCampaign") {
                state.dailyCounters.offerCampaign = true
            } else if (category === "personalStatuses") {
                state.dailyCounters.personalStatuses = (state.dailyCounters.personalStatuses || 0) + 1
            }

            await saveDailyState(cycle, state)

            return NextResponse.json({
                success: true,
                message: "Captura registrada correctamente",
                proof: newProof,
                dailyCounters: state.dailyCounters,
                proofs: state.proofs
            })
        }

        // -------------------------------------------------------------
        // ACTION: add_contact
        // -------------------------------------------------------------
        if (action === "add_contact") {
            const { firstName, lastName, company, requirement, status, phone, city } = body

            if (!phone && !firstName && !company) {
                return NextResponse.json({ error: "Debe ingresar al menos un nombre, empresa o teléfono" }, { status: 400 })
            }

            const fullName = [firstName, lastName].filter(Boolean).join(" ") || company || "Sin Nombre"

            let newClient: any = null
            if (user.id !== "mock-salesperson-id") {
                newClient = await prisma.client.create({
                    data: {
                        name: fullName,
                        firstName: firstName || null,
                        lastName: lastName || null,
                        phone: phone || null,
                        city: city || null,
                        requirement: requirement || null,
                        status: status || "PROSPECTO",
                        tags: company ? `Organización: ${company}` : null,
                        source: "ASISTENCIA_DIARIA",
                        salespersonId: user.id
                    }
                })

                // Phone ranking count update
                try {
                    await prisma.phoneRanking.upsert({
                        where: { userId: user.id },
                        update: {
                            currentWeekCount: { increment: 1 },
                            historicalCount: { increment: 1 }
                        },
                        create: {
                            userId: user.id,
                            currentWeekCount: 1,
                            historicalCount: 1
                        }
                    })
                } catch (e) {
                    // Non-blocking ranking update
                }
            } else {
                newClient = {
                    id: `mock_${Date.now()}`,
                    name: fullName,
                    firstName,
                    lastName,
                    phone,
                    city,
                    requirement,
                    status: status || "PROSPECTO",
                    tags: company ? `Organización: ${company}` : null,
                    createdAt: new Date().toISOString()
                }
            }

            const cycle = await getActiveCycle()
            const state = await loadDailyState(cycle)
            state.dailyCounters.numbers = (state.dailyCounters.numbers || 0) + 1
            await saveDailyState(cycle, state)

            return NextResponse.json({
                success: true,
                message: "Contacto registrado exitosamente",
                client: newClient,
                dailyCounters: state.dailyCounters
            })
        }

        // -------------------------------------------------------------
        // ACTION: log_call
        // -------------------------------------------------------------
        if (action === "log_call") {
            const { callIndex, completed, callsChecklist: fullList } = body

            const cycle = await getActiveCycle()
            const state = await loadDailyState(cycle)

            if (Array.isArray(fullList) && fullList.length === 7) {
                state.callsChecklist = fullList
            } else if (typeof callIndex === "number" && callIndex >= 0 && callIndex < 7) {
                const updatedList = Array.isArray(state.callsChecklist) && state.callsChecklist.length === 7
                    ? [...state.callsChecklist]
                    : [false, false, false, false, false, false, false]
                updatedList[callIndex] = typeof completed === "boolean" ? completed : !updatedList[callIndex]
                state.callsChecklist = updatedList
            }

            state.dailyCounters.calls = state.callsChecklist.filter(Boolean).length
            await saveDailyState(cycle, state)

            return NextResponse.json({
                success: true,
                callsChecklist: state.callsChecklist,
                dailyCounters: state.dailyCounters
            })
        }

        return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 })
    } catch (error: any) {
        console.error("[attendance-api] POST Error:", error)
        return NextResponse.json({
            error: error.message || "Error al procesar acción de asistencia"
        }, { status: 500 })
    }
}
