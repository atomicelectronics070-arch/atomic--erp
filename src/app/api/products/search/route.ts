import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { isStaff } from "@/lib/roles"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!isStaff(session)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const q = (searchParams.get("q") || "").trim()
        const limit = Math.min(parseInt(searchParams.get("limit") || "25", 10), 50)

        // Split query into terms for multi-word fuzzy matching (e.g. "camara ip 4mp")
        const terms = q.split(/\s+/).filter(t => t.length > 0)

        let whereClause: any = {
            isDeleted: false
        }

        if (terms.length > 0) {
            whereClause.AND = terms.map(term => ({
                OR: [
                    { name: { contains: term, mode: "insensitive" } },
                    { sku: { contains: term, mode: "insensitive" } },
                    { keywords: { contains: term, mode: "insensitive" } },
                    { description: { contains: term, mode: "insensitive" } }
                ]
            }))
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                stock: true,
                images: true,
                description: true
            },
            orderBy: [
                { stock: "desc" },
                { updatedAt: "desc" }
            ],
            take: limit
        })

        return NextResponse.json({
            success: true,
            count: products.length,
            products
        }, {
            headers: {
                "Cache-Control": "private, max-age=10, stale-while-revalidate=30"
            }
        })
    } catch (error) {
        console.error("Error searching products:", error)
        return NextResponse.json({ error: "Error al buscar productos" }, { status: 500 })
    }
}
