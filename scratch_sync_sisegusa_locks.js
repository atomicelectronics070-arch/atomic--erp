const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SISEGUSA_LOCKS = [
  {
    sku: "ZK-C-TL800",
    name: "Cerradura Digital ZKTeco TL800 con Videocámara, Pantalla LCD & WiFi ZSmart",
    price: 238.00,
    regular: 340.00,
    category: "facial",
    description: "Cerradura inteligente insignia ZKTeco TL800 con videocámara HD frontal, pantalla interior a color OLED, timbre inteligente, conectividad WiFi directa y cerradura de embutir automática de alta seguridad.",
    highlights: [
      "Videocámara HD frontal con visión nocturna infrarroja gran angular",
      "Pantalla interior a color para visualización de visitantes en tiempo real",
      "Envío de captura fotográfica y videollamada al smartphone al tocar el timbre",
      "Lector de huella digital capacitivo de alta precisión (<0.5s)",
      "Batería recargable de litio de 4200 mAh de larga duración"
    ],
    methods: ["Videocámara HD", "Huella Digital", "App ZSmart WiFi", "Contraseña Táctil", "Tarjetas RFID IC", "Llave Mecánica"],
    image: "/images/cerraduras/zkteco/zk-tl800.png"
  },
  {
    sku: "ZK-C-TL400B/L",
    name: "Cerradura Digital ZKTeco TL400B Izquierda con Huella, Bluetooth & Teclado",
    price: 175.00,
    regular: 250.00,
    category: "manija",
    description: "Cerradura inteligente para puerta principal ZKTeco TL400B con orientación izquierda, sensor de huella semiconductor, guía por voz en español, Bluetooth 4.0 con app móvil y cerradura de embutir de acero inoxidable.",
    highlights: [
      "Lector semiconductor FPC para 100 huellas digitales",
      "Conectividad Bluetooth 4.0 con administración desde app móvil ZKBioBT",
      "Guía interactiva por voz en español y pantalla OLED de administración",
      "Apertura de emergencia con llave oculta y puerto de alimentación 9V",
      "Grosor de puerta compatible: 35-50mm y 50-65mm"
    ],
    methods: ["Huella Semiconductora", "App Bluetooth", "Teclado Táctil", "Tarjetas Mifare", "Llave Oculta"],
    image: "/images/cerraduras/zkteco/zk-tl400b-left.png"
  },
  {
    sku: "ZK-C-TL400B/R",
    name: "Cerradura Digital ZKTeco TL400B Derecha con Huella, Bluetooth & Teclado",
    price: 175.00,
    regular: 250.00,
    category: "manija",
    description: "Cerradura inteligente para puerta principal ZKTeco TL400B con orientación derecha, sensor biométrico semiconductor, teclado táctil iluminado con contraseña antiespía y soporte para 100 usuarios.",
    highlights: [
      "Orientación de manija derecha para puertas de apertura derecha",
      "Sensor biométrico de huella digital de alta sensibilidad",
      "Capacidad para 100 huellas, 100 contraseñas y 100 tarjetas Mifare",
      "Alarma inteligente ante intentos de apertura no autorizados"
    ],
    methods: ["Huella Semiconductora", "App Bluetooth", "Teclado Táctil", "Tarjetas Mifare", "Llave Oculta"],
    image: "/images/cerraduras/zkteco/zk-tl400b-right.png"
  },
  {
    sku: "ZK-C-LH6000/L",
    name: "Cerradura Hotelera de Proximidad RFID ZKTeco LH6000 Izquierda",
    price: 89.90,
    regular: 128.43,
    category: "airbnb",
    description: "Cerradura electrónica hotelera ZKTeco LH6000 con lector de proximidad RFID Mifare 13.56MHz, cuerpo de acero inoxidable, memoria de auditoría para los últimos 224 eventos y compatibilidad con software hotelero ZKBioAccess.",
    highlights: [
      "Tecnología de tarjeta inteligente Mifare-1 de 13.56 MHz",
      "Cuerpo de acero inoxidable de alta durabilidad y resistencia al uso intensivo",
      "Mortise estándar americano con 5 pestillos de alta seguridad",
      "Almacenamiento de auditoría de los últimos 224 registros de apertura",
      "Alarma sonora de advertencia de batería baja y puerta mal cerrada"
    ],
    methods: ["Tarjeta RFID Mifare", "Llave Mecánica de Emergencia"],
    image: "/images/cerraduras/zkteco/zk-lh6000-left.png"
  },
  {
    sku: "ZK-C-LH6000/R",
    name: "Cerradura Hotelera de Proximidad RFID ZKTeco LH6000 Derecha",
    price: 89.90,
    regular: 128.43,
    category: "airbnb",
    description: "Cerradura electrónica para hoteles y departamentos de renta ZKTeco LH6000 con apertura derecha, cerradura mortise reforzada y lector sin contacto Mifare.",
    highlights: [
      "Orientación de manija derecha para habitaciones hoteleras",
      "Lector de proximidad ultra rápido sin contacto",
      "Diseño estilizado en acero inoxidable anticorrosión",
      "Compatible con tarjetas maestras de piso y de servicio"
    ],
    methods: ["Tarjeta RFID Mifare", "Llave Mecánica de Emergencia"],
    image: "/images/cerraduras/zkteco/zk-lh6000-right.png"
  },
  {
    sku: "ZK-C-LL-01",
    name: "Chapa Eléctrica ZKTeco LL-01 12VDC con Botón Pulsador Interior",
    price: 32.50,
    regular: 46.43,
    category: "edificios",
    description: "Cerradura eléctrica de sobreponer ZKTeco LL-01 de 12VDC construida en acero inoxidable pulido, con botón pulsador mecánico interior, cilindro exterior de latón y pestillo reversible para puertas peatonales.",
    highlights: [
      "Construcción íntegra en acero inoxidable resistente a la intemperie",
      "Botón mecánico de apertura interior integrado en la carcasa",
      "Alimentación 12VDC estándar para conexión a porteros, biométricos y receptores RF",
      "Pestillo reversible de latón macizo para puertas de apertura interior o exterior",
      "Incluye 3 llaves dentadas de seguridad exterior"
    ],
    methods: ["Pulso Eléctrico 12V", "Botón Mecánico Interior", "Llave Exterior"],
    image: "/images/cerraduras/zkteco/zk-ll-01.png"
  },
  {
    sku: "CS-DL05-R200-WBCP-GR",
    name: "Cerradura Digital Inteligente EZVIZ DL05 con Huella, Teclado & WiFi",
    price: 185.00,
    regular: 264.29,
    category: "manija",
    description: "Cerradura digital inteligente EZVIZ DL05 con conectividad WiFi nativa, sensor biométrico de huella dactilar, teclado táctil con código de privacidad, tarjetas de proximidad y gestión total desde la app EZVIZ.",
    highlights: [
      "Conexión WiFi directa e integración en el ecosistema de seguridad EZVIZ",
      "Lector de huella biométrico en el eje de la manija",
      "Códigos temporales y periódicos para visitas y personal",
      "Alertas instantáneas de intentos de manipulación o apertura forzada"
    ],
    methods: ["Huella Digital", "App EZVIZ", "Código Táctil", "Tarjetas RFID", "Llave Mecánica"],
    image: "/images/cerraduras/bp-quantum-lock.png"
  },
  {
    sku: "ZK-ML100",
    name: "Cerrojo Inteligente ZKTeco ML100 con Huella Digital & Teclado Táctil",
    price: 115.00,
    regular: 164.29,
    category: "cerrojo",
    description: "Cerrojo digital biométrico ZKTeco ML100 de alta seguridad con lector de huella dactilar, teclado iluminado y cerrojo motorizado de un solo paso.",
    highlights: [
      "Cerrojo motorizado de bloqueo automático",
      "Lector biométrico semiconductor de rápida respuesta",
      "Teclado numérico táctil retroiluminado",
      "Compatible con perforaciones estándar de cerrojo de 54mm"
    ],
    methods: ["Huella Digital", "Clave PIN", "Bluetooth Móvil", "Llaves"],
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yale-ydl120-1.png"
  }
];

async function main() {
  console.log('=== UPSERTING SISEGUSA / ZKTECO SMART LOCKS CATALOG INTO DB ===');

  let category = await prisma.category.findFirst({
    where: { name: { contains: 'Cerraduras', mode: 'insensitive' } }
  });

  let count = 0;
  for (const item of SISEGUSA_LOCKS) {
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { sku: item.sku },
          { name: { equals: item.name, mode: 'insensitive' } }
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
          compareAtPrice: item.regular,
          images: JSON.stringify([item.image]),
          categoryId: category?.id,
          provider: 'Sisegusa / ZKTeco',
          isActive: true,
          stock: 25,
          specs: JSON.stringify(item.highlights)
        }
      });
      console.log(`[UPDATED] ${item.sku} - ${item.name} -> $${item.price} USD (Reg: $${item.regular})`);
    } else {
      await prisma.product.create({
        data: {
          name: item.name,
          sku: item.sku,
          description: item.description,
          price: item.price,
          compareAtPrice: item.regular,
          images: JSON.stringify([item.image]),
          categoryId: category?.id,
          provider: 'Sisegusa / ZKTeco',
          isActive: true,
          stock: 25,
          specs: JSON.stringify(item.highlights)
        }
      });
      console.log(`[CREATED] ${item.sku} - ${item.name} -> $${item.price} USD (Reg: $${item.regular})`);
    }
    count++;
  }

  const total = await prisma.product.count({
    where: { 
      OR: [
        { provider: 'Sisegusa' },
        { provider: 'Sisegusa / ZKTeco' }
      ],
      isDeleted: false 
    }
  });

  console.log(`\nProcessed ${count} Sisegusa / ZKTeco locks. Total active Sisegusa products in DB: ${total}`);
}

main().catch(console.error).finally(() => process.exit(0));
