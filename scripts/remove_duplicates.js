const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Buscando productos duplicados...");
    try {
        // Group by name to find duplicates
        const duplicates = await prisma.product.groupBy({
            by: ['name'],
            having: {
                name: {
                    _count: {
                        gt: 1
                    }
                }
            }
        });

        console.log(`Se encontraron ${duplicates.length} nombres de productos repetidos.`);

        let deletedCount = 0;

        for (const dup of duplicates) {
            // Find all products with this name
            const items = await prisma.product.findMany({
                where: { name: dup.name },
                orderBy: { updatedAt: 'desc' } // Newest first
            });

            // Keep the first one (newest), or prioritize the one with a valid provider
            let keepIndex = 0;
            const validProviderIndex = items.findIndex(i => i.provider !== null && i.provider !== '');
            if (validProviderIndex !== -1) {
                keepIndex = validProviderIndex;
            }

            const itemToKeep = items[keepIndex];
            
            // Delete the rest
            for (let i = 0; i < items.length; i++) {
                if (i !== keepIndex) {
                    await prisma.product.delete({
                        where: { id: items[i].id }
                    });
                    deletedCount++;
                }
            }
        }

        console.log(`✅ Proceso completado. Se eliminaron ${deletedCount} productos duplicados (manteniendo los más recientes/oficiales).`);
    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
