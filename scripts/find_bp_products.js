const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Searching BP products specifically for the 5 items...");
    const bpProducts = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'Carro', mode: 'insensitive' } },
                { name: { contains: 'Carretilla', mode: 'insensitive' } },
                { name: { contains: 'Escalador', mode: 'insensitive' } },
                { name: { contains: 'Plataforma', mode: 'insensitive' } },
                { name: { contains: 'Herramientas 3', mode: 'insensitive' } },
                { name: { contains: 'Porta Cajas', mode: 'insensitive' } },
                { name: { contains: 'Niveles', mode: 'insensitive' } },
                { name: { contains: '80', mode: 'insensitive' } },
                { name: { contains: '200', mode: 'insensitive' } }
            ]
        },
        select: {
            id: true,
            name: true,
            price: true,
            compareAtPrice: true,
            provider: true,
            images: true,
            description: true,
            specs: true
        }
    });

    console.log(`Matched ${bpProducts.length} items. Filtering...`);
    const relevant = bpProducts.filter(p => {
        const n = p.name.toLowerCase();
        return n.includes('carro') || n.includes('carretilla') || n.includes('escalador') || n.includes('plataforma') || n.includes('porta');
    });

    console.log(`Relevant (${relevant.length}):`);
    relevant.forEach(p => {
        console.log(`- ID: ${p.id} | NAME: ${p.name} | PRICE: $${p.price} | PROVIDER: ${p.provider} | IMAGES: ${p.images}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
