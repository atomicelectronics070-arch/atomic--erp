const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Deep Duplicate Search...");
    
    const dups = await prisma.$queryRaw`
        SELECT name, price, COUNT(*) as count 
        FROM "Product" 
        WHERE "isDeleted" = false
        GROUP BY name, price 
        HAVING COUNT(*) > 1
    `;

    console.log(`Found ${dups.length} products with same name and price.`);
    for (const d of dups) {
        console.log(`- ${d.name} ($${d.price}) x ${d.count}`);
    }

    await prisma.$disconnect();
}

main();
