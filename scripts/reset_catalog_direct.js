const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting standalone catalog reset...");
    
    let totalDeleted = 0;
    let hasMore = true;
    const batchSize = 1000;

    while (hasMore) {
        const batch = await prisma.product.findMany({
            where: { isDeleted: false },
            select: { id: true },
            take: batchSize
        });

        if (batch.length === 0) {
            hasMore = false;
            break;
        }

        const ids = batch.map(p => p.id);
        await prisma.product.updateMany({
            where: { id: { in: ids } },
            data: { isDeleted: true }
        });

        totalDeleted += batch.length;
        console.log(`✅ Progress: ${totalDeleted} products archived.`);
    }

    console.log(`✨ DONE! Total archived: ${totalDeleted}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
