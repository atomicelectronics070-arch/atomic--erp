const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const p = await prisma.product.findMany({ 
        where: { provider: 'JM Technology' }, 
        select: { name: true, sku: true, price: true } 
    });
    console.log(JSON.stringify(p, null, 2));
    await prisma.$disconnect();
}
main();
