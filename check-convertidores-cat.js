const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategory() {
    try {
        const cat = await prisma.category.findFirst({
            where: { name: { contains: 'Convertidores', mode: 'insensitive' } }
        });
        if (cat) {
            console.log(`Found category: "${cat.name}" | ID: ${cat.id} | Parent: ${cat.parentId}`);
        } else {
            console.log("No category containing 'Convertidores' found.");
        }
        
        // Let's also look for 'Señal' or 'Senal'
        const cat2 = await prisma.category.findFirst({
            where: { name: { contains: 'Señal', mode: 'insensitive' } }
        });
        if (cat2) {
            console.log(`Found category by 'Señal': "${cat2.name}" | ID: ${cat2.id}`);
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkCategory();
