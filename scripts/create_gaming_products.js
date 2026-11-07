const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Registrando Consola PlayStation 4 Slim 1TB & Ecosistema Gaming ---');

  let category = await prisma.category.findFirst({
    where: { slug: 'gaming-consolas' }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Gaming & Consolas Certificadas',
        slug: 'gaming-consolas',
        description: 'Ecosistema de consolas de segunda mano certificadas ATOMIC con 2 años de garantía.'
      }
    });
  }

  const products = [
    {
      sku: 'PS4-SLIM-1TB-GOW-1C',
      name: 'PlayStation 4 Slim 1 TB + 1 Control Original + Estuche (Certificada)',
      description: 'PlayStation 4 versión Slim de 1 TB de disco duro en impecable estado estético y funcional. Incluye 1 control original DualShock 4, estuche rígido PlayStation, cables originales (HDMI, poder y carga) y 2 años de garantía oficial ATOMIC Gaming. Mantenimiento térmico y pasta disipadora nueva.',
      price: 260.00,
      compareAtPrice: 320.00,
      stock: 3,
      images: JSON.stringify(['/images/gaming/ps4-slim-1tb-god-of-war.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC GAMING',
      categoryId: category.id
    },
    {
      sku: 'PS4-SLIM-1TB-GOW-2C',
      name: 'PlayStation 4 Slim 1 TB + 2 Controles DualShock 4 (God of War + Camo Red) + Estuche',
      description: 'Edición para 2 jugadores: PlayStation 4 Slim 1 TB con 2 controles DualShock 4 (1 Edición Especial God of War + 1 Edición Camo Red militar), estuche rígido PlayStation de transporte, cables originales completos y 2 años de garantía certificada. ¡Lista para jugar!',
      price: 280.00,
      compareAtPrice: 350.00,
      stock: 2,
      images: JSON.stringify(['/images/gaming/ps4-slim-1tb-god-of-war.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC GAMING',
      categoryId: category.id
    },
    {
      sku: 'PS4-SLIM-1TB-GOW-MAGIA',
      name: 'PlayStation 4 Slim 1 TB + 2 Controles + Magia Instalada & Juegos a Elección',
      description: 'El pack más completo: PS4 Slim 1 TB con Magia instalada (firmware liberado permanente), catálogo de juegos descargados a tu completa elección, 2 controles DualShock 4 (God of War + Camo Red), estuche rígido y 2 años de garantía. Enciende y juega sin límites.',
      price: 295.00,
      compareAtPrice: 390.00,
      stock: 2,
      images: JSON.stringify(['/images/gaming/ps4-slim-1tb-god-of-war.jpg']),
      isActive: true,
      featured: true,
      provider: 'ATOMIC GAMING',
      categoryId: category.id
    }
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { sku: p.sku }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: p
      });
      console.log('Actualizado:', p.name, `($${p.price})`);
    } else {
      await prisma.product.create({
        data: p
      });
      console.log('Creado:', p.name, `($${p.price})`);
    }
  }

  console.log('✅ Consolas registradas en DB exitosamente.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
