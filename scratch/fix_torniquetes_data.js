const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== FIXING TORNIQUETES PRICES & ADDING COMPLETE CATALOG ===");

  // 1. Ensure category "Torniquetes y Control Peatonal" exists
  let category = await prisma.category.findFirst({
    where: { name: { contains: 'Torniquetes', mode: 'insensitive' } }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Torniquetes y Control Peatonal',
        slug: 'torniquetes-peatonales',
        description: 'Sistemas de torniquetes trípode, molinetes, puertas de vidrio flap/swing barrier y control de acceso peatonal.'
      }
    });
    console.log("Created Category: Torniquetes y Control Peatonal");
  } else {
    console.log("Found Category:", category.name, category.id);
  }

  // 2. Fix corrupted $2.73 price for Torniquete Horizontal DOS Puertas De Vidrio
  const p1 = await prisma.product.update({
    where: { id: "cmogieq5g000e7pawjz7og6ml" },
    data: {
      sku: "TRN-DOBLE-VIDRIO-V2",
      price: 1650.00,
      compareAtPrice: 1980.00,
      stock: 6,
      isActive: true,
      isDeleted: false,
      categoryId: category.id
    }
  });
  console.log(`✅ FIXED Product [${p1.id}]: "${p1.name}" -> NEW PRICE: $${p1.price}`);

  // 3. Fix corrupted $36.75 price for TORNIQUETE CON 2 FR1200 + 1 INBIO260
  const p2 = await prisma.product.update({
    where: { id: "cmogi1xws00d9cuy7sqq4usfk" },
    data: {
      price: 1280.00,
      compareAtPrice: 1550.00,
      stock: 8,
      isActive: true,
      isDeleted: false,
      categoryId: category.id
    }
  });
  console.log(`✅ FIXED Product [${p2.id}]: "${p2.name}" -> NEW PRICE: $${p2.price}`);

  // 4. Update category for sensor, solenoid, and bracket
  await prisma.product.updateMany({
    where: {
      id: { in: ["cmogihbgf000k7pawgp0sgrl0", "cmogigx1e000j7pawrdnv8cjl", "cmogihogr000l7paw1q1oc0d7"] }
    },
    data: { categoryId: category.id, isActive: true, isDeleted: false }
  });
  console.log("✅ Updated category for turnstile accessories and parts.");

  // 5. Upsert additional complete Turnstile systems
  const extraTurnstiles = [
    {
      sku: "ZK-TS1000-PRO",
      name: "Torniquete Peatonal Trípode Semi-Automático ZKTeco TS1000 Pro",
      description: "Torniquete trípode compacto en acero inoxidable SUS304 para control de acceso peatonal en oficinas, gimnasios e industrias. Brazo colapsable en emergencias.",
      price: 720.00,
      compareAtPrice: 890.00,
      stock: 12,
      provider: "ZKTeco Ecuador",
      images: JSON.stringify(["https://www.sisegusa.com/web/image/product.template/3254/image_512"])
    },
    {
      sku: "ZK-FBL4000-PRO",
      name: "Torniquete Peatonal Flap Barrier Inoxidable ZKTeco FBL4000",
      description: "Barrera de aletas de acrílico retráctiles de alta velocidad con sensores infrarrojos anti-aplastamiento y paso fluido bi-direccional.",
      price: 1850.00,
      compareAtPrice: 2200.00,
      stock: 5,
      provider: "ZKTeco Ecuador",
      images: JSON.stringify(["https://i0.wp.com/cronte.net/wp-content/uploads/2023/03/1-1.png?fit=1000%2C1000&ssl=1"])
    },
    {
      sku: "ZK-FHT2300",
      name: "Torniquete de Cuerpo Entero (Full Height Turnstile) ZKTeco FHT2300",
      description: "Molinete de seguridad de máxima altura rotor 3 brazos para zonas de alta seguridad, estadios e instalaciones militares. Acero inoxidable de alta resistencia.",
      price: 2950.00,
      compareAtPrice: 3400.00,
      stock: 3,
      provider: "ZKTeco Ecuador",
      images: JSON.stringify(["https://i0.wp.com/cronte.net/wp-content/uploads/2023/03/2-1.png?fit=1000%2C1000&ssl=1"])
    },
    {
      sku: "TRN-TRIPODE-304",
      name: "Molinete de Acceso Peatonal Trípode Bidireccional Acero 304 con Display LED",
      description: "Molinete de paso alto rendimiento con pictograma LED indicador de paso y compatibilidad con cualquier sistema RFID o Biométrico.",
      price: 650.00,
      compareAtPrice: 790.00,
      stock: 15,
      provider: "ATOMIC Security",
      images: JSON.stringify(["https://i0.wp.com/cronte.net/wp-content/uploads/2023/03/3-1.png?fit=1000%2C1000&ssl=1"])
    },
    {
      sku: "TRN-SWING-SPEED",
      name: "Torniquete de Cristal Swing Barrier Biométrico de Alta Velocidad",
      description: "Puerta batiente de cristal templado elegante para vestíbulos corporativos con integrador de huella dactilar, facial y código QR.",
      price: 2100.00,
      compareAtPrice: 2500.00,
      stock: 4,
      provider: "ATOMIC Security",
      images: JSON.stringify(["https://i0.wp.com/cronte.net/wp-content/uploads/2023/03/1-1.png?fit=1000%2C1000&ssl=1"])
    }
  ];

  for (const t of extraTurnstiles) {
    const existing = await prisma.product.findFirst({ where: { sku: t.sku } });
    if (!existing) {
      await prisma.product.create({
        data: {
          sku: t.sku,
          name: t.name,
          description: t.description,
          price: t.price,
          compareAtPrice: t.compareAtPrice,
          stock: t.stock,
          provider: t.provider,
          categoryId: category.id,
          images: t.images,
          isActive: true,
          isDeleted: false
        }
      });
      console.log(`✅ Inserted turnstile model: [${t.sku}] ${t.name}`);
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          price: t.price,
          compareAtPrice: t.compareAtPrice,
          isActive: true,
          isDeleted: false,
          categoryId: category.id
        }
      });
      console.log(`✅ Updated existing turnstile model: [${t.sku}] ${t.name}`);
    }
  }

  console.log("✨ ALL TORNIQUETES FIXED AND EXPANDED SUCCESSFULLY!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
