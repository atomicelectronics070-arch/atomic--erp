import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const categoryId = 'cmsqsbjbj0000l9lbhbls3ag9';

  const existing = await prisma.product.findFirst({
    where: { name: { contains: 'Midnight Black', mode: 'insensitive' } }
  });
  if (existing) { console.log('Ya existe:', existing.name); await prisma.$disconnect(); return; }

  const product = await prisma.product.create({
    data: {
      name: 'Mando Inalámbrico DualSense™ para PlayStation®5 (Midnight Black)',
      price: 80.00,
      stock: 10,
      isActive: true,
      isDeleted: false,
      categoryId,
      images: JSON.stringify([
        'https://ecsonyb2c.vtexassets.com/arquivos/ids/262942/ps5-dualsense-midnight-black.jpg?v=639166058709600000'
      ]),
      description: `<p>Sumérgete en la oscuridad y lleva tu experiencia de juego al siguiente nivel con el mando inalámbrico DualSense™ en su elegante acabado Midnight Black. Con un diseño sutil y moderno en tonos negros, este control combina la última tecnología en respuesta táctil con una ergonomía pensada para largas sesiones de juego.</p>
<h3>Características principales</h3>
<ul>
  <li><strong>Retroalimentación háptica:</strong> Siente vibraciones dinámicas que simulan el entorno, desde la textura del terreno hasta el impacto de los disparos.</li>
  <li><strong>Gatillos adaptativos:</strong> Experimenta distintos niveles de resistencia y tensión mecánica al interactuar con armas o vehículos en tus juegos.</li>
  <li><strong>Micrófono integrado y entrada de 3.5 mm:</strong> Mantén la comunicación activa con tu equipo de forma directa o conecta tus auriculares preferidos.</li>
  <li><strong>Botón Crear:</strong> Captura, graba y transmite tus partidas con solo presionar un botón.</li>
  <li><strong>Compatibilidad multiplataforma:</strong> Diseñado para PlayStation 5, pero totalmente funcional en PC, Mac y dispositivos móviles mediante Bluetooth® o cable USB Type-C®.</li>
</ul>`,
      specs: JSON.stringify({
        marca: 'Sony',
        plataforma: 'PlayStation 5',
        conexion: 'Bluetooth / USB Type-C',
        color: 'Midnight Black',
        microfono: 'Integrado',
        entrada_audio: '3.5 mm',
        gatillos: 'Adaptativos',
        haptica: 'Sí',
        boton_crear: 'Sí',
        compatibilidad: 'PS5, PC, Mac, Móviles'
      }),
      keywords: 'dualsense ps5 mando control playstation 5 inalambrico midnight black negro',
    }
  });

  console.log('Producto creado:');
  console.log('  ID:', product.id);
  console.log('  Nombre:', product.name);
  console.log('  Precio: $' + product.price);
  await prisma.$disconnect();
}
main().catch(console.error);
