import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { isStaff } from "@/lib/roles"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!isStaff(session)) {
            return NextResponse.json({ error: "Unauthorized access to inventory" }, { status: 403 })
        }

        const products = await (prisma as any).product.findMany({
            where: {
                NOT: { isDeleted: true }
            },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!isStaff(session)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const data = await req.json()
        
        // Soporte para creación masiva (Bulk)
        if (Array.isArray(data)) {
            const products = await (prisma as any).product.createMany({
                data: data.map(p => ({
                    name: p.name,
                    description: p.description || '',
                    price: parseFloat(p.price) || 0,
                    sku: p.sku || null,
                    images: p.images || null,
                    isActive: p.isActive ?? true,
                    featured: p.featured ?? false,
                    stock: p.stock ?? 0,
                    keywords: p.keywords || null,
                    specs: p.specs || null,
                    provider: p.provider || null,
                })),
                skipDuplicates: true 
            })
            return NextResponse.json({ success: true, count: products.count })
        }

        // Creación individual original
        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description || '',
                price: parseFloat(data.price) || 0,
                sku: data.sku || null,
                images: data.images || null,
                isActive: data.isActive ?? true,
                featured: data.featured ?? false,
                stock: data.stock ?? 0,
                keywords: data.keywords || null,
                specs: data.specs || null,
                provider: data.provider || null,
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.error("Create product error:", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }
}


