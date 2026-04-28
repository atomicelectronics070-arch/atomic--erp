const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const prods = await prisma.product.findMany({
        where: { name: { contains: 'marmol', mode: 'insensitive' } }
    });
    console.log('Products matching Marmol:', JSON.stringify(prods, null, 2));
    await prisma.$disconnect();
}
main();
