const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function run() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {name: {contains: 'antipanico', mode: 'insensitive'}},
        {name: {contains: 'antipánico', mode: 'insensitive'}},
        {name: {contains: 'push', mode: 'insensitive'}},
        {name: {contains: 'toallero', mode: 'insensitive'}},
        {name: {contains: 'eiffel', mode: 'insensitive'}},
        {name: {contains: 'rojo de 1 metro', mode: 'insensitive'}}
      ]
    }
  });

  for (const p of products) {
    if (!p.images) continue;
    let images = [];
    try {
        images = JSON.parse(p.images);
    } catch (e) {
        continue;
    }

    if (images.length <= 1) continue;

    // We will sort images by file size (largest first)
    // The scraper saved them in public/img/panic-bars/new/
    // Let's resolve their absolute paths and get sizes
    const imgData = images.map(imgUrl => {
        let size = 0;
        try {
            // The url is like /img/panic-bars/new/xxx.png
            const relPath = imgUrl.replace(/^\//, ''); // remove leading slash
            const absPath = path.join(__dirname, 'public', relPath);
            if (fs.existsSync(absPath)) {
                size = fs.statSync(absPath).size;
            }
        } catch (e) {}
        return { url: imgUrl, size };
    });

    // Sort descending by size
    imgData.sort((a, b) => b.size - a.size);

    const newImagesArray = imgData.map(img => img.url);

    await prisma.product.update({
        where: { id: p.id },
        data: { images: JSON.stringify(newImagesArray) }
    });
    console.log("Reordered images for:", p.name, "Largest is now:", newImagesArray[0]);
  }
}

run();
