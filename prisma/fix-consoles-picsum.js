const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { category: { slug: 'consolas-de-video-juegos' } }
    })

    for (const p of products) {
        let imageUrl = `https://picsum.photos/seed/${encodeURIComponent(p.name)}/800/800`;

        const name = p.name.toLowerCase();
        if (name.includes('playstation 5') || name.includes('ps5')) {
             imageUrl = 'https://picsum.photos/seed/ps5pro/800/800';
        } else if (name.includes('playstation 4') || name.includes('ps4')) {
             imageUrl = 'https://picsum.photos/seed/ps4pro/800/800';
        }

        await prisma.product.update({
            where: { id: p.id },
            data: { images: imageUrl }
        })
        console.log(`Updated ${p.name} with Picsum stable URL.`)
    }
}

main().finally(() => prisma.$disconnect())
