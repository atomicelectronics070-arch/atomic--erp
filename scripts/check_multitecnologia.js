const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        const visible = await prisma.product.count({
            where: {
                images: { contains: 'multitecnologia' },
                isDeleted: false,
                isActive: true
            }
        });
        
        const deleted = await prisma.product.count({
            where: {
                images: { contains: 'multitecnologia' },
                isDeleted: true
            }
        });

        const inactive = await prisma.product.count({
            where: {
                images: { contains: 'multitecnologia' },
                isActive: false
            }
        });

        console.log(`Multitecnologia real stats:
Total with images: 7791
Visible (isDeleted: false, isActive: true): ${visible}
Deleted (isDeleted: true): ${deleted}
Inactive (isActive: false): ${inactive}
`);

        const sample = await prisma.product.findFirst({
            where: { images: { contains: 'multitecnologia' } }
        });
        console.log("Sample:", sample.provider, sample.isDeleted);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
