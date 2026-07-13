const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showCategoryNames() {
    try {
        const ids = [
            'cmqvwknyw0002ejkxoinrsmey',
            'cmoe779ke0007wwr9315ym7bx',
            'cmr2n9vnj0001znjloggevapd'
        ];
        for (const id of ids) {
            const cat = await prisma.category.findUnique({ where: { id } });
            if (cat) {
                console.log(`ID: ${id} -> Name: ${cat.name} | parentId: ${cat.parentId}`);
            } else {
                console.log(`ID: ${id} -> NOT FOUND`);
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
showCategoryNames();
