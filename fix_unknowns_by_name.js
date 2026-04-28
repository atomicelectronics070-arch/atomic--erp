const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting Cross-Check for Unknown Products...");

    // Find all unknown products
    const unknowns = await prisma.product.findMany({
        where: {
            OR: [
                { provider: null },
                { provider: 'Unknown' }
            ]
        },
        select: { id: true, name: true, sku: true }
    });

    console.log(`🔍 Found ${unknowns.length} unknown products.`);

    // Find all products from known providers to compare
    const knowns = await prisma.product.findMany({
        where: {
            NOT: {
                OR: [
                    { provider: null },
                    { provider: 'Unknown' }
                ]
            }
        },
        select: { name: true, provider: true }
    });

    const knownNames = new Map();
    knowns.forEach(k => {
        knownNames.set(k.name.toLowerCase(), k.provider);
    });

    let fixed = 0;
    for (const u of unknowns) {
        const lowerName = u.name.toLowerCase();
        if (knownNames.has(lowerName)) {
            const provider = knownNames.get(lowerName);
            await prisma.product.update({
                where: { id: u.id },
                data: { provider: provider }
            });
            fixed++;
        }
    }

    console.log(`✅ Fixed ${fixed} unknown products by name matching.`);
    await prisma.$disconnect();
}

main();
