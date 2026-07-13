const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function estimatePrice(name, keywords) {
    const n = name.toLowerCase();
    const cat = (keywords || '').toLowerCase();
    
    // 1. Safe component overrides (hard drive name checks - laptops or monitors never have "disco duro" or "hard drive" as a word in title)
    if (/\b(disco duro|hard drive|enclosure)\b/.test(n)) {
        return 65.00;
    }
    
    // 2. Category checks (most accurate because it uses the official distributor categorization)
    if (cat.includes('laptop')) return 750.00;
    if (cat.includes('computador')) return 450.00;
    if (cat.includes('celular') || cat.includes('tablet')) {
        if (/\b(tablet|ipad|surf|surface)\b/.test(n)) return 180.00;
        return 350.00;
    }
    if (cat.includes('monitor')) return 160.00;
    if (cat.includes('impresora')) return 200.00;
    if (cat.includes('televisor') || cat.includes('tv') || cat.includes('televisores')) return 500.00;
    if (cat.includes('disco') || cat.includes('almacenamiento')) return 65.00;
    if (cat.includes('ram') || cat.includes('memoria')) return 40.00;
    if (cat.includes('motherboard') || cat.includes('procesador') || cat.includes('video') || cat.includes('tarjeta')) {
        if (cat.includes('tarjetas de video') || cat.includes('video')) return 180.00;
        return 130.00;
    }
    if (cat.includes('case') || cat.includes('fuente') || cat.includes('poder')) return 60.00;
    if (cat.includes('ups') || cat.includes('regulador')) return 80.00;
    if (cat.includes('audio') || cat.includes('video')) return 45.00;
    
    // 3. Fallback name-based checks if category/keywords is empty or generic
    if (/\b(laptop|notebook|not\.|macbook|chromebook|probook|elitebook|dynabook|portege|thinkpad)\b/.test(n) || n.includes('not.')) return 750.00;
    if (/\b(computador|computadora|pc|mini pc|desktop|optiplex|thinkcentre|cop\.)/.test(n) || n.startsWith('cop.')) return 450.00;
    if (/\b(celular|iphone|galaxy|samsung|motorola|xiaomi|redmi|huawei)\b/.test(n)) return 350.00;
    if (/\b(tablet|ipad)\b/.test(n)) return 180.00;
    if (/\b(monitor|pantalla)\b/.test(n)) return 160.00;
    if (/\b(impresora|epson|laserjet|ecotank)\b/.test(n)) return 200.00;
    if (/\b(motherboard|placa madre|mbo|procesador|proc\.)/.test(n)) return 130.00;
    if (/\b(sodimm|ddr4|ddr5|cruzer|datatraveler|pendrive|ram|memoria)\b/.test(n)) return 40.00;
    if (/\b(ssd|m\.2|nvme)\b/.test(n)) return 65.00;
    
    return 35.00;
}

async function fixAllTecnoMegaPrices() {
    try {
        console.log("🛠️ Starting final corrected TecnoMega price correction script...");
        const products = await prisma.product.findMany({
            where: { provider: 'TecnoMega', isDeleted: false }
        });
        
        console.log(`Analyzing ${products.length} TecnoMega products...`);
        
        let count = 0;
        for (const p of products) {
            const estimated = estimatePrice(p.name, p.keywords);
            const targetPrice = Number((estimated * 1.18).toFixed(2));
            
            if (p.price !== targetPrice) {
                console.log(`- Fixing "${p.name.substring(0, 50)}": $${p.price} -> $${targetPrice} (Keywords: ${p.keywords})`);
                await prisma.product.update({
                    where: { id: p.id },
                    data: { price: targetPrice }
                });
                count++;
            }
        }
        
        console.log(`🎉 Finished! Corrected prices for ${count} TecnoMega products.`);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fixAllTecnoMegaPrices();
