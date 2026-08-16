import { prisma } from '../src/lib/prisma';

async function main() {
  // Find or get Industrial category
  let industrialCategory = await prisma.category.findFirst({
    where: { name: { contains: 'Industrial', mode: 'insensitive' } }
  });

  if (!industrialCategory) {
    industrialCategory = await prisma.category.create({
      data: {
        name: 'Industrial',
        slug: 'industrial',
        description: 'Maquinaria Pesada e Industrial'
      }
    });
  }

  const description = `
<h2>Planta Industrial de Bloques y Adoquines QT4-24 (Línea Semi-Automática)</h2>
<p>La <strong>QT4-24</strong> es la planta de vibro-compresión hidráulica semi-automática diseñada para producción industrial continua de bloques huecos, adoquines viales y bordillos con la máxima eficiencia y relación costo-beneficio.</p>

<h3>Componentes Principales Incluidos:</h3>
<ol>
  <li><strong>Tolva de Alimentación:</strong> Capacidad optimizada para una alimentación constante y uniforme de la mezcla al molde.</li>
  <li><strong>Transportador de Banda:</strong> Cinta vulcanizada de 6 metros para transporte continuo de agregados.</li>
  <li><strong>Sistema de Moldeo y Prensado (Host Principal):</strong> Estructura monobloque electro-soldada con cilindros hidráulicos de compresión descendente.</li>
  <li><strong>Sistema Hidráulico Industrial:</strong> Válvulas y bombas proporcionales para trabajo pesado 24/7.</li>
  <li><strong>Mezclador de Materiales:</strong> Mezcladora Pan-Mixer JQ500 de eje vertical/doble para concreto seco.</li>
  <li><strong>Motores y Vibradores:</strong> Sistema de vibración vertical síncrona de 4500 RPM.</li>
  <li><strong>Panel de Control:</strong> Gabinete eléctrico digital para control intuitivo del ciclo de moldeo.</li>
  <li><strong>Salida de Producto:</strong> Sistema automático de desacoplamiento de tablas con carritos de acarreo manuales.</li>
</ol>

<h3>Especificaciones Técnicas:</h3>
<ul>
  <li><strong>Capacidad de Producción:</strong> 4,000 - 6,000 bloques por turno de 8 horas.</li>
  <li><strong>Potencia Instalada:</strong> 18.5 kW (Trifásico 220V/380V).</li>
  <li><strong>Fuerza de Prensado:</strong> 50 KN.</li>
  <li><strong>Tiempo de Ciclo:</strong> 24 a 28 segundos.</li>
  <li><strong>Garantía Estructural:</strong> 2 Años con soporte técnico y repuestos en bodega local ATOMIC.</li>
</ul>
  `.trim();

  const product = await prisma.product.create({
    data: {
      name: "Máquina de Bloques QT4-24 Semi-Automática",
      description: description,
      price: 8450.00,
      images: JSON.stringify(["/qt4-24-maquina-bloques.jpg"]),
      featured: true,
      isActive: true,
      categoryId: industrialCategory.id,
      provider: "ATOMIC Heavy Machinery"
    }
  });

  console.log("=== PRODUCTO QT4-24 CREADO EXITOSAMENTE ===");
  console.log(JSON.stringify(product, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
