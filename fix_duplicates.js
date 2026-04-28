const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting Duplicate Cleanup...");

    // Find all products
    const products = await prisma.product.findMany({
        where: { isDeleted: false },
        select: { id: true, name: true, provider: true, sku: true, price: true }
    });

    const nameMap = new Map();
    const toDelete = [];

    for (const p of products) {
        const key = p.name.toLowerCase().trim();
        if (nameMap.has(key)) {
            const existing = nameMap.get(key);
            
            // Heuristic: keep the one with a provider and a SKU
            let keep, remove;
            if (p.provider && !existing.provider) {
                keep = p;
                remove = existing;
            } else if (!p.provider && existing.provider) {
                keep = existing;
                remove = p;
            } else if (p.sku && !existing.sku) {
                keep = p;
                remove = existing;
            } else {
                // Same state, keep the one with higher price or just the first one
                keep = existing;
                remove = p;
            }

            toDelete.push(remove.id);
            nameMap.set(key, keep);
        } else {
            nameMap.set(key, p);
        }
    }

    console.log(`🔍 Found ${toDelete.length} duplicates to remove.`);

    if (toDelete.length > 0) {
        const deleted = await prisma.product.updateMany({
            where: { id: { in: toDelete } },
            data: { isDeleted: true }
        });
        console.log(`✅ Marked ${deleted.count} products as deleted.`);
    }

    await prisma.$disconnect();
}

main();
