const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    
    for (const p of products) {
        if (p.price === 87.41) {
            console.log(`ID: ${p.id} | Nombre: ${p.name} | Precio: ${p.price}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
