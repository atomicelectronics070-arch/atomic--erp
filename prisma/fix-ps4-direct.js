const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Using direct, optimized assets from PlayStation's own global CDN
    const ps4SlimUrl = 'https://gmedia.playstation.com/is/image/SIEPDC/ps4-slim-image-block-01-en-24jul20?$native$';
    const ps4ProUrl = 'https://gmedia.playstation.com/is/image/SIEPDC/ps4-pro-image-block-01-en-24jul20?$native$';

    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4 Slim' } },
        data: { images: ps4SlimUrl }
    })

    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4 Pro' } },
        data: { images: ps4ProUrl }
    })

    console.log('Restored PS4 images using direct PlayStation CDN assets.')
}

main().finally(() => prisma.$disconnect())
