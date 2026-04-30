const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Attempting a high-profile, original PNG from Wikimedia (similar to the working PS5 one)
    const ps4Url = 'https://upload.wikimedia.org/wikipedia/commons/6/67/PlayStation_4_Slim.png';

    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4' } },
        data: { 
            images: ps4Url,
            isActive: true,
            isDeleted: false
        }
    })

    console.log('Updated PS4 with high-profile Wikimedia PNG URL.')
}

main().finally(() => prisma.$disconnect())
