const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.product.count({ where: { sku: null } });
    console.log('Products with null SKU:', count);
    if (count > 0) {
        const samples = await prisma.product.findMany({ where: { sku: null }, take: 10 });
        console.log('Samples:', JSON.stringify(samples, null, 2));
    }
    await prisma.$disconnect();
}
main();
