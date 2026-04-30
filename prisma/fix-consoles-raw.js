const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { category: { slug: 'consolas-de-video-juegos' } }
    })

    for (const p of products) {
        let imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Arcade-Machine-Joystick.jpg/800px-Arcade-Machine-Joystick.jpg';

        const name = p.name.toLowerCase();
        if (name.includes('playstation 5') || name.includes('ps5')) {
            imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/800px-PlayStation_5_and_DualSense_with_transparent_background.png';
        } else if (name.includes('playstation 4') || name.includes('ps4')) {
            imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/PS4-Console-wDualShock4.jpg/800px-PS4-Console-wDualShock4.jpg';
        }

        // SAVE AS RAW STRING (No JSON stringify) to trigger the direct URL return in safeParseArray
        await prisma.product.update({
            where: { id: p.id },
            data: { images: imageUrl }
        })
        console.log(`Updated ${p.name} with RAW URL string.`)
    }
}

main().finally(() => prisma.$disconnect())
