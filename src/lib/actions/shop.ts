"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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

// PRODUCTS
export async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                collection: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return products
    } catch (error) {
        console.error("Error fetching products:", error)
        // Fallback to minimal products if include fails
        try {
            return await prisma.product.findMany({
                orderBy: { createdAt: 'desc' }
            })
        } catch (e) {
            console.error("Critical error in getProducts:", e)
            return []
        }
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
