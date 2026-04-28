const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const p = await prisma.product.findMany({ 
        where: { name: { contains: 'Drone', mode: 'insensitive' } }, 
        select: { name: true, provider: true, sku: true } 
    });
    console.log(JSON.stringify(p, null, 2));
    await prisma.$disconnect();
}
main();
