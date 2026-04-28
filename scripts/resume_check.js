const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking Cronte products status...");
        const cronteProducts = await prisma.product.findMany({
            where: { provider: 'Cronte Technology' },
            select: {
                id: true,
                name: true,
                price: true,
                isDeleted: true
            }
        });

        const total = cronteProducts.length;
        const withPrice = cronteProducts.filter(p => p.price > 0).length;
        const zeroPrice = cronteProducts.filter(p => p.price === 0).length;

        console.log(`Total Cronte products: ${total}`);
        console.log(`Products with price > 0: ${withPrice}`);
        console.log(`Products with price = 0: ${zeroPrice}`);

        if (zeroPrice > 0) {
            console.log("\nSome products still have $0 price:");
            cronteProducts.filter(p => p.price === 0).slice(0, 5).forEach(p => {
                console.log(`- ${p.name}`);
            });
        }
    } catch (error) {
        console.error("Error checking products:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
