const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function audit() {
  console.log('================================================================');
  console.log('🔍 INICIANDO AUDITORÍA PROFUNDA DE CERRADURAS SMART EN TODOS LOS PROVEEDORES');
  console.log('================================================================\n');

  // 1. Audit Client File
  const clientPath = 'src/app/web/cerraduras-smart/CerradurasSmartClient.tsx';
  const clientContent = fs.readFileSync(clientPath, 'utf8');

  // Regex to extract all objects inside SMART_LOCK_KITS
  const kitMatches = clientContent.match(/\{\s*id:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]+)"[\s\S]*?\}/g);
  console.log(`📋 Total Cerraduras en SMART_LOCK_KITS: ${kitMatches ? kitMatches.length : 0}`);

  // Let's check every image referenced in SMART_LOCK_KITS to see if it exists locally in public/
  const imgRegex = /image:\s*"([^"]+)"/g;
  let match;
  const missingImages = [];
  const validImages = [];

  while ((match = imgRegex.exec(clientContent)) !== null) {
    const relPath = match[1];
    const fullPath = path.join(__dirname, 'public', relPath.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      validImages.push(relPath);
    } else {
      missingImages.push(relPath);
    }
  }

  console.log(`🖼️ Auditoría de Imágenes: ${validImages.length} válidas, ${missingImages.length} faltantes`);
  if (missingImages.length > 0) {
    console.error('❌ Imágenes Faltantes:', missingImages);
  } else {
    console.log('✅ TODAS las imágenes de cerraduras existen en el sistema de archivos public/');
  }

  // 2. Query Prisma DB for all products matching lock keywords across all providers
  const keywords = ['cerradura', 'cerrojo', 'lock', 'chapa', 'biometric', 'tl800', 'tl400b', 'lh6000', 'll-01', 'dl05', 'ml100', 'voltex', 'plasma', 'hyperbolt', 'ionsecure', 'quantum', 'nova', 'cronte', 'yale', 'ydf', 'ymf', 'yrd', 'ymc'];
  
  const allDbProducts = await prisma.product.findMany({
    where: {
      OR: keywords.map(kw => ({
        OR: [
          { name: { contains: kw, mode: 'insensitive' } },
          { description: { contains: kw, mode: 'insensitive' } },
          { sku: { contains: kw, mode: 'insensitive' } }
        ]
      }))
    },
    select: {
      id: true,
      sku: true,
      name: true,
      price: true,
      compareAtPrice: true,
      provider: true,
      images: true,
      category: { select: { name: true } }
    },
    orderBy: { provider: 'asc' }
  });

  console.log(`\n🗄️ Total Cerraduras Smart Encontradas en Base de Datos: ${allDbProducts.length}`);

  const byProvider = {};
  allDbProducts.forEach(p => {
    const prov = p.provider || 'SIN_PROVEEDOR';
    if (!byProvider[prov]) byProvider[prov] = [];
    byProvider[prov].push(p);
  });

  console.log('\n📊 Desglose por Proveedor en Base de Datos:');
  Object.keys(byProvider).forEach(prov => {
    console.log(`   - ${prov}: ${byProvider[prov].length} modelos`);
  });

  console.log('\n--- DETALLE DE PRODUCTOS HOMOLOGADOS POR PROVEEDOR ---');
  Object.keys(byProvider).forEach(prov => {
    console.log(`\n🏢 PROVEEDOR: ${prov}`);
    byProvider[prov].forEach((p, idx) => {
      let imgs = [];
      try { imgs = JSON.parse(p.images); } catch(e) { imgs = [p.images]; }
      console.log(`  ${idx + 1}. [${p.sku}] ${p.name}`);
      console.log(`     Precio: $${p.price} (Reg: $${p.compareAtPrice}) | Img: ${imgs[0] || 'SIN_IMAGEN'}`);
    });
  });

  // 3. Search for any other registered providers or raw supplier items
  const allProvidersInDb = await prisma.product.groupBy({
    by: ['provider'],
    _count: { id: true }
  });

  console.log('\n🏢 TODOS LOS PROVEEDORES REGISTRADOS EN ATOMIC ERP:');
  allProvidersInDb.forEach(pr => {
    console.log(`   - ${pr.provider || 'Sin Proveedor'}: ${pr._count.id} productos totales`);
  });

  // 4. Verify no non-lock or unrelated items leaked into SMART_LOCK_KITS
  const nonLockKeywords = ['cocina', 'horno', 'encimera', 'bloque', 'generador', 'mando', 'consola', 'celular', 'tablet', 'laptop', 'cpu'];
  const leakedItems = [];
  
  // Check client content
  const idRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
  let idMatch;
  while ((idMatch = idRegex.exec(clientContent)) !== null) {
    const id = idMatch[1];
    const name = idMatch[2].toLowerCase();
    for (const nlk of nonLockKeywords) {
      if (name.includes(nlk) && !name.includes('cerradura') && !name.includes('chapa') && !name.includes('acceso')) {
        leakedItems.push({ id, name });
      }
    }
  }

  if (leakedItems.length > 0) {
    console.warn('⚠️ ALERTA: Productos potencialmente no relacionados detectados:', leakedItems);
  } else {
    console.log('\n✅ FILTRADO 100% LIMPIO: Ningún producto ajeno (cocinas, consolas, laptops, maquinaria) se ha filtrado en el catálogo de cerraduras.');
  }

}

audit().catch(console.error).finally(() => process.exit(0));
