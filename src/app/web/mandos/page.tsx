import { prisma } from '@/lib/prisma';
import MandosClient from './MandosClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mandos y Controles para Consolas | PS5, PS4, Xbox, Switch — ATOMIC GAMING',
  description:
    'Catálogo oficial de mandos inalámbricos y controles para PlayStation 5, PS4, Xbox Series X|S, Xbox One, Nintendo Switch y PlayStation Portal. Envíos inmediatos a todo el Ecuador.',
};

export default async function MandosLandingPage() {
  const rawProducts = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { categoryId: 'cmsqsbjbj0000l9lbhbls3ag9' },
        { category: { name: { contains: 'mando', mode: 'insensitive' } } },
        { name: { contains: 'DualSense', mode: 'insensitive' } },
        { name: { contains: 'DualShock', mode: 'insensitive' } },
        { name: { contains: 'PlayStation Portal', mode: 'insensitive' } },
        { name: { contains: 'Control Inalámbrico', mode: 'insensitive' } },
        { name: { contains: 'Mando Pro', mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      images: true,
      specs: true,
      description: true,
      category: { select: { name: true } },
    },
    orderBy: { price: 'desc' },
  });

  // Deduplicate by name keeping highest price
  const seen = new Map<string, (typeof rawProducts)[0]>();
  for (const p of rawProducts) {
    const key = p.name.toLowerCase().trim();
    if (!seen.has(key) || p.price > seen.get(key)!.price) seen.set(key, p);
  }
  const uniqueProducts = Array.from(seen.values()).sort((a, b) => a.price - b.price);

  return <MandosClient products={uniqueProducts} />;
}
