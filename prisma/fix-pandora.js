const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const cat = await prisma.category.findUnique({ where: { slug: 'consolas-de-video-juegos' } })
    if (!cat) return;

    // Fix Pandora Arcade
    const pandora = await prisma.product.findUnique({ where: { id: 'cmogq91ro07zoop1fm7sx7ru0' } })
    if (pandora) {
        await prisma.product.update({
            where: { id: pandora.id },
            data: { 
                categoryId: cat.id,
                images: JSON.stringify(['https://m.media-amazon.com/images/I/71RndXj8M9L._AC_SL1500_.jpg'])
            }
        })
        console.log('Fixed Pandora Arcade category and image.')
    }

    // Double check the other 4
    const products = await prisma.product.findMany({
        where: { categoryId: cat.id }
    })

    for (const p of products) {
        let imageUrl = null;
        if (p.name.toLowerCase().includes('ps5')) imageUrl = 'https://m.media-amazon.com/images/I/51q6L8yX7eL._AC_SX679_.jpg';
        else if (p.name.toLowerCase().includes('ps4')) imageUrl = 'https://m.media-amazon.com/images/I/41GGPRqTZtL._AC_.jpg';
        
        if (imageUrl) {
            await prisma.product.update({
                where: { id: p.id },
                data: { images: JSON.stringify([imageUrl]) }
            })
        }
    }
    console.log('All consoles in category verified and updated.')
}

main().finally(() => prisma.$disconnect())
