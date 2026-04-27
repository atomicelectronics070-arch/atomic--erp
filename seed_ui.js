const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  'Alarmas',
  'Ambientes',
  'Antenas',
  'Barreras Vehiculares',
  'Camaras de Seguridad',
  'Repuestos de Laptop',
  'Celulares Tablets y Computacion',
  'Energia',
  'Electronica para Negocios Movilidad y Deportes',
  'Porteria Electronica',
  'Iluminacion',
  'Cerraduras Smart y Accesos',
  'Consolas de Video Juegos',
  'Domotica Automatizacion para tu Negocio',
  'Tienda en Linea a Medida',
  'Servicios'
];

const collections = [
  {
    name: 'Tecnologia Residencial',
    description: 'Soluciones tecnologicas inteligentes para el hogar moderno. Automatizacion, seguridad y confort en un solo lugar.'
  },
  {
    name: 'Desarrollo',
    description: 'Licencias, herramientas y soluciones de software para llevar tu negocio al siguiente nivel digital.'
  },
  {
    name: 'Gaming',
    description: 'El mejor equipamiento gamer, consolas y accesorios para la experiencia definitiva de entretenimiento.'
  },
  {
    name: 'Automatizacion',
    description: 'Sistemas de control, PLCs y soluciones de automatizacion de ultima generacion para industria y negocio.'
  }
];

function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seed() {
  console.log('\n🌱 Iniciando seed de categorias y areas de especializacion...\n');

  for (const name of categories) {
    const slug = toSlug(name);
    try {
      const cat = await prisma.category.upsert({
        where: { slug },
        update: { name },
        create: { name, slug }
      });
      console.log(`  ✅ Categoria: ${cat.name} [${cat.slug}]`);
    } catch (e) {
      console.log(`  ⚠️  Categoria ya existe o error: ${name} — ${e.message}`);
    }
  }

  console.log('');

  for (const col of collections) {
    const slug = toSlug(col.name);
    try {
      const created = await prisma.collection.upsert({
        where: { slug },
        update: { name: col.name, description: col.description },
        create: { name: col.name, slug, description: col.description }
      });
      console.log(`  ✅ Area: ${created.name} [${created.slug}]`);
    } catch (e) {
      console.log(`  ⚠️  Area ya existe o error: ${col.name} — ${e.message}`);
    }
  }

  console.log('\n✨ Seed completado correctamente!\n');
}

seed()
  .catch((e) => { console.error('Error en seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
