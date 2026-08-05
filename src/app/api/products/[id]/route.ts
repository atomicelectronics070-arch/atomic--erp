export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const data = await req.json()
        const resolvedParams = await params
        const updateData: any = {}

        if (data.name !== undefined) updateData.name = data.name
        if (data.description !== undefined) updateData.description = data.description
        if (data.price !== undefined) updateData.price = parseFloat(data.price)
        if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice === null || data.compareAtPrice === '' ? null : parseFloat(data.compareAtPrice)
        if (data.sku !== undefined) updateData.sku = data.sku
        if (data.images !== undefined) updateData.images = data.images
        if (data.isActive !== undefined) updateData.isActive = data.isActive
        if (data.featured !== undefined) updateData.featured = data.featured
        if (data.stock !== undefined) updateData.stock = parseInt(data.stock)
        if (data.keywords !== undefined) updateData.keywords = data.keywords
        if (data.specs !== undefined) updateData.specs = data.specs
        if (data.provider !== undefined) updateData.provider = data.provider
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null

        const product = await prisma.product.update({
            where: { id: resolvedParams.id },
            data: updateData
        })
        return NextResponse.json(product)
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 })
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
