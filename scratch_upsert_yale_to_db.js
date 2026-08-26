const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Precise price map from the official category cards (verified against screenshots)
const CARD_PRICES = {
  "cerrojo-digital-phillips-ph240": { price: 67.00, regular: 92.00 },
  "cerrojo-digital-de-sobreponer-ph140": { price: 35.50, regular: 59.50 },
  "cerradura-digital-para-mueble-yf67": { price: 34.84, regular: 60.00 },
  "cerrojo-digital-ymc420d": { price: 260.02, regular: 399.00 },
  "cerradura-digital-yale-ysd100": { price: 227.72, regular: 297.00 },
  "cerradura-digital-biometrica-para-muebles": { price: 34.84, regular: 60.00 },
  "cerrojo-digital-ydd120-black": { price: 92.57, regular: 130.00 },
  "transformador-control-remoto-para-cerradura-electrica": { price: 67.99, regular: 79.99 },
  "cerrojo-digital-yrd226-modulo-para-abrir-desde-el-celular": { price: 329.72, regular: 387.00 },
  "cerrojo-digital-yale-ydl120": { price: 136.84, regular: 160.00 },
  "cerradura-digital-ymf40a-modulo-para-abrir-desde-el-celular": { price: 463.33, regular: 547.00 },
  "cerradura-electrica-678-con-boton": { price: 45.99, regular: 55.00 },
  "cerradura-digital-ysd100-puerta-corrediza": { price: 216.67, regular: 264.00 },
  "cerrojo-digital-yrl226-modulo-para-abrir-desde-el-celular": { price: 343.32, regular: 403.00 },
  "cerradura-digital-lia-embutir": { price: 246.42, regular: 289.00 },
  "cerradura-digital-ydm25": { price: 285.52, regular: 335.00 },
  "cerradura-de-sobreponer-396-roseta": { price: 45.99, regular: 55.00 },
  "cerradura-de-embutir-digital-ymc420": { price: 277.09, regular: 325.00 },
  "cilindro-biometrico": { price: 117.00, regular: 150.00 },
  "cerradura-digital-ymf40a": { price: 388.43, regular: 456.00 },
  "cerrojo-digital-ydf40a-modulo-para-abrir-desde-el-celular": { price: 350.63, regular: 412.00 },
  "cerradura-digital-ymf30a-modulo-para-abrir-desde-el-celular": { price: 390.53, regular: 459.00 },
  "cerrojo-digital-yrd256-modulo-para-abrir-desde-el-celular": { price: 316.12, regular: 371.00 },
  "modulo-de-conexion-yale-connect-hub": { price: 105.32, regular: 123.00 },
  "cerradura-digital-yale-ymf30a": { price: 307.93, regular: 459.00 },
  "cerradura-digital-ymc410-negra": { price: 280.00, regular: 330.00 },
  "cerradura-digital-lia-tubular": { price: 233.67, regular: 274.00 },
  "cerrojo-digital-yrd256": { price: 197.97, regular: 232.00 },
  "cerrojo-digital-ydf40a": { price: 263.13, regular: 375.00 },
  "cerradura-sobreponer-digital-nira": { price: 43.34, regular: 50.00 },
  "modulo-de-integracion-zigbee-cerrojos-yrd-yrl": { price: 48.44, regular: 56.00 },
  "modulo-de-conexion-yale-connect-hub-zigbee-yrd-yrl": { price: 153.84, regular: 180.00 },
  "cerrojo-digital-ydr41": { price: 280.42, regular: 329.00 },
  "cerradura-digital-ymc410-plateada": { price: 124.09, regular: 145.00 },
  "diagnostico-de-pre-instalacion": { price: 20.00, regular: 25.00 },
  "cerradura-digital-lia-yale-connect-tubular": { price: 304.22, regular: 357.00 },
  "cerradura-digital-lia-yale-connect-embutir": { price: 316.12, regular: 371.00 },
  "cerrojo-digital-yrd256-negro": { price: 186.89, regular: 246.00 },
  "cerrojo-digital-yrd226-bronce-oscuro": { price: 174.93, regular: 246.00 },
  "cerrojo-digital-yxr226": { price: 293.17, regular: 344.00 },
  "modulo-de-integracion-zigbee-cerraduras-ymf-ydf": { price: 62.04, regular: 72.00 },
  "cerrojo-digital-yrl226": { price: 227.72, regular: 267.00 }
};

async function main() {
  console.log('=== UPSERTING ALL 42 YALE DIGITAL LOCK PRODUCTS INTO DB ===');

  const scrapedData = JSON.parse(fs.readFileSync('./scratch_yale_all_detailed.json', 'utf8'));
  console.log(`Loaded ${scrapedData.length} scraped items.`);

  // Find or create Category: "Cerraduras Smart y Accesos"
  let category = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { contains: 'Cerraduras', mode: 'insensitive' } },
        { name: { contains: 'Domótica', mode: 'insensitive' } },
        { name: { contains: 'TECNOLOGIA RESIDENCIAL', mode: 'insensitive' } }
      ]
    }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Cerraduras Smart y Accesos",
        description: "Cerraduras biométricas, cerrojos inteligentes y controles de acceso"
      }
    });
    console.log('Created category:', category.name);
  } else {
    console.log('Using category:', category.name, '(ID:', category.id, ')');
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < scrapedData.length; i++) {
    const item = scrapedData[i];

    // Extract slug from URL
    const slug = item.link.replace('https://yale.com.ec/producto/', '').replace(/\/$/, '');
    const priceInfo = CARD_PRICES[slug] || { price: item.salePrice || 99.00, regular: item.originalPrice || 135.00 };

    const finalPrice = priceInfo.price;
    const finalComparePrice = priceInfo.regular;

    // Merge local downloaded images with remote gallery images
    const allImages = [...(item.localImages || []), ...(item.galleryImages || [])];
    const uniqueImages = [...new Set(allImages)].filter(Boolean);

    // Build specs string from bulletPoints
    const specsString = item.bulletPoints && item.bulletPoints.length > 0
      ? JSON.stringify(item.bulletPoints)
      : null;

    // Check if product already exists by name or SKU
    const existing = await prisma.product.findFirst({
      where: {
        provider: 'Yale Ecuador',
        OR: [
          { name: { equals: item.title, mode: 'insensitive' } },
          { sku: { equals: item.sku, mode: 'insensitive' } }
        ]
      }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: item.title,
          sku: item.sku || slug,
          description: item.description,
          price: finalPrice,
          compareAtPrice: finalComparePrice,
          images: JSON.stringify(uniqueImages),
          categoryId: category.id,
          provider: 'Yale Ecuador',
          isActive: true,
          stock: 25,
          specs: specsString
        }
      });
      updatedCount++;
      console.log(`[UPDATED ${i+1}/42] ${item.title} -> $${finalPrice} USD (Reg: $${finalComparePrice})`);
    } else {
      await prisma.product.create({
        data: {
          name: item.title,
          sku: item.sku || slug,
          description: item.description,
          price: finalPrice,
          compareAtPrice: finalComparePrice,
          images: JSON.stringify(uniqueImages),
          categoryId: category.id,
          provider: 'Yale Ecuador',
          isActive: true,
          stock: 25,
          specs: specsString
        }
      });
      createdCount++;
      console.log(`[CREATED ${i+1}/42] ${item.title} -> $${finalPrice} USD (Reg: $${finalComparePrice})`);
    }
  }

  const totalYale = await prisma.product.count({
    where: { provider: 'Yale Ecuador', isDeleted: false }
  });

  console.log(`\n==============================================`);
  console.log(`SYNC COMPLETE: Created: ${createdCount}, Updated: ${updatedCount}`);
  console.log(`TOTAL ACTIVE YALE PRODUCTS IN ATOMIC DB: ${totalYale}`);
  console.log(`==============================================\n`);
}

main().catch(console.error).finally(() => process.exit(0));
