const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Finding duplicates by name...");
    
    const dups = await prisma.$queryRaw`
        SELECT name, COUNT(*) as count 
        FROM "Product" 
        WHERE "isDeleted" = false
        GROUP BY name 
        HAVING COUNT(*) > 1
        ORDER BY count DESC
        LIMIT 50
    `;

    console.log(`Found ${dups.length} names with duplicates.`);
    console.log(JSON.stringify(dups, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));

    await prisma.$disconnect();
}

main();
