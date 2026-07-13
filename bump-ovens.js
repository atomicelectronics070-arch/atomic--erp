const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function bumpOvens() {
    try {
        const result = await prisma.product.updateMany({
            where: {
                provider: 'Banco del Perno',
                name: { contains: 'horno', mode: 'insensitive' }
            },
            data: {
                createdAt: new Date()
            }
        });
        console.log(`Bumped ${result.count} ovens to the top!`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
bumpOvens();
