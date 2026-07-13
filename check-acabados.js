const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAcabados() {
    const keywords = ['dispensador', 'dispensadores', 'acabado', 'pintura', 'sellador', 'masilla', 'lija', 'brocha', 'rodillo', 'espátula', 'diluyente', 'barniz', 'silicona', 'cemento', 'pegante', 'adhesivo'];
    
    for (const kw of keywords) {
        const count = await prisma.product.count({
            where: { name: { contains: kw, mode: 'insensitive' } }
        });
        if (count > 0) console.log(`${kw}: ${count} products`);
    }
    
    const bpDispenser = await prisma.product.count({
        where: { provider: 'Banco del Perno', name: { contains: 'dispensador', mode: 'insensitive' } }
    });
    console.log(`\nBanco del Perno dispensadores: ${bpDispenser}`);
    
    await prisma.$disconnect();
}
checkAcabados();
