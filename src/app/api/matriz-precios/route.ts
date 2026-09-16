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
    const provider = canSeeProvidersAndCosts ? providerParam : '';
    const categoryId = searchParams.get('categoryId')?.trim() || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const where: any = {
      isDeleted: false,
    };

    if (search) {
      const conditions: any[] = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { specs: { contains: search, mode: 'insensitive' } },
      ];
      if (canSeeProvidersAndCosts) {
        conditions.push({ provider: { contains: search, mode: 'insensitive' } });
      }
      where.OR = conditions;
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

    // Mapeo con cálculo exacto de costo, precio y margen
    const formattedProducts = products.map((p) => {
      const salePrice = p.price || 0;
      let costPrice = 0;
      let marginUsd = 0;
      let marginPercent = 0;

      if (canSeeProvidersAndCosts) {
        if (p.compareAtPrice && p.compareAtPrice > 0 && p.compareAtPrice < salePrice) {
          costPrice = p.compareAtPrice;
        } else {
          costPrice = Math.round((salePrice / 1.15) * 100) / 100;
        }
        marginUsd = Math.round((salePrice - costPrice) * 100) / 100;
        marginPercent = costPrice > 0 ? Math.round(((salePrice - costPrice) / costPrice) * 10000) / 100 : 15.0;
      }

      return {
        id: p.id,
        sku: p.sku || 'SIN-SKU',
        name: p.name,
        provider: canSeeProvidersAndCosts ? (p.provider || 'Atomic') : '',
        category: p.category?.name || 'General',
        stock: p.stock ?? 0,
        costPrice: canSeeProvidersAndCosts ? costPrice : 0,
        salePrice,
        marginUsd: canSeeProvidersAndCosts ? marginUsd : 0,
        marginPercent: canSeeProvidersAndCosts ? marginPercent : 0,
      };
    });

    // Obtener lista de proveedores únicos solo para admin/coordinador
    let providers: string[] = [];
    if (canSeeProvidersAndCosts) {
      const providersRaw = await prisma.product.findMany({
        where: { isDeleted: false },
        select: { provider: true },
        distinct: ['provider'],
      });
      providers = providersRaw.map((p) => p.provider).filter(Boolean) as string[];
    }

    // Obtener categorías únicas para los filtros
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
