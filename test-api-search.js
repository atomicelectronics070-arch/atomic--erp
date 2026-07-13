const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testApiSearch() {
    try {
        const search = "regulador";
        const where = { isDeleted: false };
        
        if (search) {
            const words = search.trim().split(/\s+/).filter(Boolean);
            if (words.length === 1) {
                where.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { sku: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    { keywords: { contains: search, mode: "insensitive" } },
                    { provider: { contains: search, mode: "insensitive" } },
                ];
            }
        }
        
        const products = await prisma.product.findMany({
            where,
            select: { name: true, provider: true, isActive: true, isDeleted: true },
            orderBy: { createdAt: "desc" },
            take: 10
        });
        
        console.log(`API search returned ${products.length} results:`);
        products.forEach(p => {
            console.log(`- ${p.name} | Provider: ${p.provider} | Active: ${p.isActive}`);
        });
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
testApiSearch();
