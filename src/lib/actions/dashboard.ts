"use server"

import { prisma } from "@/lib/prisma"
import { 
    startOfYear, 
    endOfYear, 
    startOfQuarter, 
    endOfQuarter, 
    subDays, 
    startOfDay, 
    endOfDay,
    format,
    subMonths,
    startOfMonth,
    endOfMonth
} from "date-fns"

export async function getDashboardData(userId: string, role: string) {
    try {
        const isAdmin = role === "ADMIN" || role === "MANAGEMENT"
        
        const now = new Date()
        const yearStart = startOfYear(now)
        const yearEnd = endOfYear(now)
        const quarterStart = startOfQuarter(now)
        const quarterEnd = endOfQuarter(now)
        
        // Filters
        const txWhere: any = { 
            status: "PAGADO"
        }
        if (!isAdmin) {
            txWhere.salespersonId = userId
        }

        const quotesWhere: any = isAdmin ? {} : { salespersonId: userId }

        // Fetch basic stats in parallel
        const [annualSales, quarterStats, totalQuotesCount, totalCommissions] = await Promise.all([
            (prisma as any).transaction.aggregate({
                where: { ...txWhere, date: { gte: yearStart, lte: yearEnd } },
                _sum: { amount: true }
            }),
            (prisma as any).transaction.aggregate({
                where: { ...txWhere, date: { gte: quarterStart, lte: quarterEnd } },
                _sum: { amount: true },
                _count: { id: true }
            }),
            prisma.quote.count({
                where: quotesWhere
            }),
            (prisma as any).transaction.aggregate({
                where: txWhere,
                _sum: { commission: true }
            })
        ])

        // Fetch quote data
        let quoteData: any = []
        if (isAdmin) {
            const users = await prisma.user.findMany({
                include: {
                    conversations: {
                        take: 5,
                        orderBy: { createdAt: 'desc' },
                        include: { client: true }
                    }
                },
                orderBy: { name: 'asc' }
            })
            quoteData = users.map(u => ({
                id: u.id,
                name: u.name || u.email,
                count: u.conversations.length,
                latest: u.conversations
            }))
        } else {
            quoteData = await prisma.quote.findMany({
                where: { salespersonId: userId },
                take: 20,
                orderBy: { createdAt: 'desc' },
                include: { client: true }
            })
        }

        // Optimized Chart Data - Fetch all relevant transactions once
        const sevenDaysAgo = startOfDay(subDays(now, 6))
        const sixMonthsAgo = startOfMonth(subMonths(now, 5))

        const [weeklyTxs, monthlyTxs] = await Promise.all([
            (prisma as any).transaction.findMany({
                where: { ...txWhere, date: { gte: sevenDaysAgo } },
                select: { amount: true, date: true }
            }),
            (prisma as any).transaction.findMany({
                where: { ...txWhere, date: { gte: sixMonthsAgo } },
                select: { amount: true, date: true }
            })
        ])

        // Aggregate Weekly in memory
        const weekly = []
        for (let i = 6; i >= 0; i--) {
            const d = subDays(now, i)
            const dStr = format(d, 'yyyy-MM-dd')
            const dayTotal = weeklyTxs
                .filter((tx: any) => format(new Date(tx.date), 'yyyy-MM-dd') === dStr)
                .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0)
            
            weekly.push({ name: format(d, 'eee'), total: dayTotal })
        }

        // Aggregate Monthly in memory
        const monthly = []
        for (let i = 5; i >= 0; i--) {
            const d = subMonths(now, i)
            const monthStr = format(d, 'yyyy-MM')
            const monthTotal = monthlyTxs
                .filter((tx: any) => format(new Date(tx.date), 'yyyy-MM') === monthStr)
                .reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0)
            
            monthly.push({ name: format(d, 'MMM'), total: monthTotal })
        }

        return {
            annualSales: annualSales._sum.amount || 0,
            quarterSales: quarterStats._sum.amount || 0,
            quarterCount: quarterStats._count.id || 0,
            quotesCount: totalQuotesCount,
            commissionsTotal: totalCommissions._sum.commission || 0,
            quoteData,
            charts: {
                weekly,
                monthly,
                annual: [
                    { name: '2025', total: 0 },
                    { name: '2026', total: annualSales._sum.amount || 0 }
                ]
            }
        }
    } catch (error) {
        console.error("Dashboard data error:", error)
        // Return empty structure so frontend doesn't crash but stops loading
        return {
            annualSales: 0,
            quarterSales: 0,
            quarterCount: 0,
            quotesCount: 0,
            commissionsTotal: 0,
            quoteData: [],
            charts: {
                weekly: [],
                monthly: [],
                annual: []
            }
        }
    }
}


