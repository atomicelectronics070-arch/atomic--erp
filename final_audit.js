const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.product.count();
    const byProvider = await prisma.product.groupBy({
        by: ['provider'],
        _count: true
    });
    console.log('Total Products:', count);
    console.log('By Provider:', JSON.stringify(byProvider, null, 2));
    await prisma.$disconnect();
}
main();
