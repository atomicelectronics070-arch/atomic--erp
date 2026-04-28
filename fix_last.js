const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.category.update({ where: { slug: 'cable-utp-' }, data: { image: '/categories/cable-utp.png' } });
    console.log('Fixed Cable UTP');
}
main().finally(() => prisma.$disconnect());
