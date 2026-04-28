const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const prods = await prisma.product.findMany({
        where: { provider: 'Banco del Perno', categoryId: null, isDeleted: false },
        take: 30,
        select: { name: true }
    });
    console.log(JSON.stringify(prods, null, 2));
    await prisma.$disconnect();
}
main();
