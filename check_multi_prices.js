const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const p = await prisma.product.findFirst({ 
        where: { provider: 'MultiTecnologia V&V', price: { gt: 0 } } 
    });
    console.log(JSON.stringify(p, null, 2));
    await prisma.$disconnect();
}
main();
