const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Sincronizando Catálogo 1Hora (MultiTecnología V&V) ---');

  let category = await prisma.category.findFirst({
    where: { slug: 'bancos-de-carga-1hora' }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Bancos de Carga & Soluciones de Energía 1Hora',
        slug: 'bancos-de-carga-1hora',
        description: 'Bancos de carga portátiles 20000 mAh con 4 cables integrados y cargadores inalámbricos magnéticos MagSafe 1Hora de MultiTecnología V&V.'
      }
    });
    console.log('✅ Categoría creada:', category.id);
  } else {
    console.log('ℹ️ Categoría existente:', category.id);
  }

  const products = [
    {
      sku: '1H-GAR159N',
      name: 'Banco de Carga 20000 mAh 1Hora Negro (4 Cables Integrados: USB/V8/Tipo-C/iOS)',
      description: 'Power bank de 20000 mAh 1Hora modelo GAR159N en color negro. Equipado con 4 cables integrados para que nunca olvides tu cable (USB estándar, Micro USB V8, USB Tipo-C y Lightning para iPhone). Carga rápida 22.5W con chip inteligente contra sobrecargas, linterna LED doble de alta potencia e indicador de carga de 4 niveles. Calidad original distribuida por MultiTecnología.',
      price: 27.10,
      compareAtPrice: 38.00,
      stock: 80,
      images: JSON.stringify(['/images/1hora/banco-20000-negro-gar159n.jpg']),
      isActive: true,
      featured: true,
      provider: 'MultiTecnologia V&V',
      categoryId: category.id
    },
    {
      sku: '1H-GAR159R',
      name: 'Banco de Carga 20000 mAh 1Hora Rojo (4 Cables Integrados + Linterna Doble)',
      description: 'Banco de carga de alta capacidad 20000 mAh 1Hora modelo GAR159R en llamativo color Rojo Metálico. 4 cables incorporados (USB, V8, Tipo-C, iPhone), carga rápida 22.5W, doble linterna LED y diseño ecológico ultra resistente. Ideal para viajes, trabajo en campo y uso intensivo diario.',
      price: 27.10,
      compareAtPrice: 38.00,
      stock: 65,
      images: JSON.stringify(['/images/1hora/banco-20000-rojo-magsafe-combo.jpg']),
      isActive: true,
      featured: true,
      provider: 'MultiTecnologia V&V',
      categoryId: category.id
    },
    {
      sku: '1H-GAR276N',
      name: 'Banco de Carga 5000 mAh 1Hora Carga Inalámbrica Magnética MagSafe (Mod. GAR276N)',
      description: 'Power bank magnético ultra compacto 1Hora modelo GAR276N. Carga inalámbrica rápida de 15W con fijación magnética ultra fuerte compatible con tecnología MagSafe de iPhone (12 al 16) y dispositivos Android con aro magnético. Puerto bidireccional USB Tipo-C de entrada y salida. Tamaño ultra delgado que cabe en la palma de la mano.',
      price: 28.90,
      compareAtPrice: 39.50,
      stock: 75,
      images: JSON.stringify(['/images/1hora/banco-5000-magsafe-gar276n.jpg']),
      isActive: true,
      featured: true,
      provider: 'MultiTecnologia V&V',
      categoryId: category.id
    },
    {
      sku: '1H-COMBO-DUO',
      name: 'Combo Dúo Carga Total 1Hora (Banco 20000 mAh 4 Cables + Banco 5000 mAh MagSafe)',
      description: 'El combo definitivo de energía portátil 1Hora: 1 Banco de 20000 mAh con 4 cables integrados (Negro o Rojo) para máxima autonomía en viajes + 1 Banco de 5000 mAh MagSafe magnético para el bolsillo en tu día a día. Ahorra $6 comprando el dúo.',
      price: 49.99,
      compareAtPrice: 65.00,
      stock: 30,
      images: JSON.stringify(['/images/1hora/banco-20000-rojo-magsafe-combo.jpg']),
      isActive: true,
      featured: true,
      provider: 'MultiTecnologia V&V',
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

  // Also update existing MultiTecnología references if needed
  const existingGar159 = await prisma.product.findUnique({
    where: { id: 'cmohfkahp00007phoue27d1q5' }
  });
  if (existingGar159) {
    await prisma.product.update({
      where: { id: existingGar159.id },
      data: {
        price: 27.10,
        compareAtPrice: 38.00,
        images: JSON.stringify(['/images/1hora/banco-20000-rojo-magsafe-combo.jpg']),
        categoryId: category.id
      }
    });
    console.log('Sincronizado existente cmohfkahp00007phoue27d1q5 con precio de banner $27.10');
  }

  const existingGar276 = await prisma.product.findUnique({
    where: { id: 'cmohfkaz900017phoze8z01a9' }
  });
  if (existingGar276) {
    await prisma.product.update({
      where: { id: existingGar276.id },
      data: {
        price: 28.90,
        compareAtPrice: 39.50,
        images: JSON.stringify(['/images/1hora/banco-5000-magsafe-gar276n.jpg']),
        categoryId: category.id
      }
    });
    console.log('Sincronizado existente cmohfkaz900017phoze8z01a9 con precio de banner $28.90');
  }

  console.log('✅ Catálogo 1Hora sincronizado con éxito.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
