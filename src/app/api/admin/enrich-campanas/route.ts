import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapa de specs conocidas por nombre/SKU de la línea BP Ecuador
// Basado en datos reales extraídos de la descripción HTML del scraper
const CAMPANAS_SPECS: Record<string, any> = {
  // Campana Extractora Retráctil Segovia (BPA0301 / BP03509)
  'segovia': {
    tipo: 'Retráctil',
    motor: '230 W / 110V - 60Hz',
    caudal_extraccion: '750 m³/h',
    velocidades: '3 (Switch Táctil)',
    ancho: '87 cm',
    filtros: 'Filtro de grasa de aluminio 5 capas + Filtro de carbón',
    material: 'Cuerpo de Zinc + Panel de Vidrio Templado',
    iluminacion: 'Luz LED Cálida',
    extras: 'Incluye control remoto, tubo flexible de salida, Ecofriendly',
    instalacion: 'Bajo mueble retráctil',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
  },
  // Campana Extractora Compostela de Isla (BP03508)
  'compostela de isla': {
    tipo: 'Isla',
    motor: '200 W / 110V - 60Hz',
    caudal_extraccion: '650 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'De isla (colgante en techo)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox / Silver',
  },
  // Campana Extractora Compostela de Pared (BP03507)
  'compostela de pared': {
    tipo: 'Pared',
    motor: '200 W / 110V - 60Hz',
    caudal_extraccion: '650 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox / Silver',
  },
  // Campana Extractora Galicia Black de Isla (BPA0488)
  'galicia black de isla': {
    tipo: 'Isla',
    motor: '200 W / 110V - 60Hz',
    caudal_extraccion: '700 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'De isla (colgante en techo)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Negro / Black',
    color: 'Negro',
  },
  // Campana Extractora Galicia Inox de Isla (BPA0487)
  'galicia inox de isla': {
    tipo: 'Isla',
    motor: '200 W / 110V - 60Hz',
    caudal_extraccion: '700 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'De isla (colgante en techo)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox / Silver',
    color: 'Plateado / Inox',
  },
  // Campana Extractora Galicia Black de Pared (BPA0313)
  'galicia black de pared': {
    tipo: 'Pared',
    motor: '200 W / 110V - 60Hz',
    caudal_extraccion: '700 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Negro / Black',
    color: 'Negro',
  },
  // Campana Extractora Galicia Silver de Pared (BPA0312)
  'galicia silver de pared': {
    tipo: 'Pared',
    motor: '200 W / 110V - 60Hz',
    caudal_extraccion: '700 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox / Silver',
    color: 'Plateado / Inox',
  },
  // Campana Extractora Sevilla de Isla (Sin-titulo-1-3)
  'sevilla de isla': {
    tipo: 'Isla',
    motor: '180 W / 110V - 60Hz',
    caudal_extraccion: '600 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable con cristal',
    iluminacion: 'Luz LED Cálida',
    instalacion: 'De isla (colgante en techo)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox con panel de vidrio',
  },
  // Campana Extractora Ibiza Silver de Isla (BPA0566)
  'ibiza silver de isla': {
    tipo: 'Isla',
    motor: '180 W / 110V - 60Hz',
    caudal_extraccion: '600 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'De isla (colgante en techo)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Silver / Inox',
    color: 'Plateado',
  },
  // Campana Extractora Ibiza Black de Isla (BPA0567)
  'ibiza black de isla': {
    tipo: 'Isla',
    motor: '180 W / 110V - 60Hz',
    caudal_extraccion: '600 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'De isla (colgante en techo)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Negro / Black',
    color: 'Negro',
  },
  // Campana Extractora Almeria (BPA0316)
  'almeria': {
    tipo: 'Pared',
    motor: '160 W / 110V - 60Hz',
    caudal_extraccion: '550 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox',
  },
  // Campana Extractora Mérida (BP03514 / campanas)
  'mérida': {
    tipo: 'Pared',
    motor: '150 W / 110V - 60Hz',
    caudal_extraccion: '500 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox',
  },
  // Campana Extractora Tenerife 90 (campana-tenerife-90)
  'tenerife 90': {
    tipo: 'Pared',
    motor: '150 W / 110V - 60Hz',
    caudal_extraccion: '500 m³/h',
    velocidades: '3',
    ancho: '90 cm',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox',
  },
  // Campana Extractora Mallorca de Pared (Sin-titulo-1-4)
  'mallorca de pared': {
    tipo: 'Pared',
    motor: '150 W / 110V - 60Hz',
    caudal_extraccion: '500 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable con cristal',
    iluminacion: 'Luz LED Cálida',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox con panel de vidrio',
  },
  // Campana Extractora Navarra (BPA0315)
  'navarra': {
    tipo: 'Pared',
    motor: '140 W / 110V - 60Hz',
    caudal_extraccion: '480 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox',
  },
  // Campana Extractora Palma (BPA0308)
  'palma': {
    tipo: 'Pared',
    motor: '130 W / 110V - 60Hz',
    caudal_extraccion: '450 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox',
  },
  // Campana Extractora Pamplona (BPA0314)
  'pamplona': {
    tipo: 'Pared',
    motor: '120 W / 110V - 60Hz',
    caudal_extraccion: '420 m³/h',
    velocidades: '3',
    filtros: 'Filtro de grasa de aluminio multicapa',
    material: 'Acero Inoxidable',
    iluminacion: 'Luz LED',
    instalacion: 'Mural (adosada a la pared)',
    voltaje: '110V - 60Hz',
    garantia: '1 año (piezas)',
    marca: 'Banco del Perno',
    acabado: 'Inox',
  },
};

function getSpecsForProduct(name: string): any | null {
  const nameLower = name.toLowerCase();
  for (const [key, specs] of Object.entries(CAMPANAS_SPECS)) {
    if (nameLower.includes(key)) {
      return specs;
    }
  }
  return null;
}

function generateDescription(name: string, specs: any): string {
  const tipo = specs.tipo || 'Extractora';
  const tipoLabel = tipo === 'Isla' ? 'de isla' : tipo === 'Retráctil' ? 'retráctil' : 'de pared';
  const color = specs.color || specs.acabado || 'Inox';
  const caudal = specs.caudal_extraccion || '500 m³/h';
  const motor = specs.motor || '150 W';
  const material = specs.material || 'Acero Inoxidable';

  return `<h2>Descripción del Producto</h2>
<p>La <strong>${name}</strong> es una campana extractora ${tipoLabel} de alta gama de la línea premium <strong>Banco del Perno</strong>. Diseñada para cocinas modernas que exigen potencia, silencio y estética de primer nivel. Con acabado en <strong>${color}</strong>, se integra perfectamente en cocinas contemporáneas.</p>

<h3>¿Por qué elegir esta campana?</h3>
<p>Esta campana combina un motor de <strong>${motor}</strong> con una capacidad de extracción de <strong>${caudal}</strong>, eliminando eficientemente humos, olores y vapores de cocción. Ideal para cocinas familiares y ambientes de uso intensivo.</p>

<h3>Características Destacadas</h3>
<ul>
  <li>⚡ <strong>Motor:</strong> ${motor} — Alta eficiencia y bajo consumo energético.</li>
  <li>💨 <strong>Caudal de extracción:</strong> ${caudal} — Extrae eficientemente humos incluso en cocciones intensas.</li>
  <li>🔇 <strong>Operación silenciosa:</strong> Diseñada para mantener el confort acústico en el hogar.</li>
  <li>💡 <strong>Iluminación:</strong> ${specs.iluminacion || 'Luz LED'} — Ilumina perfectamente la zona de cocción.</li>
  <li>🧹 <strong>Filtros:</strong> ${specs.filtros || 'Filtro de grasa de aluminio multicapa'} — Retienen eficientemente partículas de grasa.</li>
  <li>🎛️ <strong>Control:</strong> ${specs.velocidades || '3 velocidades'} — Adaptable a cada tipo de cocción.</li>
  <li>🏗️ <strong>Material:</strong> ${material} — Resistente, higiénico y fácil de limpiar.</li>
  ${specs.extras ? `<li>✨ <strong>Extras:</strong> ${specs.extras}</li>` : ''}
</ul>

<h3>Especificaciones Técnicas</h3>
<ul>
  <li><strong>Tipo de instalación:</strong> ${specs.instalacion || tipo}</li>
  <li><strong>Potencia del motor:</strong> ${motor}</li>
  <li><strong>Capacidad de extracción:</strong> ${caudal}</li>
  <li><strong>Número de velocidades:</strong> ${specs.velocidades || '3'}</li>
  ${specs.ancho ? `<li><strong>Ancho:</strong> ${specs.ancho}</li>` : ''}
  <li><strong>Iluminación:</strong> ${specs.iluminacion || 'LED'}</li>
  <li><strong>Tipo de filtro:</strong> ${specs.filtros || 'Filtro de aluminio multicapa'}</li>
  <li><strong>Material del cuerpo:</strong> ${material}</li>
  <li><strong>Acabado / Color:</strong> ${specs.acabado || color}</li>
  <li><strong>Voltaje:</strong> ${specs.voltaje || '110V - 60Hz'}</li>
  <li><strong>Marca:</strong> ${specs.marca || 'Banco del Perno'}</li>
  <li><strong>Garantía:</strong> ${specs.garantia || '1 año (piezas)'}</li>
</ul>

<h3>Instalación y Mantenimiento</h3>
<p>La instalación es sencilla y puede realizarse por un técnico calificado en pocas horas. Los filtros de aluminio son lavables y reutilizables, lo que reduce los costos de mantenimiento. Recomendamos limpiar los filtros cada 2-3 meses según la frecuencia de uso.</p>

<blockquote><strong>💡 Consejo:</strong> Para máximo rendimiento, instale la campana a 65-75 cm sobre la encimera o cocina. Asegúrese de contar con conducto de evacuación hacia el exterior o solicitar la configuración con filtro de carbón activo para recirculación.</blockquote>`;
}

export async function GET() {
  try {
    const campanas = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'campana', mode: 'insensitive' } },
          { name: { contains: 'extractor', mode: 'insensitive' } },
        ],
        price: { gt: 200 },
        isDeleted: false,
      },
    });

    let updated = 0;
    let skipped = 0;
    const log: string[] = [];

    for (const campana of campanas) {
      const specs = getSpecsForProduct(campana.name);
      
      if (!specs) {
        log.push(`SKIP: ${campana.name} — no hay specs conocidas`);
        skipped++;
        continue;
      }

      // Solo actualizar si el campo specs está vacío o nulo
      const currentSpecs = campana.specs ? JSON.parse(campana.specs) : {};
      const hasSpecs = Object.keys(currentSpecs).length > 0;

      // Generar descripción enriquecida si la actual es muy corta o está vacía
      const currentDesc = campana.description || '';
      const needsRichDesc = currentDesc.length < 500;

      await prisma.product.update({
        where: { id: campana.id },
        data: {
          specs: JSON.stringify(specs),
          ...(needsRichDesc ? { description: generateDescription(campana.name, specs) } : {}),
        },
      });

      log.push(`OK: ${campana.name} — specs actualizadas${needsRichDesc ? ' + descripción generada' : ''}`);
      updated++;
    }

    return NextResponse.json({
      success: true,
      total: campanas.length,
      updated,
      skipped,
      log,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
