const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const products = await prisma.product.findMany({ 
        where: { provider: 'MultiTecnologia V&V' }, 
        take: 5,
        select: { name: true, description: true }
    });
    console.log(JSON.stringify(products, null, 2));
    await prisma.$disconnect();
}
main();
