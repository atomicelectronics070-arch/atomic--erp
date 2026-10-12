export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Default initial clearance items if none configured in database yet
const DEFAULT_STOCK_REMATE_ITEMS = [
    {
        id: "remate-1",
        sku: "AT-REM-LOCK-01",
        name: "Cerradura Inteligente Tuya WiFi Biométrica Pro (Últimas Unidades)",
        description: "Liquidación por renovación de stock. Apertura con huella dactilar ultra rápida, tarjeta RFID, clave digital y app Tuya/SmartLife. Incluye cilindro de alta seguridad.",
        price: 68.00,
        compareAtPrice: 125.00,
        stock: 3,
        category: "Cerraduras Inteligentes",
        provider: "ATOMIC",
        images: ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"],
        keywords: "STOCK_REMATE, cerradura, biometrica, huella, wifi",
        isRemate: true
    },
    {
        id: "remate-2",
        sku: "AT-REM-CAM-02",
        name: "Cámara Domo IP WiFi 4MP Ultra Visión Nocturna Color (Exhibición)",
        description: "Equipo de exhibición en tienda en perfecto estado operativo. Resolución 4MP 2K, audio bidireccional, detección de humanos por IA y sirena disuasoria.",
        price: 24.50,
        compareAtPrice: 48.00,
        stock: 5,
        category: "Cámaras de Seguridad & CCTV",
        provider: "ATOMIC",
        images: ["https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"],
        keywords: "STOCK_REMATE, camara, cctv, domo, ip",
        isRemate: true
    },
    {
        id: "remate-3",
        sku: "AT-REM-ALARM-03",
        name: "Kit Alarma Inalámbrica GSM + WiFi con Sensor de Movimiento y Sirena",
        description: "Lote de liquidación comercial. Panel táctil inalámbrico, sensor PIR anti-mascotas, sensor de puerta magnético y 2 controles remotos. Aviso directo a celular.",
        price: 49.00,
        compareAtPrice: 95.00,
        stock: 2,
        category: "Alarmas & Sensores",
        provider: "ATOMIC",
        images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"],
        keywords: "STOCK_REMATE, alarma, gsm, sensor, pir",
        isRemate: true
    },
    {
        id: "remate-4",
        sku: "AT-REM-VP-04",
        name: "Videoportero WiFi HD con Pantalla 7 Pulgadas y Desbloqueo Remoto",
        description: "Remate de inventario 2025. Cámara exterior antivandálica con timbre, pantalla interior touch de 7'', visión nocturna infrarroja y conexión a cerradura eléctrica.",
        price: 89.00,
        compareAtPrice: 160.00,
        stock: 4,
        category: "Intercomunicadores & Videoporteros",
        provider: "ATOMIC",
        images: ["https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"],
        keywords: "STOCK_REMATE, videoportero, intercomunicador, wifi",
        isRemate: true
    }
];

// Helper to parse product images safely
function parseImages(imgField: string | null | undefined): string[] {
    if (!imgField) return [];
    try {
        if (imgField.startsWith('[')) {
            return JSON.parse(imgField);
        }
        return [imgField];
    } catch {
        return [imgField];
    }
}

// GET: Fetch all products assigned to Stock de Remate
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('q')?.toLowerCase() || '';

        // Query database products with STOCK_REMATE in keywords
        const dbProducts = await prisma.product.findMany({
            where: {
                keywords: { contains: 'STOCK_REMATE', mode: 'insensitive' },
                isDeleted: false,
                isActive: true
            },
            include: {
                category: { select: { id: true, name: true, slug: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });

        if (dbProducts.length > 0) {
            const formatted = dbProducts.map(p => {
                const images = parseImages(p.images);
                const originalPrice = p.compareAtPrice && p.compareAtPrice > 0 ? p.compareAtPrice : (p.price * 1.5);
                const discountPercent = originalPrice > p.price ? Math.round(((originalPrice - p.price) / originalPrice) * 100) : 0;

                return {
                    id: p.id,
                    sku: p.sku || `REM-${p.id.slice(-6).toUpperCase()}`,
                    name: p.name,
                    description: p.description || '',
                    price: p.price,
                    compareAtPrice: originalPrice,
                    discountPercent,
                    stock: p.stock,
                    category: p.category?.name || 'Stock de Remate',
                    categoryId: p.categoryId,
                    provider: p.provider || 'ATOMIC',
                    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'],
                    keywords: p.keywords || 'STOCK_REMATE',
                    isRemate: true,
                    updatedAt: p.updatedAt
                };
            });

            // Filter if search query was provided
            const filtered = search 
                ? formatted.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search) || p.category.toLowerCase().includes(search))
                : formatted;

            return NextResponse.json({
                success: true,
                count: filtered.length,
                products: filtered,
                isFromDatabase: true
            });
        }

        // Fallback: If database has no tagged products yet, return default curated clearance items
        const defaultFiltered = DEFAULT_STOCK_REMATE_ITEMS.map(p => {
            const discountPercent = p.compareAtPrice > p.price ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0;
            return {
                ...p,
                discountPercent
            };
        }).filter(p => !search || p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));

        return NextResponse.json({
            success: true,
            count: defaultFiltered.length,
            products: defaultFiltered,
            isFromDatabase: false
        });

    } catch (error: any) {
        console.error('[STOCK_REMATE_GET_ERROR]', error);
        // Fallback on error to keep the page functional
        return NextResponse.json({
            success: true,
            count: DEFAULT_STOCK_REMATE_ITEMS.length,
            products: DEFAULT_STOCK_REMATE_ITEMS.map(p => ({
                ...p,
                discountPercent: Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
            })),
            isFromDatabase: false,
            error: error.message
        });
    }
}

// POST: Add or assign a product to Stock de Remate
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            id, 
            sku, 
            name, 
            price, 
            compareAtPrice, 
            stock, 
            categoryName, 
            provider, 
            description, 
            images,
            image 
        } = body;

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Nombre y precio de remate son obligatorios' }, { status: 400 });
        }

        const cleanSku = (sku || `REM-${Date.now().toString().slice(-6)}`).trim();
        const cleanName = String(name).trim();
        const rematePrice = parseFloat(price) || 0;
        const originalPrice = compareAtPrice ? parseFloat(compareAtPrice) : (rematePrice * 1.4);
        const parsedStock = parseInt(stock) || 1;

        // Resolve images array
        let finalImages: string[] = [];
        if (Array.isArray(images) && images.length > 0) {
            finalImages = images;
        } else if (typeof image === 'string' && image.trim()) {
            finalImages = [image.trim()];
        } else if (typeof images === 'string' && images.trim()) {
            finalImages = [images.trim()];
        }
        const imagesJson = finalImages.length > 0 ? JSON.stringify(finalImages) : null;

        // Find or create Category if needed
        let categoryId: string | null = null;
        if (categoryName && categoryName.trim()) {
            const catSlug = categoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            let cat = await prisma.category.findFirst({
                where: {
                    OR: [
                        { slug: catSlug },
                        { name: { equals: categoryName.trim(), mode: 'insensitive' } }
                    ]
                }
            });
            if (!cat) {
                try {
                    cat = await prisma.category.create({
                        data: {
                            name: categoryName.trim(),
                            slug: catSlug,
                            isVisible: true
                        }
                    });
                } catch {
                    cat = await prisma.category.findFirst();
                }
            }
            categoryId = cat ? cat.id : null;
        }

        // If specific ID is provided or exists
        let existing = id ? await prisma.product.findUnique({ where: { id } }) : null;
        if (!existing && cleanSku) {
            existing = await prisma.product.findFirst({
                where: { sku: cleanSku }
            });
        }

        if (existing) {
            // Append STOCK_REMATE keyword if not present
            const currentKeywords = existing.keywords || '';
            const newKeywords = currentKeywords.includes('STOCK_REMATE') 
                ? currentKeywords 
                : `${currentKeywords ? currentKeywords + ', ' : ''}STOCK_REMATE`;

            const updated = await prisma.product.update({
                where: { id: existing.id },
                data: {
                    sku: cleanSku,
                    name: cleanName,
                    price: rematePrice,
                    compareAtPrice: originalPrice,
                    stock: parsedStock,
                    description: description !== undefined ? description : existing.description,
                    keywords: newKeywords,
                    images: imagesJson || existing.images,
                    provider: provider || existing.provider || 'ATOMIC',
                    categoryId: categoryId || existing.categoryId,
                    isActive: true,
                    isDeleted: false
                },
                include: { category: true }
            });

            return NextResponse.json({
                success: true,
                action: 'assigned_to_remate',
                product: updated
            });
        }

        // Create new clearance product directly
        const created = await prisma.product.create({
            data: {
                sku: cleanSku,
                name: cleanName,
                price: rematePrice,
                compareAtPrice: originalPrice,
                stock: parsedStock,
                description: description || 'Producto especial en Stock de Remate con descuento de liquidación.',
                keywords: 'STOCK_REMATE, remate, liquidacion, oferta',
                images: imagesJson,
                provider: provider || 'ATOMIC',
                categoryId: categoryId,
                isActive: true,
                isDeleted: false
            },
            include: { category: true }
        });

        return NextResponse.json({
            success: true,
            action: 'created_in_remate',
            product: created
        });

    } catch (error: any) {
        console.error('[STOCK_REMATE_POST_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Error guardando producto de remate' }, { status: 500 });
    }
}

// PATCH: Adjust stock or toggle clearance status
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, stockDelta, newStock, removeFromRemate, addToRemate } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        const dataToUpdate: any = {};

        // Stock adjustments
        if (newStock !== undefined) {
            dataToUpdate.stock = Math.max(0, parseInt(newStock));
        } else if (stockDelta !== undefined) {
            dataToUpdate.stock = Math.max(0, product.stock + parseInt(stockDelta));
        }

        // Toggle clearance tag
        if (removeFromRemate) {
            const currentKeywords = product.keywords || '';
            dataToUpdate.keywords = currentKeywords.replace(/STOCK_REMATE,?\s*/gi, '').trim();
        } else if (addToRemate) {
            const currentKeywords = product.keywords || '';
            if (!currentKeywords.includes('STOCK_REMATE')) {
                dataToUpdate.keywords = `${currentKeywords ? currentKeywords + ', ' : ''}STOCK_REMATE`;
            }
        }

        const updated = await prisma.product.update({
            where: { id },
            data: dataToUpdate
        });

        return NextResponse.json({
            success: true,
            product: updated
        });

    } catch (error: any) {
        console.error('[STOCK_REMATE_PATCH_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Error actualizando producto' }, { status: 500 });
    }
}

// DELETE: Remove product from Stock de Remate
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        // Clean STOCK_REMATE from keywords so it stays in regular catalog or gets unflagged
        const currentKeywords = product.keywords || '';
        const cleanedKeywords = currentKeywords.replace(/STOCK_REMATE,?\s*/gi, '').trim();

        await prisma.product.update({
            where: { id },
            data: {
                keywords: cleanedKeywords
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Producto retirado de Stock de Remate'
        });

    } catch (error: any) {
        console.error('[STOCK_REMATE_DELETE_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Error eliminando de remate' }, { status: 500 });
    }
}
