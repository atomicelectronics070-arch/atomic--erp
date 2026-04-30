const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { name: { contains: 'PlayStation 4' } }
    })

    const ps5Image = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png';

    for (const p of products) {
        await prisma.product.update({
            where: { id: p.id },
            data: { images: ps5Image }
        })
        console.log(`Test: Updated ${p.name} with PS5 image URL.`)
    }
}

main().finally(() => prisma.$disconnect())
