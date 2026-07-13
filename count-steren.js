const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countSteren() {
    try {
        const count = await prisma.product.count({
            where: { provider: 'STEREN' }
        });
        console.log(`STEREN provider products count: ${count}`);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
countSteren();
