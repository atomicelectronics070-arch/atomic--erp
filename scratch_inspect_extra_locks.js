const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function inspectExtra() {
  const skus = [
    'LOCK-350', 'LOCK-450', 'LOCK-480', 'LOCK-500', 'LOCK-510',
    'OS8810BLE DIEL IZQUIERDA', 'OS527 TYFA DIEL', 'OS527 TYFV DIEL', 'OS527 TYF DIEL', 'OS477 TYF DIEL', 'OS695 FC DIEL',
    'KDL-4100SK KOCOM', 'KDL-3700SK KOCOM',
    'cerradura-de-puerta-por-huella-dactilar-con-aplicacion-codigo-llave-de-repuesto',
    'cerradura-inteligente-de-puerta-con-huella-dactilar-con-aplicacion-y-codigo',
    'cerradura-inteligente-para-puerta-con-huella-dactilar-codigo-tarjeta-y-app',
    'cerradura-electronica-inteligente-magnetica-cajones-y-puerta'
  ];

  const items = await prisma.product.findMany({
    where: {
      OR: skus.map(s => ({
        OR: [
          { sku: { contains: s, mode: 'insensitive' } },
          { name: { contains: s, mode: 'insensitive' } }
        ]
      }))
    },
    select: {
      sku: true,
      name: true,
      price: true,
      provider: true,
      images: true,
      description: true
    }
  });

  console.log(`Found ${items.length} extra models in database:`);
  items.forEach(it => {
    let imgs = [];
    try { imgs = JSON.parse(it.images); } catch(e) { imgs = [it.images]; }
    console.log(`[${it.provider}] ${it.sku} - ${it.name} ($${it.price}) | Img: ${imgs[0]}`);
  });
}

inspectExtra().catch(console.error).finally(() => process.exit(0));
