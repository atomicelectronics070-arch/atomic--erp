const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCategoryImages() {
  const imagesToUpdate = [
    'cable-utp-',
    'tecnologia-residencial',
    'software-desarrollo',
    'automatizacion-inteligente',
    'gaming-consolas',
    'soft3-logistics',
    'alarmas',
    'ambientes',
    'antenas',
    'barreras-vehiculares',
    'camaras-de-seguridad'
  ];

  for (const slug of imagesToUpdate) {
    try {
      // Find the category by slug
      // The first one is actually 'cable-utp-' in the db according to the dump
      let dbSlug = slug;
      
      // Update the image path
      const imgPath = `/categories/${slug.replace(/-$/, '')}.png`; // remove trailing dash for filename if any
      
      await prisma.category.update({
        where: { slug: dbSlug },
        data: { image: imgPath }
      });
      console.log(`Updated ${dbSlug} with image ${imgPath}`);
    } catch (e) {
      console.error(`Error updating ${slug}:`, e.message);
    }
  }
}

updateCategoryImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
