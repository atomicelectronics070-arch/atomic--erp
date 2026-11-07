const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Registrando Generador Eléctrico Anker SOLIX C300 ---');

  let category = await prisma.category.findFirst({
    where: { slug: 'energia' }
  });

  if (!category) {
    category = await prisma.category.findFirst({
      where: { slug: 'ups-energia' }
    }) || await prisma.category.create({
      data: {
        name: 'Generadores Eléctricos & Baterías Portátiles',
        slug: 'generadores-electricos',
        description: 'Generadores 100% eléctricos con baterías LiFePO4, estaciones de energía solar y respaldo para el hogar.'
      }
    });
  }

  const solixProduct = {
    sku: 'ANKER-SOLIX-C300',
    name: 'Generador Eléctrico Portátil Anker SOLIX C300 (288Wh • 300W • LiFePO4 • 3 Salidas AC)',
    description: 'Generador 100% eléctrico y silencioso Anker SOLIX C300 con batería LiFePO4 de 288Wh de ultra larga vida (3,000+ ciclos, más de 10 años). Entrega 300W de onda senoidal pura (600W SurgePad), 3 salidas AC 110V, puerto USB-C bidireccional de 140W, 2 USB-C de 100W, toma vehicular de 12V y barra de luz LED ambiental para apagones. Cero ruido, cero humo, apto para interiores. Entrega totalmente gratis en Quito y 3 años de garantía oficial.',
    price: 380.00,
    compareAtPrice: 420.00,
    stock: 25,
    images: JSON.stringify([
      '/images/anker-solix/anker-solix-c300-hero-hogar.jpg',
      '/images/anker-solix/anker-solix-c300-precios-specs.jpg',
      '/images/anker-solix/anker-solix-c300-strap-white.jpg',
      '/images/anker-solix/anker-solix-c300-blueprint-specs.jpg'
    ]),
    isActive: true,
    featured: true,
    provider: 'ATOMIC ENERGÍA',
    categoryId: category.id
  };

  const existing = await prisma.product.findFirst({
    where: { sku: solixProduct.sku }
  });

  if (existing) {
    await prisma.product.update({
      where: { id: existing.id },
      data: solixProduct
    });
    console.log('Actualizado:', solixProduct.name, `($${solixProduct.price})`);
  } else {
    await prisma.product.create({
      data: solixProduct
    });
    console.log('Creado:', solixProduct.name, `($${solixProduct.price})`);
  }

  console.log('✅ Anker SOLIX C300 registrado exitosamente en DB.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
