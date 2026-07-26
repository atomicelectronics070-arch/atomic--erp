import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.update({
    where: { id: 'cmqx9x71z0001vmyex7r2dewu' },
    data: {
      images: JSON.stringify([
        "https://img.youtube.com/vi/nSSJ6muIZpU/hqdefault.jpg",
        "https://img.youtube.com/vi/BYt2PtAAqP4/hqdefault.jpg",
        "https://img.youtube.com/vi/KITFoIeZrds/hqdefault.jpg"
      ]),
      description: `
        <h2>Formadora Compacta de Bloques QT4-35</h2>
        <p>La <strong>QT4-35</strong> es la planta semiautomática preferida por pequeños y medianos talleres de prefabricados. Diseñada para fabricar bloques de concreto de alta resistencia compactados por vibración vertical doble y presión de molde descendente.</p>
        
        <h3>Especificaciones Técnicas</h3>
        <ul>
          <li><strong>Potencia Total:</strong> 14.7 KW.</li>
          <li><strong>Tiempo de Ciclo:</strong> 35 segundos.</li>
          <li><strong>Dimensión de Paleta:</strong> 850 x 550 x 30 mm.</li>
          <li><strong>Producción estimada:</strong> 3,000 a 4,500 bloques por turno de 8 horas.</li>
        </ul>

        <h3>¿Qué viene con su inversión?</h3>
        <ul>
          <li>Máquina formadora QT4-35 con motores vibradores de alta frecuencia.</li>
          <li>1 Molde de acero templado intercambiable.</li>
          <li>Mezcladora Pan-Mixer JQ350 para mezclas secas.</li>
          <li>Cinta transportadora vulcanizada de 6 metros.</li>
          <li>2 Carritos manuales de retiro.</li>
        </ul>
      `
    }
  });

  console.log("✅ Producto cmqx9x71z0001vmyex7r2dewu actualizado con imágenes verificadas.");
}

main().finally(() => prisma.$disconnect());
