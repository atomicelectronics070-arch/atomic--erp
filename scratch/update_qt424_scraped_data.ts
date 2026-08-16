import { prisma } from '../src/lib/prisma';

async function main() {
  const images = [
    "https://image.made-in-china.com/2f0j00eaQRPKoFCBzn/Qt4-24-Semi-Automatic-Concrete-Block-Making-Machine-for-Sale.jpg",
    "https://image.made-in-china.com/2f0j00jQtRPGkgqMzn/Qt4-24-Semi-Automatic-Concrete-Block-Making-Machine-for-Sale.jpg",
    "https://image.made-in-china.com/2f0j00jaTfHrkhOMuO/Qt4-24-Semi-Automatic-Concrete-Block-Making-Machine-for-Sale.jpg",
    "https://image.made-in-china.com/2f0j00UbnlgChtbNpo/Qt4-24-Semi-Automatic-Concrete-Block-Making-Machine-for-Sale.jpg",
    "https://image.made-in-china.com/2f0j00UqOlgFWKlNpo/Qt4-24-Semi-Automatic-Concrete-Block-Making-Machine-for-Sale.jpg",
    "https://image.made-in-china.com/2f0j00goNhrtlwAFuq/Qt4-24-Semi-Automatic-Concrete-Block-Making-Machine-for-Sale.jpg"
  ];

  // Base price $6,000 USD * 1.40 (40% margin) = $8,400.00 USD
  const baseFobPrice = 6000.00;
  const marginPercentage = 0.40;
  const finalPvpPrice = baseFobPrice * (1 + marginPercentage); // $8,400.00

  const description = `
<h2>Qt4-24 Máquina Semiautomática para Fabricación de Bloques de Concreto</h2>
<p>La <strong>QT4-24</strong> de ATOMIC Heavy Machinery es una solución industrial semiautomática para producción masiva de bloques de concreto huecos, adoquines de alta densidad, bordillos viales y bloques habiterra sismo-resistentes.</p>

<h3>Especificaciones Técnicas Principales:</h3>
<ul>
  <li><strong>Modelo:</strong> QT4-24 (Línea Semi-Automática Completa)</li>
  <li><strong>Grado Automático:</strong> Semiautomático con alimentación continua de agregados</li>
  <li><strong>Método de Moldeo:</strong> Vibro-compresión hidráulica síncrona</li>
  <li><strong>Ciclo de Moldeo:</strong> 24 segundos por bajada</li>
  <li><strong>Capacidad Estimada:</strong> 4,500 a 6,000 bloques por turno de 8 horas</li>
  <li><strong>Voltaje de Operación:</strong> 220V / 380V / 440V Trifásico</li>
  <li><strong>Motores:</strong> Motor industrial Siemens de alta resistencia térmica</li>
  <li><strong>Operarios Requeridos:</strong> 4 operarios</li>
  <li><strong>Estructura del Chasis:</strong> Acero estructural Q235 electro-soldado reforzado</li>
  <li><strong>Certificaciones Internacionales:</strong> CE, ISO9001, SGS, SONCAP</li>
</ul>

<h3>Equipamiento Incluido en el Kit Llave en Mano:</h3>
<ol>
  <li><strong>Máquina Principal Host QT4-24:</strong> Con cilindros hidráulicos de prensa superior y mesa vibratoria síncrona (4500 RPM).</li>
  <li><strong>Tolva de Alimentación de Agregados:</strong> Diseñada para flujo uniforme de mezcla seca.</li>
  <li><strong>Cinta Transportadora de Banda:</strong> 6 metros de longitud vulcanizada anti-polvo.</li>
  <li><strong>Mezcladora Pan-Mixer JQ500:</strong> De eje vertical para preparación homogénea de concreto seco.</li>
  <li><strong>Tablero Eléctrico de Control:</strong> Gabinete de distribución de potencia digital.</li>
  <li><strong>1 Molde Intercambiable:</strong> A elección del cliente (Bloque 10, 15, 20 o adoquín holandés/hexagonal).</li>
  <li><strong>Carritos Manuales de Acarreo:</strong> 2 carritos reforzados para traslado de tablas con bloques frescos.</li>
</ol>
  `.trim();

  // Find existing QT4-24 or create
  const existing = await prisma.product.findFirst({
    where: {
      OR: [
        { name: { contains: 'QT4-24', mode: 'insensitive' } },
        { name: { contains: '4-24', mode: 'insensitive' } }
      ]
    }
  });

  let product;
  if (existing) {
    product = await prisma.product.update({
      where: { id: existing.id },
      data: {
        name: "Qt4-24 Máquina Semiautomática para Hacer Bloques de Concreto",
        price: finalPvpPrice,
        images: JSON.stringify(images),
        description: description,
        provider: "ATOMIC Heavy Machinery / Chuangyun",
        isActive: true,
        featured: true
      }
    });
  } else {
    let industrialCategory = await prisma.category.findFirst({
      where: { name: { contains: 'Industrial', mode: 'insensitive' } }
    });

    product = await prisma.product.create({
      data: {
        name: "Qt4-24 Máquina Semiautomática para Hacer Bloques de Concreto",
        price: finalPvpPrice,
        images: JSON.stringify(images),
        description: description,
        provider: "ATOMIC Heavy Machinery / Chuangyun",
        categoryId: industrialCategory?.id,
        isActive: true,
        featured: true
      }
    });
  }

  console.log("=== PRODUCTO QT4-24 ACTUALIZADO CON MARGEN 40% Y FOTOS REALES ===");
  console.log(JSON.stringify(product, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
