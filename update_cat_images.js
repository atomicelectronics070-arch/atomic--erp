const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const updates = [
        { name: 'Energia', image: '/categories/energia.png' },
        { name: 'Cerraduras Smart y Accesos', image: '/categories/cerraduras-smart-y-accesos.png' },
        { name: 'Consolas de Video Juegos', image: '/categories/consolas-de-video-juegos.png' },
        { name: 'Iluminacion', image: '/categories/iluminacion.png' },
        { name: 'Porteria Electronica', image: '/categories/porteria-electronica.png' }
    ];

    for (const up of updates) {
        await prisma.category.updateMany({
            where: { name: up.name },
            data: { image: up.image }
        });
    }
    console.log('✅ Updated category images in DB');
    await prisma.$disconnect();
}
main();
