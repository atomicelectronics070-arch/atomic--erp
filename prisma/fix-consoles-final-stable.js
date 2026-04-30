const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Fix category image
    await prisma.category.update({
        where: { slug: 'consolas-de-video-juegos' },
        data: { image: '/categories/consolas-de-video-juegos.png' }
    })

    const products = await prisma.product.findMany({
        where: { category: { slug: 'consolas-de-video-juegos' } }
    })

    for (const p of products) {
        let imageUrl = `https://placehold.co/800x800/020617/white?text=${encodeURIComponent(p.name)}`;

        const name = p.name.toLowerCase();
        if (name.includes('playstation 5') || name.includes('ps5')) {
            // Using a very stable Wikimedia URL for PS5
            imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/800px-PlayStation_5_and_DualSense_with_transparent_background.png';
        } else if (name.includes('playstation 4') || name.includes('ps4')) {
            // Using a very stable Wikimedia URL for PS4
            imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/PS4-Console-wDualShock4.jpg/800px-PS4-Console-wDualShock4.jpg';
        } else if (name.includes('pandora') || name.includes('arcade')) {
             imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Arcade-Machine-Joystick.jpg/800px-Arcade-Machine-Joystick.jpg';
        }

        await prisma.product.update({
            where: { id: p.id },
            data: { images: JSON.stringify([imageUrl]) }
        })
        console.log(`Updated ${p.name} with stable URL.`)
    }
}

main().finally(() => prisma.$disconnect())
