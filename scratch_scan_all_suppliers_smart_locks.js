const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function scanAll() {
  console.log('================================================================');
  console.log('🔍 ESCANEO EXHAUSTIVO DE CERRADURAS EN TODOS LOS PROVEEDORES DE LA BD');
  console.log('================================================================');

  // Search patterns
  const terms = [
    'cerradura', 'cerrojo', 'chapa', 'smart lock', 'digital lock', 
    'diel', 'kocom', 'steren', 'shome', 'ttlock', 'tuya', 'biometric',
    'huella', 'mifare', 'rfid', 'hotelera', 'electroiman', 'electroimán'
  ];

  const excludeTerms = [
    'cable', 'notebook', 'laptop', 'bateria', 'batería', 'regulador', 
    'panel solar', 'inversor', 'gabinete rack', 'parlante', 'camara para auto'
  ];

  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      name: true,
      price: true,
      compareAtPrice: true,
      provider: true,
      images: true,
      description: true,
      category: { select: { name: true } }
    }
  });

  console.log(`Total productos en la base de datos: ${allProducts.length}`);

  const lockMatches = [];

  for (const p of allProducts) {
    const text = `${p.name} ${p.description || ''} ${p.sku || ''}`.toLowerCase();
    
    // Check if contains any lock term
    const hasLockTerm = terms.some(t => text.includes(t));
    if (!hasLockTerm) continue;

    // Check if it's an excluded term
    const isExcluded = excludeTerms.some(e => text.includes(e));
    if (isExcluded) continue;

    // Let's filter specifically for locks / access items
    if (
      text.includes('cerradura') || 
      text.includes('cerrojo') || 
      text.includes('chapa') || 
      text.includes('smart lock') || 
      text.includes('diel') ||
      text.includes('kocom') ||
      text.includes('shome-') ||
      (text.includes('biometric') && text.includes('puerta')) ||
      (text.includes('electroiman') || text.includes('electroimán'))
    ) {
      lockMatches.push(p);
    }
  }

  console.log(`\n🎯 Cerraduras & Accesos detectados en toda la BD: ${lockMatches.length}`);

  const bySupplier = {};
  lockMatches.forEach(p => {
    const prov = p.provider || 'Sin Proveedor';
    if (!bySupplier[prov]) bySupplier[prov] = [];
    bySupplier[prov].push(p);
  });

  console.log('\n📊 Desglose por Proveedor:');
  Object.keys(bySupplier).forEach(prov => {
    console.log(`\n🏢 PROVEEDOR: ${prov} (${bySupplier[prov].length} productos)`);
    bySupplier[prov].forEach((p, idx) => {
      console.log(`   ${idx + 1}. [${p.sku || 'N/A'}] ${p.name} - $${p.price} USD`);
    });
  });
}

scanAll().catch(console.error).finally(() => process.exit(0));
