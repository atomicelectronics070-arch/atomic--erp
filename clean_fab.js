const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function clean() {
    const res = await prisma.product.deleteMany({ where: { provider: 'Fabricables' } });
    console.log('Deleted:', res.count);
    await prisma.$disconnect();
}
clean();
