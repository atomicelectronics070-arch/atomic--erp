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
    format
} from "date-fns"

export async function getDashboardData(userId: string, role: string) {
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

    // 1. Annual Sales
    const annualSales = await (prisma as any).transaction.aggregate({
        where: { ...txWhere, date: { gte: yearStart, lte: yearEnd } },
        _sum: { amount: true }
    })

    // 2. Quarter Stats
    const quarterStats = await (prisma as any).transaction.aggregate({
        where: { ...txWhere, date: { gte: quarterStart, lte: quarterEnd } },
        _sum: { amount: true },
        _count: { id: true }
    })

    // 3. Quotes Count
    const totalQuotesCount = await prisma.quote.count({
        where: quotesWhere
    })

    // 4. Commissions
    const totalCommissions = await (prisma as any).transaction.aggregate({
        where: txWhere,
        _sum: { commission: true }
    })

    // 5. Admin Quote Breakdown or Personal Quote List
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

    // 6. Charts
    // Weekly
    const weekly = []
    for (let i = 6; i >= 0; i--) {
        const d = subDays(now, i)
        const res = await (prisma as any).transaction.aggregate({
            where: { ...txWhere, date: { gte: startOfDay(d), lte: endOfDay(d) } },
            _sum: { amount: true }
        })
        weekly.push({ name: format(d, 'eee'), total: res._sum.amount || 0 })
    }

    // Monthly
    const monthly = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const ms = startOfDay(d)
        const me = endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0))
        const res = await (prisma as any).transaction.aggregate({
            where: { ...txWhere, date: { gte: ms, lte: me } },
            _sum: { amount: true }
        })
        monthly.push({ name: format(d, 'MMM'), total: res._sum.amount || 0 })
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
}
