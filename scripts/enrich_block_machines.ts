import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    id: 'cmqx9xanz0003vmyeq1kttip6',
    name: 'Máquina de Fabricación de Ladrillos de Hormigón Automática',
    images: [
      "https://image.made-in-china.com/202f0j00gUtWHKlcZDoA/Automatic-Concrete-Hollow-Solid-Interlocking-Paving-Block-Making-Brick-Machine-Qt10-15.webp",
      "https://image.made-in-china.com/202f0j00cUmWwHPEVDqR/Automatic-Concrete-Hollow-Solid-Interlocking-Paving-Block-Making-Brick-Machine-Qt10-15.webp",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2070"
    ],
    description: `
      <h2>Planta Industrial Automática de Bloques de Concreto</h2>
      <p>Línea de producción industrial a gran escala para la fabricación masiva de bloques de hormigón. Este modelo cuenta con un sistema de vibración de alta frecuencia y prensado hidráulico que garantiza la máxima densidad y resistencia de las piezas.</p>
      
      <h3>Especificaciones Técnicas</h3>
      <ul>
        <li><strong>Sistema:</strong> Totalmente Automático (PLC Control)</li>
        <li><strong>Fuerza de Vibración:</strong> 100KN</li>
        <li><strong>Ciclo de Moldeo:</strong> 15-20 segundos</li>
        <li><strong>Potencia Total:</strong> 42.5 KW</li>
        <li><strong>Capacidad:</strong> Hasta 18,000 bloques estándar (400x200x200mm) por turno de 8 horas.</li>
      </ul>

      <h3>¿Qué incluye la línea completa?</h3>
      <p>Se trata de una instalación llave en mano. Al adquirir esta planta, usted recibe:</p>
      <ul>
        <li>Máquina Formadora (Host Machine) de alta resistencia.</li>
        <li>Mezcladora obligatoria de doble eje JS500 o JS750.</li>
        <li>Banda transportadora de agregados automatizada.</li>
        <li>Apilador automático de paletas (Block Stacker).</li>
        <li>Panel de control computarizado Siemens o Mitsubishi.</li>
        <li>1 Molde de acero endurecido a elegir (Bloque hueco, macizo, adoquín).</li>
      </ul>
    `
  },
  {
    id: 'cmqx9xd990005vmyek4esv7ae',
    name: 'Línea de Producción de Paneles de Pared EPS Sándwich',
    images: [
      "https://image.made-in-china.com/202f0j00EUtWKqvcJBoN/Eps-Sandwich-Wall-Panel-Machine-Fast-Installation-Solid-Wall-Panel.webp",
      "https://image.made-in-china.com/202f0j00UUtWMzvcRBoN/Eps-Sandwich-Wall-Panel-Machine-Fast-Installation-Solid-Wall-Panel.webp",
      "https://images.unsplash.com/photo-1541888081622-15cb3a5d898a?auto=format&fit=crop&q=80&w=2070"
    ],
    description: `
      <h2>Planta de Paneles de Pared EPS (Poliestireno Expandido)</h2>
      <p>La tecnología más avanzada para la construcción prefabricada. Esta línea de producción fabrica paneles sándwich EPS de concreto ligero, ideales para paredes interiores y exteriores, ofreciendo excelente aislamiento térmico, acústico y resistencia sísmica.</p>
      
      <h3>Ventajas de los Paneles EPS</h3>
      <ul>
        <li>Instalación hasta 3 veces más rápida que el bloque tradicional.</li>
        <li>Alta resistencia al fuego (Ignífugo).</li>
        <li>Ahorro de espacio estructural gracias a su menor espesor.</li>
      </ul>

      <h3>El equipo incluye:</h3>
      <ul>
        <li>Mezcladora especializada de gran volumen para cemento y perlas EPS.</li>
        <li>Sistema de bombeo de masa.</li>
        <li>Carros de moldeo (Mold Cars) para paneles múltiples (ej. 2270x610 mm).</li>
        <li>Sistema automático de desmolde.</li>
        <li>Caldera (opcional según configuración) para curado rápido.</li>
      </ul>
    `
  },
  {
    id: 'cmqx9xf2d0007vmyeslp3y2sk',
    name: 'Máquina Formadora de Adoquines y Bloques de Concreto',
    images: [
      "https://image.made-in-china.com/202f0j00SUtWKtvchNoR/Automatic-Concrete-Paving-Block-Machine-Qt4-15-.webp",
      "https://image.made-in-china.com/202f0j00OUsWGzvcVNoR/Automatic-Concrete-Paving-Block-Machine-Qt4-15-.webp"
    ],
    description: `
      <h2>Formadora Industrial de Adoquines y Bloques</h2>
      <p>Equipo industrial de rango medio diseñado para ofrecer la mejor relación costo-beneficio. Especializada en la fabricación de adoquines de colores para vías, así como bloques huecos estándar cambiando únicamente la matriz (molde).</p>
      
      <h3>Capacidades y Características</h3>
      <ul>
        <li><strong>Tipo de operación:</strong> Semiautomática / Automática (según configuración).</li>
        <li><strong>Presión hidráulica:</strong> Óptima para compactar polvo de piedra, cemento, arena y pigmentos.</li>
        <li><strong>Versatilidad:</strong> Fabricación de adoquín hueso, rectangular, hexagonal, y bloques de construcción.</li>
      </ul>

      <h3>¿Qué viene con su inversión?</h3>
      <ul>
        <li>Estructura principal vibratoria de alta resistencia.</li>
        <li>Sistema de alimentación de color (para la capa superior de los adoquines).</li>
        <li>Banda transportadora de 6 a 8 metros.</li>
        <li>Mezcladora tipo cacerola (Pan Mixer) ideal para mezclas secas.</li>
        <li>Capacitación técnica y manuales de operación.</li>
      </ul>
    `
  },
  {
    id: 'cmqx9xh4d0009vmyergrsu28p',
    name: 'Máquina de Bloques QTJ4-35',
    images: [
      "https://image.made-in-china.com/202f0j00yEgUuKtcbiok/Qtj4-35-Small-Manual-Cement-Hollow-Solid-Brick-Making-Machine-for-Sale.webp",
      "https://image.made-in-china.com/202f0j00lUqWbQzMCnkf/Qtj4-35-Small-Manual-Cement-Hollow-Solid-Brick-Making-Machine-for-Sale.webp",
      "https://image.made-in-china.com/202f0j00aUwWvRbMaNkl/Qtj4-35-Small-Manual-Cement-Hollow-Solid-Brick-Making-Machine-for-Sale.webp"
    ],
    description: `
      <h2>Formadora de Bloques QTJ4-35 (Manual/Semiautomática)</h2>
      <p>La <strong>QTJ4-35</strong> es la máquina líder para emprendimientos y medianos productores de materiales de construcción. Funciona mediante un potente sistema de mesa vibratoria y compresión de molde descendente, asegurando bloques perfectos sin necesidad de grandes inversiones hidráulicas.</p>
      
      <h3>Especificaciones Técnicas</h3>
      <ul>
        <li><strong>Voltaje:</strong> 220V/380V (Trifásico).</li>
        <li><strong>Potencia del motor principal:</strong> 8.6 kW - 11.95 kW.</li>
        <li><strong>Frecuencia de vibración:</strong> 2800 r/min.</li>
        <li><strong>Tiempo de ciclo:</strong> Aproximadamente 35 segundos.</li>
        <li><strong>Producción:</strong> Entre 2,200 y 3,200 bloques huecos por turno de 8 horas.</li>
      </ul>

      <h3>Incluido en la compra:</h3>
      <ul>
        <li>Máquina QTJ4-35.</li>
        <li>1 Molde de bloques huecos (ej. 400x200x200mm) intercambiable.</li>
        <li>Mezcladora JQ350 (Pan mixer).</li>
        <li>Cinta transportadora de material.</li>
        <li>2 Carritos manuales para retiro de bloques frescos.</li>
        <li>Herramientas básicas de mantenimiento.</li>
      </ul>
    `
  },
  {
    id: 'cmqx9xiux000bvmyeoz3zzcd0',
    name: 'Planta Automática de Bloques Interlocking (Tipo Lego)',
    images: [
      "https://image.made-in-china.com/202f0j00fUsWGqvcHNoR/Fully-Automatic-Concrete-Interlocking-Paver-Hollow-Cement-Block-Making-Machine.webp",
      "https://image.made-in-china.com/202f0j00zUtWMtvcfNoR/Fully-Automatic-Concrete-Interlocking-Paver-Hollow-Cement-Block-Making-Machine.webp"
    ],
    description: `
      <h2>Sistema Automático de Bloques Ecológicos Entrelazados (Interlocking)</h2>
      <p>Diseñada para la construcción moderna y sustentable. Produce bloques entrelazados (estilo "Lego") de alta compresión hidráulica que permiten levantar muros sin necesidad de mortero entre las juntas, reduciendo los costos de construcción enormemente.</p>
      
      <h3>Tecnología de Suelo-Cemento</h3>
      <p>Esta máquina está optimizada para prensar mezclas de tierra seleccionada (laterita, arcilla), arena y un pequeño porcentaje de cemento, logrando piezas ecológicas de extrema dureza gracias a sus cilindros hidráulicos de alta presión.</p>

      <h3>La Planta Incluye:</h3>
      <ul>
        <li>Prensa hidráulica automática con PLC.</li>
        <li>Trituradora de tierra (Soil Crusher).</li>
        <li>Criba rotativa para filtrar la tierra.</li>
        <li>Mezcladora obligatoria industrial.</li>
        <li>Sistema de bandas transportadoras.</li>
        <li>Molde Interlocking estándar.</li>
      </ul>
    `
  }
];

async function updateProducts() {
  console.log("Iniciando actualización de Máquinas de Bloques...");
  for (const update of updates) {
    try {
      await prisma.product.update({
        where: { id: update.id },
        data: {
          name: update.name, // Limpiar el nombre para que no se vea como "10% descuento..."
          images: JSON.stringify(update.images),
          description: update.description,
        }
      });
      console.log(`✅ Producto actualizado: ${update.name}`);
    } catch (e) {
      console.error(`❌ Error actualizando ${update.id}:`, e);
    }
  }
}

updateProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
