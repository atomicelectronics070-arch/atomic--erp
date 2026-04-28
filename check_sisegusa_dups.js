const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const prods = await prisma.product.findMany({ where: { provider: 'Sisegusa' }, select: { name: true, id: true } });
    const counts = {};
    const dups = [];
    prods.forEach(p => {
        counts[p.name] = (counts[p.name] || 0) + 1;
        if (counts[p.name] === 2) dups.push(p.name);
    });
    console.log('Exact Name Duplicates:', dups.length);
    if (dups.length > 0) {
        console.log('Duplicate Names Sample:', dups.slice(0, 10));
    }
    await prisma.$disconnect();
}
main();
