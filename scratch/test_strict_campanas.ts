import { prisma } from '../src/lib/prisma';

async function main() {
  const allProducts = await prisma.product.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      price: true,
      category: { select: { name: true } },
      specs: true
    }
  });

  // Palabras prohibidas que indican ruido (no son campanas de cocina)
  const excludeWords = [
    'perno', 'pernos', 'tuercas', 'patas', 'rodamientos', 'rótulas', 'cremallera', 'válvula',
    'golpes', 'carrocería', 'combustible', 'jugo', 'frutas', 'arrocera', 'molino', 'exprimidor',
    'cuchillo', 'cinta', 'soporte', 'papel', 'filtro', 'encimera', 'llave', 'bomba', 'alicate',
    'gabinete', 'caja', 'rack', 'panel', 'reloj', 'inodoro', 'rodillo', 'puente', 'desenllantadora'
  ];

  const realCampanas = allProducts.filter(p => {
    const nameLower = p.name.toLowerCase();

    // Debe contener 'campana' o ser un modelo específico de campana (como Modena Pared, Bari Pared, Treviso Pared, Compostela, Galicia, Ibiza, Sevilla, Tenerife, etc.)
    const isCampanaName =
      nameLower.includes('campana') ||
      (nameLower.includes('pared') && (nameLower.includes('modena') || nameLower.includes('bari') || nameLower.includes('treviso'))) ||
      (nameLower.includes('isla') && !nameLower.includes('mesa'));

    if (!isCampanaName) return false;

    // Excluir cualquier producto con palabras de ruido
    for (const word of excludeWords) {
      if (nameLower.includes(word)) return false;
    }

    return true;
  });

  console.log(`FOUND ${realCampanas.length} REAL KITCHEN HOODS:`);
  realCampanas.forEach(p => {
    console.log(`- [${p.id}] ${p.name} | Cat: ${p.category?.name || 'N/A'} | $${p.price}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
