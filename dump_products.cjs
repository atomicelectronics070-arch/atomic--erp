const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function dumpProducts() {
  console.log('Fetching products from database...');
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      include: {
        category: true
      }
    });

    console.log(`Found ${products.length} active products.`);

    const formattedProducts = products.map(p => {
      let imgUrl = 'https://via.placeholder.com/400';
      if (p.images) {
        if (p.images.trim().startsWith('[')) {
          try {
            const arr = JSON.parse(p.images);
            if (arr && arr.length > 0) imgUrl = arr[0];
          } catch(e) {
            imgUrl = p.images.split(',')[0].replace(/\[|\]|"/g, '');
          }
        } else {
          imgUrl = p.images.split(',')[0].replace(/\[|\]|"/g, '');
        }
      }

      return {
        id: p.id,
        name: p.name,
        code: p.sku || '',
        price: p.price,
        category: p.category ? p.category.name : 'Sin Categoría',
        image: imgUrl
      };
    });

    const outputPath = path.join('C:', 'Users', 'SANTIAGO', '.gemini', 'antigravity', 'scratch', 'atomic-catalog', 'src', 'products.json');
    fs.writeFileSync(outputPath, JSON.stringify(formattedProducts, null, 2), 'utf8');
    
    console.log('Successfully written to', outputPath);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

dumpProducts();
