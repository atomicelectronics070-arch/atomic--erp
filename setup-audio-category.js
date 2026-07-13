const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ELECTRONICA_PARENT_ID = 'cmqvwkn530000ejkxk6df8rqz';
const SLUG = 'audio-sonido';
const NAME = 'Audio y Sonido';

async function setupAudioCategory() {
    try {
        console.log("⚡ Setting up Audio y Sonido category...");
        
        // Find or create category
        let audioCat = await prisma.category.findUnique({
            where: { slug: SLUG }
        });
        
        if (!audioCat) {
            audioCat = await prisma.category.create({
                data: {
                    name: NAME,
                    slug: SLUG,
                    parentId: ELECTRONICA_PARENT_ID,
                    isVisible: true
                }
            });
            console.log(`  📁 Created subcategory: "${NAME}" under "Electrónica". ID: ${audioCat.id}`);
        } else {
            console.log(`  📁 Category "${NAME}" already exists. ID: ${audioCat.id}`);
            // Make sure it is visible and has correct parent
            await prisma.category.update({
                where: { id: audioCat.id },
                data: { isVisible: true, parentId: ELECTRONICA_PARENT_ID }
            });
        }
        
        // Find all products that should be in Audio y Sonido
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'parlante', mode: 'insensitive' } },
                    { name: { contains: 'bocina', mode: 'insensitive' } },
                    { name: { contains: 'bafle', mode: 'insensitive' } },
                    { name: { contains: 'audifono', mode: 'insensitive' } },
                    { name: { contains: 'audífono', mode: 'insensitive' } },
                    { name: { contains: 'auricular', mode: 'insensitive' } },
                    { name: { contains: 'microfono', mode: 'insensitive' } },
                    { name: { contains: 'micrófono', mode: 'insensitive' } },
                    { name: { contains: 'diadema', mode: 'insensitive' } },
                    { name: { contains: 'soundbar', mode: 'insensitive' } },
                    { name: { contains: 'barra de sonido', mode: 'insensitive' } }
                ]
            }
        });
        
        console.log(`Found ${products.length} products to re-classify to "Audio y Sonido".`);
        
        let count = 0;
        for (const p of products) {
            // Avoid changing security cameras that have microphones/speakers built-in
            const lowerName = p.name.toLowerCase();
            if (lowerName.includes('camara') || lowerName.includes('cámara') || lowerName.includes('portero') || lowerName.includes('alarma')) {
                continue;
            }
            
            await prisma.product.update({
                where: { id: p.id },
                data: {
                    categoryId: audioCat.id,
                    isActive: true,
                    isDeleted: false,
                    createdAt: new Date() // Bump to top
                }
            });
            count++;
        }
        
        console.log(`  ✅ Re-classified ${count} products to "Audio y Sonido" and bumped them.`);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

setupAudioCategory();
