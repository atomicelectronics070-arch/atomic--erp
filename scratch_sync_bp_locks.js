const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

const BP_LOCKS = [
  {
    sku: "BP03899",
    name: "Cerradura Electrónica Premium Voltex Lock",
    price: 69.99,
    compareAtPrice: 99.99,
    categoryName: "Cerraduras Inteligentes",
    provider: "BANCO DEL PERNO",
    image: "/images/cerraduras/bp/bp-voltex-lock-bp03899.png",
    description: "Cerradura digital inteligente Voltex Lock con cerrojo de sobreponer compacto, teclado numérico táctil anti-espía, lector de huella dactilar y Bluetooth para interiores, departamentos y oficinas.",
    specs: [
      "Teclado táctil iluminado de alta resistencia con códigos numéricos",
      "Sensor biométrico de huella digital de respuesta ultra rápida",
      "Conectividad Bluetooth integrada y gestión desde app móvil",
      "Bloqueo automático programable al cerrar la puerta",
      "Alimentación por 4 baterías AA con alerta de batería baja y puerto micro-USB de emergencia",
      "Ideal para puertas de madera y metal de 35mm a 55mm"
    ]
  },
  {
    sku: "BP03900",
    name: "Cerradura Electrónica Premium Plasma Lock",
    price: 79.99,
    compareAtPrice: 114.27,
    categoryName: "Cerraduras Inteligentes",
    provider: "BANCO DEL PERNO",
    image: "/images/cerraduras/bp/bp-plasma-lock-bp03900.png",
    description: "Cerradura electrónica de última generación Plasma Lock con manija reversible de alta resistencia, apertura 5 en 1 por huella, tarjeta RFID, clave, Bluetooth y llave mecánica.",
    specs: [
      "5 métodos de apertura: Huella dactilar, clave PIN, tarjeta RFID, Bluetooth y llave física",
      "Sensor semiconductor de huella integrado ergonómicamente en la manija",
      "Generación de claves temporales por horario para visitas y huéspedes Airbnb",
      "Cuerpo de aleación de zinc de alta durabilidad con acabado anticorrosión",
      "Registro de accesos en tiempo real mediante app móvil",
      "Compatible con embutidos estándar de 50mm a 70mm"
    ]
  },
  {
    sku: "BP03895",
    name: "Cerradura Electrónica Premium Hyperbolt Lock",
    price: 79.99,
    compareAtPrice: 114.27,
    categoryName: "Cerraduras Inteligentes",
    provider: "BANCO DEL PERNO",
    image: "/images/cerraduras/bp/bp-hyperbolt-lock-bp03895.png",
    description: "Cerradura digital de alta robustez Hyperbolt Lock con cerrojo reforzado de doble paso, manija ergonómica, biometría precisa y gestión móvil inteligente.",
    specs: [
      "Cerrojo mecánico reforzado de alta seguridad con pasadores dobles de acero",
      "Lector biométrico de huella en la manija para apertura en un solo movimiento fluido",
      "Teclado numérico táctil con tecnología de código señuelo contra mirones",
      "Tarjetas inteligentes de proximidad RFID incluidas",
      "Alarma disuasoria ante forcejeo o intentos fallidos de clave",
      "Respaldo de emergencia mediante cilindro oculto y llaves computarizadas"
    ]
  },
  {
    sku: "BP03897",
    name: "Cerradura Electrónica Premium Ionsecure Lock",
    price: 109.99,
    compareAtPrice: 157.13,
    categoryName: "Cerraduras Inteligentes",
    provider: "BANCO DEL PERNO",
    image: "/images/cerraduras/bp/bp-ionsecure-lock-bp03897.png",
    description: "Cerradura inteligente tope de gama Ionsecure Lock con cámara HD integrada, pantalla interior a color, sensor de huella biométrica, teclado táctil y conectividad WiFi remota.",
    specs: [
      "Videocámara exterior HD integrada para ver a quién toca a la puerta",
      "Pantalla interior a color para visualización clara desde el interior de la casa",
      "Envío de alertas fotográficas y videollamada al celular al pulsar el timbre",
      "Sensor biométrico de huella digital de grado bancario",
      "Teclado táctil retroiluminado con soporte de contraseñas dinámicas",
      "Batería recargable de litio de larga duración con aviso de recarga"
    ]
  },
  {
    sku: "BP03896",
    name: "Cerradura Electrónica Premium Quantum Lock",
    price: 99.99,
    compareAtPrice: 142.84,
    categoryName: "Cerraduras Inteligentes",
    provider: "BANCO DEL PERNO",
    image: "/images/cerraduras/bp/bp-quantum-lock-bp03896.png",
    description: "Cerradura electrónica de diseño arquitectónico Quantum Lock con perfil estilizado delgado, ideal para puertas de aluminio, perfiles angostos, madera o metal.",
    specs: [
      "Perfil ultra delgado estilizado especial para perfiles de aluminio europeo y puertas de madera fina",
      "Lector biométrico semiconductor en la empuñadura de rápida respuesta (<0.3s)",
      "Teclado táctil vertical numérico iluminado",
      "Tarjetas de proximidad IC Card de alta frecuencia",
      "Módulo Bluetooth compatible con gateway WiFi para control desde cualquier parte del mundo",
      "Mortise de perfil estrecho de acero inoxidable SUS304"
    ]
  },
  {
    sku: "BP03898",
    name: "Cerradura Electrónica Premium Nova Lock",
    price: 129.99,
    compareAtPrice: 185.70,
    categoryName: "Cerraduras Inteligentes",
    provider: "BANCO DEL PERNO",
    image: "/images/cerraduras/bp/bp-nova-lock-bp03898.png",
    description: "Cerradura digital de lujo Nova Lock con motorización automática, manija integrada de diseño italiano, teclado táctil de vidrio templado y máxima seguridad para puertas principales.",
    specs: [
      "Diseño arquitectónico de lujo con panel de vidrio templado negro 2.5D",
      "Mecanismo de cierre motorizado 100% automático al cerrar la puerta",
      "Sensor biométrico FPC sueco de alta resolución para huellas dactilares",
      "Gestión remota por app con historial de aperturas y notificaciones en tiempo real",
      "Mortise electrónico de 4 pasadores macizos de alta seguridad",
      "Llaves mecánicas maestras de seguridad y puerto USB-C de respaldo"
    ]
  }
];

async function main() {
  console.log('=== SYNCING ALL 6 BANCO DEL PERNO (BP) LOCKS TO DATABASE ===');

  let cat = await prisma.category.findFirst({
    where: { 
      OR: [
        { name: { contains: 'Cerraduras', mode: 'insensitive' } },
        { name: { contains: 'Cerradura', mode: 'insensitive' } }
      ]
    }
  });

  for (const item of BP_LOCKS) {
    const existing = await prisma.product.findFirst({
      where: { 
        OR: [
          { sku: item.sku },
          { name: { contains: item.sku, mode: 'insensitive' } }
        ]
      }
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
          images: JSON.stringify([item.image]),
          categoryId: cat ? cat.id : existing.categoryId,
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
          images: JSON.stringify([item.image]),
          categoryId: cat ? cat.id : null,
          provider: item.provider,
          isActive: true,
          stock: 50,
          specs: JSON.stringify(item.specs)
        }
      });
      console.log(`[CREATED] ${item.sku} - ${item.name} -> $${item.price} USD (Reg: $${item.compareAtPrice})`);
    }
  }

  console.log('All 6 Banco del Perno (BP) locks synced successfully!');
}

main().catch(console.error).finally(() => process.exit(0));
