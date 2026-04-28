const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const prods = await prisma.product.findMany({
        where: { name: 'VC-PANTALLA LAPTOP 14 LED FHD 1920x1080 30 PIN 25mm BRACKETS NV140FHM-N41' },
        select: { sku: true, price: true, isDeleted: true }
    });
    console.log(JSON.stringify(prods, null, 2));
    await prisma.$disconnect();
}
main();
