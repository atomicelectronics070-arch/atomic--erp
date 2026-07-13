const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ROOT_CAT_ID = 'cmoe779560006wwr9jgnohgqn'; // Celulares Tablets y Computacion (Parent: null)
const SUB_CAT_ID = 'cmr2n905o0001137wi0ufnmdm';  // Celulares y Tablets (Parent: Electrónica)

async function fixCelularesCategory() {
    try {
        console.log("⚡ Starting Celulares & Tablets category correction...");
        
        // Count products currently in the root category
        const countInRoot = await prisma.product.count({
            where: { categoryId: ROOT_CAT_ID }
        });
        console.log(`Products in root "Celulares Tablets y Computacion": ${countInRoot}`);
        
        // Update all products in the root category to the subcategory
        const updateResult = await prisma.product.updateMany({
            where: { categoryId: ROOT_CAT_ID },
            data: {
                categoryId: SUB_CAT_ID,
                isActive: true,
                isDeleted: false
            }
        });
        console.log(`Updated ${updateResult.count} products from root category to subcategory "Celulares y Tablets".`);
        
        // Also look for products with 'celular' or 'tablet' or 'galaxy' in name that might have no category or wrong category
        const miscProducts = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'celular', mode: 'insensitive' } },
                    { name: { contains: 'tablet', mode: 'insensitive' } },
                    { name: { contains: 'galaxy sm', mode: 'insensitive' } }
                ],
                NOT: { categoryId: SUB_CAT_ID }
            }
        });
        
        console.log(`Found ${miscProducts.length} misc products that might need re-classification.`);
        
        let countMisc = 0;
        for (const p of miscProducts) {
            // Avoid moving accessories unless they are actual mobile phones/tablets
            const lowerName = p.name.toLowerCase();
            if (lowerName.includes('funda') || lowerName.includes('estuche') || lowerName.includes('mica') || lowerName.includes('cargador') || lowerName.includes('cable')) {
                continue;
            }
            
            await prisma.product.update({
                where: { id: p.id },
                data: {
                    categoryId: SUB_CAT_ID,
                    isActive: true,
                    isDeleted: false,
                    createdAt: new Date() // Bump to top
                }
            });
            countMisc++;
        }
        console.log(`Re-classified and bumped ${countMisc} misc mobile products to "Celulares y Tablets".`);
        
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fixCelularesCategory();
