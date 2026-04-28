const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🧐 Analizando integridad de precios...')

    const suspiciousProducts = await prisma.product.findMany({
        where: {
            isDeleted: false,
            price: { gt: 500 } // Prices over $500 are suspicious for certain categories
        },
        include: { category: true }
    })

    const toFix = []
    
    // Keywords for small items that definitely shouldn't cost > $500
    const microKeywords = [
        'conector', 'plug', 'rj45', 'rj11', 'tornillo', 'cable de red 1m', 
        'patch cord', 'balun', 'bornera', 'capucha', 'organizador', 'funda',
        'cinta', 'herramienta ponchadora', 'pelacable'
    ]

    for (const p of suspiciousProducts) {
        const name = p.name.toLowerCase()
        const isMicroItem = microKeywords.some(kw => name.includes(kw))
        
        // Pattern check: Prices like 36295.91 are likely meant to be 362.95
        if (isMicroItem && p.price >= 500) {
            toFix.push({
                id: p.id,
                name: p.name,
                oldPrice: p.price,
                newPrice: p.price / 100,
                reason: 'Micro-item con precio inflado'
            })
        } else if (p.price > 2000 && !name.includes('servidor') && !name.includes('rack') && !name.includes('kit') && !name.includes('nvr')) {
            // Outlier check for common items
            toFix.push({
                id: p.id,
                name: p.name,
                oldPrice: p.price,
                newPrice: p.price / 100,
                reason: 'Precio detectado como factor x100 (Anomalía de punto decimal)'
            })
        }
    }

    console.log(`\n🚨 Se encontraron ${toFix.length} productos con precios altamente sospechosos:`)
    toFix.slice(0, 10).forEach(f => {
        console.log(`- [${f.reason}] ${f.name}: $${f.oldPrice} -> $${f.newPrice}`)
    })

    if (toFix.length > 0) {
        console.log(`\n🔧 Aplicando correcciones...`)
        for (const f of toFix) {
            await prisma.product.update({
                where: { id: f.id },
                data: { price: f.newPrice }
            })
        }
        console.log(`✅ ${toFix.length} precios corregidos mediante análisis heurístico.`)
    } else {
        console.log('✨ No se detectaron anomalías críticas de puntuación decimal.')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
