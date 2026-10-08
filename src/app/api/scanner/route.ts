export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Lookup product by barcode / SKU
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code')?.trim();

        if (!code) {
            return NextResponse.json({ error: 'Código requerido' }, { status: 400 });
        }

        // Try exact SKU match first
        let product = await prisma.product.findFirst({
            where: {
                sku: { equals: code, mode: 'insensitive' },
                isDeleted: false
            },
            include: {
                category: { select: { id: true, name: true } }
            }
        });

        // Fallback: lookup by ID or keywords
        if (!product) {
            product = await prisma.product.findFirst({
                where: {
                    OR: [
                        { id: code },
                        { keywords: { contains: code, mode: 'insensitive' } }
                    ],
                    isDeleted: false
                },
                include: {
                    category: { select: { id: true, name: true } }
                }
            });
        }

        if (product) {
            return NextResponse.json({
                found: true,
                product: {
                    id: product.id,
                    sku: product.sku || code,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    category: product.category?.name || 'General',
                    categoryId: product.categoryId,
                    provider: product.provider || 'ATOMIC',
                    description: product.description || '',
                    images: product.images ? (product.images.startsWith('[') ? JSON.parse(product.images) : [product.images]) : []
                }
            });
        }

        return NextResponse.json({
            found: false,
            code
        });
    } catch (error: any) {
        console.error('[SCANNER_LOOKUP_ERROR]', error);
        return NextResponse.json({ error: 'Error al buscar producto' }, { status: 500 });
    }
}

// POST: Register or update scanned product
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { sku, name, price, stock, categoryName, provider, description, compareAtPrice } = body;

        if (!sku || !name || price === undefined) {
            return NextResponse.json({ error: 'Código, nombre y precio son requeridos' }, { status: 400 });
        }

        const cleanSku = String(sku).trim();
        const cleanName = String(name).trim();
        const parsedPrice = parseFloat(price) || 0;
        const parsedStock = parseInt(stock) || 1;

        // Check if category exists or create it if categoryName is provided
        let categoryId: string | null = null;
        if (categoryName && categoryName.trim()) {
            const catSlug = categoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const cat = await prisma.category.upsert({
                where: { slug: catSlug },
                update: {},
                create: {
                    name: categoryName.trim(),
                    slug: catSlug,
                    isVisible: true
                }
            });
            categoryId = cat.id;
        }

        // Check if product with this SKU already exists
        const existing = await prisma.product.findFirst({
            where: {
                OR: [
                    { sku: cleanSku },
                    { name: { equals: cleanName, mode: 'insensitive' } }
                ]
            }
        });

        if (existing) {
            const updated = await prisma.product.update({
                where: { id: existing.id },
                data: {
                    sku: cleanSku,
                    name: cleanName,
                    price: parsedPrice,
                    stock: parsedStock,
                    description: description || existing.description,
                    provider: provider || existing.provider,
                    categoryId: categoryId || existing.categoryId,
                    compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : existing.compareAtPrice,
                    isDeleted: false,
                    isActive: true
                },
                include: { category: true }
            });

            return NextResponse.json({
                success: true,
                action: 'updated',
                product: updated
            });
        }

        // Create brand new product
        const created = await prisma.product.create({
            data: {
                sku: cleanSku,
                name: cleanName,
                price: parsedPrice,
                stock: parsedStock,
                description: description || '',
                provider: provider || 'ATOMIC',
                categoryId: categoryId,
                compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
                isActive: true,
                isDeleted: false
            },
            include: { category: true }
        });

        return NextResponse.json({
            success: true,
            action: 'created',
            product: created
        });
    } catch (error: any) {
        console.error('[SCANNER_SAVE_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Error guardando producto' }, { status: 500 });
    }
}

// PATCH: Quick stock adjust (+1 / -1)
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, stockDelta, newStock } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        let targetStock = product.stock;
        if (newStock !== undefined) {
            targetStock = Math.max(0, parseInt(newStock));
        } else if (stockDelta !== undefined) {
            targetStock = Math.max(0, product.stock + parseInt(stockDelta));
        }

        const updated = await prisma.product.update({
            where: { id },
            data: { stock: targetStock }
        });

        return NextResponse.json({ success: true, stock: updated.stock });
    } catch (error: any) {
        console.error('[SCANNER_STOCK_UPDATE_ERROR]', error);
        return NextResponse.json({ error: 'Error actualizando stock' }, { status: 500 });
    }
}
