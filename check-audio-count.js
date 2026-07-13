const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAudioCount() {
    try {
        const cat = await prisma.category.findUnique({ where: { slug: 'audio-sonido' } });
        if (!cat) {
            console.log("Category audio-sonido not found!");
            return;
        }
        const count = await prisma.product.count({ where: { categoryId: cat.id } });
        console.log(`Products in Audio y Sonido: ${count}`);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkAudioCount();
