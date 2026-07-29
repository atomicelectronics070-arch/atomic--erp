import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Catálogo COMPLETO extraído de:
// https://bpecuador.com/categoria-producto/hogar/calefactores-de-ambiente/
const BP_CALEFACTORES = [
  {
    name: 'Calefactor de Ambientes Tipo Cilindro Base Black',
    sku: 'BPA0627',
    price: 199.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2024/09/Calefactor-1-300x300.png']),
    description: `<h2>Calefactor de Ambientes Tipo Cilindro Base Black</h2>
<p>Calefactor a gas de diseño cilíndrico con acabado negro martillado de alta durabilidad. Ideal para terrazas, patios, jardines y espacios semi-abiertos. Combina funcionalidad y estética industrial para ambientes modernos.</p>
<h3>Características</h3>
<ul>
<li>Encendedor de pulso confiable con sistema de protección de llama</li>
<li>Diseño portátil: se puede mover al exterior, patio o jardín</li>
<li>Puerta integrada en cámara del tanque para fácil instalación del cilindro de gas</li>
<li>Quemadores de acero inoxidable con rejilla de calefacción de doble manto</li>
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
    isHero: true,
  },
  {
    name: 'Calefactor de Ambientes Tipo Cilindro Alto Black',
    sku: 'BPA0629',
    price: 259.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2025/05/BPA0629-300x300.webp']),
    description: `<h2>Calefactor de Ambientes Tipo Cilindro Alto Black</h2>
<p>Versión alta del calefactor cilíndrico Black. Mayor potencia y mayor área de cobertura que el modelo base. Ideal para espacios exteriores amplios como terrazas y jardines.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Cilindro Alto</li>
<li><strong>Acabado:</strong> Negro Martillado</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Material:</strong> Acero inoxidable con revestimiento polvo negro</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 359.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2024/11/BP04211-a-300x300.png']),
    description: `<h2>Calefactor de Ambientes Tipo Cuadrado Alto Black</h2>
<p>Diseño cuadrado alto en acabado negro. Mayor capacidad de calefacción para espacios amplios. Estructura robusta con quemadores de acero inoxidable.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Cuadrado Alto</li>
<li><strong>Acabado:</strong> Negro Martillado</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 199.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2024/09/CALENTADOR-HONGO2-300x300.png']),
    description: `<h2>Calefactor de Ambientes Tipo Hongo</h2>
<p>El clásico calefactor tipo hongo, diseñado para distribuir el calor de forma radial desde la cúpula superior. Perfecto para terrazas y espacios exteriores semi-abiertos.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Hongo (mushroom heater)</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Distribución de calor:</strong> Radial 360° desde cúpula superior</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 209.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2024/11/BPA0355-300x300.png']),
    description: `<h2>Calefactor de Ambientes Tipo Hongo Ratan</h2>
<p>Versión con cuerpo estilo Ratan (mimbre) del calefactor hongo. Acabado decorativo que combina calidez visual y funcional. Ideal para espacios con decoración natural y rústica.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Hongo Ratan</li>
<li><strong>Acabado:</strong> Estilo Ratan / Mimbre</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 239.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2025/10/BPA0801-300x300.webp']),
    description: `<h2>Calefactor de Ambientes Tipo Hongo Ratan Black</h2>
<p>El hongo Ratan en versión Black Edition. Combina el acabado estilo mimbre con el color negro martillado. Diseño sofisticado y funcional para terrazas modernas.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Hongo Ratan Black</li>
<li><strong>Acabado:</strong> Ratan + Negro Martillado</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 359.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2024/11/BPA0352-a-300x300.png']),
    description: `<h2>Calefactor de Ambientes Tipo Pirámide Ratan</h2>
<p>Diseño piramidal con acabado Ratan. Estético y potente, ideal para espacios al aire libre que buscan combinar funcionalidad con un diseño decorativo único.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Pirámide Ratan</li>
<li><strong>Acabado:</strong> Estilo Ratan / Mimbre</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 369.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2026/03/BPA0800-300x300.webp']),
    description: `<h2>Calefactor de Ambientes Tipo Pirámide Ratan Black</h2>
<p>La versión Black Edition de la pirámide Ratan. Máxima estética y potencia en un calefactor que combina acabado negro martillado con textura mimbre. El más premium de la línea.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Pirámide Ratan Black</li>
<li><strong>Acabado:</strong> Ratan + Negro Martillado</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 329.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2025/03/BP04213-1x1-1-300x300.png']),
    description: `<h2>Calefactor de Ambientes Tipo Pirámide Stainless Steel</h2>
<p>Diseño piramidal en acero inoxidable pulido. El acabado brillante Stainless Steel le da una apariencia moderna y de alta gama. Resistente a la corrosión y a la intemperie.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Pirámide</li>
<li><strong>Material / Acabado:</strong> Acero Inoxidable (Stainless Steel)</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 299.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2025/03/BP04212-1x1-1-300x300.png']),
    description: `<h2>Calefactor de Ambiente Tipo Pirámide</h2>
<p>El clásico de la línea: calefactor piramidal en acabado estándar. Diseño funcional y elegante que calienta espacios exteriores con eficiencia probada.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Pirámide</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 289.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2025/05/BPA0628-300x300.webp']),
    description: `<h2>Calefactor de Ambientes Cuadrado Ratan</h2>
<p>Diseño cuadrado compacto con acabado Ratan. Perfecto para espacios pequeños y medianos donde se necesita calidez con estilo decorativo.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Cuadrado Ratan</li>
<li><strong>Acabado:</strong> Estilo Ratan / Mimbre</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    price: 349.99,
    images: JSON.stringify(['https://bpecuador.com/wp-content/uploads/2025/05/BPA0629-300x300.webp']),
    description: `<h2>Calefactor de Ambientes Rectangular Ratan</h2>
<p>Formato rectangular con acabado Ratan de alta calidad. El mayor de la línea Ratan, ideal para terrazas amplias que buscan mayor área de cobertura con un diseño decorativo elegante.</p>
<h3>Especificaciones</h3>
<ul>
<li><strong>Tipo:</strong> Rectangular Ratan</li>
<li><strong>Acabado:</strong> Estilo Ratan / Mimbre</li>
<li><strong>Combustible:</strong> Gas doméstico</li>
<li><strong>Encendido:</strong> Pulso eléctrico</li>
<li><strong>Montaje:</strong> En suelo (portátil)</li>
<li><strong>Marca:</strong> Banco del Perno</li>
</ul>`,
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
    // Buscar o crear categoría de calefactores
    let categoria = await prisma.category.findFirst({
      where: { name: { contains: 'calefact', mode: 'insensitive' } },
    });
    if (!categoria) {
      categoria = await prisma.category.create({
        data: { name: 'Calefactores de Ambiente', slug: 'calefactores-de-ambiente' },
      });
    }

    const log: string[] = [];
    let inserted = 0;
    let updated = 0;

    for (const prod of BP_CALEFACTORES) {
      // Buscar por SKU primero, luego por nombre
      const existing = await prisma.product.findFirst({
        where: {
          OR: [
            { sku: prod.sku },
            { name: { equals: prod.name, mode: 'insensitive' } },
          ],
          isDeleted: false,
        },
      });

      if (existing) {
        // Actualizar con datos correctos del proveedor
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            name: prod.name,
            sku: prod.sku,
            price: prod.price,
            images: prod.images,
            description: prod.description,
            specs: prod.specs,
            stock: prod.stock,
            categoryId: categoria.id,
          },
        });
        log.push(`UPDATED: ${prod.name} (${prod.sku})`);
        updated++;
      } else {
        // Crear nuevo producto
        await prisma.product.create({
          data: {
            name: prod.name,
            sku: prod.sku,
            price: prod.price,
            images: prod.images,
            description: prod.description,
            specs: prod.specs,
            stock: prod.stock,
            categoryId: categoria.id,
            isDeleted: false,
          },
        });
        log.push(`INSERTED: ${prod.name} (${prod.sku})`);
        inserted++;
      }
    }

    // Detectar y limpiar duplicados (mismo nombre, distinto ID — dejar el de SKU correcto)
    const allCalef = await prisma.product.findMany({
      where: {
        name: { contains: 'calefact', mode: 'insensitive' },
        isDeleted: false,
      },
      orderBy: { createdAt: 'asc' },
    });

    const seenSkus = new Set<string>();
    const seenNames = new Set<string>();
    let deduped = 0;

    for (const p of allCalef) {
      const nameKey = p.name.toLowerCase().trim();
      const skuKey = (p.sku || '').toUpperCase();

      if ((skuKey && seenSkus.has(skuKey)) || seenNames.has(nameKey)) {
        await prisma.product.update({
          where: { id: p.id },
          data: { isDeleted: true },
        });
        log.push(`DEDUP: Marcado como eliminado: ${p.name} (${p.sku || 'sin SKU'})`);
        deduped++;
      } else {
        if (skuKey) seenSkus.add(skuKey);
        seenNames.add(nameKey);
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      updated,
      deduped,
      total_bp_catalog: BP_CALEFACTORES.length,
      log,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
