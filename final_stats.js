const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const multiCount = await prisma.product.count({ where: { provider: 'MultiTecnologia V&V', isDeleted: false } });
    const totalCount = await prisma.product.count({ where: { isDeleted: false } });
    const uncategorized = await prisma.product.count({ where: { categoryId: null, isDeleted: false } });
    console.log('MultiTecnologia Products:', multiCount);
    console.log('Total Active Products:', totalCount);
    console.log('Uncategorized Products:', uncategorized);
    await prisma.$disconnect();
}
main();
