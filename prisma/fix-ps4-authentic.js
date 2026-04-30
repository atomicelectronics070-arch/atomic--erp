const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Correcting PS4 Slim
    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4 Slim' } },
        data: { images: 'https://upload.wikimedia.org/wikipedia/commons/5/52/PlayStation_4_Slim_and_DualShock_4.png' }
    })

    // Correcting PS4 Pro
    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4 Pro' } },
        data: { images: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/PS4_Console_and_DualShock_4.png' }
    })

    console.log('Restored authentic PS4 Slim and Pro images from stable Wikimedia sources.')
}

main().finally(() => prisma.$disconnect())
