const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const p = await prisma.product.findMany({ 
        where: { 
            provider: 'MultiTecnologia V&V', 
            OR: [
                { name: { contains: 'Power Bank', mode: 'insensitive' } }, 
                { name: { contains: 'Audifonos', mode: 'insensitive' } }, 
                { name: { contains: 'Parlante', mode: 'insensitive' } }
            ] 
        }, 
        select: { name: true } 
    });
    console.log(JSON.stringify(p, null, 2));
    await prisma.$disconnect();
}
main();
