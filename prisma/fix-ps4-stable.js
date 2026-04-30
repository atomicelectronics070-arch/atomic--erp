const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { 
            category: { slug: 'consolas-de-video-juegos' },
            name: { contains: 'PlayStation 4' }
        }
    })

    for (const p of products) {
        // Using a highly reliable Pixabay URL for PS4 since the previous one failed for the user
        const imageUrl = 'https://cdn.pixabay.com/photo/2017/05/13/12/32/playstation-4-2309460_1280.jpg';

        await prisma.product.update({
            where: { id: p.id },
            data: { images: imageUrl }
        })
        console.log(`Updated ${p.name} with stable Pixabay URL.`)
    }
}

main().finally(() => prisma.$disconnect())
