const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRegulators() {
    try {
        const all = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'regulador', mode: 'insensitive' } },
                    { name: { contains: 'regulator', mode: 'insensitive' } },
                    { provider: { contains: 'multitecnologia', mode: 'insensitive' } },
                    { provider: { contains: 'tecnit', mode: 'insensitive' } },
                ]
            }
        });
        console.log(`Total found: ${all.length}`);
        all.forEach(p => {
            console.log(`[${p.isActive ? 'ACTIVE' : 'INACTIVE'}][${p.isDeleted ? 'DELETED' : 'OK'}] ${p.name} | Provider: ${p.provider} | Price: $${p.price} | Stock: ${p.stock} | categoryId: ${p.categoryId}`);
        });
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkRegulators();
