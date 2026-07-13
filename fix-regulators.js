const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRegulators() {
    try {
        console.log("🔧 Step 1: Bumping ALL regulators to top of shop (updating createdAt)...");
        
        // Get all regulators + UPS with regulator in name
        const regulators = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'regulador', mode: 'insensitive' } },
                    { name: { contains: 'regulator', mode: 'insensitive' } }
                ]
            }
        });
        
        console.log(`Found ${regulators.length} regulators to fix.`);
        
        let bumped = 0;
        let stockFixed = 0;
        let marginApplied = 0;
        
        for (const reg of regulators) {
            const updates = {
                createdAt: new Date(), // bump to top
                isActive: true,        // ensure active
            };
            
            // Fix stock=0
            if (reg.stock === 0) {
                updates.stock = 10;
                stockFixed++;
                console.log(`  📦 Fixed stock=0 for: ${reg.name.substring(0, 60)}`);
            }
            
            // Apply 20% margin for MultiTecnologia products
            // Their current price is the retail price. Store compareAtPrice as reference cost
            if (reg.provider === 'MultiTecnologia V&V' && !reg.compareAtPrice) {
                // Reverse: cost = price / 1.2 (so margin is 20% on top of cost)
                const estimatedCost = parseFloat((reg.price / 1.2).toFixed(2));
                updates.compareAtPrice = estimatedCost;
                marginApplied++;
            }
            
            await prisma.product.update({
                where: { id: reg.id },
                data: updates
            });
            bumped++;
        }
        
        console.log(`\n✅ Done!`);
        console.log(`  🚀 ${bumped} regulators bumped to top of shop`);
        console.log(`  📦 ${stockFixed} stock=0 issues fixed`);
        console.log(`  💰 ${marginApplied} MultiTecnologia products with margin reference saved`);
        
        // Show final state
        const multi = await prisma.product.findMany({
            where: { provider: 'MultiTecnologia V&V', name: { contains: 'regulador', mode: 'insensitive' } }
        });
        console.log(`\n📊 MultiTecnologia V&V regulators (${multi.length} total):`);
        multi.forEach(p => {
            console.log(`  - ${p.name.substring(0, 60)} | Price: $${p.price} | Cost ref: $${p.compareAtPrice || 'N/A'} | Stock: ${p.stock}`);
        });
        
    } catch(e) {
        console.error('ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

fixRegulators();
