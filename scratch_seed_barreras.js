const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

const BARRERAS_DATA = [
  {
    sku: "BAR-ZK-BG1030",
    name: "Barrera Vehicular ZKTeco BG1030 (Brazo 3m, 1.5s Ajustable, 24V DC)",
    provider: "ZKTeco",
    price: 780.85,
    compareAtPrice: 1115.50,
    images: JSON.stringify(["/images/barreras/zkteco-bg1030-bg1045.jpg"]),
    description: "Barrera vehicular inteligente ZKTeco BG1030 de alta velocidad con brazo de 3 metros y tiempo de apertura regulable de 1.5s a 3s. Incorpora motor DC Brushless de 24V con batería de respaldo, dirección de brazo reversible y monitoreo digital de control.",
    stock: 12
  },
  {
    sku: "BAR-ZK-BG1045",
    name: "Barrera Vehicular ZKTeco BG1045 (Brazo 4.5m, 2.5s Ajustable, 24V DC)",
    provider: "ZKTeco",
    price: 792.35,
    compareAtPrice: 1131.93,
    images: JSON.stringify(["/images/barreras/zkteco-bg1030-bg1045.jpg"]),
    description: "Barrera vehicular inteligente ZKTeco BG1045 con brazo de 4.5 metros y tiempo de apertura regulable de 2.5s a 3s. Motor DC Brushless de 24V de alta eficiencia, batería de respaldo 24V, registro de entrada y salida, e integración con sistemas de control de acceso y peajes.",
    stock: 10
  },
  {
    sku: "BAR-DITEC-QIK-37",
    name: "Barrera Vehicular Ditec QIK 3.7M Alto Tráfico (Fabricación Italiana)",
    provider: "Ditec Italia",
    price: 1452.45,
    compareAtPrice: 2074.93,
    images: JSON.stringify(["/images/barreras/ditec-qik-37-60.jpg"]),
    description: "Barrera vehicular de uso intensivo Ditec QIK con brazo de 3.7 metros para más de 1.500.000 maniobras. Velocidad regulable de 2 segundos, apertura de 90 grados, batería de respaldo 24V y monitoreo digital. Ideal para centros comerciales y urbanizaciones de alto flujo.",
    stock: 8
  },
  {
    sku: "BAR-DITEC-QIK-60",
    name: "Barrera Vehicular Ditec QIK 6.0M Alto Tráfico (Fabricación Italiana)",
    provider: "Ditec Italia",
    price: 1676.70,
    compareAtPrice: 2395.29,
    images: JSON.stringify(["/images/barreras/ditec-qik-37-60.jpg"]),
    description: "Barrera vehicular de gran longitud Ditec QIK con brazo de 6.0 metros diseñada para más de 1.500.000 maniobras continuas. Motor 24V de servicio continuo, carcasa de acero galvanizado con recubrimiento epóxico y compatibilidad total con sistemas de control vehicular.",
    stock: 6
  },
  {
    sku: "BAR-GAREN-PRIME-300W",
    name: "Barrera Vehicular Garen Brasil Prime DC 300W 24V (Brazo 3.3m a 4.3m)",
    provider: "Garen Brasil",
    price: 1005.10,
    compareAtPrice: 1435.86,
    images: JSON.stringify(["/images/barreras/garen-prime-dc-300w.jpg"]),
    description: "Barrera vehicular direccionable izquierda/derecha Garen Brasil con motor DC de 300W a 24V y central Prime con display digital. Ciclos continuos a 4200 RPM con apertura rápida de 2.5s (3.3m) a 5s (4.3m). Apta para condominios, comercios e industrias.",
    stock: 10
  },
  {
    sku: "BAR-DAHUA-IPMECD-3040",
    name: "Barrera Vehicular Dahua 3 - 4 Metros IPMECD-1052 Brushless (3M Ciclos)",
    provider: "Dahua Technology",
    price: 657.28,
    compareAtPrice: 938.97,
    images: JSON.stringify(["/images/barreras/dahua-ipmecd-1052-3m-4m.jpg"]),
    description: "Barrera automática Dahua IPMECD-1052 con brazo ajustable de 3 a 4 metros. Motor DC Brushless con vida útil superior a 3.000.000 de ciclos y 800.000 ciclos en cambio de resorte. Estructura metálica anti-óxido IP54, soporte para radar, loop detector y tecnología Rolling Code.",
    stock: 14
  },
  {
    sku: "BAR-HIK-DS-TMG300-DL",
    name: "Barrera Vehicular Retráctil Hikvision DS-TMG300-DL 2 - 4 Metros Izquierda (CÓD: 14122)",
    provider: "Hikvision",
    price: 563.50,
    compareAtPrice: 805.00,
    images: JSON.stringify(["/images/barreras/hikvision-ds-tmg300-dl-retractil.jpg"]),
    description: "Barrera vehicular retráctil telescópica Hikvision DS-TMG300-DL con orientación izquierda y longitud regulable de 2 a 4 metros. Motor DC Brushless de 100W con 2.5 millones de ciclos (MCBF), apertura en 3-6s y peso de 26kg.",
    stock: 15
  },
  {
    sku: "BAR-HIK-DS-TMG300-DR-LED",
    name: "Barrera Vehicular Iluminada LED Hikvision DS-TMG300-DR/A/B Derecha (CÓD: 14124)",
    provider: "Hikvision",
    price: 598.00,
    compareAtPrice: 854.29,
    images: JSON.stringify(["/images/barreras/hikvision-ds-tmg300-dr-led.jpg"]),
    description: "Barrera vehicular con iluminación LED Hikvision DS-TMG300-DR con orientación derecha. Incorpora barra de luces LED de alta visibilidad nocturna, motor DC Brushless de 2.5M ciclos, 110VAC y apertura ultra suave en 3 a 6 segundos.",
    stock: 12
  },
  {
    sku: "BAR-HIK-DS-TMG300-DL-LED",
    name: "Barrera Vehicular Iluminada LED Hikvision DS-TMG300-DL/A/B Izquierda (CÓD: 14120)",
    provider: "Hikvision",
    price: 598.00,
    compareAtPrice: 854.29,
    images: JSON.stringify(["/images/barreras/hikvision-ds-tmg300-dl-led.jpg"]),
    description: "Barrera vehicular con iluminación LED Hikvision DS-TMG300-DL con orientación izquierda. Barra LED integrada en el brazo y señalización luminosa en el gabinete, motor DC Brushless de 2.5M ciclos MCBF y bajo consumo de 100W.",
    stock: 12
  },
  {
    sku: "BAR-S4A-BG005D-RET-DER",
    name: "Barrera Automática Highteck Retráctil 3 - 6 Metros Derecha S4A-BG005D con LED",
    provider: "Highteck / S4A",
    price: 586.50,
    compareAtPrice: 837.86,
    images: JSON.stringify(["/images/barreras/highteck-s4a-bg005d-retractil-der.jpg"]),
    description: "Barrera automática Highteck / S4A modelo S4A-BG005D con brazo retráctil telescópico regulable de 3 a 6 metros y orientación derecha. Incluye iluminación LED, 2 controles remotos adicionales, 4 tornillos expansores y motor DC Brushless de alto rendimiento.",
    stock: 16
  },
  {
    sku: "BAR-S4A-BG005D-RET-IZQ",
    name: "Barrera Automática Highteck Retráctil 3 - 6 Metros Izquierda S4A-BG005D (CÓD: 14171) con LED",
    provider: "Highteck / S4A",
    price: 586.50,
    compareAtPrice: 837.86,
    images: JSON.stringify(["/images/barreras/highteck-s4a-bg005d-retractil-izq.jpg"]),
    description: "Barrera automática Highteck / S4A modelo S4A-BG005D con brazo retráctil regulable de 3 a 6 metros y orientación izquierda. Más de 1 millón de ciclos de vida útil, iluminación LED superior, motor DC Brushless de 100-200W, 2 controles remotos y 4 expansores incluidos.",
    stock: 16
  },
  {
    sku: "BAR-S4A-BG005D-FIJ-IZQ",
    name: "Barrera Automática Highteck Brazo Fijo 3 Metros Izquierda S4A-BG005D (CÓD: 14174) con LED",
    provider: "Highteck / S4A",
    price: 483.00,
    compareAtPrice: 690.00,
    images: JSON.stringify(["/images/barreras/highteck-s4a-bg005d-fijo-izq.jpg"]),
    description: "Barrera automática de acceso vehicular Highteck / S4A con brazo fijo de aluminio reforzado de 3 metros y orientación izquierda. Motor DC Brushless de 110VAC, luz LED indicadora, 2 controles remotos y pernos de fijación incluidos.",
    stock: 18
  },
  {
    sku: "BAR-HIK-DS-TMG300-DR",
    name: "Barrera Vehicular Retráctil Hikvision DS-TMG300-DR 2 - 4 Metros Derecha (CÓD: 14121)",
    provider: "Hikvision",
    price: 563.50,
    compareAtPrice: 805.00,
    images: JSON.stringify(["/images/barreras/hikvision-ds-tmg300-dr-retractil.jpg"]),
    description: "Barrera vehicular retráctil telescópica Hikvision DS-TMG300-DR con orientación derecha y brazo regulable de 2 a 4 metros. 2,5 millones de ciclos MCBF, motor DC Brushless, apertura veloz de 3 a 6 segundos y pintura electrostática anti-corrosión.",
    stock: 15
  },
  {
    sku: "BAR-S4A-BG005D-FIJ-DER",
    name: "Barrera Automática Highteck Brazo Fijo 3 Metros Derecha S4A-BG005D (CÓD: 14164) con LED",
    provider: "Highteck / S4A",
    price: 483.00,
    compareAtPrice: 690.00,
    images: JSON.stringify(["/images/barreras/highteck-s4a-bg005d-fijo-der.jpg"]),
    description: "Barrera automática de acceso vehicular Highteck / S4A con brazo fijo de 3 metros y orientación derecha. Apertura rápida en 3-6s, luz LED nocturna, motor DC Brushless de 110V y más de 1.000.000 de ciclos de vida útil.",
    stock: 18
  },
  {
    sku: "BAR-DAHUA-IPMECD-4050",
    name: "Barrera Vehicular Dahua 4 - 5 Metros IPMECD-1052 Brushless (3M Ciclos)",
    provider: "Dahua Technology",
    price: 674.48,
    compareAtPrice: 963.54,
    images: JSON.stringify(["/images/barreras/dahua-ipmecd-1052-4m-5m.jpg"]),
    description: "Barrera automática Dahua IPMECD-1052 con brazo extendido de 4 a 5 metros para carriles amplios y transporte pesado. Motor DC Brushless con 3.000.000 de ciclos de vida útil, gabinete de alta protección IP54 y compatibilidad total con radares de detección vehicular.",
    stock: 10
  }
];

async function seedBarreras() {
  console.log('Seeding 15 barreras vehiculares in database...');

  const categoryId = 'cmoe777fa0003wwr9gaosfxgt'; // Barreras Vehiculares

  for (const item of BARRERAS_DATA) {
    const existing = await prisma.product.findFirst({
      where: { sku: item.sku }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          provider: item.provider,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          images: item.images,
          description: item.description,
          stock: item.stock,
          categoryId: categoryId
        }
      });
      console.log(`[UPDATED] ${item.sku} - ${item.name}`);
    } else {
      await prisma.product.create({
        data: {
          sku: item.sku,
          name: item.name,
          provider: item.provider,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          images: item.images,
          description: item.description,
          stock: item.stock,
          categoryId: categoryId
        }
      });
      console.log(`[CREATED] ${item.sku} - ${item.name}`);
    }
  }

  console.log('✅ Seeding completed successfully!');
}

seedBarreras().catch(console.error).finally(() => process.exit(0));
