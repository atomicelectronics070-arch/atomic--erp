export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = String((session?.user as any)?.role || '').toUpperCase();
    const canSeeProvidersAndCosts = userRole.includes('ADMIN') || userRole.includes('COORDINATOR') || userRole.includes('MANAGEMENT') || userRole.includes('SUPER_ADMIN');

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const providerParam = searchParams.get('provider')?.trim() || '';
    const provider = canSeeProvidersAndCosts ? providerParam : '';
    const categoryId = searchParams.get('categoryId')?.trim() || '';
    const showDeleted = canSeeProvidersAndCosts && searchParams.get('showDeleted') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '150', 10);

    const where: any = {
      isDeleted: showDeleted ? true : false,
      NOT: [
        { name: { contains: 'quiénes somos', mode: 'insensitive' } },
        { name: { contains: 'quienes somos', mode: 'insensitive' } },
        { name: { contains: 'politica de', mode: 'insensitive' } },
        { name: { contains: 'política de', mode: 'insensitive' } },
        { name: { contains: 'terminos y condiciones', mode: 'insensitive' } },
      ],
    };

    const isCameraCategoryOrSearch = 
      categoryId === 'cmr1ljg860003enspbm1m5tic' || 
      search.toLowerCase().includes('camara') || 
      search.toLowerCase().includes('cámara');

    if (isCameraCategoryOrSearch) {
      where.NOT.push(
        { name: { contains: 'CASE CORSAIR', mode: 'insensitive' } },
        { name: { contains: 'PATCH CORD', mode: 'insensitive' } },
        { name: { contains: 'CABLE DE RED', mode: 'insensitive' } },
        { name: { contains: 'BRACKET MOUNTING', mode: 'insensitive' } },
        { name: { contains: 'CINTA LED', mode: 'insensitive' } },
        { name: { contains: 'Botonera', mode: 'insensitive' } },
        { name: { contains: 'CABLE BNC', mode: 'insensitive' } },
        { name: { contains: 'CARD READER', mode: 'insensitive' } },
        { name: { contains: 'Soporte Para Monitor', mode: 'insensitive' } }
      );
    }

    if (search) {
      const stopWords = new Set(['de', 'del', 'la', 'el', 'en', 'para', 'con', 'un', 'una', 'y']);
      const tokens = search
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && !stopWords.has(t.toLowerCase()));

      const getVariants = (w: string) => {
        const lower = w.toLowerCase();
        const clean = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const set = new Set<string>([w, lower, clean]);
        if (clean === 'camara') { set.add('cámara'); set.add('camaras'); set.add('cámaras'); }
        if (clean === 'bateria') { set.add('batería'); set.add('baterias'); set.add('baterías'); }
        if (clean === 'telefono') { set.add('teléfono'); set.add('telefonos'); set.add('teléfonos'); }
        if (clean === 'linea') { set.add('línea'); set.add('lineas'); set.add('líneas'); }
        if (clean === 'electronica') { set.add('electrónica'); }
        if (clean === 'cocina') { set.add('cocinas'); set.add('encimera'); set.add('induccion'); }
        if (clean === 'laptop') { set.add('laptops'); set.add('portatil'); set.add('portátil'); }
        return Array.from(set);
      };

      if (tokens.length > 0) {
        where.AND = tokens.map((token) => {
          const variants = getVariants(token);
          const conditions: any[] = [];
          for (const v of variants) {
            conditions.push({ name: { contains: v, mode: 'insensitive' } });
            conditions.push({ sku: { contains: v, mode: 'insensitive' } });
            conditions.push({ specs: { contains: v, mode: 'insensitive' } });
            conditions.push({ description: { contains: v, mode: 'insensitive' } });
            conditions.push({ category: { name: { contains: v, mode: 'insensitive' } } });
            if (canSeeProvidersAndCosts) {
              conditions.push({ provider: { contains: v, mode: 'insensitive' } });
            }
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

    const selectFields: any = {
      id: true,
      sku: true,
      name: true,
      price: true,
      stock: true,
      images: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    };

    if (canSeeProvidersAndCosts) {
      selectFields.compareAtPrice = true;
      selectFields.provider = true;
    }

    const products = await prisma.product.findMany({
      where,
      select: selectFields,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedProducts = products.map((p: any) => {
      const salePrice = p.price || 0;
      let costPrice = 0;
      let marginUsd = 0;
      let marginPercent = 0;

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

      // Extraer URL de imagen limpia descartando logos de proveedores o marcas
      const isProviderLogo = (url: string) => {
        if (!url || typeof url !== 'string') return true;
        const u = url.toLowerCase();
        return (
          u.includes('tms_logow') ||
          u.includes('tecnomega') ||
          u.includes('tecnomegastore') ||
          u.includes('placetopay') ||
          u.includes('servientrega') ||
          u.includes('/marcas/') ||
          u.includes('cropped-favicon') ||
          u.includes('pago-seguro') ||
          u.includes('hubfunciones')
        );
      };

      let cleanImage = '';
      if (p.images) {
        try {
          if (typeof p.images === 'string' && p.images.startsWith('[') && p.images.endsWith(']')) {
            const parsed = JSON.parse(p.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const valid = parsed.find((img: string) => !isProviderLogo(img));
              cleanImage = valid || '';
            }
          } else if (typeof p.images === 'string') {
            const first = p.images.split(',')[0].trim();
            cleanImage = !isProviderLogo(first) ? first : '';
          }
        } catch (_) {
          cleanImage = !isProviderLogo(p.images) ? p.images : '';
        }
      }

      return {
        id: p.id,
        sku: p.sku || 'SIN-SKU',
        name: p.name,
        image: cleanImage,
        images: p.images,
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
      select: { 
        id: true, 
        name: true,
        _count: { select: { products: true } }
      },
      where: {
        products: { some: { isDeleted: false } }
      },
      orderBy: { products: { _count: 'desc' } },
      take: 25,
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
