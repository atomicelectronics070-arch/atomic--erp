const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const result = await prisma.product.deleteMany({
        where: { name: 'BANCO DE CARGA 5000 MAh CARGA INALAMBRICA MAGNETICA NEGRO GAR276N 1 HORA', sku: null }
    });
    console.log('Deleted duplicates:', result.count);
    await prisma.$disconnect();
}
main();
