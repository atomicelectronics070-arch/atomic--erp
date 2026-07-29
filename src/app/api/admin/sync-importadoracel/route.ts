import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MARGEN = 0.15; // 15%

const IMPORTADORA_CELL_PRODUCTS = [
  {
    name: 'Honor Magic 7 Lite 5G',
    sku: 'HONOR-MAGIC-7-LITE',
    costPrice: 380.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2025/02/Importadora-Cel-Honor-Magic-7-Lite-1.jpg',
      'https://www.importadoracel.com/wp-content/uploads/2025/02/Importadora-Cel-Honor-Magic-7-Lite-2.jpg',
      'https://www.importadoracel.com/wp-content/uploads/2025/02/Importadora-Cel-Honor-Magic-7-Lite-3.jpg'
    ]),
    description: `<h2>Honor Magic 7 Lite 5G</h2>
<p>El Honor Magic 7 Lite 5G combina una pantalla ultrarresistente AMOLED de 6.78 pulgadas con tasa de refresco a 120Hz, procesador Snapdragon 6 Gen 1 de alto rendimiento y una impresionante super batería de 6600 mAh.</p>
<h3>Características Principales</h3>
<ul>
<li>Pantalla curva AMOLED de 6.78" 120Hz con protección anticaídas</li>
<li>Procesador Qualcomm Snapdragon 6 Gen 1 (4nm)</li>
<li>Batería masiva de 6600 mAh con carga ultra rápida de 66W</li>
<li>Cámara principal Ultra-Clara de 108 MP + 5 MP Gran Angular</li>
<li>Cámara frontal de 16 MP con modo retrato avanzado</li>
<li>8GB de RAM (+8GB RAM Turbo) y 256GB / 512GB de almacenamiento</li>
<li>Resistencia al agua y polvo con certificación IP64</li>
<li>Desbloqueo facial y lector de huellas dactilares integrado en pantalla</li>
</ul>`,
    specs: JSON.stringify({
      pantalla: '6.78" AMOLED 120Hz Curved Display',
      procesador: 'Qualcomm Snapdragon 6 Gen 1 (4nm)',
      ram: '8GB + 8GB RAM Turbo',
      almacenamiento: '256GB / 512GB ROM',
      camara_trasera: '108 MP (Principal) + 5 MP (Ultra Gran Angular)',
      camara_frontal: '16 MP',
      bateria: '6600 mAh con Carga Rápida 66W',
      sistema: 'Android 14 / MagicOS 8.0',
      proteccion: 'Certificación IP64 (resistencia al polvo y salpicaduras)',
      seguridad: 'Lector de huella bajo pantalla + Desbloqueo facial',
      conectividad: '5G NR, Wi-Fi Dual Band, Bluetooth 5.1, NFC, USB Type-C',
    }),
    stock: 15,
  },
  {
    name: 'Honor Magic 8 Lite 5G',
    sku: 'HONOR-MAGIC-8-LITE',
    costPrice: 410.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2025/02/Importadora-Cel-Honor-Magic-7-Lite-2.jpg'
    ]),
    description: `<h2>Honor Magic 8 Lite 5G</h2>
<p>Edición avanzada de la serie Magic con procesador optimizado, mayor rendimiento multitarea y pantalla AMOLED antirreflectante de alta precisión de color.</p>`,
    specs: JSON.stringify({
      pantalla: '6.78" AMOLED 120Hz',
      procesador: 'Snapdragon 6 Gen 1 (2.2 GHz)',
      ram: '12GB RAM',
      almacenamiento: '512GB ROM',
      camara_trasera: '108 MP + 5 MP',
      bateria: '6600 mAh',
      sistema: 'Android 14 MagicOS',
    }),
    stock: 12,
  },
  {
    name: 'Honor 400 5G',
    sku: 'HONOR-400-5G',
    costPrice: 350.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2025/02/Importadora-Cel-Honor-Magic-7-Lite-3.jpg'
    ]),
    description: `<h2>Honor 400 5G</h2><p>Smartphone estilizado con cámara ultra nítida y pantalla fluida de 120Hz.</p>`,
    specs: JSON.stringify({
      pantalla: '6.7" OLED 120Hz',
      ram: '8GB RAM',
      almacenamiento: '256GB ROM',
      camara: '108 MP',
      bateria: '5000 mAh',
    }),
    stock: 10,
  },
  {
    name: 'Huawei Nova 8i',
    sku: 'HUAWEI-NOVA-8I',
    costPrice: 280.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2024/03/Importadora-Cel-Vivo-Y30-3.jpg'
    ]),
    description: `<h2>Huawei Nova 8i</h2><p>Diseño premium con cámara cuádruple de 64MP y carga rápida SuperCharge de 66W.</p>`,
    specs: JSON.stringify({
      pantalla: '6.67" FHD+',
      ram: '8GB RAM',
      almacenamiento: '128GB ROM',
      camara: '64 MP Cuádruple',
      bateria: '4300 mAh 66W SuperCharge',
    }),
    stock: 8,
  },
  {
    name: 'Infinix Hot 60 Pro',
    sku: 'INFINIX-HOT-60-PRO',
    costPrice: 190.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2025/07/Importadora-Cel-infinix-hot-60i-6.jpg'
    ]),
    description: `<h2>Infinix Hot 60 Pro</h2><p>Smartphone gamer accesible con pantalla de 120Hz y batería de larga duración.</p>`,
    specs: JSON.stringify({
      pantalla: '6.78" FHD+ 120Hz',
      ram: '8GB RAM',
      almacenamiento: '256GB ROM',
      bateria: '5000 mAh',
    }),
    stock: 15,
  },
  {
    name: 'Infinix Hot 60 Pro Plus',
    sku: 'INFINIX-HOT-60-PRO-PLUS',
    costPrice: 220.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2025/07/Importadora-Cel-infinix-hot-60i-6-600x600.jpg'
    ]),
    description: `<h2>Infinix Hot 60 Pro Plus</h2><p>Rendimiento superior con diseño ultra delgado y procesador de alta eficiencia.</p>`,
    specs: JSON.stringify({
      pantalla: '6.78" AMOLED 120Hz',
      ram: '8GB + 8GB Virtual',
      almacenamiento: '256GB ROM',
      bateria: '5000 mAh',
    }),
    stock: 12,
  },
  {
    name: 'Infinix Hot 60i',
    sku: 'INFINIX-HOT-60I',
    costPrice: 140.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2025/07/Importadora-Cel-infinix-hot-60i-6.jpg'
    ]),
    description: `<h2>Infinix Hot 60i</h2><p>Smartphone económico de gran batería y pantalla de 90Hz.</p>`,
    specs: JSON.stringify({
      pantalla: '6.6" HD+ 90Hz',
      ram: '4GB RAM',
      almacenamiento: '128GB ROM',
      bateria: '5000 mAh',
    }),
    stock: 20,
  },
  {
    name: 'Samsung Galaxy A17 4G/5G',
    sku: 'SAMSUNG-A17',
    costPrice: 225.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2026/03/a17-gris.jpg'
    ]),
    description: `<h2>Samsung Galaxy A17</h2><p>Pantalla Super AMOLED de 6.7", cámara cuádruple y respaldo garantizado por Samsung.</p>`,
    specs: JSON.stringify({
      pantalla: '6.7" Super AMOLED 90Hz',
      ram: '6GB RAM',
      almacenamiento: '128GB ROM',
      camara: '50 MP Cuádruple',
      bateria: '5000 mAh',
    }),
    stock: 15,
  },
  {
    name: 'Samsung Galaxy A07',
    sku: 'SAMSUNG-A07',
    costPrice: 150.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2026/04/a07-gris-300x300.jpg'
    ]),
    description: `<h2>Samsung Galaxy A07</h2><p>Calidad Samsung al mejor precio con batería de 5000 mAh y pantalla HD+.</p>`,
    specs: JSON.stringify({
      pantalla: '6.5" HD+',
      ram: '4GB RAM',
      almacenamiento: '64GB ROM',
      bateria: '5000 mAh',
    }),
    stock: 20,
  },
  {
    name: 'Wiko T3',
    sku: 'WIKO-T3',
    costPrice: 120.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2024/03/Importadora-Cel-Vivo-Y30-3.jpg'
    ]),
    description: `<h2>Wiko T3</h2><p>Dispositivo accesible con triple cámara y batería de larga duración.</p>`,
    specs: JSON.stringify({
      pantalla: '6.6" HD+',
      ram: '4GB RAM',
      almacenamiento: '128GB ROM',
      bateria: '5000 mAh',
    }),
    stock: 10,
  },
  {
    name: 'Blackview A100',
    sku: 'BLACKVIEW-A100',
    costPrice: 145.00,
    images: JSON.stringify([
      'https://www.importadoracel.com/wp-content/uploads/2024/08/Importadora-Cel-BlckView-A100-1.jpg'
    ]),
    description: `<h2>Blackview A100</h2><p>Smartphone de alta velocidad de enfoque fotográfico y cuerpo ultradelgado.</p>`,
    specs: JSON.stringify({
      pantalla: '6.67" FHD+',
      ram: '6GB RAM',
      almacenamiento: '128GB ROM',
      bateria: '4680 mAh',
    }),
    stock: 10,
  },
];

export async function GET() {
  try {
    let categoria = await prisma.category.findFirst({
      where: { name: { contains: 'celular', mode: 'insensitive' } },
    });
    if (!categoria) {
      categoria = await prisma.category.create({
        data: { name: 'Celulares y Tablets', slug: 'celulares-y-tablets' },
      });
    }

    const log: string[] = [];
    let updated = 0;
    let inserted = 0;

    for (const rawProd of IMPORTADORA_CELL_PRODUCTS) {
      const salePrice = Math.round(rawProd.costPrice * (1 + MARGEN) * 100) / 100;
      const compareAt = Math.round(salePrice * 1.15 * 100) / 100;

      let existing = await prisma.product.findFirst({
        where: { sku: rawProd.sku },
      }) ?? await prisma.product.findFirst({
        where: { name: { equals: rawProd.name, mode: 'insensitive' } },
      });

      const productData = {
        name: rawProd.name,
        sku: rawProd.sku,
        price: salePrice,
        compareAtPrice: compareAt,
        images: rawProd.images,
        description: rawProd.description,
        specs: rawProd.specs,
        stock: rawProd.stock,
        provider: 'Importadora Cell',
        categoryId: categoria.id,
        isDeleted: false,
      };

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: productData,
        });
        log.push(`UPDATED (Margen 15%): ${rawProd.name} (Costo: $${rawProd.costPrice} -> Venta: $${salePrice})`);
        updated++;
      } else {
        await prisma.product.create({
          data: productData,
        });
        log.push(`INSERTED (Margen 15%): ${rawProd.name} (Venta: $${salePrice})`);
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      margin_applied: '15%',
      inserted,
      updated,
      total_catalog: IMPORTADORA_CELL_PRODUCTS.length,
      log,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
