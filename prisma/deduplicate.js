const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🧹 Iniciando limpieza de productos duplicados...')

    const allProducts = await prisma.product.findMany({
        where: { isDeleted: false }
    })

    const seen = new Map()
    const toDelete = []

    for (const product of allProducts) {
        // We use name as a key for duplicates (case insensitive)
        const key = product.name.trim().toLowerCase()
        
        if (seen.has(key)) {
            const existing = seen.get(key)
            
            // Heuristic: Keep the one with images or more description
            const existingHasImage = existing.images && existing.images !== '[]' && existing.images !== 'null'
            const currentHasImage = product.images && product.images !== '[]' && product.images !== 'null'

            if (!existingHasImage && currentHasImage) {
                // Current is better, delete existing
                toDelete.push(existing.id)
                seen.set(key, product)
            } else {
                // Existing is better or same, delete current
                toDelete.push(product.id)
            }
        } else {
            seen.set(key, product)
        }
    }

    console.log(`🔍 Se encontraron ${toDelete.length} duplicados para eliminar.`)

    if (toDelete.length > 0) {
        await prisma.product.updateMany({
            where: { id: { in: toDelete } },
            data: { isDeleted: true }
        })
        console.log('✅ Duplicados marcados como eliminados satisfactoriamente.')
    } else {
        console.log('✨ No se encontraron duplicados significativos.')
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
