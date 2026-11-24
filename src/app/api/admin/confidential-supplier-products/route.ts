export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Resolver for provider source & scraping target
export function resolveSupplierDetails(
    providerRaw: string | null | undefined,
    name: string,
    imagesRaw: string | null | undefined
) {
    const cleanName = (name || "").trim().replace(/^(VC-|AU-|SK-|LP-)/i, "").trim();

    let images: string[] = [];
    if (imagesRaw) {
        try {
            const parsed = JSON.parse(imagesRaw);
            if (Array.isArray(parsed)) {
                images = parsed.filter((img) => typeof img === "string" && img.trim().length > 0);
            } else if (typeof parsed === "string" && parsed.trim().length > 0) {
                images = [parsed];
            }
        } catch {
            if (imagesRaw.startsWith("http") || imagesRaw.startsWith("/")) {
                images = [imagesRaw.trim()];
            }
        }
    }

    const p = (providerRaw || "").trim();

    // Determine if product has no supplier or is an internal manual entry
    const isInternalOrNull =
        !p ||
        p.toLowerCase() === "manual" ||
        p.toLowerCase() === "sin proveedor" ||
        p.toLowerCase() === "null" ||
        p.toLowerCase() === "undefined" ||
        p.toLowerCase() === "proveedor sync" ||
        p.toLowerCase() === "general" ||
        p.toLowerCase().startsWith("atomic");

    if (isInternalOrNull) {
        return {
            hasProvider: false,
            providerName: p && p.toLowerCase() !== "null" ? p : "Sin Proveedor",
            noProviderMessage: "⚠️ Producto ingresado sin proveedor",
            supplierDomain: null,
            supplierUrl: null,
            images,
        };
    }

    const pLower = p.toLowerCase();
    let supplierDomain = "";
    let supplierUrl = "";

    if (pLower.includes("multitecnologia") || pLower.includes("v&v")) {
        supplierDomain = "multitecnologiavyv.com";
        supplierUrl = `https://multitecnologiavyv.com/buscar?controller=search&s=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("banco del perno") || pLower.includes("bpecuador")) {
        supplierDomain = "bpecuador.com";
        supplierUrl = `https://bpecuador.com/?s=${encodeURIComponent(cleanName)}&post_type=product`;
    } else if (pLower.includes("sisegusa")) {
        supplierDomain = "sisegusa.com";
        supplierUrl = `https://www.sisegusa.com/shop?search=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("tecnomega")) {
        supplierDomain = "tecnomegastore.ec";
        supplierUrl = `https://tecnomegastore.ec/busqueda?q=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("steren")) {
        supplierDomain = "steren.com.ec";
        supplierUrl = `https://www.steren.com.ec/catalogsearch/result/?q=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("meeltech")) {
        supplierDomain = "meeltechstore.com";
        supplierUrl = `https://meeltechstore.com/search?q=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("idc mayorista") || pLower.includes("idcmayoristas")) {
        supplierDomain = "idcmayoristas.com";
        supplierUrl = `https://www.idcmayoristas.com/?s=${encodeURIComponent(cleanName)}&post_type=product`;
    } else if (pLower.includes("competencia")) {
        supplierDomain = "competencia.com.ec";
        supplierUrl = `https://competencia.com.ec/buscar?controller=search&s=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("yale")) {
        supplierDomain = "yale.com.ec";
        supplierUrl = `https://yale.com.ec/tienda/?s=${encodeURIComponent(cleanName)}&post_type=product`;
    } else if (pLower.includes("impormel")) {
        supplierDomain = "impormel.com";
        supplierUrl = `https://impormel.com/?s=${encodeURIComponent(cleanName)}&post_type=product`;
    } else if (pLower.includes("cronte")) {
        supplierDomain = "cronte.net";
        supplierUrl = `https://cronte.net/?s=${encodeURIComponent(cleanName)}&post_type=product`;
    } else if (pLower.includes("jm technology") || pLower.includes("jmtechnology")) {
        supplierDomain = "jmtechnology.ec";
        supplierUrl = `https://jmtechnology.ec/?s=${encodeURIComponent(cleanName)}&post_type=product`;
    } else if (pLower.includes("easy laptop")) {
        supplierDomain = "easylaptopec.com";
        supplierUrl = `https://easylaptopec.com/?s=${encodeURIComponent(cleanName)}&post_type=product`;
    } else if (pLower.includes("telefonos") && pLower.includes("accesorios")) {
        supplierDomain = "telefonosyaccesorios.com";
        supplierUrl = `https://telefonosyaccesorios.com/?s=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("celularquito")) {
        supplierDomain = "celularquito.com";
        supplierUrl = `https://celularquito.com/?s=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("mk ecuador")) {
        supplierDomain = "mkecuador.com";
        supplierUrl = `https://mkecuador.com/?s=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("zkteco")) {
        supplierDomain = "zkteco.com";
        supplierUrl = `https://www.zkteco.com/es/search?keywords=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("hikvision")) {
        supplierDomain = "hikvision.com";
        supplierUrl = `https://www.hikvision.com/es-la/search/?q=${encodeURIComponent(cleanName)}`;
    } else if (pLower.includes("dahua")) {
        supplierDomain = "dahuasecurity.com";
        supplierUrl = `https://www.dahuasecurity.com/la/search?keyword=${encodeURIComponent(cleanName)}`;
    } else if (
        pLower.includes("robot") ||
        pLower.includes("ubtech") ||
        pLower.includes("hongfa") ||
        pLower.includes("reeman") ||
        pLower.includes("hantewin") ||
        pLower.includes("glgw")
    ) {
        supplierDomain = "made-in-china.com";
        supplierUrl = `https://www.made-in-china.com/multi-search/${encodeURIComponent(cleanName)}/F1.html`;
    } else {
        // Try extracting host from the first image
        let detectedHost = "";
        if (images.length > 0) {
            try {
                const u = new URL(images[0]);
                if (
                    u.hostname &&
                    !u.hostname.includes("localhost") &&
                    !u.hostname.includes("unsplash") &&
                    !u.hostname.includes("atomic")
                ) {
                    detectedHost = u.hostname.replace(/^www\./, "");
                }
            } catch {}
        }

        if (detectedHost) {
            supplierDomain = detectedHost;
            supplierUrl = `https://${detectedHost}/?s=${encodeURIComponent(cleanName)}`;
        } else {
            supplierDomain = p;
            supplierUrl = `https://www.google.com/search?q=${encodeURIComponent(p + " " + cleanName)}`;
        }
    }

    return {
        hasProvider: true,
        providerName: p,
        noProviderMessage: null,
        supplierDomain,
        supplierUrl,
        images,
    };
}

// GET /api/admin/confidential-supplier-products
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = (searchParams.get("search") || "").trim();
        const providerFilter = (searchParams.get("provider") || "").trim();
        const categoryId = (searchParams.get("category") || "").trim();
        const statusFilter = (searchParams.get("filter") || "ALL").toUpperCase(); // "ALL" | "WITH_PROVIDER" | "NO_PROVIDER"
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "30")));
        const skip = (page - 1) * limit;

        // Build where filter
        const where: any = { isDeleted: false };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (statusFilter === "NO_PROVIDER" || providerFilter === "SIN_PROVEEDOR") {
            where.OR = [
                { provider: null },
                { provider: "" },
                { provider: "MANUAL" },
                { provider: "Sin Proveedor" },
                { provider: { startsWith: "ATOMIC" } },
            ];
        } else if (statusFilter === "WITH_PROVIDER") {
            where.AND = [
                { provider: { not: null } },
                { provider: { not: "" } },
                { provider: { not: "MANUAL" } },
                { provider: { not: "Sin Proveedor" } },
                { NOT: { provider: { startsWith: "ATOMIC" } } },
            ];
        } else if (providerFilter && providerFilter !== "ALL") {
            where.provider = providerFilter;
        }

        if (search) {
            const searchClause = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { provider: { contains: search, mode: "insensitive" } },
            ];

            if (where.OR) {
                where.AND = [{ OR: where.OR }, { OR: searchClause }];
                delete where.OR;
            } else if (where.AND) {
                where.AND.push({ OR: searchClause });
            } else {
                where.OR = searchClause;
            }
        }

        // Fetch products and total count in parallel
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    compareAtPrice: true,
                    stock: true,
                    isActive: true,
                    provider: true,
                    images: true,
                    description: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: [
                    { provider: "asc" },
                    { updatedAt: "desc" },
                ],
                take: limit,
                skip,
            }),
            prisma.product.count({ where }),
        ]);

        // Process products with supplier resolver
        const processedProducts = products.map((prod) => {
            const supplier = resolveSupplierDetails(prod.provider, prod.name, prod.images);
            const wholesaleCost =
                prod.compareAtPrice !== null && prod.compareAtPrice !== undefined && prod.compareAtPrice > 0
                    ? Number(prod.compareAtPrice)
                    : null;
            const retailPrice = Number(prod.price || 0);
            const estimatedMargin = wholesaleCost ? Math.max(0, retailPrice - wholesaleCost) : null;

            return {
                id: prod.id,
                name: prod.name,
                sku: prod.sku || `SKU-${prod.id.slice(-6).toUpperCase()}`,
                price: retailPrice,
                wholesaleCost,
                margin: estimatedMargin,
                stock: prod.stock ?? 0,
                isActive: prod.isActive,
                categoryName: prod.category?.name || "General",
                description: prod.description || "",
                hasProvider: supplier.hasProvider,
                providerName: supplier.providerName,
                noProviderMessage: supplier.noProviderMessage,
                supplierDomain: supplier.supplierDomain,
                supplierUrl: supplier.supplierUrl,
                images: supplier.images,
                updatedAt: prod.updatedAt,
            };
        });

        // Fast aggregated supplier statistics for filter tabs
        const providerStatsRaw = await prisma.product.groupBy({
            by: ["provider"],
            _count: { id: true },
            where: { isDeleted: false },
            orderBy: { _count: { id: "desc" } },
        });

        let withoutProviderCount = 0;
        const formattedProviderStats: Array<{ name: string; count: number; isInternal: boolean }> = [];

        for (const item of providerStatsRaw) {
            const p = item.provider;
            const count = item._count.id;
            const isInternal =
                !p ||
                p.toLowerCase() === "manual" ||
                p.toLowerCase() === "sin proveedor" ||
                p.toLowerCase() === "proveedor sync" ||
                p.toLowerCase().startsWith("atomic");

            if (isInternal) {
                withoutProviderCount += count;
            } else {
                formattedProviderStats.push({
                    name: p,
                    count,
                    isInternal: false,
                });
            }
        }

        const totalCatalogCount = await prisma.product.count({ where: { isDeleted: false } });

        return NextResponse.json({
            success: true,
            products: processedProducts,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
            summary: {
                totalCatalog: totalCatalogCount,
                totalWithoutProvider: withoutProviderCount,
                totalWithProvider: Math.max(0, totalCatalogCount - withoutProviderCount),
            },
            topSuppliers: formattedProviderStats.slice(0, 15),
        });
    } catch (error: any) {
        console.error("Error in confidential supplier products API:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Error al obtener catálogo de proveedores confidenciales",
                products: [],
                pagination: { total: 0, page: 1, limit: 30, totalPages: 0 },
            },
            { status: 500 }
        );
    }
}
