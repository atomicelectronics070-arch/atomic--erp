const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function run() {
  const data = JSON.parse(fs.readFileSync('scraped_products.json', 'utf8'));

  // Delete all existing panic bars
  console.log('Deleting old panic bars...');
  await prisma.product.deleteMany({
    where: {
      OR: [
        {name: {contains: 'antipanico', mode: 'insensitive'}},
        {name: {contains: 'antipánico', mode: 'insensitive'}}
      ]
    }
  });

  console.log('Inserting new exact products...');
  for (const p of data) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        description: p.description || "",
        images: JSON.stringify(p.images),
        // Just store the category name in provider or create a category, but the UI might just fetch by keyword
      }
    });
    console.log(`Inserted: ${p.name}`);
  }

  console.log('Database updated successfully!');
}

run()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
