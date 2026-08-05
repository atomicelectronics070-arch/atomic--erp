import { prisma } from '@/lib/prisma';
import CampanasClient from './CampanasClient';

export const dynamic = 'force-dynamic';

export default async function CampanasPremiumPage() {
  // Palabras prohibidas que indican productos que NO son campanas extractoras de cocina
  const excludeKeywords = [
    'perno', 'pernos', 'tuercas', 'patas', 'rodamientos', 'rótulas', 'cremallera', 'válvula',
    'golpes', 'carrocería', 'combustible', 'jugo', 'frutas', 'arrocera', 'molino', 'exprimidor',
    'cuchillo', 'cinta', 'soporte', 'papel', 'filtro', 'encimera', 'llave', 'bomba', 'alicate',
    'gabinete', 'caja', 'rack', 'panel', 'reloj', 'inodoro', 'rodillo', 'puente', 'desenllantadora',
    'sirena', 'aislador', 'tubo', 'recubrimiento', 'soporte', 'papel'
  ];

  const rawProducts = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { name: { contains: 'pared', mode: 'insensitive' } },
        { name: { contains: 'isla', mode: 'insensitive' } },
        { category: { name: { contains: 'campana', mode: 'insensitive' } } },
        { category: { name: { contains: 'extracción', mode: 'insensitive' } } },
      ]
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      images: true,
      specs: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { price: 'desc' },
  });

  // Filtrado estricto para eliminar cualquier producto que NO sea una campana extractora real
  const filteredProducts = rawProducts.filter((p) => {
    const nameLower = p.name.toLowerCase();

    // 1. Debe llamarse "Campana..." o ser un modelo específico de pared/isla como Modena Pared, Bari Pared, Treviso Pared
    const isHood =
      nameLower.includes('campana') ||
      (nameLower.includes('pared') && (nameLower.includes('modena') || nameLower.includes('bari') || nameLower.includes('treviso'))) ||
      (nameLower.includes('isla') && !nameLower.includes('mesa'));

    if (!isHood) return false;

    // 2. Excluir productos con cualquier palabra de ruido
    for (const kw of excludeKeywords) {
      if (nameLower.includes(kw)) return false;
    }

    return true;
  });

  // Deduplicar por nombre conservando la variante con el mejor precio
  const seen = new Map<string, (typeof filteredProducts)[0]>();
  for (const c of filteredProducts) {
    const key = c.name.toLowerCase().trim();
    if (!seen.has(key) || c.price > seen.get(key)!.price) {
      seen.set(key, c);
    }
  }

  const uniqueCampanas = Array.from(seen.values()).sort((a, b) => b.price - a.price);

  return <CampanasClient initialProducts={uniqueCampanas} />;
}
