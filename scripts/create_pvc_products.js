const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Sincronizando Catálogo Completo de Paneles & Planchas PVC ---');

  let category = await prisma.category.findFirst({
    where: { slug: 'paneles-ranurados-remodelaciones' }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Paneles ranurados y remodelaciones de interior y exterior',
        slug: 'paneles-ranurados-remodelaciones',
        description: 'Paneles ranurados WPC (2.90m x 16cm) y Planchas de PVC tipo mármol (1.22m) para remodelaciones modernas residenciales y comerciales en Ecuador.'
      }
    });
  }

  const pvcProducts = [
    {
      sku: 'PVC-MAR-NEG-27',
      name: 'Plancha PVC Estilo Mármol Negro Marquina (Precio de Liquidación)',
      description: 'Plancha de PVC decorativa estilo mármol negro con vetas doradas/blancas de 1.22m de ancho. 100% resistente a la humedad, fácil de limpiar e instalación rápida y limpia. Ideal para salas de estar, baños y muros de acento. Retiro inmediato en Carapungo (Quito) y envíos a todo el país.',
      price: 27.00,
      compareAtPrice: 38.00,
      stock: 45,
      images: JSON.stringify(['/images/paneles-wpc/plancha-pvc-marmol-negro-liquidacion.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC ARQUITECTURA',
      categoryId: category.id
    },
    {
      sku: 'PVC-MAR-BLA-29',
      name: 'Plancha PVC Estilo Mármol Blanco Carrara Veteado Oro (1.22m)',
      description: 'Plancha de PVC de alta definición estilo mármol blanco Carrara con elegantes vetas doradas de 1.22m de ancho. Apta para zonas húmedas, baños, salas y dormitorios. Acabado brillante tipo losa de mármol sin peso excesivo ni costos altos de instalación.',
      price: 29.00,
      compareAtPrice: 42.00,
      stock: 60,
      images: JSON.stringify(['/images/paneles-wpc/plancha-pvc-marmol-blanco-dorado.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC ARQUITECTURA',
      categoryId: category.id
    },
    {
      sku: 'PVC-MAR-DOR-29',
      name: 'Plancha PVC Estilo Mármol Blanco Estatuario / Dormitorio (1.22m)',
      description: 'Lámina de PVC arquitectónica estilo mármol blanco puro de 1.22m de ancho. Diseñada para respaldos de cama, halls y áreas residenciales de lujo. Resistente al agua, antimoho y de fácil aseo.',
      price: 29.99,
      compareAtPrice: 44.00,
      stock: 50,
      images: JSON.stringify(['/images/paneles-wpc/plancha-pvc-marmol-blanco-dormitorio.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC ARQUITECTURA',
      categoryId: category.id
    },
    {
      sku: 'PVC-MAR-GRI-29',
      name: 'Plancha PVC Estilo Mármol Gris Piedra / Baño & Ducha (1.22m)',
      description: 'Plancha de PVC impermeable en textura gris piedra / mármol industrial de 1.22m. Especialmente recomendada para duchas, cuartos de baño, lavanderías y spas. Acabado sobrio y durabilidad garantizada.',
      price: 29.10,
      compareAtPrice: 40.00,
      stock: 40,
      images: JSON.stringify(['/images/paneles-wpc/plancha-pvc-marmol-gris-bano.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC ARQUITECTURA',
      categoryId: category.id
    },
    {
      sku: 'PVC-MAR-CAL-29',
      name: 'Plancha PVC Estilo Mármol Calacatta Sala & TV Wall (1.22m)',
      description: 'Lámina de PVC tipo mármol Calacatta con veteado arquitectónico de 1.22m. Combina a la perfección con paneles ranurados WPC en los laterales para crear centros de entretenimiento modernos.',
      price: 29.30,
      compareAtPrice: 42.00,
      stock: 55,
      images: JSON.stringify(['/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC ARQUITECTURA',
      categoryId: category.id
    },
    {
      sku: 'WPC-COMBO-WALL',
      name: 'Combo Arquitectónico Muro TV: 1 Plancha PVC Mármol + 6 Paneles Ranurados WPC',
      description: 'Kit completo de diseño para sala: 1 lámina de PVC mármol 1.22m para el centro de TV + 6 paneles ranurados WPC de 2.90m para los laterales en color a elección (Negro, Bicolor o Café). Transforma tu sala en una tarde.',
      price: 79.99,
      compareAtPrice: 110.00,
      stock: 25,
      images: JSON.stringify(['/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC ARQUITECTURA',
      categoryId: category.id
    }
  ];

  for (const prod of pvcProducts) {
    const existing = await prisma.product.findFirst({
      where: { sku: prod.sku }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: prod
      });
      console.log('Actualizado:', prod.name, `($${prod.price})`);
    } else {
      await prisma.product.create({
        data: prod
      });
      console.log('Creado:', prod.name, `($${prod.price})`);
    }
  }

  console.log('✅ Todos los productos de Planchas PVC y Combos registrados exitosamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
