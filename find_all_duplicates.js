const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Finding duplicates...");
    
    // Exact name duplicates
    const nameDups = await prisma.$queryRaw`
        SELECT name, COUNT(*) as count 
        FROM "Product" 
        WHERE "isDeleted" = false
        GROUP BY name 
        HAVING COUNT(*) > 1
    `;
    
    console.log("Names with duplicates:", nameDups.length);
    for (const d of nameDups) {
        console.log(`- ${d.name} (${d.count})`);
    }

    // SKU duplicates (if any, though unique constraint should prevent)
    // But maybe null SKUs?
    const nullSkuDups = await prisma.$queryRaw`
        SELECT name, COUNT(*) as count 
        FROM "Product" 
        WHERE "sku" IS NULL AND "isDeleted" = false
        GROUP BY name 
        HAVING COUNT(*) > 1
    `;
    console.log("\nNull SKU duplicates:", nullSkuDups.length);
    for (const d of nullSkuDups) {
        console.log(`- ${d.name} (${d.count})`);
    }

    await prisma.$disconnect();
}

main();
