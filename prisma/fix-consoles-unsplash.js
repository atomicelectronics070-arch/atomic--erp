const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { category: { slug: 'consolas-de-video-juegos' } }
    })

    for (const p of products) {
        let imageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop'; // Default Arcade/Retro

        const name = p.name.toLowerCase();
        if (name.includes('playstation 5') || name.includes('ps5')) {
            imageUrl = 'https://images.unsplash.com/photo-1606144048470-3863a14af261?q=80&w=1000&auto=format&fit=crop';
        } else if (name.includes('playstation 4') || name.includes('ps4')) {
            imageUrl = 'https://images.unsplash.com/photo-1507457379470-08b8006bc664?q=80&w=1000&auto=format&fit=crop';
        } else if (name.includes('pandora') || name.includes('arcade')) {
            imageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop';
        }

        await prisma.product.update({
            where: { id: p.id },
            data: { images: JSON.stringify([imageUrl]) }
        })
        console.log(`Updated ${p.name} with Unsplash URL.`)
    }
}

main().finally(() => prisma.$disconnect())
