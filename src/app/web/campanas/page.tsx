import { prisma } from '@/lib/prisma';
import CampanasClient from './CampanasClient';

export const dynamic = 'force-dynamic';

export default async function CampanasPremiumPage() {
  const campanas = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { name: { contains: 'extractor', mode: 'insensitive' } },
        { description: { contains: 'campana', mode: 'insensitive' } },
        { category: { name: { contains: 'campana', mode: 'insensitive' } } },
        { category: { name: { contains: 'extractor', mode: 'insensitive' } } },
        { category: { name: { contains: 'cocina', mode: 'insensitive' } } },
      ],
      isDeleted: false,
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

  // Deduplicar por nombre conservando la mejor coincidencia
  const seen = new Map<string, (typeof campanas)[0]>();
  for (const c of campanas) {
    const key = c.name.toLowerCase().trim();
    if (!seen.has(key) || c.price > seen.get(key)!.price) {
      seen.set(key, c);
    }
  }
  const uniqueCampanas = Array.from(seen.values()).sort((a, b) => b.price - a.price);

  return <CampanasClient initialProducts={uniqueCampanas} />;
}
