const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // FORCE the working PS5 URL to the PS4 products to isolate the issue
    const workingUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png';

    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4' } },
        data: { images: workingUrl }
    })

    console.log('FORCED WORKING PS5 URL TO PS4 PRODUCTS.')
}

main().finally(() => prisma.$disconnect())
