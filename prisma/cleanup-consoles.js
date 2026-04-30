const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Find categories
    const catConsolas = await prisma.category.findUnique({ where: { slug: 'consolas-de-video-juegos' } })
    const catGaming = await prisma.category.findUnique({ where: { slug: 'gaming-consolas' } })

    if (catConsolas && catGaming) {
        // Move products from gaming-consolas to consolas-de-video-juegos
        await prisma.product.updateMany({
            where: { categoryId: catGaming.id },
            data: { categoryId: catConsolas.id }
        })
        // Hide the duplicate
        await prisma.category.update({
            where: { id: catGaming.id },
            data: { isVisible: false }
        })
        console.log('Merged gaming-consolas into consolas-de-video-juegos.')
    }

    // 2. Fix PlayStation Images
    const ps4Slim = await prisma.product.findFirst({ where: { name: { contains: 'PlayStation 4 Slim' } } })
    if (ps4Slim) {
        await prisma.product.update({
            where: { id: ps4Slim.id },
            data: { images: JSON.stringify(['https://m.media-amazon.com/images/I/41GGPRqTZtL._AC_.jpg']) }
        })
    }

    const ps4Pro = await prisma.product.findFirst({ where: { name: { contains: 'PlayStation 4 Pro' } } })
    if (ps4Pro) {
        await prisma.product.update({
            where: { id: ps4Pro.id },
            data: { images: JSON.stringify(['https://m.media-amazon.com/images/I/41S8eC0rNXL._AC_.jpg']) }
        })
    }

    const ps5Slim = await prisma.product.findFirst({ where: { name: { contains: 'PlayStation 5 Slim' } } })
    if (ps5Slim) {
        await prisma.product.update({
            where: { id: ps5Slim.id },
            data: { images: JSON.stringify(['https://m.media-amazon.com/images/I/51q6L8yX7eL._AC_SX679_.jpg']) }
        })
    }

    const ps5Pro = await prisma.product.findFirst({ where: { name: { contains: 'PlayStation 5 Pro' } } })
    if (ps5Pro) {
        await prisma.product.update({
            where: { id: ps5Pro.id },
            data: { images: JSON.stringify(['https://m.media-amazon.com/images/I/517E86Ial9L._AC_SL1000_.jpg']) }
        })
    }

    console.log('PlayStation images updated with Amazon direct URLs.')
}

main().finally(() => prisma.$disconnect())
