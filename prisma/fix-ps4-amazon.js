const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Using an industry-standard Amazon CDN URL for PS4
    const ps4Url = 'https://m.media-amazon.com/images/I/715rb6F6b7L._AC_SX679_.jpg';

    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4' } },
        data: { images: ps4Url }
    })

    console.log('Updated PS4 with industry-standard Amazon CDN URL.')
}

main().finally(() => prisma.$disconnect())
