import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const [categories, collections, providerRows] = await Promise.all([
            prisma.category.findMany({ orderBy: { name: "asc" } }),
            prisma.collection.findMany({ orderBy: { name: "asc" } }),
            prisma.product.findMany({
                where: { isDeleted: false, provider: { not: null } },
                select: { provider: true },
                distinct: ['provider'],
                orderBy: { provider: 'asc' }
            })
        ])
        const providersList = providerRows
            .map((r: any) => r.provider)
            .filter((p: string | null) => p && p.trim() !== '')
        return NextResponse.json({ categories, collections, providersList })
    } catch (error) {
        console.error("Web metadata API error:", error)
        return NextResponse.json({ categories: [], collections: [], providersList: [] })
    }
}


