const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.product.count({ where: { provider: 'Sisegusa' } });
    console.log('Sisegusa Products:', count);
    if (count > 0) {
        const samples = await prisma.product.findMany({ where: { provider: 'Sisegusa' }, take: 5, select: { name: true } });
        console.log('Samples:', JSON.stringify(samples, null, 2));
    }
    await prisma.$disconnect();
}
main();
