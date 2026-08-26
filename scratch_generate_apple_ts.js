const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch_apple_catalog_clean.json', 'utf8'));

// Format products with complete specs
const products = raw.map((p, idx) => {
  let specs = {};
  let highlights = [];
  let badge = p.condition === 'Open Box Grado A+' ? '✨ OPEN BOX A+' : '🍎 100% ORIGINAL';
  let popular = idx < 12;

  if (p.family === 'mac') {
    specs = {
      "Procesador": p.chip,
      "Memoria Unificada": /24GB/i.test(p.name) ? "24 GB Unificada" : (/16GB/i.test(p.name) ? "16 GB Unificada" : "8 GB / 16 GB Unificada"),
      "Almacenamiento": /512GB/i.test(p.name) ? "512 GB SSD PCIe Ultrarrápido" : (/1TB/i.test(p.name) ? "1 TB SSD" : "256 GB SSD"),
      "Pantalla": /15\.3/i.test(p.name) ? "15.3\" Liquid Retina con True Tone" : (/14\.2/i.test(p.name) ? "14.2\" Liquid Retina XDR 120Hz" : (/24INCH/i.test(p.name) ? "24\" 4.5K Retina Display" : "13.6\" Liquid Retina Display")),
      "Sistema Operativo": "macOS Sequoia con Apple Intelligence",
      "Batería / Autonomía": /imac|mini/i.test(p.name) ? "Alimentación de Corriente 110V/220V" : "Hasta 18 - 22 Horas de Batería",
      "Puertos": /3USB-C/i.test(p.name) ? "3x Thunderbolt / USB-C 4 + MagSafe 3" : "2x Thunderbolt 4 / USB-C + MagSafe 3 + Jack 3.5mm",
      "Seguridad": "Touch ID Integrado en Teclado Magic Keyboard"
    };
    highlights = [
      `Potente procesador ${p.chip} con arquitectura de memoria unificada de ultra baja latencia`,
      "Diseño térmico silencioso sin ventiladores en modelos Air o refrigeración activa en Pro",
      "Pantalla Retina de alta resolución con gama de colores P3 y 500 nits de brillo",
      "Cámara FaceTime HD 1080p y sistema de audio de 4 a 6 bocinas espaciales"
    ];
  } else if (p.family === 'iphone') {
    specs = {
      "Procesador": p.chip,
      "Almacenamiento": /512GB/i.test(p.name) ? "512 GB NVMe" : (/256GB/i.test(p.name) ? "256 GB NVMe" : "128 GB NVMe"),
      "Pantalla": /Pro Max|6\.9/i.test(p.name) ? "6.9\" Super Retina XDR OLED ProMotion 120Hz" : (/Pro|6\.3/i.test(p.name) ? "6.3\" / 6.1\" Super Retina XDR OLED 120Hz" : "6.1\" Super Retina XDR OLED"),
      "Cámaras": /Pro/i.test(p.name) ? "Sistema Triple 48MP Fusión + Teleobjetivo 5x Óptico + Ultra Gran Angular" : "Sistema Dual 48MP Fusión + Ultra Gran Angular con Modo Noche",
      "Conectividad": "5G Homologado Ecuador (Claro, Movistar, CNT) + Wi-Fi 7 / 6E + Bluetooth 5.3",
      "Conector": /15|16|17/i.test(p.name) ? "USB-C Estándar Universal con carga rápida" : "Puerto Lightning Apple",
      "Seguridad": "Face ID con sensor TrueDepth biométrico 3D",
      "Resistencia": "Ceramic Shield de última generación y protección al agua IP68"
    };
    highlights = [
      `Chip de vanguardia ${p.chip} preparado para Apple Intelligence`,
      "Dynamic Island interactiva para notificaciones en vivo y música",
      "Fotografía computacional de 48 MP con retratos automáticos de última generación",
      "Batería de larga duración para todo el día y carga inalámbrica MagSafe"
    ];
  } else if (p.family === 'ipad') {
    specs = {
      "Procesador": "Apple A16 Bionic / Apple Silicon M-Series",
      "Pantalla": "11\" Liquid Retina Display con True Tone y revestimiento antirreflejo",
      "Almacenamiento": /512GB/i.test(p.name) ? "512 GB" : (/256GB/i.test(p.name) ? "256 GB" : "128 GB / 64 GB"),
      "Compatibilidad": "Apple Pencil (2ª Gen / USB-C) y Magic Keyboard Folio",
      "Cámaras": "Cámara trasera 12MP 4K y frontal 12MP Ultra Gran Angular con Encuadre Centrado",
      "Audio": "Bocinas estéreo en orientación horizontal con sonido envolvente",
      "Conector": "USB-C para carga ultrarrápida y transferencia de accesorios"
    };
    highlights = [
      "Pantalla Liquid Retina brillante de 11 pulgadas de borde a borde",
      "Compatible con Apple Pencil para dibujo profesional, notas y diseño",
      "iPadOS con multitarea avanzada Stage Manager y apps profesionales",
      "Batería para todo el día con hasta 10 horas de navegación Wi-Fi continua"
    ];
  } else if (p.family === 'watch') {
    specs = {
      "Procesador": "Chip S8 SiP de doble núcleo de 64 bits",
      "Pantalla": "Retina OLED LTPO de hasta 1000 nits",
      "Caja": "Aluminio 100% reciclado 40mm / 44mm con cristal Ion-X",
      "Sensores": "Frecuencia Cardíaca óptica, Detección de Caídas y Choques de Auto",
      "Resistencia": "Resistente al agua hasta 50 metros (Apto para natación)",
      "Batería": "Hasta 18 horas de uso continuo con modo de Ahorro de Batería"
    };
    highlights = [
      "Monitoreo constante de salud cardiovascular, sueño y entrenamientos",
      "Llamadas y respuestas a mensajes directo desde la muñeca",
      "Detección de Choques graves y Caídas con llamada automática a Emergencias",
      "Integración total con iPhone y app Apple Fitness+"
    ];
  } else if (p.family === 'audio') {
    specs = {
      "Chip de Audio": "Apple H1 / H2 con ecualización adaptativa en tiempo real",
      "Cancelación de Ruido": "Cancelación Activa de Ruido (ANC) y Modo Ambiente Pro",
      "Audio Espacial": "Audio Espacial personalizado con seguimiento dinámico de la cabeza",
      "Autonomía": "Hasta 6 horas por carga y 30 horas con el estuche MagSafe USB-C",
      "Resistencia": "Clasificación IP54 resistente al sudor y al agua"
    };
    highlights = [
      "Sonido de alta fidelidad con cancelación de ruido de nivel superior",
      "Cambio automático entre iPhone, iPad y Mac sin desconectar",
      "Estuche MagSafe con bocina integrada y chip U1 para búsqueda precisa Find My"
    ];
  } else {
    specs = {
      "Compatibilidad": "Dispositivos Apple iPhone, iPad, Mac y Apple Watch",
      "Tecnología": /magsafe/i.test(p.name) ? "Alineación Magnética MagSafe Qi / Qi2" : (/airtag|finder/i.test(p.name) ? "Red Apple Find My / Buscar de Apple (iOS)" : "Carga rápida USB-C Power Delivery"),
      "Material": "Materiales premium de alta durabilidad y resistencia al uso diario",
      "Garantía": "Garantía oficial ATOMIC y certificación de seguridad eléctrica"
    };
    highlights = [
      "Accesorio 100% compatible y homologado para el ecosistema Apple",
      "Carga rápida y segura con protección contra sobretensión y temperatura",
      "Diseño compacto y elegante para viajes y oficina"
    ];
  }

  return {
    ...p,
    badge,
    popular,
    specs,
    highlights
  };
});

const fileContent = `// Auto-generated Apple Products dataset for ATOMIC Apple Store Ecuador
export interface AppleProduct {
  id: string
  name: string
  provider: string
  family: 'mac' | 'iphone' | 'ipad' | 'watch' | 'audio' | 'ecosistema' | 'accesorios'
  familyLabel: string
  chip: string
  condition: string
  priceBase: number
  priceWithVat: number
  compareAtPrice: number
  images: string[]
  mainImage: string
  description: string
  badge: string
  popular: boolean
  specs: { [key: string]: string }
  highlights: string[]
}

export const APPLE_PRODUCTS: AppleProduct[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync('src/app/web/apple/appleProductsData.ts', fileContent);
console.log('Successfully written src/app/web/apple/appleProductsData.ts with', products.length, 'products!');
