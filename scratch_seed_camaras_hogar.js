const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

const PRODUCTS = [
  {
    sku: "CAM-EZVIZ-H6C-3MP",
    name: "Cámara de Seguridad Wi-Fi EZVIZ H6C 3MP Básica 360° con Garantía de 2 Años",
    price: 44.99,
    compareAtPrice: 64.27,
    provider: "EZVIZ / Sisegusa",
    categoryName: "Cámaras de Seguridad",
    images: ["/images/camaras/camara-ezviz-h6c-3mp-basica-44.jpg", "/images/camaras/camaras-hogar-portada-4k.jpg"],
    description: "Transforma tu hogar o negocio con la tranquilidad que mereces. Nuestra cámara 100% Wi-Fi EZVIZ H6C 3MP ofrece vigilancia avanzada y sin complicaciones. Disfruta de monitoreo en tiempo real directamente desde tu celular, sin importar dónde te encuentres. Incluye Garantía Oficial ATOMIC de 2 Años.",
    specs: [
      "Resolución HD 3MP de alta claridad",
      "Visión panorámica motorizada de 360° con giro e inclinación",
      "Visión nocturna inteligente por infrarrojos hasta 10 metros",
      "Detección de movimiento con seguimiento automático de personas",
      "Comunicación bidireccional en tiempo real (micrófono y altavoz integrados)",
      "Modo de suspensión para privacidad total cuando estás en casa",
      "Ranura para tarjeta MicroSD de hasta 512GB y almacenamiento en nube",
      "Garantía oficial directa de 2 años con respaldo ATOMIC"
    ]
  },
  {
    sku: "CAM-EZVIZ-3K-AVANZADA",
    name: "Cámara de Seguridad Wi-Fi EZVIZ 3K Avanzada Visión Nocturna Color con Garantía de 2 Años",
    price: 64.99,
    compareAtPrice: 92.84,
    provider: "EZVIZ / Sisegusa",
    categoryName: "Cámaras de Seguridad",
    images: ["/images/camaras/camara-ezviz-3k-avanzada-64.jpg", "/images/camaras/camaras-hogar-portada-4k.jpg"],
    description: "SOLUCIÓN DE VIGILANCIA COMPLETA 3K: Esta cámara inteligente de alto rendimiento ofrece un monitoreo excepcional del interior de su hogar, oficina o negocio, brindando tranquilidad las 24 horas del día. Acceso remoto total desde su celular con visión nocturna a color y Garantía Oficial de 2 Años.",
    specs: [
      "Resolución Ultra Nítida 3K (5MP equivalente) para máximo detalle",
      "Visión panorámica 360° con control PTZ motorizado suave",
      "Visión nocturna a todo color con focos LED inteligentes",
      "Detección de movimiento inteligente y seguimiento de objetivos",
      "Audio bidireccional de alta fidelidad con cancelación de ruido",
      "Configuración sencilla Plug & Play en menos de 3 minutos",
      "Monitoreo 24/7 desde la app EZVIZ Home para iOS y Android",
      "Garantía oficial directa de 2 años con respaldo ATOMIC"
    ]
  },
  {
    sku: "CAM-EZVIZ-4K-PREMIUM",
    name: "Cámara de Seguridad Wi-Fi 4K Ultra HD Premium con IA & Seguimiento Inteligente (Garantía 2 Años)",
    price: 78.99,
    compareAtPrice: 112.84,
    provider: "EZVIZ / ZKTeco",
    categoryName: "Cámaras de Seguridad",
    images: ["/images/camaras/camara-ezviz-4k-premium-78.jpg", "/images/camaras/camaras-hogar-portada-4k.jpg"],
    description: "CÁMARA TOP DE GAMA 4K ULTRA HD ⭐ RECOMENDADA: Experimenta la máxima tranquilidad con tecnología de vanguardia. Cámaras 100% Wi-Fi con resolución 4K Ultra HD, detección humana con Inteligencia Artificial, visión nocturna a color y seguimiento inteligente 360°. Incluye Garantía Oficial de 2 Años.",
    specs: [
      "Máxima resolución 4K Ultra HD para lectura clara de rostros y detalles",
      "Inteligencia Artificial integrada: Detección precisa de formas humanas y mascotas",
      "Seguimiento automático inteligente 360° con zoom dinámico",
      "Visión nocturna a color de largo alcance con sensor Starlight y focos auxiliares",
      "Audio bidireccional premium con micrófono dual y altavoz de alta potencia",
      "Modo de privacidad de obturador físico / suspensión con un toque",
      "Almacenamiento dual: Tarjeta MicroSD hasta 512GB y EZVIZ CloudPlay",
      "Conexión Wi-Fi de alta estabilidad 2.4 GHz con antenas mejoradas",
      "Garantía oficial completa de 2 años y opción de instalación profesional"
    ]
  }
];

async function main() {
  console.log('=== UPSERTING CAMARAS HOGAR 4K / 3K / 3MP PRODUCTS INTO DB ===');

  let cat = await prisma.category.findFirst({
    where: { 
      OR: [
        { name: { contains: 'Cámaras', mode: 'insensitive' } },
        { name: { contains: 'Camaras', mode: 'insensitive' } },
        { name: { contains: 'Seguridad', mode: 'insensitive' } }
      ]
    }
  });

  if (!cat) {
    cat = await prisma.category.create({
      data: {
        name: "Cámaras de Seguridad",
        slug: "camaras-de-seguridad",
        description: "Cámaras de seguridad Wi-Fi inteligentes para hogar y empresas",
        image: "/images/camaras/camaras-hogar-portada-4k.jpg"
      }
    });
  }

  for (const item of PRODUCTS) {
    const existing = await prisma.product.findFirst({
      where: { sku: item.sku }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          sku: item.sku,
          description: item.description,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          images: JSON.stringify(item.images),
          categoryId: cat.id,
          provider: item.provider,
          isActive: true,
          stock: 50,
          specs: JSON.stringify(item.specs)
        }
      });
      console.log(`[UPDATED] ${item.sku} - ${item.name} -> $${item.price} USD (Reg: $${item.compareAtPrice})`);
    } else {
      await prisma.product.create({
        data: {
          name: item.name,
          sku: item.sku,
          description: item.description,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          images: JSON.stringify(item.images),
          categoryId: cat.id,
          provider: item.provider,
          isActive: true,
          stock: 50,
          specs: JSON.stringify(item.specs)
        }
      });
      console.log(`[CREATED] ${item.sku} - ${item.name} -> $${item.price} USD (Reg: $${item.compareAtPrice})`);
    }
  }

  console.log('All 3 camera products seeded successfully into database!');
}

main().catch(console.error).finally(() => process.exit(0));
