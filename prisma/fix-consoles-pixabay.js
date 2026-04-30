const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { category: { slug: 'consolas-de-video-juegos' } }
    })

    for (const p of products) {
        let imageUrl = 'https://cdn.pixabay.com/photo/2018/12/03/10/40/arcade-3853177_1280.jpg';

        const name = p.name.toLowerCase();
        if (name.includes('playstation 5') || name.includes('ps5')) {
            imageUrl = 'https://cdn.pixabay.com/photo/2021/01/21/11/09/playstation-5-5937102_1280.jpg';
        } else if (name.includes('playstation 4') || name.includes('ps4')) {
            imageUrl = 'https://cdn.pixabay.com/photo/2017/05/13/12/32/playstation-4-2309460_1280.jpg';
        }

        // SAVE AS RAW STRING
        await prisma.product.update({
            where: { id: p.id },
            data: { images: imageUrl }
        })
        console.log(`Updated ${p.name} with Pixabay URL.`)
    }
}

main().finally(() => prisma.$disconnect())
