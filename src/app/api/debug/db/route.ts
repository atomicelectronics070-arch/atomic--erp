import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const totalProducts = await prisma.product.count()
        const deletedProducts = await prisma.product.count({ where: { isDeleted: true } })
        const activeProducts = await prisma.product.count({ where: { isActive: true, isDeleted: false } })
        const inactiveProducts = await prisma.product.count({ where: { isActive: false, isDeleted: false } })
        
        const totalCategories = await prisma.category.count()
        const visibleCategories = await prisma.category.count({ where: { isVisible: true } })
        
        const sampleProducts = await prisma.product.findMany({
            take: 5,
            select: { id: true, name: true, isDeleted: true, isActive: true, categoryId: true }
        })

        const stats = {
            products: {
                total: totalProducts,
                deleted: deletedProducts,
                visible: activeProducts,
                hiddenByIsActive: inactiveProducts,
                netVisible: totalProducts - deletedProducts - inactiveProducts
            },
            categories: {
                total: totalCategories,
                visible: visibleCategories
            },
            samples: sampleProducts
        }

        return NextResponse.json(stats)
    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
    }
}
