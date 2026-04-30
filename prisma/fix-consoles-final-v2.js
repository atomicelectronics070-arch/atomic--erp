const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Update PS4 with a different Wikimedia URL that might be more compatible
    const ps4Products = await prisma.product.findMany({
        where: { name: { contains: 'PlayStation 4' } }
    })

    for (const p of ps4Products) {
        const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/23/PlayStation_4_Pro.png';
        await prisma.product.update({
            where: { id: p.id },
            data: { images: imageUrl }
        })
        console.log(`Updated PS4: ${p.name} with new Wikimedia URL.`)
    }

    // Update Pandora too
    const pandora = await prisma.product.findMany({
        where: { name: { contains: 'Pandora' } }
    })

    for (const p of pandora) {
        const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Arcade-Machine-Joystick.jpg';
        await prisma.product.update({
            where: { id: p.id },
            data: { images: imageUrl }
        })
        console.log(`Updated Pandora: ${p.name}`)
    }
}

main().finally(() => prisma.$disconnect())
