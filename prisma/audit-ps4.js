const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { name: { contains: 'PlayStation 4' } },
        include: { category: true }
    })

    for (const p of products) {
        console.log(`ID: ${p.id} | Name: ${p.name} | Category: ${p.category?.name} | Images: ${p.images}`)
    }
}

main().finally(() => prisma.$disconnect())
