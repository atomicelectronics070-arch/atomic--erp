const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CRONTE_SMART_LOCKS = [
  {
    name: "Cerradura Inteligente Facial 3D WiFi - Tuya Smart - Máxima Seguridad 5 Pistones",
    sku: "MAA-FACIAL-3D-5P",
    price: 137.99,
    regular: 197.13,
    weight: "3.5 kg",
    dimensions: "7.5 x 2.4 x 37.2 cm",
    category: "facial",
    description: "Cerradura inteligente Cronte Maadok con reconocimiento facial 3D estructurado en luz infrarroja, conectividad WiFi Tuya Smart, mirilla con cámara LCD y cerradura de embutir de alta seguridad con 5 pistones.",
    highlights: [
      "Reconocimiento facial 3D de alta precisión con cámara infrarroja",
      "Mirilla con cámara HD y pantalla LCD a color integrada",
      "Cuerpo de cerradura de embutir reforzado con 5 pistones de acero",
      "Apertura remota por app Tuya Smart / Smart Life",
      "Batería recargable de litio de larga duración"
    ],
    methods: ["Facial 3D", "Huella Digital", "App Tuya WiFi", "Contraseña", "Tarjeta IC", "Llave Mecánica"],
    image: "/images/cerraduras/bp-plasma-lock.png"
  },
  {
    name: "Cerradura Inteligente WiFi - Tuya Smart - 5 Pistones con Cámara & Mirilla LCD",
    sku: "MAA-CAM-5P-LCD",
    price: 140.00,
    regular: 200.00,
    weight: "3.5 kg",
    dimensions: "7.5 x 2.4 x 37.5 cm",
    category: "facial",
    description: "Cerradura inteligente Cronte con videocámara HD frontal y pantalla LCD interior. Envía foto y videollamada al smartphone cada vez que tocan el timbre.",
    highlights: [
      "Videocámara HD frontal con visión nocturna infrarroja",
      "Pantalla interior a color para visualización en tiempo real",
      "Cuerpo de 5 pistones de acero templado anti-apalancamiento",
      "Apertura remota al recibir solicitud de timbre en el celular"
    ],
    methods: ["Videocámara HD", "Huella Digital", "App Tuya", "Clave Táctil", "Tarjeta", "Llave"],
    image: "/categories/cerraduras-smart-y-accesos.png"
  },
  {
    name: "Cerradura Inteligente WiFi - Tuya Smart - 5 Pistones Push-Pull Automática",
    sku: "MAA-PUSHPULL-5P",
    price: 169.49,
    regular: 242.13,
    weight: "3.5 kg",
    dimensions: "7.5 x 2.4 x 37.2 cm",
    category: "manija",
    description: "Cerradura digital Push-Pull totalmente automática de Cronte Technology. El cerrojo motorizado se desbloquea y se abre con solo empujar o halar.",
    highlights: [
      "Mecanismo Push-Pull 100% motorizado y automático",
      "Lector de huella digital integrado en la manija ergonómica",
      "Bloqueo automático inmediato al cerrar la puerta",
      "Conexión WiFi directa sin gateways"
    ],
    methods: ["Push-Pull Automático", "Huella Digital", "App Tuya", "Contraseña", "Tarjeta", "Llave"],
    image: "/images/cerraduras/bp-quantum-lock.png"
  },
  {
    name: "Cerradura Inteligente WiFi Puerta Corrediza de Aluminio & Perfil Europeo",
    sku: "MAA-SLIM-ALUM-WIFI",
    price: 139.78,
    regular: 199.68,
    weight: "2.0 kg",
    dimensions: "3.0 x 2.4 x 27.0 cm",
    category: "cerrojo",
    description: "Cerradura digital ultra estrecha de Cronte para puertas corredizas, perfiles de aluminio y marcos metálicos delgados.",
    highlights: [
      "Diseño slimline ultra angosto para perfiles de aluminio y hierro",
      "Cerradura de gancho doble para puertas corredizas y batientes",
      "Conectividad WiFi Tuya Smart con claves temporales",
      "Resistencia a la intemperie IP65"
    ],
    methods: ["Huella Digital", "App Tuya WiFi", "Contraseña PIN", "Tarjetas RFID", "Llave"],
    image: "/images/cerraduras/bp-voltex-lock.webp"
  },
  {
    name: "Cerradura Inteligente WiFi - Tuya Smart - 5 Pistones Manija Reversible",
    sku: "MAA-MANIJA-5P",
    price: 89.80,
    regular: 128.28,
    weight: "3.5 kg",
    dimensions: "7.5 x 2.4 x 37.2 cm",
    category: "manija",
    description: "Cerradura de alta seguridad Cronte con manija ergonómica, lector semiconductor FPC y cuerpo de embutir de 5 pistones.",
    highlights: [
      "Manija reversible de acero inoxidable y aleación de zinc",
      "Lector de huella de alta velocidad (0.25 segundos)",
      "Historial de accesos en tiempo real con notificaciones al celular",
      "Alarma sonora ante intentos no autorizados"
    ],
    methods: ["Huella Ergonómica", "App Tuya", "Clave PIN Antiespía", "Tarjetas RFID", "Llave"],
    image: "/images/cerraduras/bp-plasma-lock.png"
  },
  {
    name: "Cerradura Inteligente WiFi - Tuya Smart - 2 Pistones Manija Negra",
    sku: "MAA-MANIJA-2P",
    price: 86.48,
    regular: 123.54,
    weight: "1.855 kg",
    dimensions: "8.0 x 5.0 x 25.0 cm",
    category: "manija",
    description: "Cerradura digital Cronte de 2 pistones con diseño moderno en negro mate, ideal para puertas de entrada principales e interiores.",
    highlights: [
      "Cuerpo compacto de alta resistencia en negro mate",
      "Teclado táctil retroiluminado con código antiespía",
      "Gestión remota por app Tuya Smart / Smart Life",
      "Modo paso libre para reuniones"
    ],
    methods: ["Huella Digital", "Clave Numérica", "App Tuya", "Tarjeta RFID", "Llave"],
    image: "/images/cerraduras/bp-plasma-lock.png"
  },
  {
    name: "Chapa Eléctrica Inteligente WiFi para Exterior - Tuya Smart con Huella & Control Remoto",
    sku: "MAA-CHAPA-EXT-WIFI",
    price: 127.95,
    regular: 182.78,
    dimensions: "8.5 x 28.0 x 21.5 cm",
    category: "edificios",
    description: "Chapa eléctrica inteligente de sobreponer para puertas exteriores, portones y rejas metálicas. Incluye teclado exterior táctil, lector de huella dactilar y control remoto inalámbrico.",
    highlights: [
      "Diseño sellado de sobreponer para exteriores e intemperie",
      "Lector de huella digital + teclado táctil exterior resistente a lluvia",
      "Incluye control remoto inalámbrico de largo alcance",
      "Apertura remota por app Tuya desde cualquier lugar",
      "Cilindro mecánico de alta seguridad con llaves de punto"
    ],
    methods: ["Huella Exterior", "App Tuya WiFi", "Control Remoto", "Clave PIN", "Tarjetas RFID", "Llave"],
    image: "/images/cerraduras/bp-plasma-lock.png"
  },
  {
    name: "Chapa Eléctrica Inteligente WiFi - Tuya Smart - Apertura Huella Exterior",
    sku: "MAA-CHAPA-HUELLA-EXT",
    price: 101.65,
    regular: 145.21,
    dimensions: "8.5 x 28.0 x 21.5 cm",
    category: "edificios",
    description: "Chapa de sobreponer inteligente para puertas metálicas y peatonales con lector biométrico impermeable.",
    highlights: [
      "Apta para portones residenciales y comerciales",
      "Teclado táctil impermeable con retroiluminación",
      "Registro de aperturas y notificaciones push",
      "Alimentación 12V con opción a respaldo de batería"
    ],
    methods: ["Huella Digital", "App Tuya", "Código PIN", "Tarjeta Mifare", "Llave"],
    image: "/images/cerraduras/bp-plasma-lock.png"
  },
  {
    name: "Cerradura Inteligente - Tuya Smart - WiFi - Puerta de Vidrio Templado con Pantalla",
    sku: "MAA-VIDRIO-WIFI-DISP",
    price: 111.62,
    regular: 159.45,
    weight: "0.99 kg",
    dimensions: "7.0 x 10.0 x 21.0 cm",
    category: "airbnb",
    description: "Cerradura digital de sobreponer para puertas de vidrio templado sin necesidad de perforar. Cuenta con pantalla OLED integrada y perno doble.",
    highlights: [
      "Instalación limpia por abrazadera a presión sin taladrar el vidrio",
      "Compatible con puertas de vidrio batientes y corredizas de 10 a 12mm",
      "Pantalla OLED para administración y visualización de fecha/hora",
      "Conectividad WiFi nativa Tuya Smart"
    ],
    methods: ["Huella Digital", "App Tuya WiFi", "Contraseña Táctil", "Tarjeta IC", "Control Remoto"],
    image: "/images/cerraduras/bp-quantum-lock.png"
  },
  {
    name: "Cerradura Inteligente - Tuya Smart - Bluetooth - Puerta de Vidrio",
    sku: "MAA-VIDRIO-BLE",
    price: 71.94,
    regular: 102.77,
    weight: "0.99 kg",
    dimensions: "7.0 x 10.0 x 21.0 cm",
    category: "airbnb",
    description: "Cerradura para puertas de vidrio templado con tecnología Bluetooth y lector de huella capacitivo.",
    highlights: [
      "Fijación rápida por presión sin perforación",
      "Lector de huella de alta precisión",
      "Control de accesos y registros por app Bluetooth",
      "Perno de acero templado de alta resistencia"
    ],
    methods: ["Huella Digital", "App Bluetooth", "Clave PIN", "Tarjeta RFID"],
    image: "/images/cerraduras/bp-quantum-lock.png"
  },
  {
    name: "Cerradura Inteligente WiFi - Tuya Smart - Apertura Huella en Pomo",
    sku: "MAA-POMO-HUELLA-WIFI",
    price: 58.56,
    regular: 83.65,
    category: "airbnb",
    description: "Pomo inteligente biométrico Cronte para recámaras, consultorios y oficinas privadas. Sustituye cualquier pomo estándar.",
    highlights: [
      "Sensor biométrico integrado directamente en el centro del pomo",
      "Conexión WiFi directa para control y apertura remota",
      "Reemplazo directo en perforaciones de 54mm sin obras",
      "Autonomía de hasta 12 meses con pilas estándar AAA"
    ],
    methods: ["Huella en Pomo", "App Tuya WiFi", "Clave Numérica", "Llave Mecánica"],
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yale-ydl120-1.png"
  },
  {
    name: "Cerradura Bluetooth + WiFi - Clave - Llave - App Tuya Smart Pomo Teclado",
    sku: "MAA-POMO-TECLADO-WIFI",
    price: 67.78,
    regular: 96.82,
    weight: "1.019 kg",
    dimensions: "8.0 x 2.0 x 15.0 cm",
    category: "airbnb",
    description: "Cerradura de pomo con teclado táctil numérico retroiluminado, lector de huella y conectividad Tuya Smart.",
    highlights: [
      "Teclado táctil completo integrado en el cuerpo del pomo",
      "Códigos temporales y dinámicos para invitados",
      "Puerto de emergencia micro-USB / Tipo C",
      "Ideal para dormitorios y departamentos de renta"
    ],
    methods: ["Huella Digital", "Código PIN Táctil", "App Tuya", "Llave"],
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yale-ydl120-1.png"
  },
  {
    name: "Candado Inteligente App Tuya Smart Bluetooth con Lector de Huella",
    sku: "MAA-CANDADO-SMART-BLE",
    price: 32.66,
    regular: 46.65,
    category: "airbnb",
    description: "Candado inteligente de alta seguridad con lector de huella digital y administración por app móvil Tuya Smart.",
    highlights: [
      "Apertura en 0.2 segundos con sensor biométrico",
      "Cuerpo de aleación de zinc y arco de acero inoxidable",
      "Batería recargable USB de larga duración",
      "Resistente a la intemperie IP65"
    ],
    methods: ["Huella Dactilar", "App Tuya Bluetooth"],
    image: "/images/cerraduras/bp-quantum-lock.png"
  },
  {
    name: "Chapa Eléctrica con Botón para Puerta Peatonal de Sobreponer",
    sku: "MAA-CHAPA-BOTON-EXT",
    price: 26.65,
    regular: 38.07,
    category: "edificios",
    description: "Cerradura eléctrica de sobreponer tradicional para portones peatonales, conjuntos residenciales y rejas.",
    highlights: [
      "Botón de apertura mecánica interior",
      "Bobina eléctrica de 12V DC/AC para intercomunicadores",
      "Cilindro de latón con 3 llaves dentadas",
      "Carcasa de acero niquelado resistente a la corrosión"
    ],
    methods: ["Pulsador Eléctrico 12V", "Botón Mecánico Interior", "Llave Exterior"],
    image: "/images/cerraduras/yale/yale-cerradura-el-ctrica-678-con-bot-n-1.png"
  }
];

async function main() {
  console.log('=== UPSERTING CRONTE SMART LOCKS CATALOG INTO DB ===');

  let category = await prisma.category.findFirst({
    where: { name: { contains: 'Cerraduras', mode: 'insensitive' } }
  });

  let count = 0;
  for (const item of CRONTE_SMART_LOCKS) {
    const existing = await prisma.product.findFirst({
      where: {
        provider: 'Cronte Technology',
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
          provider: 'Cronte Technology',
          isActive: true,
          stock: 25,
          specs: JSON.stringify(item.highlights)
        }
      });
      console.log(`[UPDATED] ${item.name} -> $${item.price} USD (Reg: $${item.regular})`);
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
          provider: 'Cronte Technology',
          isActive: true,
          stock: 25,
          specs: JSON.stringify(item.highlights)
        }
      });
      console.log(`[CREATED] ${item.name} -> $${item.price} USD (Reg: $${item.regular})`);
    }
    count++;
  }

  const total = await prisma.product.count({
    where: { provider: 'Cronte Technology', isDeleted: false }
  });

  console.log(`\nProcessed ${count} Cronte smart locks. Total active Cronte products in DB: ${total}`);
}

main().catch(console.error).finally(() => process.exit(0));
