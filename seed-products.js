const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Check if category exists or create it
    let category = await prisma.category.findUnique({ where: { name: 'Paneles Solares' } });
    if (!category) {
        category = await prisma.category.create({
            data: {
                name: 'Paneles Solares',
                slug: 'paneles-solares',
                description: 'Kits y paneles solares'
            }
        });
    }

    const products = [
        {
            name: 'Kit Paneles Solares 5000 W (5-8 horas)',
            description: 'Autonomía de 5 - 8 horas. Incluye: 12 Paneles Solares 560W, 16 Baterías de Litio 12V/100Ah, Inversor de baja frecuencia de fase dividida 5000W, Controlador de Carga MPPT 100A/48V. Opcional: Módulo WiFi.',
            price: 7069.00,
            images: '["/uploads/kit-5000w.jpeg"]',
            categoryId: category.id,
            provider: 'tecnoglobal',
            stock: 10
        },
        {
            name: 'Kit Paneles Solares 3000 W (5-8 horas)',
            description: 'Autonomía de 5 - 8 horas. Incluye: 6 Paneles Solares 560W, 8 Baterías de Litio 12V/100Ah, Inversor de baja frecuencia de fase dividida 3000W, Controlador de Carga MPPT 60A/48V. Opcional: Módulo WiFi.',
            price: 3650.00,
            images: '["/uploads/kit-3000w.jpeg"]',
            categoryId: category.id,
            provider: 'tecnoglobal',
            stock: 10
        },
        {
            name: 'Kit Paneles Solares 1000 W (5-8 horas)',
            description: 'Autonomía de 5 - 8 horas. Incluye: 2 Paneles Solares 560W, 4 Baterías de Litio 12V/100Ah, Inversor de baja frecuencia de fase dividida 1000W, Controlador de Carga MPPT 30A/24V. Opcional: Módulo WiFi.',
            price: 1242.00,
            images: '["/uploads/kit-1000w.jpeg"]',
            categoryId: category.id,
            provider: 'tecnoglobal',
            stock: 10
        },
        {
            name: 'Panel Solar Monocristalino Bifacial 580W (Cód: 28197)',
            description: 'Corriente de circuito corto (Isc): 13,84A. Voltaje de circuito abierto (Voc): 53,11V. Eficiencia: 20,7%. Alto: 2465mm, Ancho: 1134mm. Peso: 27,3Kg.',
            price: 109.00,
            images: '["/uploads/panel-580w.jpeg"]',
            categoryId: category.id,
            provider: 'tecnoglobal',
            stock: 50
        },
        {
            name: 'Panel Solar Monocristalino LONGi 555W (Cód: 28184)',
            description: 'Voltaje de circuito abierto (Voc): 51,46V. Corriente de circuito corto (Isc): 13,88A. Eficiencia: 21,5%. Alto: 2278mm, Ancho: 1134mm. Peso: 27,2Kg.',
            price: 105.00,
            images: '["/uploads/panel-555w.jpeg"]',
            categoryId: category.id,
            provider: 'tecnoglobal',
            stock: 50
        },
        {
            name: 'Panel Solar Monocristalino LONGi 355W (Cód: 28184-B)',
            description: 'Voltaje de circuito abierto (Voc): 40,6V. Corriente de circuito corto (Isc): 11,25A. Eficiencia: 19,5%. Alto: 1755mm, Ancho: 1038mm. Peso: 19,5Kg.',
            price: 85.00,
            images: '["/uploads/panel-355w.jpeg"]',
            categoryId: category.id,
            provider: 'tecnoglobal',
            stock: 50
        },
        {
            name: 'Panel Solar Monocristalino 60W (Cód: 18230)',
            description: 'Voltaje de circuito abierto (Voc): 21,24V. Corriente de circuito corto (Isc): 27,52A. Eficiencia: 18,03%. Alto: 335mm, Ancho: 570mm. Peso: 3,2Kg.',
            price: 40.00,
            images: '["/uploads/panel-60w.jpeg"]',
            categoryId: category.id,
            provider: 'tecnoglobal',
            stock: 100
        }
    ];

    for (const p of products) {
        await prisma.product.create({ data: p });
    }
    
    console.log("Seeded 7 products successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
