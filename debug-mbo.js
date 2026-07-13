function estimatePrice(name, keywords) {
    const n = name.toLowerCase();
    const cat = (keywords || '').toLowerCase();
    
    if (/\b(disco duro|hard drive|enclosure)\b/.test(n)) {
        return { price: 65.00, rule: 'disco/ssd name' };
    }
    if (/\b(sodimm|ddr4|ddr5|cruzer|datatraveler|pendrive|pen drive|usb drive)\b/.test(n)) {
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
    
    return { price: 35.00, rule: 'generic fallback' };
}

const name = "MBO Gigabyte B840MHG10 EAGLE WIFI6E AMD5 Ryzen 900";
const keywords = "Motherboards";
const res = estimatePrice(name, keywords);
console.log(`Price: $${res.price} | Rule: "${res.rule}"`);
