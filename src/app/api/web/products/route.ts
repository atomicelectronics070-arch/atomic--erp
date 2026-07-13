import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const pageSize = parseInt(searchParams.get("pageSize") || "24")
        const search = searchParams.get("search") || ""
        const categoryId = searchParams.get("categoryId") || ""
        const collectionId = searchParams.get("collectionId") || ""
        const skip = (page - 1) * pageSize

        const where: any = { isDeleted: false }

        if (search) {
            // Split into words for multi-keyword search (each word must match at least one field)
            const words = search.trim().split(/\s+/).filter(Boolean)
            
            if (words.length === 1) {
                // Single word: broad search across all fields
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { sku: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    { keywords: { contains: search, mode: "insensitive" } },
                    { provider: { contains: search, mode: "insensitive" } },
                ]
            } else {
                // Multi-word: AND logic — each word must appear somewhere in name OR description
                where.AND = words.map(word => ({
                    OR: [
                        { name: { contains: word, mode: "insensitive" } },
                        { description: { contains: word, mode: "insensitive" } },
                        { keywords: { contains: word, mode: "insensitive" } },
                        { sku: { contains: word, mode: "insensitive" } },
                    ]
                }))
            }
        }
        if (categoryId && categoryId !== "all") {
            const subcats = await prisma.category.findMany({ where: { parentId: categoryId }, select: { id: true } });
            const catIds = [categoryId, ...subcats.map(s => s.id)];
            where.categoryId = { in: catIds };
        }
        if (collectionId && collectionId !== "all") where.collectionId = collectionId

        const [products, total] = await Promise.all([
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
                    category: { select: { id: true, name: true, slug: true } },
                    collection: { select: { id: true, name: true, slug: true } },
                },
                orderBy: { createdAt: "desc" },
                take: pageSize,
                skip,
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({ products, total, page, pageSize })
    } catch (error) {
        console.error("Web products API error:", error)
        return NextResponse.json(
            { error: "Failed to fetch products", products: [], total: 0 },
            { status: 500 }
        )
    }
}


