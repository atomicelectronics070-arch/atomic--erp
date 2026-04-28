const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const c = await prisma.product.count({ 
        where: { name: { contains: 'Generador', mode: 'insensitive' }, isDeleted: false } 
    });
    console.log('Generadores in DB:', c);
    await prisma.$disconnect();
}
main();
