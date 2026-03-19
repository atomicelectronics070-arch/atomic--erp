"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"

// CATEGORIES & COLLECTIONS
export async function getShopMetadata() {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    const collections = await prisma.collection.findMany({ orderBy: { name: 'asc' } })
    return { categories, collections }
}

export async function createCategory(name: string) {
    const slug = name.toLowerCase().replace(/ /g, '-')
    const cat = await prisma.category.create({
        data: { name, slug }
    })
    revalidatePath('/dashboard/shop')
    return cat
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
export async function getProducts(options: { page?: number, pageSize?: number, search?: string, categoryId?: string, collectionId?: string } = {}) {
    noStore(); 
    const { page = 1, pageSize = 50, search = "", categoryId, collectionId } = options;
    const skip = (page - 1) * pageSize;

    const where: any = {};
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

export async function getProductById(id: string) {
    noStore();
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                collection: true
            }
        });
        return product;
    } catch (error) {
        console.error("Error fetching product by id:", error);
        return null;
    }
}

export async function getRelatedProducts(categoryId: string | null, currentProductId: string) {
    noStore();
    if (!categoryId) return [];
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId,
                id: { not: currentProductId },
                isActive: true
            },
            take: 4,
            orderBy: { createdAt: 'desc' }
        });
        return products;
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}

export async function saveProduct(data: any) {
    const { id, ...productData } = data

    // Ensure numeric fields are numbers
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
    await prisma.product.delete({ where: { id } })
    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
    return { success: true }
}

export async function deleteManyProducts(ids: string[]) {
    await prisma.product.deleteMany({
        where: { id: { in: ids } }
    })
    revalidatePath('/dashboard/shop')
    revalidatePath('/web')
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
