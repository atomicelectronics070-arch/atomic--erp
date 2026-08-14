export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const format = searchParams.get('format') || 'json';

        const products = await prisma.product.findMany({
            take: 500,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        });

        if (format === 'csv') {
            // Generate Meta Commerce Manager standard CSV Feed format
            let csv = 'id,title,description,availability,condition,price,link,image_link,brand\n';
            products.forEach(p => {
                const id = p.id;
                const title = `"${(p.name || '').replace(/"/g, '""')}"`;
                const description = `"${(p.description || p.name || '').replace(/"/g, '""')}"`;
                const availability = (p.stock || 1) > 0 ? 'in stock' : 'out of stock';
                const condition = 'new';
                const price = `${(p.price || 0).toFixed(2)} USD`;
                const link = `https://atomiccotizador.shop/web/product/${p.id}`;
                const imageLink = p.imageUrl || 'https://atomiccotizador.shop/icon.png';
                const brand = 'ATOMIC';

                csv += `${id},${title},${description},${availability},${condition},${price},${link},${imageLink},${brand}\n`;
            });

            return new Response(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="whatsapp-catalog-meta-feed.csv"'
                }
            });
        }

        return NextResponse.json({
            count: products.length,
            products: products.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                stock: p.stock,
                category: p.category?.name || 'General',
                imageUrl: p.imageUrl,
                link: `https://atomiccotizador.shop/web/product/${p.id}`
            }))
        });
    } catch (error: any) {
        console.error('[WHATSAPP_CATALOG_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
