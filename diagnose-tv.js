const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function estimatePrice(name, keywords) {
    const n = name.toLowerCase();
    const cat = (keywords || '').toLowerCase();
    
    if (/\b(disco duro|ssd|m\.2|nvme|externo|kingston|sandisk|crucial|wd|adata|su-650|su650|enclosure)\b/.test(n)) {
        return { price: 65.00, rule: 'disco/ssd name' };
    }
    if (/\b(memoria|ram|ddr4|ddr5|sodimm|flash|usb|cruzer|datatraveler)\b/.test(n) || n.includes('flash memory')) {
        return { price: 40.00, rule: 'ram name' };
    }
    if (/\b(motherboard|placa madre|procesador|intel core|ryzen|am4|am5|lga|mbo)\b/.test(n)) {
        return { price: 130.00, rule: 'motherboard name' };
    }
    if (/\b(case|chasis|fuente|power supply|cooler|bezel)\b/.test(n)) {
        return { price: 60.00, rule: 'case name' };
    }
    if (/\b(ups|regulador|estabilizador|no break)\b/.test(n)) {
        return { price: 80.00, rule: 'ups name' };
    }
    if (/\b(audio|parlante|bocina|audifono|audífono|diadema|headset|soundbar|echo show)\b/.test(n)) {
        return { price: 45.00, rule: 'audio name' };
    }
    
    if (cat.includes('laptop')) return { price: 750.00, rule: 'laptop cat' };
    if (cat.includes('computador')) return { price: 450.00, rule: 'computador cat' };
    if (cat.includes('celular') || cat.includes('tablet')) {
        if (n.includes('tablet') || n.includes('ipad') || n.includes('surf') || n.includes('surface')) return { price: 180.00, rule: 'tablet cat/name' };
        return { price: 350.00, rule: 'celular cat' };
    }
    if (cat.includes('monitor')) return { price: 160.00, rule: 'monitor cat' };
    if (cat.includes('impresora')) return { price: 200.00, rule: 'impresora cat' };
    if (cat.includes('televisor') || cat.includes('tv') || cat.includes('televisores')) return { price: 500.00, rule: 'tv cat' };
    if (cat.includes('disco') || cat.includes('almacenamiento')) return { price: 65.00, rule: 'disco cat' };
    if (cat.includes('ram') || cat.includes('memoria')) return { price: 40.00, rule: 'ram cat' };
    if (cat.includes('motherboard') || cat.includes('procesador') || cat.includes('video') || cat.includes('tarjeta')) {
        if (cat.includes('tarjetas de video') || cat.includes('video')) return { price: 180.00, rule: 'video cat' };
        return { price: 130.00, rule: 'motherboard cat' };
    }
    if (cat.includes('case') || cat.includes('fuente') || cat.includes('poder')) return { price: 60.00, rule: 'case cat' };
    if (cat.includes('ups') || cat.includes('regulador')) return { price: 80.00, rule: 'ups cat' };
    if (cat.includes('audio') || cat.includes('video')) return { price: 45.00, rule: 'audio cat' };
    
    return { price: 35.00, rule: 'generic fallback' };
}

async function diagnose() {
    try {
        const p = await prisma.product.findFirst({
            where: { provider: 'TecnoMega', name: { contains: 'TV LG 50INC ALPHA5' } }
        });
        if (p) {
            console.log(`Product: "${p.name}"`);
            console.log(`Keywords: "${p.keywords}"`);
            console.log(`Price: $${p.price}`);
            const res = estimatePrice(p.name, p.keywords);
            console.log(`Diagnostic estimation: $${res.price} | Rule: "${res.rule}"`);
        } else {
            console.log("Product not found in DB.");
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
diagnose();
