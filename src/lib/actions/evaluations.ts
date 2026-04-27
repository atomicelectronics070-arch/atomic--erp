"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getActiveWorkCycle(userId: string) {
    try {
        return await (prisma as any).workCycle.findFirst({
            where: { userId, isActive: true },
            include: { dailyLogs: { orderBy: { dayNumber: 'asc' } } }
        })
    } catch (error) {
        console.error("Get Active Cycle Error:", error)
        return null
    }
}

export async function activateWorkCycle(userId: string, data: {
    role: string,
    startDate: Date,
    endDate: Date,
    fixedPay: number,
    commissionPct: number,
    functions: string[]
}) {
    try {
        // Deactivate existing cycles first
        await (prisma as any).workCycle.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false }
        })

        const cycle = await (prisma as any).workCycle.create({
            data: {
                userId,
                role: data.role,
                startDate: data.startDate,
                endDate: data.endDate,
                fixedPay: data.fixedPay,
                commissionPct: data.commissionPct,
                functions: JSON.stringify(data.functions),
                isActive: true
            }
        })

        revalidatePath("/dashboard/evaluations")
        return { success: true, cycle }
    } catch (error: any) {
        console.error("Activate Cycle Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deactivateWorkCycle(cycleId: string) {
    try {
        await (prisma as any).workCycle.update({
            where: { id: cycleId },
            data: { isActive: false }
        })
        revalidatePath("/dashboard/evaluations")
        return { success: true }
    } catch (error: any) {
        console.error("Deactivate Cycle Error:", error)
        return { success: false, error: error.message }
    }
}

export async function saveDailyLog(cycleId: string, dayNumber: number, content: any) {
    try {
        const existing = await (prisma as any).dailyLog.findFirst({
            where: { cycleId, dayNumber }
        })

        if (existing) {
            await (prisma as any).dailyLog.update({
                where: { id: existing.id },
                data: { content: JSON.stringify(content) }
            })
        } else {
            await (prisma as any).dailyLog.create({
                data: {
                    cycleId,
                    dayNumber,
                    content: JSON.stringify(content)
                }
            })
        }

        revalidatePath("/dashboard/evaluations")
        return { success: true }
    } catch (error: any) {
        console.error("Save Daily Log Error:", error)
        return { success: false, error: error.message }
    }
}

export async function getAllUsersWithActiveCycle() {
    try {
        const users = await (prisma as any).user.findMany({
            include: {
                workCycles: {
                    where: { isActive: true },
                    include: { dailyLogs: { orderBy: { dayNumber: 'asc' } } }
                }
            },
            orderBy: { name: 'asc' }
        })
        return users
    } catch (error) {
        console.error("Get Users Error:", error)
        return []
    }
}


