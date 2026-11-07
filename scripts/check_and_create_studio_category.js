const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking categories for Creación de Contenido / Atomic Studio...");
    let category = await prisma.category.findFirst({
        where: {
            OR: [
                { slug: 'creacion-de-contenido' },
                { slug: 'atomic-studio' },
                { name: { contains: 'contenido', mode: 'insensitive' } },
                { name: { contains: 'studio', mode: 'insensitive' } }
            ]
        }
    });

    if (!category) {
        console.log("Category does not exist yet. Creating 'ATOMIC Studio & Creación de Contenido'...");
        category = await prisma.category.create({
            data: {
                name: "ATOMIC Studio & Creación de Contenido",
                slug: "creacion-de-contenido",
                description: "Planes mensuales de redes sociales, edición profesional, sesiones audiovisuales y mega packs para creadores de contenido.",
                isVisible: true,
                image: "/images/atomic-studio/atomic-studio-paquetes.jpg"
            }
        });
        console.log("Category created successfully:", category.id);
    } else {
        console.log("Category found:", category.id, category.name, category.slug);
    }

    // Now check or create products for the 4 armed tickets / bundles
    const ticketItems = [
        {
            sku: "STUDIO-PLAN-BASICO",
            name: "Plan Redes Sociales Básico (10 FB + 5 IG + 4 Historias)",
            price: 100.0,
            compareAtPrice: 150.0,
            description: "Paquete mensual básico para marcas y negocios: 10 diseños profesionales para Facebook, 5 diseños para Instagram y 4 Historias de alta interacción. Incluye calendario mensual.",
            images: JSON.stringify(["/images/atomic-studio/planes-mensuales-redes-sociales.jpg"]),
            stock: 99,
            isActive: true,
            featured: true,
            provider: "ATOMIC STUDIO",
            categoryId: category.id
        },
        {
            sku: "STUDIO-PLAN-ESTANDAR",
            name: "Plan Redes Sociales Estándar (12 FB + 10 IG + 6 Historias + Sesión)",
            price: 300.0,
            compareAtPrice: 420.0,
            description: "Paquete mensual estándar para negocios en crecimiento: 12 diseños para Facebook, 10 diseños para Instagram, 6 Historias interactivas, Plan mensual con objetivos específicos y Sesión de fotografía y video profesional.",
            images: JSON.stringify(["/images/atomic-studio/planes-mensuales-redes-sociales.jpg"]),
            stock: 99,
            isActive: true,
            featured: true,
            provider: "ATOMIC STUDIO",
            categoryId: category.id
        },
        {
            sku: "STUDIO-PLAN-PREMIUM",
            name: "Plan Redes Sociales Indispensable / Premium (15 FB + 12 IG + 6 Hist + 2 Videos)",
            price: 600.0,
            compareAtPrice: 850.0,
            description: "Paquete mensual completo de alto rendimiento: 15 diseños para Facebook, 12 diseños para Instagram, 6 Historias, 2 Videos comerciales / Reels de alto impacto, Plan estratégico de conversión y Sesión profesional.",
            images: JSON.stringify(["/images/atomic-studio/innovacion-rendimiento-paquetes.jpg"]),
            stock: 99,
            isActive: true,
            featured: true,
            provider: "ATOMIC STUDIO",
            categoryId: category.id
        },
        {
            sku: "STUDIO-MEGA-PACK",
            name: "MEGA PACK Creador de Contenido (Recursos + Plantillas + VFX)",
            price: 49.99,
            compareAtPrice: 120.0,
            description: "El kit definitivo para creadores, agencias y streamers: Intros, Efectos de sonido, Pack de memes, Miniaturas YouTube, Emojis, Transiciones, Fuentes prémium, Elementos, Tarjetas digitales, Mockups, Overlays y Pantallas verdes.",
            images: JSON.stringify(["/images/atomic-studio/mega-pack-creador-contenido.jpg"]),
            stock: 999,
            isActive: true,
            featured: true,
            provider: "ATOMIC STUDIO",
            categoryId: category.id
        }
    ];

    for (const t of ticketItems) {
        const existing = await prisma.product.findFirst({
            where: {
                OR: [
                    { sku: t.sku },
                    { name: t.name }
                ]
            }
        });

        if (!existing) {
            const created = await prisma.product.create({
                data: t
            });
            console.log(`✅ Created Product: [${created.id}] ${created.name} ($${created.price})`);
        } else {
            console.log(`ℹ️ Product exists: [${existing.id}] ${existing.name} ($${existing.price})`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
