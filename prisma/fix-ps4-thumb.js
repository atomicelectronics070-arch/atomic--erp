const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Attempting a smaller, high-compatibility thumbnail URL for PS4
    const ps4Url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PS4_Console_and_DualShock_4.png/600px-PS4_Console_and_DualShock_4.png';

    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4' } },
        data: { images: ps4Url }
    })

    console.log('Updated PS4 with high-compatibility thumbnail URL.')
}

main().finally(() => prisma.$disconnect())
