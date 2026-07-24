const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PHONE_BRANDS = ['samsung', 'iphone', 'xiaomi', 'oppo', 'motorola', 'redmi', 'realme', 'honor', 'infinix', 'tecno', 'zte', 'nokia', 'huawei', 'poco'];
const BANNED_KEYWORDS = [
    'funda', 'estuche', 'case ', 'mica', 'protector', 'cargador', 'cable', 'repuesto', 'bateria', 'batería', 
    'teclado', 'keyboard', 'mouse', 'raton', 'ratón', 'banco de poder', 'power bank', 'powerbank', 
    'audifono', 'audífono', 'audífonos', 'audifonos', 'tablet', 'ipad', 'imac', 'macbook', 'laptop', 'computador', 'pc',
    'tv', 'televisor', 'monitor', 'ssd', 'disco', 'cerradura', 'cerrojo', 'pasta', 'extensor', 'convertidor',
    'memoria', 'flash', 'trampa', 'caja fuerte', 'holder', 'soporte', 'corsair', 'impresora', 'smartwatch', 'reloj',
    'correa', 'adaptador', 'adapter', 'smart tv', 'television', 'auricular', 'auriculares', 'headset', 'parlante', 'amazon fire'
];

async function main() {
    const products = await prisma.product.findMany({ select: { id: true, name: true, price: true } });
    
    let updatedCount = 0;

    for (const p of products) {
        const name = p.name.toLowerCase();
        
        if (BANNED_KEYWORDS.some(kw => name.includes(kw) || name === kw)) continue;
        
        const isSmartphone = name.includes('smartphone') || name.includes('celular') || (name.includes('iphone') && !name.includes('ipad'));
        const hasBrand = PHONE_BRANDS.some(brand => name.includes(brand));
        const hasSpecs = (name.includes('gb') && (name.includes('ram') || name.includes('rom') || /\d+gb/.test(name))) || name.includes('dual sim') || name.includes('dual-sim') || name.includes('5g') || name.includes('4g') || name.includes('lte');

        if (isSmartphone || (hasBrand && hasSpecs)) {
            // Apply 15% margin
            const newPrice = p.price * 1.15;
            await prisma.product.update({
                where: { id: p.id },
                data: { price: newPrice }
            });
            console.log(`Updated [${p.id}]: ${p.name} - Old: $${p.price.toFixed(2)} -> New: $${newPrice.toFixed(2)}`);
            updatedCount++;
        }
    }

    console.log(`\nOperation complete. Updated ${updatedCount} cellphones.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
