export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado. Se requiere inicio de sesión.' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const canSeeProvidersAndCosts = userRole === 'ADMIN' || userRole === 'COORDINATOR';

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const providerParam = searchParams.get('provider')?.trim() || '';
    // Only ADMIN/COORDINATOR can filter by provider
    const provider = canSeeProvidersAndCosts ? providerParam : '';
    const categoryId = searchParams.get('categoryId')?.trim() || '';
    // Only ADMIN/COORDINATOR can view trash/deleted items
    const showDeleted = canSeeProvidersAndCosts && searchParams.get('showDeleted') === 'true';
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
        where.AND = tokens.map((token) => {
          const conditions: any[] = [
            { name: { contains: token, mode: 'insensitive' } },
            { sku: { contains: token, mode: 'insensitive' } },
            { specs: { contains: token, mode: 'insensitive' } },
            { description: { contains: token, mode: 'insensitive' } },
            { category: { name: { contains: token, mode: 'insensitive' } } },
          ];
          if (canSeeProvidersAndCosts) {
            conditions.push({ provider: { contains: token, mode: 'insensitive' } });
          }
          return { OR: conditions };
        });
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
        compareAtPrice: canSeeProvidersAndCosts,
        stock: true,
        provider: canSeeProvidersAndCosts,
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
      let marginUsd = 0;
      let marginPercent = 0;

      // Calcular costo base interno para derivar el descuento máximo permitido
      let baseCost = 0;
      if (p.compareAtPrice && p.compareAtPrice > 0 && p.compareAtPrice < salePrice) {
        baseCost = p.compareAtPrice;
      } else {
        baseCost = Math.round((salePrice / 1.15) * 100) / 100;
      }
      const rawMarginUsd = Math.max(0, Math.round((salePrice - baseCost) * 100) / 100);
      const maxDiscountUsd = rawMarginUsd > 0 ? Math.round((rawMarginUsd / 2) * 100) / 100 : 0;
      const maxDiscountPercent = salePrice > 0 && maxDiscountUsd > 0 ? Math.round(((maxDiscountUsd / salePrice) * 100) * 100) / 100 : 0;

      if (canSeeProvidersAndCosts) {
        costPrice = baseCost;
        marginUsd = rawMarginUsd;
        marginPercent = costPrice > 0 ? Math.round(((salePrice - costPrice) / costPrice) * 10000) / 100 : 15.0;
      }

      return {
        id: p.id,
        sku: p.sku || 'SIN-SKU',
        name: p.name,
        provider: canSeeProvidersAndCosts ? (p.provider || 'Atomic') : '',
        category: p.category?.name || 'General',
        categoryId: p.category?.id || '',
        stock: p.stock ?? 0,
        costPrice: canSeeProvidersAndCosts ? costPrice : 0,
        salePrice,
        marginUsd: canSeeProvidersAndCosts ? marginUsd : 0,
        marginPercent: canSeeProvidersAndCosts ? marginPercent : 0,
        maxDiscountUsd,
        maxDiscountPercent,
      };
    });


    let providers: string[] = [];
    if (canSeeProvidersAndCosts) {
      const providersRaw = await prisma.product.findMany({
        where: { isDeleted: showDeleted ? true : false },
        select: { provider: true },
        distinct: ['provider'],
      });
      providers = providersRaw.map((p) => p.provider).filter(Boolean) as string[];
    }

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
      canSeeProvidersAndCosts,
    });
  } catch (err: any) {
    console.error('Error fetching matriz precios:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

