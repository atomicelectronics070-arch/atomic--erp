import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { isStaff } from "@/lib/roles"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!isStaff(session)) {
            return NextResponse.json({ error: "Unauthorized access to inventory" }, { status: 403 })
        }

        const products = await (prisma as any).product.findMany({
            where: {
                NOT: { isDeleted: true }
            },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!isStaff(session)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const data = await req.json()
        
        // Soporte para creación masiva (Bulk) con prevención de duplicados por nombre
        if (Array.isArray(data)) {
            const existingNames = new Set(
                (await prisma.product.findMany({ select: { name: true } }))
                    .map(p => p.name.trim().toLowerCase())
            );

            const filteredData = data.filter(p => p.name && !existingNames.has(p.name.trim().toLowerCase()));

            if (filteredData.length === 0) {
                return NextResponse.json({ success: true, count: 0, message: "Todos los productos ya existían (Duplicados omitidos)" })
            }

            const products = await (prisma as any).product.createMany({
                data: filteredData.map(p => ({
                    name: p.name.trim(),
                    description: p.description || '',
                    price: parseFloat(p.price) || 0,
                    sku: p.sku || null,
                    images: p.images || null,
                    isActive: p.isActive ?? true,
                    featured: p.featured ?? false,
                    stock: p.stock ?? 0,
                    keywords: p.keywords || null,
                    specs: p.specs || null,
                    provider: p.provider || null,
                })),
                skipDuplicates: true 
            })
            return NextResponse.json({ success: true, count: products.count })
        }

        // Creación individual con prevención de duplicados
        const cleanName = data.name.trim();
        const existing = await prisma.product.findFirst({
            where: { name: { equals: cleanName, mode: 'insensitive' } }
        });

        if (existing) {
            // Actualizar producto existente conservando proveedor y margen
            const updated = await prisma.product.update({
                where: { id: existing.id },
                data: {
                    price: parseFloat(data.price) || existing.price,
                    provider: data.provider || existing.provider,
                    images: data.images || existing.images,
                    description: data.description || existing.description,
                    stock: data.stock !== undefined ? data.stock : existing.stock
                }
            });
            return NextResponse.json(updated);
        }

        const product = await prisma.product.create({
            data: {
                name: cleanName,
                description: data.description || '',
                price: parseFloat(data.price) || 0,
                sku: data.sku || null,
                images: data.images || null,
                isActive: data.isActive ?? true,
                featured: data.featured ?? false,
                stock: data.stock ?? 0,
                keywords: data.keywords || null,
                specs: data.specs || null,
                provider: data.provider || null,
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.error("Create product error:", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }
}
