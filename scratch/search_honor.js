const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== BUSCANDO HONOR MAGIC EN LA BASE DE DATOS Y EN DESCARGAS ===');

  // Check Downloads directory for any Honor Magic images downloaded recently
  const downloadsDir = 'C:\\Users\\SANTIAGO\\Downloads';
  if (fs.existsSync(downloadsDir)) {
    const files = fs.readdirSync(downloadsDir);
    const honorFiles = files.filter(f => f.toLowerCase().includes('honor') || f.toLowerCase().includes('magic') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.jpg'));
    console.log('Archivos de imagen recientes en Downloads:', honorFiles.slice(0, 10));
  }

  // Check DB for Honor or Magic products
  const prods = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: 'honor', mode: 'insensitive' } },
        { name: { contains: 'magic', mode: 'insensitive' } },
        { name: { contains: '7 lite', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Encontrados en DB: ${prods.length} productos.`);
  prods.forEach(p => {
    console.log(`- ${p.id} | ${p.name} | $${p.price} | Stock: ${p.stock}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
