import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const PHONE_BRANDS = ['samsung', 'iphone', 'xiaomi', 'oppo', 'motorola', 'redmi', 'realme', 'honor', 'infinix', 'tecno', 'zte', 'nokia', 'huawei', 'poco', 'apple']
const BANNED_KEYWORDS = [
    'funda', 'estuche', 'case ', 'mica', 'protector', 'cargador', 'cable', 'repuesto', 'bateria', 'batería', 
    'teclado', 'keyboard', 'mouse', 'raton', 'ratón', 'banco de poder', 'power bank', 'powerbank', 
    'audifono', 'audífono', 'audífonos', 'audifonos', 'tablet', 'ipad', 'imac', 'macbook', 'laptop', 'computador', 'pc',
    'tv', 'televisor', 'monitor', 'ssd', 'disco', 'cerradura', 'cerrojo', 'pasta', 'extensor', 'convertidor',
    'memoria', 'flash', 'trampa', 'caja fuerte', 'holder', 'soporte', 'corsair', 'impresora', 'smartwatch', 'reloj',
    'correa', 'adaptador', 'adapter', 'smart tv', 'television', 'auricular', 'auriculares', 'headset', 'parlante', 'amazon fire',
    'airpod', 'airpods', 'buds', 'watch'
]

export async function GET(req: Request) {
    try {
        const allProducts = await prisma.product.findMany({
            where: { isDeleted: false, isActive: true },
            select: {
                id: true,
                name: true,
                price: true,
                compareAtPrice: true,
                images: true,
                categoryId: true,
                isActive: true,
                provider: true,
                description: true,
                category: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" }
        })

        let p = allProducts.filter(x => {
            const name = x.name.toLowerCase()
            const category = (x.category?.name || '').toLowerCase()
            
            if (BANNED_KEYWORDS.some(kw => name.includes(kw) || name === kw)) return false
            
            const isSmartphone = name.includes('smartphone') || name.includes('celular') || (name.includes('iphone') && !name.includes('ipad'))
            const hasBrand = PHONE_BRANDS.some(brand => name.includes(brand))
            const hasSpecs = (name.includes('gb') && (name.includes('ram') || name.includes('rom') || /\d+gb/.test(name))) || name.includes('dual sim') || name.includes('dual-sim') || name.includes('5g') || name.includes('4g') || name.includes('lte')

            if (isSmartphone) return true;
            if (hasBrand && hasSpecs) return true;
            if (category.includes('celular') && hasBrand) return true;
            
            return false
        })

        return NextResponse.json({ products: p, total: p.length })
    } catch (error) {
        console.error("Web phones API error:", error)
        return NextResponse.json(
            { error: "Failed to fetch phones", products: [], total: 0 },
            { status: 500 }
        )
    }
}
