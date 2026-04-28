const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.product.count({ where: { provider: 'Meeltech Store', isDeleted: false } });
    console.log('Meeltech Products:', count);
    await prisma.$disconnect();
}
main();
