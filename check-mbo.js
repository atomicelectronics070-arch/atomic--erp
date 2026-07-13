const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMboName() {
    try {
        const p = await prisma.product.findFirst({
            where: { provider: 'TecnoMega', name: { contains: 'B840M' } }
        });
        if (p) {
            console.log(`DB Name: "${p.name}"`);
            console.log(`DB Keywords: "${p.keywords}"`);
            console.log(`DB Price: $${p.price}`);
        } else {
            console.log("Not found.");
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkMboName();
