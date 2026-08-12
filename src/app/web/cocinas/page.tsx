import { prisma } from '@/lib/prisma';
import CocinasClient from './CocinasClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Encimeras & Hornos | Equipamiento Premium de Cocina — ATOMIC',
  description:
    'Descubre encimeras a gas e inducción y hornos de empotrar de alta gama. Filtra por número de hornillas y dimensiones. Combos especiales disponibles. Envío a todo el Ecuador.',
};

export default async function CocinasLandingPage() {
  const excludeKeywords = [
    'campana', 'extractora', 'retráctil', 'isla', 'pared', 'timbre',
    'processor', 'procesador', 'alexa', 'tablet', 'laptop', 'celular',
  ];

  const rawProducts = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: 'encimera', mode: 'insensitive' } },
        { name: { contains: 'horno', mode: 'insensitive' } },
        { category: { name: { contains: 'encimera', mode: 'insensitive' } } },
        { category: { name: { contains: 'horno', mode: 'insensitive' } } },
        { category: { name: { contains: 'cocina y', mode: 'insensitive' } } },
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
    const isEncimera = nameLow.includes('encimera');
    const isHorno = nameLow.includes('horno');
    if (!isEncimera && !isHorno) return false;
    for (const kw of excludeKeywords) {
      if (nameLow.includes(kw)) return false;
    }
    return true;
  });

  // Deduplicate by name keeping highest price
  const seen = new Map<string, (typeof products)[0]>();
  for (const p of products) {
    const key = p.name.toLowerCase().trim();
    if (!seen.has(key) || p.price > seen.get(key)!.price) seen.set(key, p);
  }
  const unique = Array.from(seen.values()).sort((a, b) => b.price - a.price);

  return <CocinasClient products={unique} />;
}
