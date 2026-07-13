const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixOtherCategories() {
    try {
        console.log("⚡ Fixing other root categories parent mapping...");
        
        // Find Electrónica ID
        const electronica = await prisma.category.findFirst({
            where: { name: { equals: 'Electrónica', mode: 'insensitive' } }
        });
        console.log(`Electrónica ID: ${electronica ? electronica.id : 'NOT FOUND'}`);
        
        // Find Residencial ID
        const residencial = await prisma.category.findFirst({
            where: { name: { equals: 'Residencial', mode: 'insensitive' } }
        });
        console.log(`Residencial ID: ${residencial ? residencial.id : 'NOT FOUND'}`);
        
        // Find UPS y Energía ID
        const upsEnergia = await prisma.category.findFirst({
            where: { name: { contains: 'UPS', mode: 'insensitive' } }
        });
        console.log(`UPS y Energía ID: ${upsEnergia ? upsEnergia.id : 'NOT FOUND'}`);
        
        // Find Cámaras de Seguridad ID
        const camarasSeg = await prisma.category.findFirst({
            where: { name: { contains: 'Cámaras de Seguridad', mode: 'insensitive' } }
        });
        console.log(`Cámaras de Seguridad ID: ${camarasSeg ? camarasSeg.id : 'NOT FOUND'}`);
        
        if (residencial) {
            // Move TECNOLOGIA RESIDENCIAL to subcat of Residencial
            const techRes = await prisma.category.findFirst({
                where: { name: { contains: 'TECNOLOGIA RESIDENCIAL', mode: 'insensitive' } }
            });
            if (techRes) {
                await prisma.category.update({
                    where: { id: techRes.id },
                    data: { parentId: residencial.id, isVisible: true }
                });
                console.log(`  ops: Moved "${techRes.name}" to parent "${residencial.name}".`);
            }
        }
        
        if (electronica) {
            const toElectronicsNames = [
                'Alarmas', 'Antenas', 'Repuestos de Laptop', 
                'Electronica para Negocios Movilidad y Deportes',
                'Gaming & Consolas', 'Consolas de Video Juegos', 
                'Cerraduras Smart y Accesos'
            ];
            
            for (const name of toElectronicsNames) {
                const cat = await prisma.category.findFirst({
                    where: { name: { equals: name, mode: 'insensitive' } }
                });
                if (cat) {
                    await prisma.category.update({
                        where: { id: cat.id },
                        data: { parentId: electronica.id, isVisible: true }
                    });
                    console.log(`  ✅ Mapped "${cat.name}" to parent "${electronica.name}".`);
                }
            }
        }
        
        if (upsEnergia) {
            // Find root "Energia"
            const rootEnergia = await prisma.category.findFirst({
                where: { name: { equals: 'Energia', mode: 'insensitive' }, parentId: null }
            });
            if (rootEnergia) {
                const countEnergia = await prisma.product.count({ where: { categoryId: rootEnergia.id } });
                if (countEnergia > 0) {
                    await prisma.product.updateMany({
                        where: { categoryId: rootEnergia.id },
                        data: { categoryId: upsEnergia.id }
                    });
                    console.log(`  ✅ Moved ${countEnergia} products from root "Energia" to "${upsEnergia.name}".`);
                }
            }
        }
        
        if (camarasSeg) {
            // Find root "Camaras de Seguridad" (without accent)
            const rootCam = await prisma.category.findFirst({
                where: { name: { equals: 'Camaras de Seguridad', mode: 'insensitive' }, parentId: null }
            });
            if (rootCam) {
                const countCam = await prisma.product.count({ where: { categoryId: rootCam.id } });
                if (countCam > 0) {
                    await prisma.product.updateMany({
                        where: { categoryId: rootCam.id },
                        data: { categoryId: camarasSeg.id }
                    });
                    console.log(`  ✅ Moved ${countCam} products from root "Camaras de Seguridad" to "${camarasSeg.name}".`);
                }
            }
        }
        
        console.log("🎉 Category correction finished successfully!");
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fixOtherCategories();
