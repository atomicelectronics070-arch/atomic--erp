const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PHONE_BRANDS = ['samsung', 'iphone', 'xiaomi', 'oppo', 'motorola', 'redmi', 'realme', 'honor', 'infinix', 'tecno', 'zte', 'nokia', 'huawei', 'poco', 'apple'];

const BANNED_KEYWORDS = [
    'funda', 'estuche', 'case', 'mica', 'protector', 'cargador', 'cable', 'repuesto', 'bateria', 'batería', 
    'teclado', 'keyboard', 'mouse', 'raton', 'ratón', 'banco de poder', 'power bank', 'powerbank', 
    'audifono', 'audífono', 'audífonos', 'audifonos', 'tablet', 'ipad', 'imac', 'macbook', 'laptop', 'computador', 'pc',
    'tv', 'televisor', 'monitor', 'ssd', 'disco', 'cerradura', 'cerrojo', 'pasta', 'extensor', 'convertidor',
    'memoria', 'flash', 'trampa', 'caja fuerte', 'holder', 'soporte', 'corsair', 'impresora', 'smartwatch', 'reloj',
    'correa', 'adaptador', 'adapter', 'smart tv', 'television', 'auricular', 'auriculares', 'headset', 'parlante', 'amazon fire',
    'airpod', 'airpods', 'buds', 'watch'
];

async function testFilter() {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        include: { category: true }
    });

    let passed = [];
    let rejected = [];

    products.forEach(x => {
        const name = x.name.toLowerCase();
        const category = (x.category?.name || '').toLowerCase();
        
        let isBanned = BANNED_KEYWORDS.some(kw => name.includes(kw) || name === kw);
        if (isBanned) {
            rejected.push({ name: x.name, reason: 'BANNED_KEYWORD' });
            return;
        }

        const isSmartphone = name.includes('smartphone') || name.includes('celular') || (name.includes('iphone') && !name.includes('ipad'));
        const hasBrand = PHONE_BRANDS.some(brand => name.includes(brand));
        const hasSpecs = (name.includes('gb') && (name.includes('ram') || name.includes('rom') || /\d+gb/.test(name))) || name.includes('dual sim') || name.includes('dual-sim') || name.includes('5g') || name.includes('4g') || name.includes('lte');

        if (isSmartphone) { passed.push(x); return; }
        if (hasBrand && hasSpecs) { passed.push(x); return; }
        if (category.includes('celular') && hasBrand) { passed.push(x); return; }
        
        rejected.push({ name: x.name, reason: 'FAILED_ALL_CHECKS', hasBrand, hasSpecs, isSmartphone, category });
    });

    console.log(`Passed: ${passed.length}`);
    console.log(`Rejected: ${rejected.length}`);
    
    console.log("\nSome rejected items that might be phones:");
    rejected.filter(r => r.reason === 'FAILED_ALL_CHECKS').forEach(r => {
        console.log(`- ${r.name} (Brand? ${r.hasBrand}, Specs? ${r.hasSpecs}, Cat: ${r.category})`);
    });
}

testFilter().catch(console.error).finally(() => prisma.$disconnect());
