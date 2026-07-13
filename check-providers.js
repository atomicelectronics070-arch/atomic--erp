const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProviders() {
    try {
        console.log("Checking unique providers in Product table...");
        const providers = await prisma.product.groupBy({
            by: ['provider']
        });
        console.log("Found providers:");
        providers.forEach(p => {
            console.log(`- ${p.provider}`);
        });
        
        // Also check counts of products per provider
        for (const p of providers) {
            const count = await prisma.product.count({
                where: { provider: p.provider }
            });
            console.log(`  Count for ${p.provider || 'null'}: ${count}`);
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkProviders();
