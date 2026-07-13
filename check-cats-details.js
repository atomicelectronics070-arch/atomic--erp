const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategoriesDetails() {
    try {
        const cats = await prisma.category.findMany({
            where: {
                OR: [
                    { name: { contains: 'celular', mode: 'insensitive' } },
                    { name: { contains: 'tablet', mode: 'insensitive' } }
                ]
            }
        });
        
        console.log("Categories detail matching 'celular' or 'tablet':");
        for (const cat of cats) {
            const parent = cat.parentId ? await prisma.category.findUnique({ where: { id: cat.parentId } }) : null;
            console.log(`- ID: ${cat.id} | Name: "${cat.name}" | Slug: "${cat.slug}" | Parent: "${parent ? parent.name : 'None'} (ID: ${cat.parentId})" | Visible: ${cat.isVisible}`);
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkCategoriesDetails();
