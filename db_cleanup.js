const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    console.log('🧹 Cleaning up database...');
    
    // 1. Delete categories scraped as products from Banco del Perno
    const bpCategories = [
        'FERRETERÍA', 'ACABADOS DE CONSTRUCCIÓN', 'HOGAR', 'AUTOMOTRIZ', 
        'PERNERÍA Y FIJACIÓN', 'SEGURIDAD ELECTRÓNICA', 'COMBOS', 'PROMOCIÓN'
    ];
    const del1 = await prisma.product.deleteMany({
        where: { provider: 'Banco del Perno', name: { in: bpCategories } }
    });
    console.log(`Deleted ${del1.count} BP category items.`);

    // 2. Delete products with price 0 (except Fabricables which are catalog only)
    const del2 = await prisma.product.deleteMany({
        where: { price: 0, provider: { not: 'Fabricables' } }
    });
    console.log(`Deleted ${del2.count} zero-price items.`);

    // 3. Delete products without images (unless they are real but just missing images)
    // For now, let's just mark them as inactive if they have no image AND no description.
    const upd1 = await prisma.product.updateMany({
        where: { images: '[]', description: null, isDeleted: false },
        data: { isActive: false }
    });
    console.log(`Marked ${upd1.count} incomplete items as inactive.`);

    await prisma.$disconnect();
}
main();
