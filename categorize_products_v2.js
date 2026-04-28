const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Categorizing products...');
    
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany({
        where: { categoryId: null, isDeleted: false }
    });

    console.log(`Found ${products.length} uncategorized products.`);

    let updated = 0;
    for (const product of products) {
        let matchedCatId = null;
        const name = (product.name || '').toLowerCase();

        if (name.includes('banco de carga') || name.includes('power bank')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('celulares'))?.id;
        } else if (name.includes('audifono') || name.includes('tws') || name.includes('parlante') || name.includes('inalambrico') || name.includes('bluetooth')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('audifonos'))?.id;
        } else if (name.includes('cargador') || name.includes('cable usb') || name.includes('iphone') || name.includes('celular') || name.includes('tablet')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('celulares'))?.id;
        } else if (name.includes('generador') || name.includes('motobomba') || name.includes('bateria') || name.includes('ups') || name.includes('energia')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('energia'))?.id;
        } else if (name.includes('camara') || name.includes('dvr') || name.includes('nvr') || name.includes('seguridad') || name.includes('vigilancia')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('camaras'))?.id;
        } else if (name.includes('cerradura') || name.includes('acceso') || name.includes('intercom') || name.includes('porteria')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('cerraduras'))?.id;
        } else if (name.includes('router') || name.includes('switch') || name.includes('utp') || name.includes('rj45') || name.includes('networking') || name.includes('patch cord') || name.includes('cable de red')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('networking'))?.id;
        } else if (name.includes('ram') || name.includes('disco') || name.includes('ssd') || name.includes('laptop') || name.includes('teclado') || name.includes('mouse') || name.includes('adaptador') || name.includes('case usb') || name.includes('computadora')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('celulares'))?.id; // Using Celulares, Tablets y Computacion
        } else if (name.includes('limpiador') || name.includes('mantenimiento') || name.includes('pasta termica')) {
            matchedCatId = categories.find(c => c.name.toLowerCase().includes('servicios') || c.name.toLowerCase().includes('computacion'))?.id;
        }

        if (matchedCatId) {
            await prisma.product.update({
                where: { id: product.id },
                data: { categoryId: matchedCatId }
            });
            updated++;
        }
    }

    console.log(`✅ Successfully categorized ${updated} products.`);
    await prisma.$disconnect();
}

main();
