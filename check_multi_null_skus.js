const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.product.count({ where: { provider: 'MultiTecnologia V&V', sku: null } });
    console.log('MultiTecnologia with null SKU:', count);
    await prisma.$disconnect();
}
main();
