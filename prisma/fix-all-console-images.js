const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { category: { slug: 'consolas-de-video-juegos' } }
    })

    console.log(`Found ${products.length} products in Consolas category.`)

    for (const p of products) {
        let imageUrl = 'https://m.media-amazon.com/images/I/6127XFzU+UL._AC_SL1500_.jpg'; // Default Controller

        if (p.name.toLowerCase().includes('playstation 5') || p.name.toLowerCase().includes('ps5')) {
            imageUrl = 'https://m.media-amazon.com/images/I/51q6L8yX7eL._AC_SX679_.jpg';
        } else if (p.name.toLowerCase().includes('playstation 4') || p.name.toLowerCase().includes('ps4')) {
            imageUrl = 'https://m.media-amazon.com/images/I/41GGPRqTZtL._AC_.jpg';
        } else if (p.name.toLowerCase().includes('nintendo') || p.name.toLowerCase().includes('switch')) {
            imageUrl = 'https://m.media-amazon.com/images/I/61Dh76v+h2L._AC_SX679_.jpg';
        } else if (p.name.toLowerCase().includes('xbox')) {
            imageUrl = 'https://m.media-amazon.com/images/I/61JG6laY4eL._AC_SX679_.jpg';
        }

        await prisma.product.update({
            where: { id: p.id },
            data: { images: JSON.stringify([imageUrl]) }
        })
        console.log(`Updated: ${p.name}`)
    }
}

main().finally(() => prisma.$disconnect())
