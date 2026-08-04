const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Game Controllers Category & Products...');

    // 1. Ensure Category exists
    let category = await prisma.category.findFirst({
        where: { name: { contains: 'Controles de Videojuegos', mode: 'insensitive' } }
    });

    if (!category) {
        let gamingParent = await prisma.category.findFirst({
            where: { name: { contains: 'Gaming', mode: 'insensitive' } }
        });

        category = await prisma.category.create({
            data: {
                name: 'Controles de Videojuegos',
                slug: 'controles-de-videojuegos',
                description: 'Mandos y controles inalámbricos y alámbricos para PS5, Xbox, Nintendo Switch y PC.',
                icon: '🎮',
                parentId: gamingParent ? gamingParent.id : null
            }
        });
        console.log('Created category: Controles de Videojuegos', category.id);
    } else {
        console.log('Found category: Controles de Videojuegos', category.id);
    }

    // 2. Controllers data
    const controllers = [
        {
            sku: 'CTL-PS5-DS-WHT',
            name: 'Mando Inalámbrico PlayStation 5 DualSense - Blanco',
            description: 'Control oficial PS5 con retroalimentación háptica, gatillos adaptativos dinámicos y micrófono integrado.',
            price: 85.00,
            compareAtPrice: 65.00,
            stock: 25,
            provider: 'Sony PlayStation Ecuador',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/612hn-3u68L._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-PS5-DS-BLK',
            name: 'Mando Inalámbrico PlayStation 5 DualSense - Midnight Black',
            description: 'Control oficial PS5 edición Midnight Black con tecnología háptica sensible y respuesta inmersiva.',
            price: 85.00,
            compareAtPrice: 65.00,
            stock: 20,
            provider: 'Sony PlayStation Ecuador',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/61O9tWR6WDS._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-PS5-DSEDGE',
            name: 'Mando Pro PlayStation 5 DualSense Edge Wireless',
            description: 'Control profesional personalizable para PS5 con palancas intercambiables, botones traseros asignables y perfiles guardados.',
            price: 245.00,
            compareAtPrice: 195.00,
            stock: 8,
            provider: 'Sony PlayStation Ecuador',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/61b2XwTzI9L._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-XBX-WLS-BLK',
            name: 'Control Inalámbrico Xbox Series X/S - Carbon Black',
            description: 'Mando inalámbrico oficial Xbox con agarre texturizado, botón Compartir dedicado y compatibilidad con Xbox, PC, Android e iOS.',
            price: 78.00,
            compareAtPrice: 58.00,
            stock: 30,
            provider: 'Microsoft Ecuador',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/61z3vJ1500L._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-XBX-ELT-S2',
            name: 'Control Inalámbrico Xbox Elite Series 2 - Black',
            description: 'El mando para juegos más avanzado del mundo. Palancas de tensión ajustable, componentes intercambiables y hasta 40h de batería.',
            price: 210.00,
            compareAtPrice: 165.00,
            stock: 10,
            provider: 'Microsoft Ecuador',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/71u96V1-LFL._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-NSW-PRO-BLK',
            name: 'Mando Nintendo Switch Pro Controller - Negro',
            description: 'Control tradicional para Nintendo Switch con sensores de movimiento, vibración HD y funcionalidad amiibo integrada.',
            price: 89.00,
            compareAtPrice: 68.00,
            stock: 18,
            provider: 'Nintendo Latam',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/61dr-N4c8nL._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-8BD-ULT-WLS',
            name: 'Control 8BitDo Ultimate Wireless con Base de Carga (PC & Switch)',
            description: 'Mando pro con Joysticks Hall Effect anti-drift, botones traseros pro, software de mapeo custom y dock de carga rápida.',
            price: 69.90,
            compareAtPrice: 48.00,
            stock: 15,
            provider: '8BitDo Official',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/61Nl01-y+SL._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-GMS-T4PRO',
            name: 'Control Inalámbrico GameSir T4 Pro Multiplataforma (PC/Switch/iOS/Android)',
            description: 'Gamepad con giroscopio de 6 ejes, iluminación RGB retroiluminada, motor doble de vibración y soporte para smartphone incluido.',
            price: 49.00,
            compareAtPrice: 32.00,
            stock: 22,
            provider: 'GameSir Gaming',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/71R3yX+1K9L._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-RZR-WLV2-CHR',
            name: 'Control Pro Razer Wolverine V2 Chroma RGB (Xbox & PC)',
            description: 'Mando de eSports con switches meca-táctiles Razer, 6 botones multifunción adicionales y Razer Chroma RGB customizable.',
            price: 185.00,
            compareAtPrice: 140.00,
            stock: 7,
            provider: 'Razer Gaming Ecuador',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/71j1wD55M2L._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-LGT-F310',
            name: 'Gamepad Alámbrico Logitech G F310 USB',
            description: 'Gamepad clásico Plug-and-Play para PC con distribución de botones consola XInput/DirectInput y D-pad flotante de 4 conmutadores.',
            price: 29.90,
            compareAtPrice: 19.50,
            stock: 40,
            provider: 'Logitech Ecuador',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/71K2U1X4K8L._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-FDG-VAD3-PRO',
            name: 'Control Pro Flydigi Vader 3 Pro Hall Effect (PC & Switch)',
            description: 'Gamepad competitivo con gatillos mecánicos Dual-Cut, Joysticks Hall Effect de ultra precisión y tasa de sondeo de 500Hz.',
            price: 89.90,
            compareAtPrice: 62.00,
            stock: 12,
            provider: 'Flydigi Tech',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/61Nl01-y+SL._AC_SL1500_.jpg'])
        },
        {
            sku: 'CTL-MSI-GC30-V2',
            name: 'Control Inalámbrico MSI Force GC30 V2 White',
            description: 'Gamepad inalámbrico/alámbrico con cubiertas D-Pad magnéticas intercambiables, motores de vibración dual y batería de larga duración.',
            price: 52.00,
            compareAtPrice: 38.00,
            stock: 14,
            provider: 'MSI Gaming Ecuador',
            images: JSON.stringify(['https://m.media-amazon.com/images/I/61g+2P1gP4L._AC_SL1500_.jpg'])
        }
    ];

    for (const c of controllers) {
        const existing = await prisma.product.findFirst({
            where: { sku: c.sku }
        });

        if (!existing) {
            await prisma.product.create({
                data: {
                    sku: c.sku,
                    name: c.name,
                    description: c.description,
                    price: c.price,
                    compareAtPrice: c.compareAtPrice,
                    stock: c.stock,
                    provider: c.provider,
                    categoryId: category.id,
                    images: c.images,
                    isActive: true,
                    isDeleted: false
                }
            });
            console.log(`Inserted product: [${c.sku}] ${c.name}`);
        } else {
            console.log(`Product already exists: [${c.sku}] ${c.name}`);
        }
    }

    console.log('✅ Controller products seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
