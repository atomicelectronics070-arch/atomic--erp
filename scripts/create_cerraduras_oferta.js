const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Registrando Cerraduras Inteligentes Oferta Fin de Año ---');

  let category = await prisma.category.findFirst({
    where: { slug: 'cerraduras-smart' }
  });

  if (!category) {
    category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: 'seguridad' },
          { slug: 'cerraduras' },
          { name: { contains: 'Cerradura', mode: 'insensitive' } }
        ]
      }
    });
  }

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Cerraduras Inteligentes & Seguridad Biométrica',
        slug: 'cerraduras-smart',
        description: 'Cerraduras inteligentes WiFi con reconocimiento facial 3D, cámara, huella, Tuya Smart y entrega inmediata.'
      }
    });
  }

  const cerraduras = [
    {
      sku: 'CERRADURA-WIFI-FACIAL-3D',
      name: 'Cerradura Inteligente WiFi con Reconocimiento Facial 3D y 5 Pistones (Tuya / Smart Life)',
      description: 'Cerradura de máxima gama con Reconocimiento Facial 3D (Cámara HD 1080P), videollamada bidireccional y control total por Tuya / Smart Life. 5 métodos de apertura (Facial, Huella, Código, Tarjeta IC y Llave). Batería de litio recargable, bloqueo de 5 pistones ultra seguro. Apta para puertas de madera y metal (35-120 mm). Incluye cable Tipo C, 2 tarjetas IC y 2 llaves de emergencia. Garantía 12 meses. Entrega GRATIS inmediata en Quito.',
      price: 145.00,
      compareAtPrice: 195.00,
      stock: 18,
      images: JSON.stringify([
        '/images/cerraduras/oferta-fin-ano/cerradura-facial-3d-5pistones-145.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'ATOMIC SEGURIDAD',
      categoryId: category.id
    },
    {
      sku: 'CERRADURA-TUYA-WIFI-5PISTONES',
      name: 'Cerradura Inteligente WiFi Tuya Smart con Bloqueo de 5 Pistones y Alarma Antisabotaje',
      description: 'Cerradura inteligente WiFi Tuya Smart & Smart Life con bloqueo de 5 pistones de máxima seguridad y alarma antisabotaje integrada. 5 métodos de apertura (Huella, Contraseña, Tarjeta, Llave y App). Apta para interior y exterior. 12 meses de garantía. $89.80 Inc. IVA con entrega inmediata gratis en Quito y envíos a todo Ecuador.',
      price: 89.80,
      compareAtPrice: 125.00,
      stock: 24,
      images: JSON.stringify([
        '/images/cerraduras/oferta-fin-ano/cerradura-tuya-wifi-5pistones-89.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'ATOMIC SEGURIDAD',
      categoryId: category.id
    },
    {
      sku: 'CERRADURA-WIFI-CAMARA-2PISTONES',
      name: 'Cerradura Inteligente WiFi con Cámara Integrada y 2 Pistones (Tuya / Smart Life)',
      description: 'Cerradura inteligente WiFi con cámara HD integrada en panel frontal y timbre interactivo para visualización remota en celular. 5 métodos de apertura (Huella, Contraseña, Tarjeta, Llave y App). Mecanismo de 2 pistones para máxima seguridad. Apto para interior y exterior con 12 meses de garantía oficial. $91 USD con entrega gratis en Quito y entrega inmediata.',
      price: 91.00,
      compareAtPrice: 130.00,
      stock: 20,
      images: JSON.stringify([
        '/images/cerraduras/oferta-fin-ano/cerradura-camara-wifi-2pistones-91.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'ATOMIC SEGURIDAD',
      categoryId: category.id
    }
  ];

  for (const item of cerraduras) {
    const existing = await prisma.product.findFirst({
      where: { sku: item.sku }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: item
      });
      console.log(`✅ Actualizado: ${item.name} ($${item.price})`);
    } else {
      await prisma.product.create({
        data: item
      });
      console.log(`✨ Creado: ${item.name} ($${item.price})`);
    }
  }

  console.log('--- Proceso completado exitosamente ---');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
