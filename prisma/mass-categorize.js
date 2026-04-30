const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const products = await prisma.product.findMany({
        where: { categoryId: null },
        select: { id: true, name: true }
    });

    console.log(`Analyzing ${products.length} uncategorized products...`);

    const categories = await prisma.category.findMany();
    const catMap = {};
    categories.forEach(c => {
        catMap[c.slug] = c.id;
    });

    let updatedCount = 0;
    
    for (const p of products) {
        const name = p.name.toUpperCase();
        let targetSlug = null;

        if (name.includes('PILA') || name.includes('ENERGIZER') || name.includes('BATERIA') || name.includes('CARGADOR') || name.includes('FUENTE DE PODER')) {
            targetSlug = 'energia';
        } else if (name.includes('CAMARA') || name.includes('DVR') || name.includes('NVR') || name.includes('SEGURIDAD')) {
            targetSlug = 'camaras-de-seguridad';
        } else if (name.includes('PANTALLA') || name.includes('TECLADO') || name.includes('PCI EXPRESS') || name.includes('SATA') || name.includes('RJ45') || name.includes('USB') || name.includes('HDMI') || name.includes('CABLE')) {
            targetSlug = 'celulares-tablets-y-computacion';
        } else if (name.includes('PS4') || name.includes('PS5') || name.includes('PLAYSTATION') || name.includes('XBOX') || name.includes('NINTENDO')) {
            targetSlug = 'consolas-de-video-juegos';
        } else if (name.includes('ALUCOBOND') || name.includes('MÁRMOL') || name.includes('MARMOL')) {
            targetSlug = 'acabados-marmol';
        }

        if (targetSlug && catMap[targetSlug]) {
            await prisma.product.update({
                where: { id: p.id },
                data: { categoryId: catMap[targetSlug] }
            });
            updatedCount++;
        }
    }

    console.log(`Auto-categorized ${updatedCount} products.`);
    
    // Create a "General / Varios" category for the rest
    const miscCat = await prisma.category.upsert({
        where: { slug: 'accesorios-varios' },
        update: {},
        create: {
            name: 'Accesorios y Varios',
            slug: 'accesorios-varios',
            isVisible: true,
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop'
        }
    });

    const remaining = await prisma.product.updateMany({
        where: { categoryId: null },
        data: { categoryId: miscCat.id }
    });

    console.log(`Assigned remaining ${remaining.count} products to "Accesorios y Varios".`);
}

main().finally(() => prisma.$disconnect())
