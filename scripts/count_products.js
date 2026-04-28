const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        const total = await prisma.product.count({ where: { isDeleted: false } });
        const byProvider = await prisma.product.groupBy({
            by: ['provider'],
            where: { isDeleted: false },
            _count: { id: true }
        });
        
        console.log(`Total productos VISIBLES: ${total}`);
        console.log("Por proveedor:");
        byProvider.sort((a,b) => b._count.id - a._count.id).forEach(p => {
            console.log(`- ${p.provider || 'Sin Proveedor'}: ${p._count.id}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
