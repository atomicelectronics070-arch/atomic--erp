const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Restaurando productos de Multitecnologia...");
        const result = await prisma.product.updateMany({
            where: {
                images: { contains: 'multitecnologia' },
                isDeleted: true
            },
            data: {
                isDeleted: false,
                provider: 'MultiTecnologia V&V' // Setting proper provider explicitly
            }
        });
        
        console.log(`✅ Restaurados ${result.count} productos exitosamente.`);

    } catch (e) {
        console.error("❌ Error restaurando:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
