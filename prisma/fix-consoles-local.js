const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { category: { slug: 'consolas-de-video-juegos' } }
    })

    for (const p of products) {
        // Use the LOCAL asset that we KNOW works because categories are visible
        const imageUrl = '/categories/consolas-de-video-juegos.png';

        await prisma.product.update({
            where: { id: p.id },
            data: { images: imageUrl }
        })
        console.log(`Updated ${p.name} with LOCAL category image.`)
    }
}

main().finally(() => prisma.$disconnect())
