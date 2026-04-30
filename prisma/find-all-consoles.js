const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'PlayStation' } },
                { name: { contains: 'PS5' } },
                { name: { contains: 'PS4' } },
                { name: { contains: 'Consola' } }
            ]
        },
        include: { category: true }
    })

    console.log(`Found ${products.length} potential console products.`)
    for (const p of products) {
        console.log(`[${p.category?.name || 'No Cat'}] ${p.name} - ID: ${p.id}`)
    }
}

main().finally(() => prisma.$disconnect())
