const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategoriesVisibility() {
    try {
        const cats = await prisma.category.findMany();
        console.log("Categories visibility in DB:");
        cats.forEach(c => {
            console.log(`- Name: ${c.name} | Visible: ${c.isVisible} | parentId: ${c.parentId}`);
        });
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkCategoriesVisibility();
