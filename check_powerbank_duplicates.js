const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const prods = await prisma.product.findMany({
        where: { name: { contains: 'BANCO DE CARGA 5000' } },
        select: { sku: true, name: true, price: true, provider: true, isDeleted: true }
    });
    console.log(JSON.stringify(prods, null, 2));
    await prisma.$disconnect();
}
main();
