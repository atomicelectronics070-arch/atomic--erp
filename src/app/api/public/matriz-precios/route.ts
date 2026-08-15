export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const provider = searchParams.get('provider')?.trim() || '';
    const categoryId = searchParams.get('categoryId')?.trim() || '';
    const showDeleted = searchParams.get('showDeleted') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '150', 10);

    const where: any = {
      isDeleted: showDeleted ? true : false,
    };

    if (search) {
      // Clean stop words and tokenize
      const stopWords = new Set(['de', 'del', 'la', 'el', 'en', 'para', 'con', 'un', 'una', 'y']);
      const tokens = search
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && !stopWords.has(t.toLowerCase()));

      if (tokens.length > 0) {
        where.AND = tokens.map((token) => ({
          OR: [
            { name: { contains: token, mode: 'insensitive' } },
            { sku: { contains: token, mode: 'insensitive' } },
            { provider: { contains: token, mode: 'insensitive' } },
            { specs: { contains: token, mode: 'insensitive' } },
            { description: { contains: token, mode: 'insensitive' } },
            { category: { name: { contains: token, mode: 'insensitive' } } },
          ],
        }));
      }
    }

    if (provider && provider !== 'ALL') {
      where.provider = { equals: provider, mode: 'insensitive' };
    }

    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId;
    }

    const totalProducts = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        sku: true,
        name: true,
        price: true,
        compareAtPrice: true,
        stock: true,
        provider: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedProducts = products.map((p) => {
      const salePrice = p.price || 0;
      let costPrice = 0;
      if (p.compareAtPrice && p.compareAtPrice > 0 && p.compareAtPrice < salePrice) {
        costPrice = p.compareAtPrice;
      } else {
        costPrice = Math.round((salePrice / 1.15) * 100) / 100;
      }

      const marginUsd = Math.round((salePrice - costPrice) * 100) / 100;
      const marginPercent = costPrice > 0 ? Math.round(((salePrice - costPrice) / costPrice) * 10000) / 100 : 15.0;

      return {
        id: p.id,
        sku: p.sku || 'SIN-SKU',
        name: p.name,
        provider: p.provider || 'Atomic',
        category: p.category?.name || 'General',
        categoryId: p.category?.id || '',
        stock: p.stock ?? 0,
        costPrice,
        salePrice,
        marginUsd,
        marginPercent,
      };
    });

    const providersRaw = await prisma.product.findMany({
      where: { isDeleted: showDeleted ? true : false },
      select: { provider: true },
      distinct: ['provider'],
    });
    const providers = providersRaw.map((p) => p.provider).filter(Boolean);

    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products: formattedProducts,
      providers,
      categories,
    });
  } catch (err: any) {
    console.error('Error fetching matriz precios:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
