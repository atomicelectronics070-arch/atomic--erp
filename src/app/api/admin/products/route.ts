import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "50")
        const search = searchParams.get("search") || ""
        const isTrash = searchParams.get("isTrash") === "true"
        const provider = searchParams.get("provider") || ""

        const skip = (page - 1) * limit

        const where: any = { isDeleted: isTrash }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { provider: { contains: search, mode: "insensitive" } },
            ]
        }
        
        if (provider) {
            where.provider = provider
        }

        // Base where for global stats (always non-deleted, no filters)
        const globalWhere = { isDeleted: false }

        const [products, total, totalInStock, providerStatsRaw] = await Promise.all([
            prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    compareAtPrice: true,
                    images: true,
                    categoryId: true,
                    collectionId: true,
                    isActive: true,
                    featured: true,
                    provider: true,
                    stock: true,
                    sku: true,
                    specSheetUrl: true,
                    createdAt: true,
                    isDeleted: true,
                    category: { select: { id: true, name: true, slug: true } },
                    collection: { select: { id: true, name: true, slug: true } },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            prisma.product.count({ where }),
            // Global: count products with stock > 0
            prisma.product.count({ where: { ...globalWhere, stock: { gt: 0 } } }),
            // Global: group by provider
            prisma.product.groupBy({
                by: ['provider'],
                where: globalWhere,
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } }
            })
        ])

        const providerStats = providerStatsRaw
            .filter((r: any) => r.provider && r.provider.trim() !== '')
            .map((r: any) => ({ name: r.provider, count: r._count.id }))

        return NextResponse.json({ products, total, page, limit, totalInStock, providerStats })
    } catch (error) {
        console.error("Admin products API error:", error)
        return NextResponse.json(
            { error: "Failed to fetch products", products: [], total: 0, totalInStock: 0, providerStats: [] },
            { status: 500 }
        )
    }
}
