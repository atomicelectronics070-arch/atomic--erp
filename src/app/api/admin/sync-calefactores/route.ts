import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Margen comercial asignado: 15% sobre precio base del proveedor BP Ecuador
const MARGEN = 0.15; // 15%

const BP_CALEFACTORES_RAW = [
  {
    name: 'Calefactor de Ambientes Tipo Cilindro Base Black',
    sku: 'BPA0627',
    costPrice: 199.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2025/05/BPA0627-1.webp',
      'https://bpecuador.com/wp-content/uploads/2025/05/BPA0627-1-600x600.webp'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Cilindro Base Black</h2>
<p>Calefactor a gas de diseño cilíndrico con acabado negro martillado de alta durabilidad. Ideal para terrazas, patios, jardines y espacios semi-abiertos. Combina funcionalidad y estética industrial para ambientes modernos.</p>
<h3>Características</h3>
<ul>
<li>Encendedor de pulso confiable con sistema de protección de llama</li>
<li>Diseño portátil: se puede mover de forma flexible al exterior, patio o jardín</li>
<li>Puerta integrada en cámara del tanque para fácil colocación del cilindro de gas</li>
<li>Quemadores de acero inoxidable y rejilla de calefacción de doble manto</li>
<li>Revestimiento de polvo negro martillado de alta durabilidad</li>
<li>Válvula de gas sugerida: BP02417</li>
</ul>
<h3>Especificaciones Técnicas</h3>
<ul>
<li><strong>Color:</strong> Black (negro martillado)</li>
<li><strong>Forma:</strong> Cilindro</li>
<li><strong>Cualidad:</strong> Silencioso</li>
<li><strong>Tipo de montaje:</strong> Montaje en suelo</li>
<li><strong>Tipo de combustible:</strong> Gas de uso doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Área de calentamiento:</strong> 5 – 10 m²</li>
<li><strong>Presión de entrada válvula:</strong> 7.5 bar</li>
<li><strong>Presión de salida válvula:</strong> 28 mbar</li>
<li><strong>Diámetro de entrada:</strong> 22 mm</li>
<li><strong>Diámetro de salida:</strong> 8 mm</li>
<li><strong>Flujo:</strong> 1.3 Kg/h</li>
</ul>`,
    specs: JSON.stringify({
      tipo: 'Cilindro Base',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      area_calentamiento: '5 – 10 m²',
      montaje: 'En suelo (portátil)',
      material: 'Acero inoxidable + revestimiento polvo negro',
      acabado: 'Negro Martillado (Black)',
      cualidad: 'Silencioso',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
      valvula_sugerida: 'BP02417',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Tipo Cilindro Alto Black',
    sku: 'BPA0629',
    costPrice: 259.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2025/05/BPA0629-300x300.webp'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Cilindro Alto Black</h2><p>Versión alta del calefactor cilíndrico Black. Mayor potencia y área de cobertura que el modelo base. Ideal para terrazas y jardines amplios.</p>`,
    specs: JSON.stringify({
      tipo: 'Cilindro Alto',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      montaje: 'En suelo (portátil)',
      material: 'Acero inoxidable + revestimiento polvo negro',
      acabado: 'Negro Martillado (Black)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Tipo Cuadrado Alto Black',
    sku: 'BPA0628',
    costPrice: 359.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2024/11/BP04211-a-300x300.png'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Cuadrado Alto Black</h2><p>Diseño cuadrado alto en acabado negro. Mayor capacidad de calefacción para espacios amplios.</p>`,
    specs: JSON.stringify({
      tipo: 'Cuadrado Alto',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      montaje: 'En suelo (portátil)',
      acabado: 'Negro Martillado (Black)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Tipo Hongo',
    sku: 'BPA0354',
    costPrice: 199.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2024/09/CALENTADOR-HONGO2.png'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Hongo</h2><p>El clásico calefactor tipo hongo, diseñado para distribuir el calor de forma radial desde la cúpula superior.</p>`,
    specs: JSON.stringify({
      tipo: 'Hongo',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      distribucion: 'Radial 360° desde cúpula',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Tipo Hongo Ratan',
    sku: 'BPA0355',
    costPrice: 209.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2024/11/BPA0355-300x300.png'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Hongo Ratan</h2><p>Versión con cuerpo estilo Ratan (mimbre) del calefactor hongo.</p>`,
    specs: JSON.stringify({
      tipo: 'Hongo Ratan',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      acabado: 'Estilo Ratan / Mimbre',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Tipo Hongo Ratan Black',
    sku: 'BPA0801',
    costPrice: 239.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2025/10/BPA0801-300x300.webp'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Hongo Ratan Black</h2><p>El hongo Ratan en versión Black Edition. Combina mimbre con negro martillado.</p>`,
    specs: JSON.stringify({
      tipo: 'Hongo Ratan Black',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      acabado: 'Ratan + Negro Martillado',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Tipo Piramide Ratan',
    sku: 'BPA0352',
    costPrice: 359.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2024/11/BPA0352-a-300x300.png'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Pirámide Ratan</h2><p>Diseño piramidal con acabado Ratan. Estético y potente.</p>`,
    specs: JSON.stringify({
      tipo: 'Pirámide Ratan',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      acabado: 'Estilo Ratan / Mimbre',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Tipo Piramide Ratan Black',
    sku: 'BPA0800',
    costPrice: 369.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2026/03/BPA0800-300x300.webp'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Pirámide Ratan Black</h2><p>La versión Black Edition de la pirámide Ratan.</p>`,
    specs: JSON.stringify({
      tipo: 'Pirámide Ratan Black',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      acabado: 'Ratan + Negro Martillado',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Tipo Piramide STAINLESS STEEL',
    sku: 'BPA0353',
    costPrice: 329.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2025/03/BP04213-1x1-1-300x300.png'
    ]),
    description: `<h2>Calefactor de Ambientes Tipo Pirámide Stainless Steel</h2><p>Diseño piramidal en acero inoxidable pulido.</p>`,
    specs: JSON.stringify({
      tipo: 'Pirámide Stainless Steel',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      material: 'Acero Inoxidable (Stainless Steel)',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambiente Tipo Pirámide',
    sku: 'BPA0351',
    costPrice: 299.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2025/03/BP04212-1x1-1-300x300.png'
    ]),
    description: `<h2>Calefactor de Ambiente Tipo Pirámide</h2><p>El clásico de la línea: calefactor piramidal en acabado estándar.</p>`,
    specs: JSON.stringify({
      tipo: 'Pirámide',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Cuadrado Ratan',
    sku: 'BPA0356',
    costPrice: 289.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2025/05/BPA0628-300x300.webp'
    ]),
    description: `<h2>Calefactor de Ambientes Cuadrado Ratan</h2><p>Diseño cuadrado compacto con acabado Ratan.</p>`,
    specs: JSON.stringify({
      tipo: 'Cuadrado Ratan',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      acabado: 'Estilo Ratan / Mimbre',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
  {
    name: 'Calefactor de Ambientes Rectangular Ratan',
    sku: 'BPA0357',
    costPrice: 349.99,
    images: JSON.stringify([
      'https://bpecuador.com/wp-content/uploads/2025/05/BPA0629-300x300.webp'
    ]),
    description: `<h2>Calefactor de Ambientes Rectangular Ratan</h2><p>Formato rectangular con acabado Ratan de alta calidad.</p>`,
    specs: JSON.stringify({
      tipo: 'Rectangular Ratan',
      combustible: 'Gas doméstico',
      encendido: 'Pulso eléctrico',
      acabado: 'Estilo Ratan / Mimbre',
      montaje: 'En suelo (portátil)',
      marca: 'Banco del Perno',
      garantia: '1 año (piezas)',
    }),
    stock: 10,
  },
];

export async function GET() {
  try {
    let categoria = await prisma.category.findFirst({
      where: { name: { contains: 'calefact', mode: 'insensitive' } },
    });
    if (!categoria) {
      categoria = await prisma.category.create({
        data: { name: 'Calefactores de Ambiente', slug: 'calefactores-de-ambiente' },
      });
    }

    const log: string[] = [];
    let updated = 0;
    let inserted = 0;

    for (const rawProd of BP_CALEFACTORES_RAW) {
      // Precio Venta al Público con +15% de margen comercial
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

    // Limpiar viejos / ajenos
    const validSkus = BP_CALEFACTORES_RAW.map((b) => b.sku);
    const nonBpCalefactores = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'calefact', mode: 'insensitive' } },
          { categoryId: categoria.id },
        ],
        NOT: { sku: { in: validSkus } },
      },
    });

    let cleaned = 0;
    for (const badProd of nonBpCalefactores) {
      await prisma.product.update({
        where: { id: badProd.id },
        data: { isDeleted: true },
      });
      log.push(`CLEANED: ${badProd.name} ($${badProd.price})`);
      cleaned++;
    }

    return NextResponse.json({
      success: true,
      margin_applied: '15%',
      inserted,
      updated,
      cleaned,
      total_bp_catalog: BP_CALEFACTORES_RAW.length,
      log,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
