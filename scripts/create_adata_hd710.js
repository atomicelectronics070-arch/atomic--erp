const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Registrando Discos Duros Externos ADATA HD710 (Tecnomega) ---');

  let category = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: 'almacenamiento' },
        { slug: 'discos-duros' },
        { slug: 'computacion' },
        { name: { contains: 'Almacenamiento', mode: 'insensitive' } }
      ]
    }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Discos Duros & Almacenamiento Externo',
        slug: 'almacenamiento-externo',
        description: 'Discos duros externos blindados ADATA HD710 antishock, resistentes al agua y polvo IP68 de alta velocidad.'
      }
    });
  }

  const products = [
    {
      sku: 'HDDADA1TBHD710Y',
      name: 'Disco Duro Externo ADATA 1TB HD710 USB 3.0 AntiShock WaterResist Amarillo',
      description: 'Disco duro externo ultra resistente ADATA HD710 de 1TB en color Amarillo Cyber. Certificación militar contra caídas MIL-STD-810G 516.6 y protección IP68 sumergible en agua hasta 2 metros por 60 minutos. Interfaz USB 3.0 / 3.2 Gen 1 de alta velocidad con ranura envolvente para guardar el cable. Sensores G-Shock con LED de alerta que suspenden la aguja magnética ante impactos. Precio incluye IVA. Garantía oficial Tecnomega / ADATA.',
      price: 148.12,
      compareAtPrice: 175.00,
      stock: 25,
      images: JSON.stringify([
        '/images/adata-hd710/adata-hd710-1tb-amarillo.png',
        '/images/adata-hd710/adata-hd710-1tb-amarillo.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    },
    {
      sku: 'HDDADA1TBHD710R',
      name: 'Disco Duro Externo ADATA 1TB HD710 USB 3.0 AntiShock WaterResist Rojo',
      description: 'Disco duro externo blindado ADATA HD710 de 1TB en color Rojo Deportivo. Triple capa de silicona amortiguadora, certificación militar MIL-STD-810G y sellado hermético IP68 impermeable y antipolvo. Conectividad USB 3.0 Plug & Play compatible con Windows, Mac y Linux. Sensor de impacto G-Shock integrado. Precio incluye IVA oficial.',
      price: 148.12,
      compareAtPrice: 175.00,
      stock: 30,
      images: JSON.stringify([
        '/images/adata-hd710/adata-hd710-1tb-rojo.png',
        '/images/adata-hd710/adata-hd710-1tb-rojo.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    },
    {
      sku: 'HDDADA1TBHD710L',
      name: 'Disco Duro Externo ADATA 1TB HD710 USB 3.0 AntiShock WaterResist Azul',
      description: 'Disco duro externo de grado industrial ADATA HD710 de 1TB en color Azul Eléctrico. Protección extrema contra golpes, polvo y agua IP68. Cable USB 3.0 empotrable en el contorno del chasis para evitar pérdidas. Máxima fiabilidad para profesionales de campo, fotógrafos y backup seguro. Precio incluye IVA.',
      price: 148.12,
      compareAtPrice: 175.00,
      stock: 22,
      images: JSON.stringify([
        '/images/adata-hd710/adata-hd710-1tb-azul.png',
        '/images/adata-hd710/adata-hd710-1tb-azul.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    },
    {
      sku: 'HDDADA2TBHD710K',
      name: 'Disco Duro Externo ADATA 2TB HD710 USB 3.0 AntiShock WaterResist Negro',
      description: 'Disco duro externo ADATA HD710 de 2TB de alta capacidad en acabado Negro Carbón (Stealth Edition). El doble de almacenamiento con la legendaria resistencia militar MIL-STD-810G y sellado IP68 sumergible. Velocidades de transferencia USB 3.0 hasta 5 Gbps. Cable envolvente y sensor de vibraciones. Precio incluye IVA.',
      price: 178.80,
      compareAtPrice: 215.00,
      stock: 28,
      images: JSON.stringify([
        '/images/adata-hd710/adata-hd710-2tb-negro.png',
        '/images/adata-hd710/adata-hd710-2tb-negro.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    },
    {
      sku: 'HDDADA2TBHD710R',
      name: 'Disco Duro Externo ADATA 2TB HD710 USB 3.0 AntiShock WaterResist Rojo',
      description: 'Disco duro externo ADATA HD710 de 2TB en color Rojo Deportivo. Máximo espacio de almacenamiento protegido por armadura de tres capas de elastómero y plástico reforzado. Certificación militar antishock y sumergibilidad IP68. Compatible con consolas de juegos, computadoras y servidores. Precio incluye IVA.',
      price: 178.80,
      compareAtPrice: 215.00,
      stock: 20,
      images: JSON.stringify([
        '/images/adata-hd710/adata-hd710-2tb-rojo.png',
        '/images/adata-hd710/adata-hd710-2tb-rojo.jpg'
      ]),
      isActive: true,
      featured: true,
      provider: 'TECNOMEGA',
      categoryId: category.id
    }
  ];

  for (const item of products) {
    const existing = await prisma.product.findFirst({
      where: { sku: item.sku }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: item
      });
      console.log(`✅ Actualizado: ${item.name} (${item.sku}) - $${item.price}`);
    } else {
      await prisma.product.create({
        data: item
      });
      console.log(`✨ Creado: ${item.name} (${item.sku}) - $${item.price}`);
    }
  }

  console.log('✅ Todos los discos duros ADATA HD710 fueron sincronizados en DB exitosamente.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
