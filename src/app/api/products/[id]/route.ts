import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const data = await req.json()
        const resolvedParams = await params
        const product = await prisma.product.update({
            where: { id: resolvedParams.id },
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                sku: data.sku,
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
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params
        await prisma.product.delete({
            where: { id: resolvedParams.id }
        })
        return NextResponse.json({ message: "Product deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }
}

