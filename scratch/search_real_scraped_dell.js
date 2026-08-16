const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== BUSCANDO IMÁGENES REALES DE SCRAPER / PROVEEDOR ===');

  // Check DB for any other products with Dell or AIO and real HTTP images
  const dbProds = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: 'AIO', mode: 'insensitive' } },
        { name: { contains: 'Dell', mode: 'insensitive' } },
        { name: { contains: 'Inspiron', mode: 'insensitive' } },
        { name: { contains: 'Optiplex', mode: 'insensitive' } },
        { name: { contains: '27', mode: 'insensitive' } }
      ]
    },
    select: { id: true, name: true, images: true, provider: true }
  });

  console.log(`Encontrados en DB: ${dbProds.length} productos.`);
  dbProds.forEach(p => {
    console.log(`- DB: ${p.name} | Prov: ${p.provider} | Images: ${p.images}`);
  });

  // Check scraped_products.json if it exists
  const files = ['scraped_products.json', 'campanas_200.json', 'bpecuador_subcategories.json'];
  for (const f of files) {
    if (fs.existsSync(f)) {
      try {
        const content = JSON.parse(fs.readFileSync(f, 'utf8'));
        if (Array.isArray(content)) {
          const matches = content.filter(x => {
            const name = (x.name || x.title || '').toLowerCase();
            return name.includes('dell') || name.includes('aio') || name.includes('27');
          });
          console.log(`Archivo ${f}: ${matches.length} coincidencias.`);
          matches.slice(0, 5).forEach(m => {
            console.log(`  * ${m.name || m.title} -> Img: ${JSON.stringify(m.images || m.image || m.img)}`);
          });
        }
      } catch (e) {}
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
