export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}

async function handleSync(req: NextRequest) {
  try {
    const startTime = Date.now();
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    console.log('[PROVEDOR INVENTORY SYNC] Iniciando monitoreo y sincronización pasiva...');

    // 1. Cargar productos desde fuentes de proveedores disponibles en sistema (Archivos scraped / feeds)
    const scrapedFiles = [
      'scraped_products.json',
      'campanas_200.json',
      'bpecuador_subcategories.json'
    ];

    let providerItemsMap = new Map<string, any>(); // Normalizado por SKU o Nombre

    for (const fileName of scrapedFiles) {
      const filePath = path.join(process.cwd(), fileName);
      if (fs.existsSync(filePath)) {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (Array.isArray(content)) {
            content.forEach((item: any) => {
              const name = (item.name || item.title || item.descripcion || '').trim();
              const sku = (item.sku || item.codigo || item.id || '').trim();
              const price = parseFloat(item.price || item.precio || 0);
              const isAvailable = item.available !== false && item.stock !== 0 && !item.agotado;

              const key = sku ? sku.toLowerCase() : name.toLowerCase();
              if (key) {
                providerItemsMap.set(key, {
                  name,
                  sku: sku || undefined,
                  price,
                  stock: isAvailable ? (parseInt(item.stock, 10) || 5) : 0,
                  isAvailable,
                  provider: item.provider || item.proveedor || 'Proveedor Sync',
                  category: item.category || item.categoria || 'General',
                  images: item.images || item.image ? JSON.stringify(Array.isArray(item.images) ? item.images : [item.image]) : null,
                });
              }
            });
          }
        } catch (err) {
          console.error(`[SYNC] Error leyendo ${fileName}:`, err);
        }
      }
    }

    // 2. Analizar todos los productos registrados en la Base de Datos ATOMIC
    const dbProducts = await prisma.product.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        price: true,
        provider: true,
        isActive: true,
      }
    });

    let countAgotados = 0;
    let countReactivados = 0;
    let countNuevosDescubiertos = 0;
    let countInalterados = 0;

    // A) Marcar AGOTADO productos que no estén presentes o estén descontinuados en los feeds del proveedor
    for (const p of dbProducts) {
      const skuKey = p.sku ? p.sku.toLowerCase() : '';
      const nameKey = p.name ? p.name.toLowerCase() : '';

      const matchedProviderItem = providerItemsMap.get(skuKey) || providerItemsMap.get(nameKey);

      if (matchedProviderItem) {
        // El proveedor reporta este producto
        if (!matchedProviderItem.isAvailable || matchedProviderItem.stock <= 0) {
          // El proveedor lo marcó sin stock / descontinuado
          if (p.stock > 0 || p.isActive) {
            await prisma.product.update({
              where: { id: p.id },
              data: { stock: 0, isActive: false }
            });
            countAgotados++;
          } else {
            countInalterados++;
          }
        } else {
          // El proveedor tiene stock disponible -> Asegurar que esté activo
          if (p.stock <= 0 || !p.isActive) {
            await prisma.product.update({
              where: { id: p.id },
              data: { stock: matchedProviderItem.stock || 5, isActive: true }
            });
            countReactivados++;
          } else {
            countInalterados++;
          }
        }
      } else {
        // Si hay una consulta de sync estricto (force=true) y el producto de proveedor desapareció
        if (force && (p.provider?.includes('Sync') || p.provider?.includes('TecnoMega') || p.provider?.includes('MultiTecnologia'))) {
          if (p.stock > 0) {
            await prisma.product.update({
              where: { id: p.id },
              data: { stock: 0 }
            });
            countAgotados++;
          } else {
            countInalterados++;
          }
        } else {
          countInalterados++;
        }
      }
    }

    // B) Descubrir e importar automáticamente nuevos productos publicados por proveedores
    if (providerItemsMap.size > 0) {
      const existingSkus = new Set(dbProducts.map(p => p.sku?.toLowerCase()).filter(Boolean));
      const existingNames = new Set(dbProducts.map(p => p.name.toLowerCase()));

      for (const [key, newItem] of providerItemsMap.entries()) {
        const hasSkuMatch = newItem.sku && existingSkus.has(newItem.sku.toLowerCase());
        const hasNameMatch = existingNames.has(newItem.name.toLowerCase());

        if (!hasSkuMatch && !hasNameMatch && newItem.price > 0) {
          // Es un producto nuevo publicado por el proveedor -> Importar automáticamente
          try {
            let catObj = await prisma.category.findFirst({
              where: { name: { contains: newItem.category, mode: 'insensitive' } }
            });

            await prisma.product.create({
              data: {
                name: newItem.name,
                sku: newItem.sku || null,
                price: newItem.price,
                compareAtPrice: Math.round((newItem.price / 1.15) * 100) / 100,
                stock: newItem.isAvailable ? (newItem.stock || 5) : 0,
                provider: newItem.provider,
                images: newItem.images,
                categoryId: catObj ? catObj.id : null,
                isActive: newItem.isAvailable,
              }
            });
            countNuevosDescubiertos++;
          } catch (e) {
            // Ignorar duplicados o errores silenciosamente
          }
        }
      }
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      durationMs,
      summary: {
        totalProductosAnalizados: dbProducts.length,
        productosAgotadosActualizados: countAgotados,
        productosReactivadosConStock: countReactivados,
        nuevosProductosDescubiertos: countNuevosDescubiertos,
        productosSinCambios: countInalterados,
      },
      message: `✅ Sincronización completada en ${durationMs}ms. (${countAgotados} agotados marcados, ${countNuevosDescubiertos} nuevos productos importados).`
    });

  } catch (err: any) {
    console.error('[PROVEDOR INVENTORY SYNC] Error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Error en sincronización de inventario'
    }, { status: 500 });
  }
}
