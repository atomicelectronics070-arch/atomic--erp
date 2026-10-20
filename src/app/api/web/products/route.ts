import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sanitizeProductPrice, sanitizeProductImage } from "@/lib/productSanitizer"

export const dynamic = "force-dynamic"

function expandSearchTerm(term: string): string[] {
    const clean = term.trim().toLowerCase()
    if (!clean) return []
    const variants = new Set<string>([clean])

    // Normalización de tildes
    const unaccented = clean.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    variants.add(unaccented)

    // Variaciones comunes con tildes
    if (unaccented === "induccion") variants.add("inducción")
    if (unaccented === "camara") variants.add("cámara")
    if (unaccented === "camaras") variants.add("cámaras")
    if (unaccented === "bateria") variants.add("batería")
    if (unaccented === "baterias") variants.add("baterías")
    if (unaccented === "electronica") variants.add("electrónica")

    // Lematización en español: Plural <-> Singular
    if (unaccented.endsWith("ces") && unaccented.length > 3) {
        variants.add(unaccented.slice(0, -3) + "z") // luces -> luz
    } else if (unaccented.endsWith("es") && unaccented.length > 4) {
        variants.add(unaccented.slice(0, -2)) // generadores -> generador, motores -> motor
        variants.add(unaccented.slice(0, -1))
    } else if (unaccented.endsWith("s") && unaccented.length > 3) {
        variants.add(unaccented.slice(0, -1)) // encimeras -> encimera, cocinas -> cocina, camaras -> camara
    } else {
        // Singular -> Plural
        variants.add(unaccented + "s") // encimera -> encimeras
        variants.add(unaccented + "es") // panel -> paneles
    }

    // Grupos semánticos y sinónimos de alta relevancia
    const synonyms: Record<string, string[]> = {
        encimera: ["cocina", "hornilla", "parrilla", "induccion", "inducción", "quemador", "estufa", "plancha"],
        encimeras: ["cocinas", "hornillas", "parrillas", "induccion", "inducción", "quemadores", "estufas"],
        cocina: ["encimera", "parrilla", "hornilla", "estufa", "induccion", "inducción"],
        cocinas: ["encimeras", "parrillas", "hornillas", "estufas", "induccion", "inducción"],
        camara: ["cctv", "dvr", "nvr", "vigilancia", "ip"],
        camaras: ["cctv", "dvr", "nvr", "vigilancia", "ip"],
        cerradura: ["chapa", "smart lock", "manija digital", "biometrico"],
        cerraduras: ["chapas", "smart locks", "manijas digitales"],
        senseface: ["zkteco", "facial", "biometrico", "asistencia", "2a"],
        zkteco: ["senseface", "biometrico", "facial", "2a"],
        "2a": ["senseface", "zkteco", "facial", "biometrico"],
        laptop: ["portatil", "portátil", "notebook", "computador"],
        laptops: ["portatiles", "portátiles", "notebooks", "computadores"],
        portatil: ["laptop", "notebook"],
        portatiles: ["laptops", "notebooks"],
    }

    for (const v of Array.from(variants)) {
        const vClean = v.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        if (synonyms[vClean]) {
            synonyms[vClean].forEach(s => variants.add(s))
        }
    }

    return Array.from(variants).filter(Boolean)
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const pageSize = parseInt(searchParams.get("pageSize") || "36")
        const search = searchParams.get("search") || ""
        const categoryId = searchParams.get("categoryId") || ""
        const collectionId = searchParams.get("collectionId") || ""
        const skip = (page - 1) * pageSize

        const where: any = { isDeleted: false }

        if (search) {
            const rawWords = search.trim().split(/\s+/).filter(Boolean)
            const allVariants = new Set<string>()
            rawWords.forEach(w => expandSearchTerm(w).forEach(v => allVariants.add(v)))
            const variantList = Array.from(allVariants)

            // Buscar si alguna categoría coincide con los términos de búsqueda
            const matchedCategories = await prisma.category.findMany({
                where: {
                    OR: variantList.map(v => ({
                        name: { contains: v, mode: "insensitive" }
                    }))
                },
                select: { id: true }
            }).catch(() => [])
            const matchedCatIds = matchedCategories.map(c => c.id)

            // Construir filtro amplio OR
            const buildTermConditions = (term: string) => [
                { name: { contains: term, mode: "insensitive" } },
                { description: { contains: term, mode: "insensitive" } },
                { sku: { contains: term, mode: "insensitive" } },
                { keywords: { contains: term, mode: "insensitive" } },
                { provider: { contains: term, mode: "insensitive" } },
                { category: { name: { contains: term, mode: "insensitive" } } },
                { category: { slug: { contains: term, mode: "insensitive" } } },
                { collection: { name: { contains: term, mode: "insensitive" } } },
            ]

            const orClauses: any[] = []
            variantList.forEach(v => {
                orClauses.push(...buildTermConditions(v))
            })

            if (matchedCatIds.length > 0) {
                orClauses.push({ categoryId: { in: matchedCatIds } })
            }

            where.OR = orClauses
        }
        if (categoryId && categoryId !== "all") {
            const subcats = await prisma.category.findMany({ where: { parentId: categoryId }, select: { id: true } });
            const catIds = [categoryId, ...subcats.map(s => s.id)];
            where.categoryId = { in: catIds };
        }
        if (collectionId && collectionId !== "all") where.collectionId = collectionId

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
                    provider: true,
                    stock: true,
                    sku: true,
                    specSheetUrl: true,
                    createdAt: true,
                    category: { select: { id: true, name: true, slug: true } },
                    collection: { select: { id: true, name: true, slug: true } },
                },
                orderBy: { createdAt: "desc" },
                take: pageSize,
                skip,
            }),
            prisma.product.count({ where }),
        ])

        const sanitizedProducts = products.map(p => {
            const catName = p.category?.name || ""
            const priceCheck = sanitizeProductPrice(p.name, p.price, catName)
            const sanitizedImg = sanitizeProductImage(p.name, p.images, catName)
            return {
                ...p,
                price: priceCheck.price,
                images: JSON.stringify([sanitizedImg])
            }
        })

        return NextResponse.json({ products: sanitizedProducts, total, page, pageSize })
    } catch (error) {
        console.error("Web products API error:", error)
        return NextResponse.json(
            { error: "Failed to fetch products", products: [], total: 0 },
            { status: 500 }
        )
    }
}


