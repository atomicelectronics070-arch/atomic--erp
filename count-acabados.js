const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countAcabados() {
    try {
        const cat = await prisma.category.findFirst({ where: { slug: 'acabados' } });
        if (!cat) {
            console.log("No acabados category yet");
            return;
        }
        const count = await prisma.product.count({ where: { categoryId: cat.id } });
        console.log(`Saved acabados products count: ${count}`);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
countAcabados();
