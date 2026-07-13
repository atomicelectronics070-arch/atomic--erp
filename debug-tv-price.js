function estimatePrice(name, keywords) {
    const n = name.toLowerCase();
    const cat = (keywords || '').toLowerCase();
    
    // 1. Strict name-based check for small components (this takes precedence to avoid mapping "disco duro laptop" as a laptop)
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
    
    // 2. Check category name
    if (cat.includes('laptop')) return { price: 750.00, rule: 'laptop cat' };
    if (cat.includes('computador')) return { price: 450.00, rule: 'computador cat' };
    if (cat.includes('celular') || cat.includes('tablet')) {
        if (n.includes('tablet') || n.includes('ipad') || n.includes('surf') || n.includes('surface')) return { price: 180.00, rule: 'tablet cat/name' };
        return { price: 350.00, rule: 'celular cat' };
    }
    if (cat.includes('monitor')) return { price: 160.00, rule: 'monitor cat' };
    if (cat.includes('impresora')) return { price: 200.00, rule: 'impresora cat' };
    if (cat.includes('televisor') || cat.includes('tv')) return { price: 500.00, rule: 'tv cat' };
    if (cat.includes('disco') || cat.includes('almacenamiento')) return { price: 65.00, rule: 'disco cat' };
    if (cat.includes('ram') || cat.includes('memoria')) return { price: 40.00, rule: 'ram cat' };
    if (cat.includes('motherboard') || cat.includes('procesador') || cat.includes('video') || cat.includes('tarjeta')) {
        if (cat.includes('tarjetas de video') || cat.includes('video')) return { price: 180.00, rule: 'video cat' };
        return { price: 130.00, rule: 'motherboard cat' };
    }
    if (cat.includes('case') || cat.includes('fuente') || cat.includes('poder')) return { price: 60.00, rule: 'case cat' };
    if (cat.includes('ups') || cat.includes('regulador')) return { price: 80.00, rule: 'ups cat' };
    if (cat.includes('audio') || cat.includes('video')) return { price: 45.00, rule: 'audio cat' };
    
    // 3. Fallback to name keywords if category is empty or generic
    if (/\b(laptop|notebook|not\.|macbook|chromebook)\b/.test(n) || n.includes('not.')) return { price: 750.00, rule: 'laptop name fallback' };
    if (/\b(computador|computadora|pc|mini pc|desktop|optiplex|thinkcentre|cop\.)/.test(n) || n.startsWith('cop.')) return { price: 450.00, rule: 'desktop name fallback' };
    if (/\b(celular|iphone|galaxy|samsung|motorola|xiaomi|redmi|huawei)\b/.test(n)) return { price: 350.00, rule: 'celular name fallback' };
    if (/\b(tablet|ipad)\b/.test(n)) return { price: 180.00, rule: 'tablet name fallback' };
    if (/\b(monitor|pantalla)\b/.test(n)) return { price: 160.00, rule: 'monitor name fallback' };
    if (/\b(impresora|epson|laserjet|ecotank)\b/.test(n)) return { price: 200.00, rule: 'impresora name fallback' };
    
    return { price: 35.00, rule: 'generic fallback' };
}

const name = "TV LG 50INC ALPHA5 4K GEN 6 WEBOS 23 THINQ AI HDR";
const keywords = "Televisores";
const result = estimatePrice(name, keywords);
console.log(`Name: "${name}"`);
console.log(`Keywords: "${keywords}"`);
console.log(`Price: $${result.price} | Rule: "${result.rule}"`);
