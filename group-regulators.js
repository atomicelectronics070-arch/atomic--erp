const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function groupRegulators() {
    try {
        const regulators = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'regulador', mode: 'insensitive' } },
                    { name: { contains: 'regulator', mode: 'insensitive' } }
                ]
            }
        });
        
        console.log(`Total regulators: ${regulators.length}`);
        const grouped = {};
        regulators.forEach(p => {
            const prov = p.provider || 'NULL';
            if (!grouped[prov]) grouped[prov] = [];
            grouped[prov].push(p);
        });
        
        for (const [prov, list] of Object.entries(grouped)) {
            console.log(`\nProvider: ${prov} (${list.length} products)`);
            list.forEach(p => {
                console.log(`  - [${p.isActive ? 'ACTIVE' : 'INACTIVE'}][${p.isDeleted ? 'DELETED' : 'OK'}] ${p.name} | Price: $${p.price} | Stock: ${p.stock}`);
            });
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
groupRegulators();
