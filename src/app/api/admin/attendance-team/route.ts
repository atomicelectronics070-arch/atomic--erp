export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/attendance-team?userId=xxx
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const userRole = String((session.user as any)?.role || "").toUpperCase();
        const isAdminOrCoord = userRole.includes("ADMIN") || userRole.includes("COORDINATOR") || userRole.includes("MANAGEMENT");

        const { searchParams } = new URL(req.url);
        const targetUserId = searchParams.get("userId");

        // If no targetUserId requested, return summary list of advisors for the selector
        if (!targetUserId) {
            if (!isAdminOrCoord) {
                return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
            }

            const advisors = await prisma.user.findMany({
                where: {
                    isActive: true,
                },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    role: true,
                    phoneNumber: true,
                    cedula: true,
                    profileData: true,
                    createdAt: true
                },
                orderBy: [
                    { role: "asc" },
                    { name: "asc" }
                ]
            });

            return NextResponse.json({ success: true, advisors });
        }

        // Fetch target user details
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                role: true,
                phoneNumber: true,
                cedula: true,
                profileData: true,
                createdAt: true
            }
        });

        if (!targetUser) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        // Fetch active or latest work cycle for this user
        let activeCycle = await prisma.workCycle.findFirst({
            where: {
                userId: targetUserId,
                isActive: true,
                role: "SALESPERSON_EVALUATION"
            },
            orderBy: { createdAt: "desc" },
            include: {
                dailyLogs: {
                    orderBy: { dayNumber: "asc" }
                }
            }
        });

        if (!activeCycle) {
            activeCycle = await prisma.workCycle.findFirst({
                where: {
                    userId: targetUserId,
                },
                orderBy: { createdAt: "desc" },
                include: {
                    dailyLogs: {
                        orderBy: { dayNumber: "asc" }
                    }
                }
            });
        }

        let cycleData: any = null;
        if (activeCycle) {
            let metadata: any = {};
            try {
                metadata = activeCycle.functions ? JSON.parse(activeCycle.functions) : {};
            } catch (e) {
                metadata = {};
            }

            const totalDays = metadata.daysCount || 30;
            const completedCount = activeCycle.dailyLogs.filter(l => {
                try {
                    const c = JSON.parse(l.content);
                    return c.status === "COMPLETED";
                } catch (e) {
                    return false;
                }
            }).length;

            cycleData = {
                id: activeCycle.id,
                role: activeCycle.role,
                isActive: activeCycle.isActive,
                startDate: activeCycle.startDate,
                endDate: activeCycle.endDate,
                fixedPay: activeCycle.fixedPay,
                commissionPct: activeCycle.commissionPct,
                daysCount: totalDays,
                cycleAgreement: metadata.cycleAgreement || "",
                category: metadata.category || "General",
                sellerPhone: metadata.sellerPhone || targetUser.phoneNumber || "",
                completedDays: completedCount,
                progressPct: Math.min(100, Math.round((completedCount / totalDays) * 100)),
                dailyLogs: activeCycle.dailyLogs.map(l => {
                    let parsedContent: any = {};
                    try {
                        parsedContent = JSON.parse(l.content);
                    } catch (e) {
                        parsedContent = {};
                    }
                    return {
                        id: l.id,
                        dayNumber: l.dayNumber,
                        date: l.date,
                        status: parsedContent.status || "PENDING",
                        activities: parsedContent.activities || {
                            posts: 0,
                            groupPosts: 0,
                            numbers: 0,
                            calls: 0,
                            personalStatuses: 0,
                            brandCampaign: false
                        },
                        observations: parsedContent.observations || "",
                        clockInTime: parsedContent.clockInTime || null,
                        clockOutTime: parsedContent.clockOutTime || null,
                        updatedBy: parsedContent.updatedBy || null
                    };
                })
            };
        }

        return NextResponse.json({
            success: true,
            user: targetUser,
            cycle: cycleData
        });

    } catch (error: any) {
        console.error("[ATTENDANCE_TEAM_GET] Error:", error);
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
    }
}

// POST /api/admin/attendance-team
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const userRole = String((session.user as any)?.role || "").toUpperCase();
        const isAdminOrCoord = userRole.includes("ADMIN") || userRole.includes("COORDINATOR") || userRole.includes("MANAGEMENT");

        const body = await req.json();
        const { action } = body;

        // ─────────────────────────────────────────────────────────────
        // ACTION 1: INICIAR O REINICIAR CICLO LABORAL
        // ─────────────────────────────────────────────────────────────
        if (action === "start_cycle") {
            if (!isAdminOrCoord) {
                return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
            }

            const { 
                userId, 
                startDate, 
                endDate, 
                daysCount = 30, 
                cycleAgreement = "", 
                firstName, 
                lastName, 
                phone, 
                category = "Cámaras & CCTV Inteligente" 
            } = body;

            if (!userId) {
                return NextResponse.json({ error: "userId es obligatorio" }, { status: 400 });
            }

            const parsedDays = Math.max(1, parseInt(String(daysCount)) || 30);
            const start = startDate ? new Date(startDate) : new Date();
            const end = endDate ? new Date(endDate) : new Date(start.getTime() + parsedDays * 24 * 60 * 60 * 1000);

            // 1. Update user profile details if provided
            await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(firstName ? { name: firstName } : {}),
                    ...(lastName ? { lastName } : {}),
                    ...(phone ? { phoneNumber: phone } : {}),
                }
            });

            // 2. Deactivate any previous active cycle for this user
            await prisma.workCycle.updateMany({
                where: { userId, isActive: true },
                data: { isActive: false }
            });

            // 3. Create metadata JSON
            const metadata = {
                daysCount: parsedDays,
                cycleAgreement,
                category,
                sellerPhone: phone || "",
                sellerFullName: `${firstName || ""} ${lastName || ""}`.trim(),
                startedBy: session.user?.email || "Admin",
                startedAt: new Date().toISOString()
            };

            // 4. Create new WorkCycle
            const newCycle = await prisma.workCycle.create({
                data: {
                    userId,
                    role: "SALESPERSON_EVALUATION",
                    startDate: start,
                    endDate: end,
                    fixedPay: 100,
                    commissionPct: 5,
                    functions: JSON.stringify(metadata),
                    isActive: true,
                }
            });

            // 5. Initialize dailyLogs for each day of the cycle (1 to parsedDays)
            for (let day = 1; day <= parsedDays; day++) {
                const dayDate = new Date(start.getTime() + (day - 1) * 24 * 60 * 60 * 1000);
                const initialContent = {
                    status: "PENDING",
                    activities: {
                        posts: 0,
                        groupPosts: 0,
                        numbers: 0,
                        calls: 0,
                        personalStatuses: 0,
                        brandCampaign: false
                    },
                    observations: "",
                    clockInTime: null,
                    clockOutTime: null,
                    updatedBy: "INIT"
                };

                await prisma.dailyLog.create({
                    data: {
                        cycleId: newCycle.id,
                        dayNumber: day,
                        date: dayDate,
                        content: JSON.stringify(initialContent)
                    }
                });
            }

            return NextResponse.json({
                success: true,
                message: `Ciclo laboral de ${parsedDays} días iniciado correctamente.`,
                cycleId: newCycle.id
            });
        }

        // ─────────────────────────────────────────────────────────────
        // ACTION 2: ACTUALIZAR UN DÍA ESPECÍFICO DEL CICLO (MANIPULAR DÍA)
        // ─────────────────────────────────────────────────────────────
        if (action === "update_day") {
            const { 
                cycleId, 
                dayNumber, 
                status = "PENDING", 
                activities = {}, 
                observations = "", 
                clockInTime = null, 
                clockOutTime = null 
            } = body;

            if (!cycleId || !dayNumber) {
                return NextResponse.json({ error: "cycleId y dayNumber son requeridos" }, { status: 400 });
            }

            const cycle = await prisma.workCycle.findUnique({
                where: { id: cycleId },
                include: { user: true }
            });

            if (!cycle) {
                return NextResponse.json({ error: "Ciclo no encontrado" }, { status: 404 });
            }

            // Check permissions: either admin/coordinator or the owner seller
            const isOwner = cycle.userId === (session.user as any)?.id;
            if (!isAdminOrCoord && !isOwner) {
                return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
            }

            let log = await prisma.dailyLog.findFirst({
                where: {
                    cycleId,
                    dayNumber: parseInt(String(dayNumber))
                }
            });

            const dayDate = log?.date || new Date();
            const payload = {
                status,
                activities: {
                    posts: Number(activities.posts || 0),
                    groupPosts: Number(activities.groupPosts || 0),
                    numbers: Number(activities.numbers || 0),
                    calls: Number(activities.calls || 0),
                    personalStatuses: Number(activities.personalStatuses || 0),
                    brandCampaign: Boolean(activities.brandCampaign)
                },
                observations: String(observations || ""),
                clockInTime: clockInTime || null,
                clockOutTime: clockOutTime || null,
                updatedBy: session.user?.email || "User",
                updatedAt: new Date().toISOString()
            };

            if (log) {
                await prisma.dailyLog.update({
                    where: { id: log.id },
                    data: {
                        content: JSON.stringify(payload)
                    }
                });
            } else {
                log = await prisma.dailyLog.create({
                    data: {
                        cycleId,
                        dayNumber: parseInt(String(dayNumber)),
                        date: dayDate,
                        content: JSON.stringify(payload)
                    }
                });
            }

            // Sync with systemSetting for real-time fallback compatibility
            const dateKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
            await prisma.systemSetting.upsert({
                where: { key: `attendance_${cycle.userId}_${dateKey}` },
                update: {
                    value: JSON.stringify({
                        dailyCounters: payload.activities,
                        clockInTime: payload.clockInTime,
                        clockOutTime: payload.clockOutTime,
                        status: payload.status,
                        observations: payload.observations
                    })
                },
                create: {
                    key: `attendance_${cycle.userId}_${dateKey}`,
                    value: JSON.stringify({
                        dailyCounters: payload.activities,
                        clockInTime: payload.clockInTime,
                        clockOutTime: payload.clockOutTime,
                        status: payload.status,
                        observations: payload.observations
                    })
                }
            });

            return NextResponse.json({
                success: true,
                message: `Día ${dayNumber} actualizado correctamente.`,
                data: payload
            });
        }

        // ─────────────────────────────────────────────────────────────
        // ACTION 3: ASISTENCIA RÁPIDA (UNIVERSAL CLOCK-IN/OUT)
        // ─────────────────────────────────────────────────────────────
        if (action === "quick_clock") {
            const userId = (session.user as any)?.id;
            if (!userId) {
                return NextResponse.json({ error: "No autorizado" }, { status: 401 });
            }

            const now = new Date();
            const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const timeStr = now.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

            const settingKey = `attendance_${userId}_${dateKey}`;
            const existingSetting = await prisma.systemSetting.findUnique({ where: { key: settingKey } });

            let currentData: any = {};
            if (existingSetting?.value) {
                try {
                    currentData = JSON.parse(existingSetting.value);
                } catch (e) {
                    currentData = {};
                }
            }

            let clockType = "IN";
            let responseMessage = "";

            if (!currentData.clockInTime) {
                // Register Clock In
                currentData.clockInTime = timeStr;
                currentData.status = "IN_PROGRESS";
                clockType = "IN";
                responseMessage = `Entrada registrada a las ${timeStr}`;
            } else if (!currentData.clockOutTime) {
                // Register Clock Out
                currentData.clockOutTime = timeStr;
                currentData.status = "COMPLETED";
                clockType = "OUT";
                responseMessage = `Salida registrada a las ${timeStr}`;
            } else {
                // Already clocked out, re-record time
                currentData.clockOutTime = timeStr;
                clockType = "OUT_UPDATE";
                responseMessage = `Salida actualizada a las ${timeStr}`;
            }

            await prisma.systemSetting.upsert({
                where: { key: settingKey },
                update: { value: JSON.stringify(currentData) },
                create: { key: settingKey, value: JSON.stringify(currentData) }
            });

            return NextResponse.json({
                success: true,
                clockType,
                time: timeStr,
                message: responseMessage
            });
        }

        return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });

    } catch (error: any) {
        console.error("[ATTENDANCE_TEAM_POST] Error:", error);
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
    }
}
