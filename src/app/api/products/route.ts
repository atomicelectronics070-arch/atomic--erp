import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
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
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.error("Create product error:", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }
}
