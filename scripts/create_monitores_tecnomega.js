const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Regla maestra de margen comercial Tecnomega:
// Base >= $200 -> 25% de margen (x1.25)
// Base < $200  -> 28% de margen (x1.28)
function calcSalePrice(cost) {
  const margin = cost >= 200 ? 1.25 : 1.28;
  return Number((cost * margin).toFixed(2));
}

async function main() {
  console.log('--- Registrando Monitores Gaming & Pro Tecnomega con Margen Oficial ---');

  let category = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: 'monitores' },
        { slug: 'monitores-tm' },
        { name: { contains: 'Monitor', mode: 'insensitive' } }
      ]
    }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Monitores Gaming & Oficina',
        slug: 'monitores',
        description: 'Monitores gamers de alta tasa de refresco (120Hz, 144Hz IPS), paneles profesionales y corporativos Dell, LG, ASUS y Gigabyte.'
      }
    });
  }

  const items = [
    {
      sku: 'MONASUVY279HGR',
      name: 'Monitor ASUS VY279HGR 27" FHD IPS 120Hz 1ms Eye Care Plus',
      description: 'Monitor gamer y profesional ASUS VY279HGR de 27 pulgadas con panel IPS Full HD (1920x1080) y fluidez extrema de 120Hz con 1ms de tiempo de respuesta (MPRT). Tecnología ASUS Eye Care Plus con filtro de luz azul TÜV Rheinland y tratamiento antibacterial patentado en los biseles. Conectividad HDMI y VGA. Ideal para gaming fluido, teletrabajo y diseño gráfico. Distribución oficial Tecnomega con garantía.',
      costPrice: 253.92,
      price: calcSalePrice(253.92), // $317.40
      compareAtPrice: 365.00,
      stock: 15,
      images: JSON.stringify([
        '/images/monitores/monitor-asus-vy279hgr-27.png',
        '/images/monitores/monitor-asus-vy279hgr-27.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    },
    {
      sku: 'MONLGX24G411B-B',
      name: 'Monitor LG UltraGear 23.8" FHD IPS Gaming 144Hz 1ms HDMI DP Slim Stand',
      description: 'Monitor Gaming de alta competición LG UltraGear de 24 pulgadas (23.8" diagonal) con panel IPS Full HD (1920x1080), frecuencia de actualización nativa de 144Hz y 1ms MBR. Soporte para AMD FreeSync Premium, gama de color sRGB 99%, bisel ultradelgado de 3 lados y soporte estilizado Slim Stand. Entradas HDMI y DisplayPort. Garantía oficial.',
      costPrice: 171.93,
      price: calcSalePrice(171.93), // $220.07
      compareAtPrice: 259.00,
      stock: 20,
      images: JSON.stringify([
        '/images/monitores/monitor-lg-ultragear-24g411b.png',
        '/images/monitores/monitor-lg-ultragear-24g411b.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    },
    {
      sku: 'MONLGX27G411A-B',
      name: 'Monitor LG UltraGear 27" FHD IPS Gaming 144Hz 1ms HDMI DP Slim Stand',
      description: 'El legendario monitor LG UltraGear en formato de 27 pulgadas. Pantalla IPS Full HD con tasa de refresco ultra rápida de 144Hz, 1ms de respuesta y cobertura cromática 99% sRGB con HDR10. Diseño sin bordes en 3 lados, base Slim de diseño contemporáneo y conectividad DisplayPort 1.2 + HDMI. Disfruta de una inmersión cinemática sin tearing ni stuttering.',
      costPrice: 203.66,
      price: calcSalePrice(203.66), // $254.58
      compareAtPrice: 299.00,
      stock: 18,
      images: JSON.stringify([
        '/images/monitores/monitor-lg-ultragear-27g411a.png',
        '/images/monitores/monitor-lg-ultragear-27g411a.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    },
    {
      sku: 'MONGIBGS24F14',
      name: 'Monitor GIGABYTE GS24F 23.8" FHD IPS Gaming 144Hz (170Hz OC) 1ms',
      description: 'Monitor gamer táctico GIGABYTE GS24F de 23.8 pulgadas con panel Super Speed IPS FHD (1920x1080), 144Hz nativos overclockeables a 170Hz y 1ms de tiempo de respuesta. Soporta tecnología AMD FreeSync Premium, HDR Ready, funciones tácticas OSD Sidekick, Black Equalizer y Aim Stabilizer. Conexiones Dual HDMI 2.0 y DisplayPort 1.2.',
      costPrice: 208.95,
      price: calcSalePrice(208.95), // $261.19
      compareAtPrice: 310.00,
      stock: 16,
      images: JSON.stringify([
        '/images/monitores/monitor-gigabyte-gs24f.png',
        '/images/monitores/monitor-gigabyte-gs24f.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    },
    {
      sku: 'MONDELE2026H',
      name: 'Monitor Dell Pro 20 E2026H 19.5" HD+ (1600x900) HDMI DP VGA (3 Años Garantía)',
      description: 'Monitor profesional de alta durabilidad Dell Pro 20 E2026H de 19.5 pulgadas con resolución HD+ (1600x900). Triple conectividad versátil: HDMI, DisplayPort y VGA clásica para compatibilidad universal con cualquier computador o servidor. Eficiencia energética ENERGY STAR®, ComfortView antiparpadeo y garantía oficial extendida Dell de 3 años.',
      costPrice: 142.83,
      price: calcSalePrice(142.83), // $182.82
      compareAtPrice: 219.00,
      stock: 25,
      images: JSON.stringify([
        '/images/monitores/monitor-dell-pro-e2026h.png',
        '/images/monitores/monitor-dell-pro-e2026h.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    }
  ];

  for (const item of items) {
    const existing = await prisma.product.findFirst({
      where: { sku: item.sku }
    });

    const { costPrice, ...dbData } = item;

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: dbData
      });
      console.log(`✅ Actualizado: ${item.name} (${item.sku}) -> Costo: $${costPrice} | PVP con Margen: $${item.price}`);
    } else {
      await prisma.product.create({
        data: dbData
      });
      console.log(`✨ Creado: ${item.name} (${item.sku}) -> Costo: $${costPrice} | PVP con Margen: $${item.price}`);
    }
  }

  console.log('--- Proceso de monitores finalizado exitosamente ---');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
