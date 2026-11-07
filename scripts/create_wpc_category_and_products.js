const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Creating / Verifying Category: 'Paneles ranurados y remodelaciones de interior y exterior'...");
    
    let category = await prisma.category.findFirst({
        where: {
            OR: [
                { slug: 'paneles-ranurados-remodelaciones' },
                { name: { contains: 'Paneles ranurados', mode: 'insensitive' } },
                { name: { contains: 'remodelaciones', mode: 'insensitive' } }
            ]
        }
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: "Paneles ranurados y remodelaciones de interior y exterior",
                slug: "paneles-ranurados-remodelaciones",
                description: "Paneles ranurados WPC (2.90m x 16cm), revestimientos acústicos y decorativos para muros de salas, dormitorios, locales comerciales y exteriores protegidos.",
                isVisible: true,
                image: "/images/paneles-wpc/panel-wpc-cafe.jpg"
            }
        });
        console.log("✅ Category created:", category.id, category.name);
    } else {
        console.log("ℹ️ Category already exists:", category.id, category.name);
    }

    const products = [
        {
            sku: "WPC-PANEL-NEGRO",
            name: "Panel Ranurado WPC Color Negro (2.90m x 16cm)",
            price: 9.09,
            compareAtPrice: 14.50,
            description: "Panel ranurado de WPC (Wood Plastic Composite) en color negro mate moderno. Dimensiones 2.90m de alto x 16cm de ancho. 100% impermeable, alta durabilidad, no se apolilla ni se deforma con la humedad. Ideal para acentuar muros de TV, salas modernas y cabeceras de cama.",
            images: JSON.stringify(["/images/paneles-wpc/panel-wpc-negro.jpg"]),
            stock: 250,
            isActive: true,
            featured: true,
            provider: "ATOMIC ARQUITECTURA",
            categoryId: category.id
        },
        {
            sku: "WPC-PANEL-BICOLOR",
            name: "Panel Ranurado WPC Color Bicolor Madera (2.90m x 16cm)",
            price: 9.09,
            compareAtPrice: 14.50,
            description: "Panel ranurado de WPC bicolor con acabado veteado tipo teca y nogal. Dimensiones 2.90m de alto x 16cm de ancho. Aporta calidez y diseño orgánico a salas, comedores, recepciones y locales comerciales. Instalación limpia y rápida.",
            images: JSON.stringify(["/images/paneles-wpc/panel-wpc-bicolor-madera.jpg"]),
            stock: 250,
            isActive: true,
            featured: true,
            provider: "ATOMIC ARQUITECTURA",
            categoryId: category.id
        },
        {
            sku: "WPC-PANEL-CAFE",
            name: "Panel Ranurado WPC Color Café Cálido (2.90m x 16cm)",
            price: 9.09,
            compareAtPrice: 14.50,
            description: "Panel ranurado de WPC en tono café cálido / roble natural. Dimensiones 2.90m de alto x 16cm de ancho. Estilo Japandi y contemporáneo. Resistente al agua, cero mantenimiento y propiedades aislantes acústicas.",
            images: JSON.stringify(["/images/paneles-wpc/panel-wpc-cafe.jpg"]),
            stock: 250,
            isActive: true,
            featured: true,
            provider: "ATOMIC ARQUITECTURA",
            categoryId: category.id
        },
        {
            sku: "WPC-KIT-INSTALACION",
            name: "Kit de Remodelación & Perfilería WPC (Clips + Terminales + Adhesivo)",
            price: 12.50,
            compareAtPrice: 18.00,
            description: "Kit completo de accesorios para instalación limpia de paneles WPC: 20 clips de fijación oculta en acero inoxidable, perfil terminal de remate en L de 2.90m y tubo de adhesivo sellador de montaje de alta resistencia.",
            images: JSON.stringify(["/images/paneles-wpc/panel-wpc-cafe.jpg"]),
            stock: 150,
            isActive: true,
            featured: false,
            provider: "ATOMIC ARQUITECTURA",
            categoryId: category.id
        },
        {
            sku: "WPC-PACK-SALA-10P",
            name: "Pack Remodelación Muro Completo (10 Paneles WPC 2.90m + Kit Clips)",
            price: 99.99,
            compareAtPrice: 145.00,
            description: "Combo de remodelación para pared de acento (1.60m de ancho x 2.90m de alto). Incluye 10 paneles ranurados WPC (color a elección: Negro, Bicolor o Café) + set completo de clips de fijación y perfiles de terminación.",
            images: JSON.stringify(["/images/paneles-wpc/panel-wpc-negro.jpg"]),
            stock: 60,
            isActive: true,
            featured: true,
            provider: "ATOMIC ARQUITECTURA",
            categoryId: category.id
        }
    ];

    for (const p of products) {
        const existing = await prisma.product.findFirst({
            where: {
                OR: [
                    { sku: p.sku },
                    { name: p.name }
                ]
            }
        });

        if (!existing) {
            const created = await prisma.product.create({ data: p });
            console.log(`✅ Created Product: [${created.id}] ${created.name} ($${created.price})`);
        } else {
            console.log(`ℹ️ Product exists: [${existing.id}] ${existing.name} ($${existing.price})`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
