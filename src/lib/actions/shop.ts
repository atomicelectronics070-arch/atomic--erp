"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"

// CATEGORIES & COLLECTIONS
export async function getShopMetadata() {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    const collections = await prisma.collection.findMany({ orderBy: { name: 'asc' } })
    return { categories, collections }
}

export async function saveCategory(id: string | null, data: any, productIds: string[] = []) {
    const slug = data.name.toLowerCase().replace(/ /g, '-')
    const finalData = {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
        isVisible: data.isVisible ?? true
    }
    
    let cat;
    if (id) {
        cat = await prisma.category.update({ where: { id }, data: finalData })
        await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } })
        if (productIds.length > 0) {
            await prisma.product.updateMany({ where: { id: { in: productIds } }, data: { categoryId: id } })
        }
    } else {
        cat = await prisma.category.create({ data: finalData })
        if (productIds.length > 0) {
            await prisma.product.updateMany({ where: { id: { in: productIds } }, data: { categoryId: cat.id } })
        }
    }
    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
    return cat
}

export async function createCategory(name: string) {
    const slug = name.toLowerCase().replace(/ /g, '-')
    const cat = await prisma.category.create({
        data: { name, slug }
    })
    revalidatePath('/dashboard/shop')
    return cat
}

export async function saveCollection(id: string | null, data: any, productIds: string[] = []) {
    const slug = data.name.toLowerCase().replace(/ /g, '-')
    const finalData = {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
        isVisible: data.isVisible ?? true
    }
    
    let col;
    if (id) {
        col = await prisma.collection.update({ where: { id }, data: finalData })
        await prisma.product.updateMany({ where: { collectionId: id }, data: { collectionId: null } })
        if (productIds.length > 0) {
            await prisma.product.updateMany({ where: { id: { in: productIds } }, data: { collectionId: id } })
        }
    } else {
        col = await prisma.collection.create({ data: finalData })
        if (productIds.length > 0) {
            await prisma.product.updateMany({ where: { id: { in: productIds } }, data: { collectionId: col.id } })
        }
    }
    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
    return col
}

export async function createCollection(name: string) {
    const slug = name.toLowerCase().replace(/ /g, '-')
    const col = await prisma.collection.create({
        data: { name, slug }
    })
    revalidatePath('/dashboard/shop')
    return col
}

export async function deleteCollection(id: string) {
    await prisma.collection.delete({ where: { id } })
    revalidatePath('/dashboard/shop')
    return { success: true }
}

export async function deleteManyCollections(ids: string[]) {
    await prisma.collection.deleteMany({
        where: { id: { in: ids } }
    })
    revalidatePath('/dashboard/shop')
    return { success: true }
}

export async function updateCollection(id: string, name: string) {
    const slug = name.toLowerCase().replace(/ /g, '-')
    await prisma.collection.update({
        where: { id },
        data: { name, slug }
    })
    revalidatePath('/dashboard/shop')
    return { success: true }
}

// PRODUCTS
export async function getProducts(options: { 
    page?: number, 
    pageSize?: number, 
    search?: string, 
    categoryId?: string, 
    collectionId?: string,
    showDeleted?: boolean 
} = {}) {
    noStore(); 
    const { page = 1, pageSize = 50, search = "", categoryId, collectionId, showDeleted = false } = options;
    const skip = (page - 1) * pageSize;

    const where: any = {
        NOT: { isDeleted: showDeleted ? false : true }
    };

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ];
    }
    if (categoryId && categoryId !== 'all') where.categoryId = categoryId;
    if (collectionId && collectionId !== 'all') where.collectionId = collectionId;

    try {
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    compareAtPrice: true,
                    images: true,
                    categoryId: true,
                    collectionId: true,
                    isActive: true,
                    featured: true,
                    stock: true,
                    sku: true,
                    createdAt: true,
                    category: true,
                    collection: true
                },
                orderBy: { createdAt: 'desc' },
                take: pageSize,
                skip: skip
            }),
            prisma.product.count({ where })
        ]);
        return { products, total, page, pageSize };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], total: 0, page, pageSize };
    }
}

export async function saveProduct(data: any) {
    const { id, ...productData } = data

    const finalData = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        compareAtPrice: productData.compareAtPrice ? parseFloat(productData.compareAtPrice) : null,
        stock: parseInt(productData.stock) || 0,
    }

    if (id) {
        await prisma.product.update({
            where: { id },
            data: finalData
        })
    } else {
        await prisma.product.create({
            data: finalData
        })
    }

    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
    return { success: true }
}

export async function deleteProduct(id: string) {
    // Soft delete
    await (prisma as any).product.update({
        where: { id },
        data: { isDeleted: true }
    })
    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
    return { success: true }
}

export async function restoreProduct(id: string) {
    await (prisma as any).product.update({
        where: { id },
        data: { isDeleted: false }
    })
    revalidatePath('/dashboard/shop')
    return { success: true }
}

export async function permanentDeleteProduct(id: string) {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/dashboard/shop')
    return { success: true }
}

export async function deleteManyProducts(ids: string[]) {
    // Soft bulk delete
    await (prisma as any).product.updateMany({
        where: { id: { in: ids } },
        data: { isDeleted: true }
    })
    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
    return { success: true }
}

export async function restoreManyProducts(ids: string[]) {
    await (prisma as any).product.updateMany({
        where: { id: { in: ids } },
        data: { isDeleted: false }
    })
    revalidatePath('/dashboard/shop')
    return { success: true }
}

export async function permanentDeleteManyProducts(ids: string[]) {
    await prisma.product.deleteMany({
        where: { id: { in: ids } }
    })
    revalidatePath('/dashboard/shop')
    return { success: true }
}

export async function updateProductsCollection(productIds: string[], collectionId: string | null) {
    await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { collectionId }
    })
    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
    return { success: true }
}

export async function bulkUpdateProducts(productIds: string[], data: any) {
    const updateData: any = {}
    if (data.name !== undefined && data.name !== "") updateData.name = data.name
    if (data.price !== undefined) updateData.price = parseFloat(data.price)
    if (data.stock !== undefined) updateData.stock = parseInt(data.stock)
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.collectionId !== undefined) updateData.collectionId = data.collectionId

    await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: updateData
    })
    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
    return { success: true }
}

export async function getProductById(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            collection: true
        }
    })
}

export async function getRelatedProducts(categoryId: string | null, currentProductId: string) {
    if (!categoryId) return []
    return await (prisma as any).product.findMany({
        where: {
            categoryId,
            id: { not: currentProductId },
            NOT: { isDeleted: true }
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            price: true,
            images: true
        }
    })
}

export async function cleanupDuplicateProducts() {
    // Buscamos duplicados exactos (nombre, precio, imágenes) y nos quedamos solo con el más reciente
    await prisma.$executeRaw`
        WITH dups AS (
            SELECT id,
                   ROW_NUMBER() OVER(PARTITION BY name, price, images ORDER BY "createdAt" DESC) as row_num
            FROM "Product"
            WHERE "isDeleted" = false
        )
        UPDATE "Product"
        SET "isDeleted" = true, "updatedAt" = NOW()
        WHERE id IN (SELECT id FROM dups WHERE row_num > 1)
    `
    revalidatePath('/dashboard/shop')
    return { success: true }
}

export async function getProviderStats() {
    // Obtenemos todos los productos que tengan imágenes para detectar proveedores
    const products = await prisma.product.findMany({
        where: { 
            images: { not: '' },
            isDeleted: false
        },
        select: { images: true }
    })

    const providersMap: Record<string, number> = {}
    
    products.forEach(p => {
        try {
            const imgs = JSON.parse(p.images)
            if (Array.isArray(imgs) && imgs.length > 0) {
                const url = new URL(imgs[0])
                const domain = url.hostname.replace('www.', '')
                providersMap[domain] = (providersMap[domain] || 0) + 1
            }
        } catch (e) {}
    })

    const stats = Object.entries(providersMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    return stats
}

export async function searchProductsForTaxonomy(query: string) {
    if (!query || query.length < 2) return []

    return await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } }
            ],
            isDeleted: false
        },
        select: {
            id: true,
            name: true,
            sku: true,
            images: true
        },
        take: 20,
        orderBy: { name: 'asc' }
    })
}
