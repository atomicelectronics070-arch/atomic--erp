const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.product.count({ where: { provider: 'Banco del Perno', price: 0 } });
    console.log('Zero price BP:', count);
    if (count > 0) {
        const samples = await prisma.product.findMany({ where: { provider: 'Banco del Perno', price: 0 }, take: 10, select: { name: true } });
        console.log('Samples:', JSON.stringify(samples, null, 2));
    }
    await prisma.$disconnect();
}
main();
