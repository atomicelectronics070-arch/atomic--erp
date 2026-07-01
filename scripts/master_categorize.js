const { PrismaClient } = require('@prisma/client');
const { classifyProduct } = require('./utils/smartClassifier');

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting Intelligent Master Categorization...');
    
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
        console.error('❌ No categories found in the database!');
        process.exit(1);
    }
    
    // We are going to process all products, since the user requested to overwrite existing categories 
    // to ensure they fall into the smart classification matrix.
    const products = await prisma.product.findMany({
        where: { isDeleted: false },
        select: { id: true, name: true, categoryId: true, provider: true }
    });

    console.log(`📦 Found ${products.length} active products to evaluate.`);

    let updatedCount = 0;
    const batchSize = 100;
    
    // Process in batches
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const updates = [];

        for (const product of batch) {
            const newCatId = classifyProduct(product.name, categories);
            
            // If we found a category and it's different from the current one
            if (newCatId && newCatId !== product.categoryId) {
                updates.push(
                    prisma.product.update({
                        where: { id: product.id },
                        data: { categoryId: newCatId }
                    })
                );
            }
        }

        if (updates.length > 0) {
            await prisma.$transaction(updates);
            updatedCount += updates.length;
            console.log(`  ✅ Processed batch ${i / batchSize + 1}: Updated ${updates.length} products`);
        }
    }

    console.log(`🎉 Master Categorization Complete! Total products updated: ${updatedCount}`);
    await prisma.$disconnect();
}

main().catch(e => {
    console.error('❌ Error during categorization:', e);
    process.exit(1);
});
