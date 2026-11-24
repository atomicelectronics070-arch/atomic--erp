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
      price: { gt: 0 },
      NOT: [
        { name: { contains: 'quiénes somos', mode: 'insensitive' } },
        { name: { contains: 'quienes somos', mode: 'insensitive' } },
        { name: { contains: 'politica de', mode: 'insensitive' } },
        { name: { contains: 'política de', mode: 'insensitive' } },
        { name: { contains: 'terminos y condiciones', mode: 'insensitive' } },
        { name: { contains: 'PRODUCTOS\n', mode: 'insensitive' } },
        { name: { contains: '\nPRODUCTOS', mode: 'insensitive' } },
        { name: { contains: 'PRECIOS DE LOCURA', mode: 'insensitive' } },
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

    const searchLower = (search || '').toLowerCase();
    const isIphoneSearch = searchLower.includes('iphone') || searchLower.includes('i phone');
    const wantsAccessories = 
      searchLower.includes('cable') || 
      searchLower.includes('cargador') || 
      searchLower.includes('funda') || 
      searchLower.includes('case') || 
      searchLower.includes('soporte') || 
      searchLower.includes('powerbank') || 
      searchLower.includes('banco') || 
      searchLower.includes('microfono') || 
      searchLower.includes('micrófono');

    if (isIphoneSearch && !wantsAccessories) {
      where.NOT.push(
        { name: { contains: 'CABLE', mode: 'insensitive' } },
        { name: { contains: 'CARGADOR', mode: 'insensitive' } },
        { name: { contains: 'BANCO DE CARGA', mode: 'insensitive' } },
        { name: { contains: 'SOPORTE', mode: 'insensitive' } },
        { name: { contains: 'MICROFONO', mode: 'insensitive' } },
        { name: { contains: 'MICRÓFONO', mode: 'insensitive' } },
        { name: { contains: 'VIDEÓFONO', mode: 'insensitive' } },
        { name: { contains: 'VIDEOPORTERO', mode: 'insensitive' } },
        { name: { contains: 'TIMBRE', mode: 'insensitive' } }
      );
    }

    const isLaptopCategoryOrSearch = 
      categoryId === 'cmrfunoy400031d1g55magimc' || 
      searchLower.includes('laptop') || 
      searchLower.includes('notebook') || 
      searchLower.includes('portatil') || 
      searchLower.includes('portátil');

    const wantsLaptopParts = 
      searchLower.includes('bateria') || 
      searchLower.includes('batería') || 
      searchLower.includes('cargador') || 
      searchLower.includes('teclado') || 
      searchLower.includes('repuesto') || 
      searchLower.includes('ventilador') || 
      searchLower.includes('pantalla') || 
      searchLower.includes('flex');

    if (isLaptopCategoryOrSearch && !wantsLaptopParts) {
      where.NOT.push(
        { name: { contains: 'VENTILADOR', mode: 'insensitive' } },
        { name: { contains: 'BATERIA', mode: 'insensitive' } },
        { name: { contains: 'BATERÍA', mode: 'insensitive' } },
        { name: { contains: 'TECLADO PARA', mode: 'insensitive' } },
        { name: { contains: 'VC-TECLADO', mode: 'insensitive' } },
        { name: { contains: 'PIN DE CARGA', mode: 'insensitive' } },
        { name: { contains: 'FLEX DE VIDEO', mode: 'insensitive' } },
        { name: { contains: 'BISAGRA', mode: 'insensitive' } },
        { name: { contains: 'CABLE LOCK', mode: 'insensitive' } },
        { name: { contains: 'STAND PARA NOTEBOOK', mode: 'insensitive' } },
        { name: { contains: 'COBERTOR NOTEBOOK', mode: 'insensitive' } },
        { name: { contains: 'MOCHILA NOTEBOOK', mode: 'insensitive' } },
        { name: { contains: 'SO-DIMM', mode: 'insensitive' } },
        { name: { contains: 'SIERRA', mode: 'insensitive' } },
        { name: { contains: 'TALADRO', mode: 'insensitive' } },
        { name: { contains: 'RASURADORA', mode: 'insensitive' } },
        { name: { contains: 'SECADOR', mode: 'insensitive' } },
        { name: { contains: 'INODORO', mode: 'insensitive' } },
        { name: { contains: 'EXPRIMIDOR', mode: 'insensitive' } },
        { name: { contains: 'PERFUME', mode: 'insensitive' } },
        { name: { contains: 'RADIO PORTATIL', mode: 'insensitive' } },
        { name: { contains: 'PLA+2.0', mode: 'insensitive' } },
        { name: { contains: 'PLA+1.0', mode: 'insensitive' } },
        { name: { contains: 'TPU Black', mode: 'insensitive' } },
        { name: { contains: 'TPU Blue', mode: 'insensitive' } },
        { name: { contains: 'PETG Glow', mode: 'insensitive' } },
        { name: { contains: 'ADAPTADOR CONVERTIDOR USB', mode: 'insensitive' } },
        { name: { contains: 'MBO ASUS', mode: 'insensitive' } },
        { name: { contains: 'CASE ASUS', mode: 'insensitive' } },
        { name: { contains: 'VIDEO ASUS', mode: 'insensitive' } },
        { name: { contains: 'FUENTE DE PODER', mode: 'insensitive' } },
        { name: { contains: 'MOUSE ASUS', mode: 'insensitive' } }
      );
    }

    const isCerraduraCategoryOrSearch = 
      categoryId === 'cmoe77b3r000bwwr9nado4n9q' || 
      searchLower.includes('cerradura') || 
      searchLower.includes('cerrojo') || 
      searchLower.includes('smart lock') ||
      searchLower.includes('chapa');

    const wantsDoorphone = 
      searchLower.includes('portero') || 
      searchLower.includes('videoportero') || 
      searchLower.includes('citofono') || 
      searchLower.includes('citófono') || 
      searchLower.includes('intercom') || 
      searchLower.includes('timbre') || 
      searchLower.includes('botonera') ||
      searchLower.includes('frente de calle');

    if (isCerraduraCategoryOrSearch && !wantsDoorphone) {
      where.NOT.push(
        { name: { contains: 'PORTERO', mode: 'insensitive' } },
        { name: { contains: 'VIDEOPORTERO', mode: 'insensitive' } },
        { name: { contains: 'CITOFONO', mode: 'insensitive' } },
        { name: { contains: 'CITÓFONO', mode: 'insensitive' } },
        { name: { contains: 'TIMBRE', mode: 'insensitive' } },
        { name: { contains: 'BOTONERA', mode: 'insensitive' } },
        { name: { contains: 'FRENTE DE CALLE', mode: 'insensitive' } },
        { name: { contains: 'INTERCOM', mode: 'insensitive' } },
        { name: { contains: 'RECOLECTOR', mode: 'insensitive' } },
        { name: { contains: 'CARD READER', mode: 'insensitive' } },
        { name: { contains: 'HUB USB', mode: 'insensitive' } },
        { name: { contains: 'RATON', mode: 'insensitive' } },
        { name: { contains: 'RATÓN', mode: 'insensitive' } },
        { name: { contains: 'LOGITECH', mode: 'insensitive' } },
        { name: { contains: 'DIAGNOSTICO', mode: 'insensitive' } },
        { name: { contains: 'DIAGNÓSTICO', mode: 'insensitive' } },
        { name: { contains: 'VENTILADOR', mode: 'insensitive' } },
        { name: { contains: 'FUENTE PARA CONTROL', mode: 'insensitive' } },
        { name: { contains: 'FUENTE DE PODER', mode: 'insensitive' } },
        { name: { contains: 'SIERRA', mode: 'insensitive' } },
        { name: { contains: 'TALADRO', mode: 'insensitive' } },
        { name: { contains: 'ACEITE', mode: 'insensitive' } },
        { name: { contains: 'FRUTA', mode: 'insensitive' } },
        { name: { contains: 'MICROFONO', mode: 'insensitive' } },
        { name: { contains: 'MICRÓFONO', mode: 'insensitive' } },
        { name: { contains: 'MBO ASUS', mode: 'insensitive' } },
        { name: { contains: 'CASE ASUS', mode: 'insensitive' } }
      );
    }

    const isGeneradorSearch = 
      searchLower.includes('generador') || 
      searchLower.includes('planta electrica') || 
      searchLower.includes('planta eléctrica');

    const wantsPlugs = 
      searchLower.includes('enchufe') || 
      searchLower.includes('nema') || 
      searchLower.includes('clavija') || 
      searchLower.includes('adaptador') || 
      searchLower.includes('conector');

    if (isGeneradorSearch && !wantsPlugs) {
      where.NOT.push(
        { name: { contains: 'ENCHUFE', mode: 'insensitive' } },
        { name: { contains: 'NEMA', mode: 'insensitive' } },
        { name: { contains: 'CLAVIJA', mode: 'insensitive' } },
        { name: { contains: 'GENERADOR DE TONOS', mode: 'insensitive' } },
        { name: { contains: 'LAN TESTER', mode: 'insensitive' } },
        { name: { contains: 'NETWORK TESTER', mode: 'insensitive' } },
        { name: { contains: 'HEATSINK', mode: 'insensitive' } }
      );
    }

    const isBateriaSearch = 
      searchLower.includes('bateria') || 
      searchLower.includes('batería') || 
      searchLower.includes('pila');

    const wantsUps = searchLower.includes('ups');
    const wantsSpeaker = searchLower.includes('parlante') || searchLower.includes('bafle') || searchLower.includes('altavoz');
    const wantsCamera = searchLower.includes('camara') || searchLower.includes('cámara');
    const wantsCable = searchLower.includes('cable') || searchLower.includes('flex');
    const wantsCharger = searchLower.includes('cargador');
    const wantsTester = searchLower.includes('probador') || searchLower.includes('tester');

    if (isBateriaSearch) {
      if (!wantsUps) {
        where.NOT.push(
          { name: { contains: 'UPS ', mode: 'insensitive' } },
          { name: { contains: 'SISTEMA UPS', mode: 'insensitive' } },
          { name: { contains: 'NO BREAK', mode: 'insensitive' } },
          { name: { contains: 'NO-BREAK', mode: 'insensitive' } },
          { name: { contains: 'REGULADOR BIFÁSICO', mode: 'insensitive' } }
        );
      }
      if (!wantsSpeaker) {
        where.NOT.push(
          { name: { contains: 'PARLANTE', mode: 'insensitive' } },
          { name: { contains: 'BAFLE', mode: 'insensitive' } },
          { name: { contains: 'ALTAVOZ', mode: 'insensitive' } }
        );
      }
      if (!wantsCamera) {
        where.NOT.push(
          { name: { contains: 'CAMARA DE SEGURIDAD', mode: 'insensitive' } },
          { name: { contains: 'CÁMARA DE SEGURIDAD', mode: 'insensitive' } },
          { name: { contains: 'CAMARA IP', mode: 'insensitive' } },
          { name: { contains: 'CÁMARA IP', mode: 'insensitive' } },
          { name: { contains: 'BODY CAMERA', mode: 'insensitive' } },
          { name: { contains: 'HB8 PANTILT', mode: 'insensitive' } },
          { name: { contains: 'EB3+PANEL', mode: 'insensitive' } },
          { name: { contains: 'EB5 CAMARA', mode: 'insensitive' } }
        );
      }
      where.NOT.push(
        { name: { contains: 'RADIO MOVIL', mode: 'insensitive' } },
        { name: { contains: 'RADIO PORTATIL ANALOGO', mode: 'insensitive' } },
        { name: { contains: 'RADIO PORTATIL BANDA LIBRE', mode: 'insensitive' } },
        { name: { contains: 'LINTERNA', mode: 'insensitive' } },
        { name: { contains: 'REFLECTOR', mode: 'insensitive' } },
        { name: { contains: 'LAMPARA', mode: 'insensitive' } },
        { name: { contains: 'LÁMPARA', mode: 'insensitive' } },
        { name: { contains: 'SERIE LED', mode: 'insensitive' } },
        { name: { contains: 'AUDIFONOS', mode: 'insensitive' } },
        { name: { contains: 'AUDÍFONOS', mode: 'insensitive' } },
        { name: { contains: 'PIXEL BUDS', mode: 'insensitive' } },
        { name: { contains: 'MICROFONO', mode: 'insensitive' } },
        { name: { contains: 'MICRÓFONO', mode: 'insensitive' } },
        { name: { contains: 'RECEPTOR DE AUDIO', mode: 'insensitive' } },
        { name: { contains: 'TRANSMISOR / RECEPTOR', mode: 'insensitive' } },
        { name: { contains: 'MOUSE INALAMBRICO', mode: 'insensitive' } },
        { name: { contains: 'TECLADO Y MOUSE', mode: 'insensitive' } },
        { name: { contains: 'LIJADORA', mode: 'insensitive' } },
        { name: { contains: 'CAUTIN', mode: 'insensitive' } },
        { name: { contains: 'CAUTÍN', mode: 'insensitive' } },
        { name: { contains: 'FUMIGADORA TIPO MOCHILA', mode: 'insensitive' } },
        { name: { contains: 'CONTADORA DE BILLETES', mode: 'insensitive' } },
        { name: { contains: 'ASPIRADORA RECARGABLE', mode: 'insensitive' } },
        { name: { contains: 'KIT TALADRO', mode: 'insensitive' } },
        { name: { contains: 'COMBO TALADRO', mode: 'insensitive' } },
        { name: { contains: 'SENSOR DE HUMO', mode: 'insensitive' } },
        { name: { contains: 'SMART FINDER', mode: 'insensitive' } },
        { name: { contains: 'HUMIDIFICADOR', mode: 'insensitive' } },
        { name: { contains: 'INVERSOR DE VOLTAJE', mode: 'insensitive' } },
        { name: { contains: 'INVERSOR OFF GRID', mode: 'insensitive' } },
        { name: { contains: 'CONTROLADOR DE CARGA', mode: 'insensitive' } }
      );
      if (!wantsTester) {
        where.NOT.push(
          { name: { contains: 'PROBADOR DE BATERIA', mode: 'insensitive' } }
        );
      }
      if (!wantsCharger) {
        where.NOT.push(
          { name: { contains: 'CARGADOR DE USB', mode: 'insensitive' } },
          { name: { contains: 'SWITCH PARA CARGADOR', mode: 'insensitive' } },
          { name: { contains: 'FUSIBLE PARA CARGADOR', mode: 'insensitive' } }
        );
      }
      if (!wantsCable) {
        where.NOT.push(
          { name: { contains: 'CABLE DE BATERIA', mode: 'insensitive' } },
          { name: { contains: 'VC-CABLE DE BATERIA', mode: 'insensitive' } },
          { name: { contains: 'CABLE PARA BATERÍA', mode: 'insensitive' } },
          { name: { contains: 'BORNES PARA BATERÍA', mode: 'insensitive' } },
          { name: { contains: 'CONECTOR ANDERSON', mode: 'insensitive' } },
          { name: { contains: 'HERRAMIENTA PARA TERMINALES', mode: 'insensitive' } }
        );
      }
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
        if (clean === 'laptop') { 
          set.add('laptops'); 
          set.add('not.'); 
          set.add('notebook'); 
          set.add('notebooks'); 
          set.add('portatil'); 
          set.add('portátil'); 
          set.add('portatiles'); 
          set.add('macbook');
          set.add('vivobook');
          set.add('ideapad');
          set.add('thinkpad');
          set.add('probook');
          set.add('elitebook');
          set.add('zenbook');
        }
        if (clean === 'cerradura') {
          set.add('cerraduras');
          set.add('cerrojo');
          set.add('cerrojos');
          set.add('smart lock');
          set.add('chapa');
        }
        if (clean === 'cerrojo') {
          set.add('cerrojos');
          set.add('cerradura');
          set.add('cerraduras');
        }
        if (clean === 'generador') {
          set.add('generadores');
          set.add('planta');
          set.add('plantas');
        }
        return Array.from(set);
      };

      if (tokens.length > 0) {
        where.AND = tokens.map((token) => {
          const variants = getVariants(token);
          const conditions: any[] = [];
          const skipDescriptionKeywords = [
            'portatil', 'portátil', 'portatiles',
            'cerradura', 'cerraduras', 'cerrojo', 'cerrojos', 'chapa', 'chapas', 'smart lock',
            'generador', 'generadores',
            'bateria', 'batería', 'baterias', 'baterías'
          ];
          for (const v of variants) {
            conditions.push({ name: { contains: v, mode: 'insensitive' } });
            conditions.push({ sku: { contains: v, mode: 'insensitive' } });
            conditions.push({ specs: { contains: v, mode: 'insensitive' } });
            if (!skipDescriptionKeywords.includes(v.toLowerCase())) {
              conditions.push({ description: { contains: v, mode: 'insensitive' } });
            }
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
      orderBy: [
        { stock: 'desc' },
        { name: 'asc' },
      ],
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
