import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

// GET /api/admin/price-list
// Returns products grouped by supplier with cost/price info
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const allowedRoles = ["ADMIN", "MANAGEMENT", "SALESPERSON", "AFILIADO", "COORDINATOR", "COORD_ASSISTANT"]
        if (!session || !allowedRoles.includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const provider = searchParams.get("provider") || ""
        const search = searchParams.get("search") || ""
        const category = searchParams.get("category") || ""
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "100")
        const skip = (page - 1) * limit

        // Build where clause
        const where: any = { isDeleted: false }
        if (provider) where.provider = provider
        if (category) where.categoryId = category
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
            ]
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    compareAtPrice: true,
                    stock: true,
                    isActive: true,
                    provider: true,
                    images: true,
                    description: true,
                    category: { select: { id: true, name: true } },
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: [
                    { provider: "asc" },
                    { name: "asc" }
                ],
                take: limit,
                skip,
            }),
            prisma.product.count({ where }),
        ])

        // Get supplier stats (all providers, not filtered)
        const providerStats = await prisma.product.groupBy({
            by: ["provider"],
            _count: { id: true },
            _min: { price: true },
            _max: { price: true },
            _avg: { price: true },
            where: { isDeleted: false },
            orderBy: { _count: { id: "desc" } }
        })

        // Get categories for filter
        const categories = await prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" }
        })

        const isAdmin = session.user?.role === "ADMIN"
        const redactedProducts = products.map(p => ({
            ...p,
            compareAtPrice: isAdmin ? p.compareAtPrice : null
        }))

        return NextResponse.json({
            products: redactedProducts,
            total,
            page,
            limit,
            providerStats: providerStats.map(s => ({
                name: s.provider || "Sin Proveedor",
                count: s._count.id,
                minPrice: s._min.price,
                maxPrice: s._max.price,
                avgPrice: s._avg.price,
            })),
            categories
        })
    } catch (error: any) {
        console.error("Price list API error:", error)
        return NextResponse.json({ error: error.message, products: [], total: 0 }, { status: 500 })
    }
}

// PATCH /api/admin/price-list
// Update price (PVP) and/or cost (compareAtPrice) for a product
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { id, price, compareAtPrice, isActive, stock } = body

        if (!id) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 })
        }

        const updateData: any = {}
        if (price !== undefined) updateData.price = parseFloat(price)
        if (compareAtPrice !== undefined) updateData.compareAtPrice = parseFloat(compareAtPrice)
        if (isActive !== undefined) updateData.isActive = isActive
        if (stock !== undefined) updateData.stock = parseInt(stock)

        const updated = await prisma.product.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, price: true, compareAtPrice: true, isActive: true }
        })

        return NextResponse.json({ success: true, product: updated })
    } catch (error: any) {
        console.error("Price list PATCH error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST /api/admin/price-list/bulk
// Bulk update prices with margin
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { action, provider, marginPercent, ids } = body

        if (action === "apply_margin" && provider && marginPercent !== undefined) {
            // Apply margin to all products of a provider
            const products = await prisma.product.findMany({
                where: { provider, isDeleted: false },
                select: { id: true, compareAtPrice: true, price: true }
            })

            const updates = products
                .filter(p => p.compareAtPrice && p.compareAtPrice > 0)
                .map(p => prisma.product.update({
                    where: { id: p.id },
                    data: { price: parseFloat((p.compareAtPrice! * (1 + marginPercent / 100)).toFixed(2)) }
                }))

            await Promise.all(updates)
            return NextResponse.json({ success: true, updated: updates.length })
        }

        if (action === "bulk_apply_margin" && ids && Array.isArray(ids) && marginPercent !== undefined) {
            // Apply margin to selected products by ID
            const products = await prisma.product.findMany({
                where: { id: { in: ids }, isDeleted: false },
                select: { id: true, compareAtPrice: true }
            })

            const updates = products
                .filter(p => p.compareAtPrice && p.compareAtPrice > 0)
                .map(p => prisma.product.update({
                    where: { id: p.id },
                    data: { price: parseFloat((p.compareAtPrice! * (1 + marginPercent / 100)).toFixed(2)) }
                }))

            await Promise.all(updates)
            return NextResponse.json({ success: true, updated: updates.length })
        }

        if (action === "bulk_price_update" && ids && Array.isArray(ids)) {
            const { price, compareAtPrice, stock, isActive } = body
            const updateData: any = {}
            if (price !== undefined) updateData.price = parseFloat(price)
            if (compareAtPrice !== undefined) updateData.compareAtPrice = parseFloat(compareAtPrice)
            if (stock !== undefined) updateData.stock = parseInt(stock)
            if (isActive !== undefined) updateData.isActive = isActive

            await prisma.product.updateMany({
                where: { id: { in: ids } },
                data: updateData
            })
            return NextResponse.json({ success: true, updated: ids.length })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error: any) {
        console.error("Price list POST error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
