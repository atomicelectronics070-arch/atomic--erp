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
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ]
        }
        if (categoryId && categoryId !== "all") where.categoryId = categoryId
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
