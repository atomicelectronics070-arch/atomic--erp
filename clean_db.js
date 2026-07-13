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
    let newName = p.name;
    newName = newName.replace(/Cronte CR-500/ig, '').replace(/Cronte CR-800/ig, '');
    newName = newName.replace(/Cronte/ig, '').replace(/Yale/ig, '').replace(/Eiffel/ig, '').replace(/Tampa/ig, '').replace(/Orlando/ig, '');
    newName = newName.replace(/\s+/g, ' ').trim();
    
    // Si quedó como "Barra Antipánico de 2 Puntos", "Barra Antipánico (1 Punto)", etc.
    if (newName === 'Manija Para Barra Antipánico') newName = 'Manija Exterior para Barra Antipánico';
    if (newName === 'Barra Antipánico') newName = 'Barra Antipánico de Empuje';
    
    let newImages = p.images;
    if (newImages && newImages.includes('amazon.com')) {
       newImages = '["/img/panic_bar_fallback.png"]';
    }
    
    await prisma.product.update({
      where: { id: p.id },
      data: { name: newName, images: newImages, provider: null }
    });
  }
  console.log('Database cleaned successfully.');
}

run()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
