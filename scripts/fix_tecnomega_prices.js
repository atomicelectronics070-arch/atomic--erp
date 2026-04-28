const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function estimatePrice(name) {
    const n = name.toLowerCase();
    if (n.includes('laptop') || n.includes('computador')) return 650.00;
    if (n.includes('celular') || n.includes('iphone') || n.includes('samsung galaxy')) return 450.00;
    if (n.includes('tablet') || n.includes('ipad')) return 250.00;
    if (n.includes('monitor')) return 180.00;
    if (n.includes('impresora')) return 220.00;
    if (n.includes('disco duro') || n.includes('ssd') || n.includes('externo')) return 75.00;
    if (n.includes('memoria') || n.includes('ram') || n.includes('flash')) return 35.00;
    if (n.includes('teclado') || n.includes('mouse')) return 25.00;
    if (n.includes('tv') || n.includes('televisor')) return 550.00;
    if (n.includes('motherboard') || n.includes('procesador')) return 150.00;
    if (n.includes('fuente') || n.includes('case')) return 65.00;
    if (n.includes('ups') || n.includes('regulador')) return 85.00;
    if (n.includes('audio') || n.includes('parlante')) return 45.00;
    return 45.00; // Generic fallback
}

async function run() {
    console.log('🛠️ Arreglando precios en Tecnomega...');
    
    const products = await prisma.product.findMany({
        where: { provider: 'TecnoMega', price: 0 }
    });

    console.log(`🔍 Encontrados ${products.length} productos con precio $0.`);

    let updated = 0;
    for (const p of products) {
        const newPrice = estimatePrice(p.name);
        await prisma.product.update({
            where: { id: p.id },
            data: { price: newPrice }
        });
        updated++;
        if (updated % 50 === 0) console.log(`✅ ${updated} actualizados...`);
    }

    console.log(`\n🎉 ¡Arreglo completado! ${updated} productos actualizados.`);
    await prisma.$disconnect();
}

run();
