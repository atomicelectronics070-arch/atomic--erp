import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const categoryId = 'cmsqsbjbj0000l9lbhbls3ag9';

const products = [
  {
    name: 'Control Inalámbrico DUALSHOCK®4 para PlayStation®4 (Jet Black)',
    price: 25.00,
    stock: 10,
    images: JSON.stringify([
      'https://gmedia.playstation.com/is/image/SIEPDC/dualshock4-blk-controller-01-us-04jun21?$native--t$'
    ]),
    description: `<p>El mando inalámbrico DUALSHOCK®4 para PS4 define la experiencia de juego de su generación. Combina controles revolucionarios con un diseño ergonómico e intuitivo para ofrecer precisión absoluta en cada partida.</p>
<h3>Características principales</h3>
<ul>
  <li><strong>Panel táctil capacitivo:</strong> Interactúa con los juegos mediante gestos y toques precisos.</li>
  <li><strong>Barra luminosa integrada:</strong> Emiten distintos colores para identificar a los jugadores y dar información visual del juego.</li>
  <li><strong>Altavoz integrado y conector de 3.5 mm:</strong> Escucha efectos de sonido directamente desde el mando o conecta tus auriculares.</li>
  <li><strong>Botón SHARE:</strong> Comparte tus capturas de pantalla y transmisiones en vivo al instante.</li>
</ul>`,
    specs: JSON.stringify({
      marca: 'Sony', plataforma: 'PlayStation 4', conexion: 'Bluetooth / Micro-USB',
      color: 'Jet Black', panel_tactil: 'Sí', barra_luminosa: 'Sí',
      altavoz: 'Integrado', entrada_audio: '3.5 mm', boton_share: 'Sí'
    }),
    keywords: 'dualshock 4 ps4 mando control playstation 4 jet black inalambrico'
  },
  {
    name: 'PlayStation Portal™ Remote Player (Blanco)',
    price: 350.00,
    stock: 10,
    images: JSON.stringify([
      'https://gmedia.playstation.com/is/image/SIEPDC/playstation-portal-remote-player-product-thumbnail-01-en-06sep23?$native--t$'
    ]),
    description: `<p>Lleva el poder de tu PS5™ a cualquier rincón de tu casa con el dispositivo de juego remoto PlayStation Portal™. Disfruta de tus juegos instalados en la consola a través de tu red Wi-Fi doméstica con una calidad visual impresionante en su pantalla de 8 pulgadas.</p>
<h3>Características principales</h3>
<ul>
  <li><strong>Experiencia DualSense® completa:</strong> Incluye retroalimentación háptica y gatillos adaptativos integrados en los agarres laterales.</li>
  <li><strong>Pantalla LCD de 8 pulgadas:</strong> Ofrece resolución 1080p a 60 fps para un rendimiento fluido y detallado.</li>
  <li><strong>Acceso instantáneo a tu consola:</strong> Enciende y reproduce tus títulos de PS5 sin necesidad de un televisor.</li>
</ul>`,
    specs: JSON.stringify({
      marca: 'Sony', plataforma: 'PlayStation 5', pantalla: '8" LCD 1080p 60fps',
      color: 'Blanco', conexion: 'Wi-Fi', haptica: 'Sí', gatillos: 'Adaptativos'
    }),
    keywords: 'playstation portal remote player ps5 blanco pantalla 8 pulgadas streaming'
  },
  {
    name: 'PlayStation Portal™ Remote Player (Midnight Black)',
    price: 450.00,
    stock: 10,
    images: JSON.stringify([
      'https://gmedia.playstation.com/is/image/SIEPDC/playstation-portal-remote-player-midnight-black-product-thumbnail-01-en-2023?$native--t$'
    ]),
    description: `<p>La versión en tono Midnight Black del PlayStation Portal™ combina el juego remoto portátil con un acabado oscuro elegante y discreto. Conéctate a tu PS5 mediante Wi-Fi y sigue jugando desde cualquier lugar de tu hogar.</p>
<h3>Características principales</h3>
<ul>
  <li><strong>Diseño ergonómico sombrío:</strong> Mantiene la ergonomía del mando DualSense en un acabado totalmente negro.</li>
  <li><strong>Pantalla táctil HD de 8":</strong> Visualiza tus partidas a 1080p y 60 cuadros por segundo.</li>
  <li><strong>Integración Háptica Avanzada:</strong> Siente cada impacto, disparo y textura del terreno tal como en la consola principal.</li>
</ul>`,
    specs: JSON.stringify({
      marca: 'Sony', plataforma: 'PlayStation 5', pantalla: '8" LCD 1080p 60fps',
      color: 'Midnight Black', conexion: 'Wi-Fi', haptica: 'Sí', gatillos: 'Adaptativos'
    }),
    keywords: 'playstation portal remote player ps5 midnight black pantalla 8 pulgadas streaming negro'
  },
  {
    name: 'Control Inalámbrico Xbox para Xbox One (Negro Clásico)',
    price: 45.00,
    stock: 10,
    images: JSON.stringify([
      'https://assets.xboxservices.com/assets/58/c4/58c4ca23-c388-4c7a-9a41-d3a55ae16de7.jpg?n=XboxOne_Hero-LG_1.jpg'
    ]),
    description: `<p>Experimenta la comodidad y la precisión del mando inalámbrico de Xbox para Xbox One y PC. Su diseño refinado cuenta con agarre texturizado y la icónica distribución de botones asimétricos para un control óptimo.</p>
<h3>Características principales</h3>
<ul>
  <li><strong>Diseño ergonómico probado:</strong> Diseñado para adaptarse cómodamente a manos de cualquier tamaño.</li>
  <li><strong>Gatillos con impulso:</strong> Siente la acción en tus dedos con la vibración directa en los gatillos superior e inferior.</li>
  <li><strong>Conector de 3.5 mm:</strong> Compatible con cualquier auricular estéreo estándar.</li>
</ul>`,
    specs: JSON.stringify({
      marca: 'Microsoft', plataforma: 'Xbox One / PC / Android / iOS',
      conexion: 'Inalámbrico Xbox / USB', color: 'Negro', entrada_audio: '3.5 mm',
      gatillos_vibra: 'Sí'
    }),
    keywords: 'xbox one mando control inalambrico negro clasico microsoft pc android ios'
  },
  {
    name: 'Control Inalámbrico Xbox Series X|S — Carbon Black',
    price: 85.00,
    stock: 10,
    images: JSON.stringify([
      'https://assets.xboxservices.com/assets/a1/b4/a1b43b90-b80a-4090-a12c-79df6aa06f0e.jpg?n=XboxSeriesX_Carbon-Black_Hero-LG.jpg'
    ]),
    description: `<p>Eleva tu nivel de juego con el control inalámbrico oficial de Xbox Series X|S en color Carbon Black. Cuenta con un diseño esculpido moderno, geometría refinada y opciones de intercambio de contenido instantáneo.</p>
<h3>Características principales</h3>
<ul>
  <li><strong>Cruceta híbrida:</strong> D-pad optimizado para ofrecer precisión tanto en juegos de peleas como en navegación rápida.</li>
  <li><strong>Botón Compartir dedicado:</strong> Captura e intercambia clips y capturas de pantalla de forma impecable.</li>
  <li><strong>Agarre texturizado:</strong> Presente en gatillos, botones superiores y carcasa trasera para evitar deslizamientos.</li>
  <li><strong>Conectividad multidispositivo:</strong> Empareja y conmuta fácilmente entre Xbox Series X|S, Xbox One, PC con Windows, Android e iOS.</li>
</ul>`,
    specs: JSON.stringify({
      marca: 'Microsoft', plataforma: 'Xbox Series X|S / Xbox One / PC / Android / iOS',
      conexion: 'Xbox Wireless / Bluetooth / USB-C', color: 'Carbon Black',
      cruceta: 'Híbrida', boton_compartir: 'Sí', agarre: 'Texturizado'
    }),
    keywords: 'xbox series x s carbon black mando control inalambrico microsoft pc bluetooth usbc'
  },
  {
    name: 'Mando Pro de Nintendo Switch™ (Negro Semitransparente)',
    price: 70.00,
    stock: 10,
    images: JSON.stringify([
      'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.5/c_scale,w_400/ncom/en_US/products/accessories/switch/pro-controller/114448-pro-controller-black'
    ]),
    description: `<p>Diseñado para largas sesiones de juego y controles de máxima precisión, el mando Pro de Nintendo Switch™ ofrece la mejor ergonomía para jugar en modo televisor o sobremesa.</p>
<h3>Características principales</h3>
<ul>
  <li><strong>Vibración HD:</strong> Siente matices de vibración ultra precisos que mejoran la inmersión en tus juegos de Nintendo.</li>
  <li><strong>Funcionalidad amiibo® integrada:</strong> Lector NFC en el centro del mando para escanear tus figuras al instante.</li>
  <li><strong>Controles de movimiento:</strong> Giroscopio y acelerómetro integrados para un apuntado dinámico y sensible.</li>
  <li><strong>Gran autonomía:</strong> Batería recargable de larga duración para jugar horas sin interrupciones.</li>
</ul>`,
    specs: JSON.stringify({
      marca: 'Nintendo', plataforma: 'Nintendo Switch',
      conexion: 'Bluetooth / USB Type-C', color: 'Negro Semitransparente',
      vibracion: 'HD', nfc: 'Sí (amiibo)', giroscopio: 'Sí', acelerometro: 'Sí'
    }),
    keywords: 'nintendo switch pro mando control negro semitransparente amiibo nfc vibración hd'
  }
];

async function main() {
  console.log(`Insertando ${products.length} productos en categoría Mandos para Consolas...`);
  let count = 0;
  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { name: { equals: p.name, mode: 'insensitive' } }
    });
    if (existing) {
      console.log(`  ⚠️  Ya existe: ${p.name}`);
      continue;
    }
    const created = await prisma.product.create({
      data: { ...p, categoryId, isActive: true, isDeleted: false }
    });
    console.log(`  ✅ ${created.name} — $${created.price} — ID: ${created.id}`);
    count++;
  }
  console.log(`\nTotal creados: ${count}/${products.length}`);
  await prisma.$disconnect();
}
main().catch(console.error);
