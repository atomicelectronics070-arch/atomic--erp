const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function runScrapers() {
    console.log('🚀 Iniciando Monitor Automático de Lanzamientos (Cron)...');
    
    // 1. Guardar timestamp de inicio
    const startTime = new Date();
    
    // 2. Ejecutar los scripts de sincronización (Scrapers)
    const scripts = [
        'node sync_bp_final.js',
        'node sync_multitecnologia_v3.js'
    ];

    for (const script of scripts) {
        console.log(`\n⏳ Ejecutando: ${script}`);
        try {
            // Se ejecuta de manera síncrona. En la vida real, podría ser asíncrono para mayor velocidad.
            execSync(script, { stdio: 'inherit' });
            console.log(`✅ ${script} finalizado con éxito.`);
        } catch (error) {
            console.error(`❌ Error ejecutando ${script}:`, error.message);
        }
    }

    // 3. Buscar productos nuevos (creados después de startTime)
    const newProducts = await prisma.product.findMany({
        where: {
            createdAt: {
                gte: startTime
            }
        },
        select: { id: true, name: true, provider: true }
    });

    // 4. Si hay productos nuevos, enviar notificación a todos los ADMIN
    if (newProducts.length > 0) {
        console.log(`\n🎉 Se detectaron ${newProducts.length} nuevos lanzamientos/productos.`);
        
        // Agrupar por proveedor
        const providers = [...new Set(newProducts.map(p => p.provider))].filter(Boolean);
        const providerText = providers.length > 0 ? ` (de ${providers.join(', ')})` : '';

        // Buscar usuarios admin
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true }
        });

        if (admins.length > 0) {
            const notifications = admins.map(admin => ({
                userId: admin.id,
                title: '¡Nuevos Lanzamientos Detectados!',
                message: `El monitor automático detectó ${newProducts.length} productos nuevos${providerText}.`,
                type: 'SYSTEM_ALERT',
                isRead: false
            }));

            await prisma.notification.createMany({
                data: notifications
            });
            console.log(`🔔 Notificaciones enviadas a ${admins.length} administradores.`);
        }
    } else {
        console.log('\n💤 No se detectaron nuevos lanzamientos en este ciclo.');
    }

    await prisma.$disconnect();
    console.log('✅ Ciclo del Monitor completado.');
}

runScrapers().catch(err => {
    console.error('Error crítico en el monitor:', err);
    process.exit(1);
});
