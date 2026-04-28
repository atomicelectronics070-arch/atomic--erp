const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.collection.update({ 
        where: { slug: 'tecnologia-residencial' }, 
        data: { image: '/assets/banners/residencial.png' } 
    });
    await prisma.collection.update({ 
        where: { slug: 'desarrollo' }, 
        data: { image: '/assets/banners/desarrollo.png' } 
    });
    await prisma.collection.update({ 
        where: { slug: 'gaming' }, 
        data: { image: '/assets/banners/gaming.png' } 
    });
    await prisma.collection.update({ 
        where: { slug: 'automatizacion' }, 
        data: { image: '/assets/banners/automatizacion.png' } 
    });
    console.log('COLLECTIONS UPDATED WITH NEW PREMIUM BANNERS');
}

main().catch(console.error).finally(() => prisma.$disconnect());
