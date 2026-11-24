import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const PHONE_BRANDS = [
    'samsung', 'iphone', 'xiaomi', 'oppo', 'motorola', 'redmi', 'realme', 'honor',
    'infinix', 'tecno', 'zte', 'nokia', 'huawei', 'poco', 'apple', 'amazon', 'dialn',
    'onn', 'surface', 'wacom', 'fire'
]

const BANNED_KEYWORDS = [
    'funda', 'estuche', 'case ', 'mica', 'protector', 'cargador', 'cable', 'repuesto', 'bateria', 'batería', 
    'teclado', 'keyboard', 'mouse', 'raton', 'ratón', 'banco de poder', 'power bank', 'powerbank', 
    'audifono', 'audífono', 'audífonos', 'audifonos', 'imac', 'macbook', 'laptop', 'computador', 'pc',
    'tv', 'televisor', 'monitor', 'ssd', 'disco', 'cerradura', 'cerrojo', 'pasta', 'extensor', 'convertidor',
    'memoria', 'flash', 'trampa', 'caja fuerte', 'holder', 'soporte', 'corsair', 'impresora', 'smartwatch', 'reloj',
    'correa', 'adaptador', 'adapter', 'smart tv', 'television', 'auricular', 'auriculares', 'headset', 'parlante',
    'airpod', 'airpods', 'buds', 'watch', 'fire tv', 'firecuda', 'campfire', 'stand para', 'mesa portátil',
    'tabletas limpiadoras', 'tabletop', 'disipador', 'card reader', 'docking station'
]

// Normalización de modelo para deduplicación precisa
function getModelDedupeKey(rawName: string): string {
    let n = rawName.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim()
    n = n.replace(/^(celular|smartphone|tablet|not|cop)\s+/, '')
    
    // Samsung Galaxy: agrupa "samsung galaxy a56", "samsung galaxy s25 ultra", etc.
    const samMatch = n.match(/(?:samsung\s+)?(?:galaxy\s+)?(tab\s+[a-z0-9\s]+|s\d+\s+ultra|s\d+\s+plus|s\d+\s+fe|s\d+|a\d+|z\s+fold\d*|z\s+flip\d*|xcover\d*)/)
    if (samMatch) return 'samsung_' + samMatch[1].replace(/\s+/g, '_')
    
    // iPhone
    const ipMatch = n.match(/iphone\s+(\d+\s+pro\s+max|\d+\s+pro|\d+\s+plus|\d+|se)/)
    if (ipMatch) return 'apple_iphone_' + ipMatch[1].replace(/\s+/g, '_')

    // iPad
    const ipadMatch = n.match(/ipad\s+([a-z0-9\s]+?)(?:\s+\d+gb|\s+wi\s*fi|$)/)
    if (ipadMatch) return 'apple_ipad_' + ipadMatch[1].replace(/\s+/g, '_')

    // Amazon Tablets / Fire / Kindle
    if (n.includes('amazon') && (n.includes('fire') || n.includes('kindle'))) {
        const fireMatch = n.match(/fire\s+([a-z0-9\s]+?)(?:pulgadas|\d+gb|,|$)/)
        return 'amazon_fire_' + (fireMatch ? fireMatch[1].trim().replace(/\s+/g, '_') : 'tablet')
    }

    // Xiaomi / Redmi
    const xiaomiMatch = n.match(/(?:xiaomi|redmi|poco)\s+([a-z0-9\s]+?)(?:\s+\d+gb|\s+ram|\s+alm|$)/)
    if (xiaomiMatch) return 'xiaomi_' + xiaomiMatch[1].trim().replace(/\s+/g, '_')

    // Honor
    const honorMatch = n.match(/honor\s+([a-z0-9\s]+?)(?:\s+\d+gb|\s+ram|\s+alm|$)/)
    if (honorMatch) return 'honor_' + honorMatch[1].trim().replace(/\s+/g, '_')

    // Infinix
    const infMatch = n.match(/infinix\s+([a-z0-9\s]+?)(?:\s+\d+gb|\s+ram|\s+alm|$)/)
    if (infMatch) return 'infinix_' + infMatch[1].trim().replace(/\s+/g, '_')

    return n.split(' ').slice(0, 4).join('_')
}

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
            
            const isTablet = name.includes('tablet') || name.includes('ipad') || 
                (name.includes('fire') && (name.includes('hd') || name.includes('kids') || name.includes('pulgada') || name.includes('7') || name.includes('8') || name.includes('10'))) || 
                (name.includes('tab') && (name.includes('samsung') || name.includes('galaxy') || name.includes('lenovo')))
                
            const isSmartphone = name.includes('smartphone') || name.includes('celular') || (name.includes('iphone') && !name.includes('ipad'))
            const hasBrand = PHONE_BRANDS.some(brand => name.includes(brand))
            const hasSpecs = (name.includes('gb') && (name.includes('ram') || name.includes('rom') || /\d+gb/.test(name))) || name.includes('dual sim') || name.includes('dual-sim') || name.includes('5g') || name.includes('4g') || name.includes('lte')

            if (isTablet) return true
            if (isSmartphone) return true
            if (hasBrand && hasSpecs) return true
            if (category.includes('celular') && hasBrand) return true
            if (category.includes('tablet')) return true
            
            return false
        })

        // Deduplicación por clave de modelo: se evita tener 3 o 4 tarjetas del mismo modelo repetido
        const modelGroups = new Map<string, typeof p>()
        p.forEach(prod => {
            const key = getModelDedupeKey(prod.name)
            if (!modelGroups.has(key)) {
                modelGroups.set(key, [])
            }
            modelGroups.get(key)!.push(prod)
        })

        const deduplicated: typeof p = []
        modelGroups.forEach((items) => {
            // Prioriza títulos limpios y concisos (ej. "Samsung Galaxy A54 5G" antes que códigos largos)
            items.sort((a, b) => {
                const aClean = a.name.length < 50 ? 1 : 0
                const bClean = b.name.length < 50 ? 1 : 0
                if (aClean !== bClean) return bClean - aClean
                return a.price - b.price
            })
            deduplicated.push(items[0])
        })

        return NextResponse.json({ products: deduplicated, total: deduplicated.length })
    } catch (error) {
        console.error("Web phones API error:", error)
        return NextResponse.json(
            { error: "Failed to fetch phones", products: [], total: 0 },
            { status: 500 }
        )
    }
}
