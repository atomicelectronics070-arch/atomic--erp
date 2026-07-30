const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    console.log("Seeding EV Products...")

    // 1. Check or create Category
    let category = await prisma.category.findFirst({
        where: { slug: "cargadores-electricos-ev" }
    })

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: "Movilidad Eléctrica & Cargadores EV",
                slug: "cargadores-electricos-ev",
                description: "Estaciones de carga wallbox europeas, cargadores portátiles y saltadores de batería profesionales.",
                isVisible: true
            }
        })
        console.log("Created category:", category.name)
    }

    const evProducts = [
        {
            name: "Estación de Carga EV Wallbox Smart ATOMIC (7.4kW / 11kW / 22kW)",
            sku: "EV-WALLBOX-SMART",
            price: 650.00,
            compareAtPrice: 790.00,
            description: "Estación de carga residencial y comercial inteligente para vehículos eléctricos e híbridos enchufables. Fabricación europea CE & TUV, protección IP65 anti-agua y climas severos, balanceo dinámico de carga, pantalla LCD de telemetría en tiempo real y 3 años de garantía con instalación opcional llave en mano.",
            images: JSON.stringify(["/ev-images/cargador-1.jpeg"]),
            stock: 25,
            featured: true,
            isActive: true,
            provider: "ATOMIC EV Europe",
            keywords: "cargador auto electrico, wallbox, cargador ev, estacion de carga, 7.4kw, 11kw, 22kw",
            specs: JSON.stringify({
                garantia: "3 Años de Garantía Directa",
                certificacion: "CE, TUV, RoHS (Fabricación Europea)",
                proteccion: "IP65 Resistente a Lluvia y Polvo / IK10 Anti-impactos",
                versiones: [
                    { id: "7kw", name: "Versión 7.4 kW Monofásico (220V / 32A)", price: 650.00, speed: "~35-40 km/h" },
                    { id: "11kw", name: "Versión 11 kW Trifásico (380V / 16A)", price: 890.00, speed: "~60-70 km/h" },
                    { id: "22kw", name: "Versión 22 kW Ultra Fast (380V / 32A)", price: 1250.00, speed: "~120 km/h" }
                ]
            })
        },
        {
            name: "Cargador Portátil Multiconector EV Pro ATOMIC (Schuko / CEE)",
            sku: "EV-PORTABLE-PRO",
            price: 380.00,
            compareAtPrice: 450.00,
            description: "Cargador portátil de alta resistencia con pantalla OLED táctil. Permite regular el amperaje (8A, 10A, 13A, 16A, 32A) para cargar tu auto eléctrico en cualquier tomacorriente. Cable de cobre puro blindado TPE de 5m. Fabricación europea con 3 años de garantía.",
            images: JSON.stringify(["/ev-images/cargador-4.jpeg"]),
            stock: 30,
            featured: true,
            isActive: true,
            provider: "ATOMIC EV Europe",
            keywords: "cargador portatil ev, cargador schuko, cee 32a, cargador auto electrico portatil",
            specs: JSON.stringify({
                garantia: "3 Años de Garantía",
                certificacion: "CE & TUV Europe",
                proteccion: "IP67 en conector y caja de control",
                versiones: [
                    { id: "3.5kw", name: "Versión 3.5 kW Schuko (110V/220V - 16A)", price: 380.00, connector: "Schuko Estándar" },
                    { id: "7.4kw", name: "Versión 7.4 kW CEE Industrial (220V - 32A)", price: 490.00, connector: "CEE Industrial 32A" }
                ]
            })
        },
        {
            name: "Arrancador y Saltador de Batería Heavy Duty 2000A ATOMIC",
            sku: "EV-JUMPER-2000A",
            price: 165.00,
            compareAtPrice: 199.00,
            description: "Arrancador portátil de baterías 12V con 2000 Amperios pico. Arranca motores a gasolina de hasta 8.0L y diésel de 6.5L al instante. Incluye Powerbank de 24,000 mAh con puerto USB-C de carga rápida y linterna LED ultrabrillante de 300 Lumens.",
            images: JSON.stringify(["/ev-images/cargador-2.jpeg"]),
            stock: 45,
            featured: true,
            isActive: true,
            provider: "ATOMIC Power",
            keywords: "saltador de bateria, arrancador de auto, jumper 2000a, powerbank auto, arrancador heavy duty",
            specs: JSON.stringify({
                potenciaPico: "2000 Amperios 12V",
                capacidad: "24,000 mAh Powerbank",
                garantia: "3 Años de Garantía",
                motores: "Hasta 8.0L Gasolina / 6.5L Diésel"
            })
        },
        {
            name: "Saltador y Arrancador Compacto 1200A ATOMIC con QC3.0",
            sku: "EV-JUMPER-1200A",
            price: 115.00,
            compareAtPrice: 140.00,
            description: "Saltador compacto de batería 12V 1200A pico. Diseñado para vehículos sedán, SUVs pequeñas y motocicletas. Powerbank integrado de 16,000 mAh para cargar laptops y celulares a alta velocidad. Pinzas de seguridad inteligentes anti-chispas.",
            images: JSON.stringify(["/ev-images/cargador-3.jpeg"]),
            stock: 50,
            featured: false,
            isActive: true,
            provider: "ATOMIC Power",
            keywords: "arrancador compacto, saltador 1200a, jumper auto, powerbank vehiculo",
            specs: JSON.stringify({
                potenciaPico: "1200 Amperios 12V",
                capacidad: "16,000 mAh Powerbank",
                garantia: "3 Años de Garantía",
                motores: "Hasta 6.0L Gasolina / 4.0L Diésel"
            })
        }
    ]

    for (const prod of evProducts) {
        const existing = await prisma.product.findUnique({
            where: { sku: prod.sku }
        })

        if (existing) {
            await prisma.product.update({
                where: { sku: prod.sku },
                data: { ...prod, categoryId: category.id }
            })
            console.log("Updated product:", prod.name)
        } else {
            await prisma.product.create({
                data: { ...prod, categoryId: category.id }
            })
            console.log("Created product:", prod.name)
        }
    }

    console.log("EV Products Seed Completed!")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
