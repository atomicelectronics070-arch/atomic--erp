const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // These are original high-quality PNGs from Wikimedia, same format as the working PS5 image
    const ps4SlimUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/40/PlayStation_4_system_and_DualShock_4.png';
    const ps4ProUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/82/PlayStation_4_Pro_Console.png';

    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4 Slim' } },
        data: { images: ps4SlimUrl }
    })

    await prisma.product.updateMany({
        where: { name: { contains: 'PlayStation 4 Pro' } },
        data: { images: ps4ProUrl }
    })

    console.log('Restored authentic PS4 Slim and Pro PNGs from Wikimedia.')
}

main().finally(() => prisma.$disconnect())
