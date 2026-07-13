const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const products = await prisma.product.findMany({ 
    where: { 
      OR: [
        {name: {contains: 'antipanico', mode: 'insensitive'}}, 
        {name: {contains: 'antipánico', mode: 'insensitive'}}
      ] 
    } 
  });
  
  for (const p of products) {
    let newImages = p.images;
    
    if (p.name.includes('Exterior')) {
        newImages = '["/img/panic-bars/eiffel.png"]';
    } else if (p.name.includes('Empuje')) {
        newImages = '["/img/panic-bars/tampa-1.png"]';
    } else if (p.name === 'Barra Antipánico de 2 Puntos') {
        newImages = '["/img/panic-bars/tampa-2.webp"]';
    } else if (p.name.includes('(1 Punto)')) {
        newImages = '["/img/panic-bars/cronte-1.jpg"]';
    } else if (p.name.includes('Doble (2 Puntos)')) {
        newImages = '["/img/panic-bars/cronte-2.jpg"]';
    } else if (p.name === 'Barra Antipánico de 1 Punto') {
        newImages = '["/img/panic-bars/tampa-1.png"]'; // Orlando is basically Tampa 1
    }

    await prisma.product.update({
      where: { id: p.id },
      data: { images: newImages }
    });
    console.log(`Updated images for: ${p.name}`);
  }
  
  console.log('Database image paths updated to local files.');
}

run()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
