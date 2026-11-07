const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const ids = [
        'cmmwxkyzt05zr86cq1s9mvvkp', // Carro Escalador para Transporte 80KG
        'cmmwxkyzt05zq86cqv9e17dws', // Carro Multiuso
        'cmmwxkyzt05zs86cqa707o7mn', // Carro para Transporte de Carga 200 KG
        'cmmx2lf4602aibnt09pqie90g', // Carro Porta Herramientas 3 Niveles
        'cmmwxkyzt05zp86cqs9j2tss1'  // Carro Porta Cajas / Cilindros
    ];

    const products = await prisma.product.findMany({
        where: { id: { in: ids } },
        include: { category: true }
    });

    console.log(JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
