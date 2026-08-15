export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true, isDeleted: false },
            include: { category: true }
        })

        const formattedProducts = products.map(p => {
            let imgUrl = 'https://via.placeholder.com/400';
            if (p.images) {
                try {
                    const arr = JSON.parse(p.images);
                    if (arr && arr.length > 0) imgUrl = arr[0];
                } catch(e) {
                    imgUrl = p.images.split(',')[0].replace(/\[|\]|"/g, '');
                }
            }
            return {
                id: p.id,
                name: p.name,
                code: p.sku || 'N/A',
                price: Number(p.price) || 0,
                image: imgUrl,
                category: p.category?.name || 'Sin Categoría',
                description: p.description,
                stock: p.stock
            };
        })

        return NextResponse.json({ success: true, count: formattedProducts.length, products: formattedProducts })
    } catch (error: any) {
        console.error("Prices API error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
