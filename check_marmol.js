const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const cats = await prisma.category.findMany({
        where: { name: { contains: 'marmol', mode: 'insensitive' } }
    });
    console.log('Categories matching Marmol:', JSON.stringify(cats, null, 2));
    
    if (cats.length > 0) {
        const prods = await prisma.product.count({
            where: { categoryId: cats[0].id, isDeleted: false }
        });
        console.log(`Products in ${cats[0].name}:`, prods);
    }
    await prisma.$disconnect();
}
main();
