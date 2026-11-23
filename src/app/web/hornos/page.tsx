import { prisma } from '@/lib/prisma';
import HornosClient from './HornosClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hornos de Empotrar a Gas y Eléctricos con Convección | ATOMIC Ecuador',
  description:
    'Catálogo exclusivo de hornos de empotrar a gas y eléctricos de alta gama, hornos con convección 3D y microondas empotrables para nicho de 60 cm en Ecuador.',
};

export default async function HornosLandingPage() {
  const excludeKeywords = [
    'campana', 'extractora', 'retráctil', 'isla', 'pared', 'timbre',
    'processor', 'procesador', 'alexa', 'tablet', 'laptop', 'celular',
    'encimera',
  ];

  let unique: any[] = [];
  try {
    const rawProducts = await prisma.product.findMany({
      where: {
        isDeleted: false,
        OR: [
          { name: { contains: 'horno', mode: 'insensitive' } },
          { category: { name: { contains: 'horno', mode: 'insensitive' } } },
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

    const products = rawProducts.filter((p) => {
      const nameLow = p.name.toLowerCase();
      const isHorno = nameLow.includes('horno');
      if (!isHorno) return false;
      for (const kw of excludeKeywords) {
        if (nameLow.includes(kw)) return false;
      }
      return true;
    });

    const seen = new Map<string, (typeof products)[0]>();
    for (const p of products) {
      const key = p.name.toLowerCase().trim();
      if (!seen.has(key) || p.price > seen.get(key)!.price) seen.set(key, p);
    }
    unique = Array.from(seen.values()).sort((a, b) => b.price - a.price);
  } catch (e) {
    console.error("Error loading hornos products:", e);
  }

  return <HornosClient products={unique} />;
}
