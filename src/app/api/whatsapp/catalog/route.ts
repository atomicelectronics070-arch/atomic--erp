export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Catálogo Oficial Bandera extraído directamente de las solicitudes e imágenes de WhatsApp
const OFFICIAL_FLAGSHIP_PRODUCTS = [
    {
        id: 'ATOMIC-ANT-MERCURY-5003',
        sku: 'ANT-RS5003TR',
        name: 'Par de Antenas de Seguridad RF Mono Dahua Mercury (ANT-RS5003TR)',
        description: 'Antena de seguridad RF de alto rendimiento para tiendas, boutiques, farmacias y supermercados. Detección inteligente: 70cm etiquetas / 95cm tags duros. Material: Tubo reforzado.',
        price: 499.96,
        category: 'Seguridad Comercial Antihurto',
        brand: 'Dahua / ATOMIC',
        imageUrl: 'https://atomiccotizador.shop/images/products/antena_mercury.jpg'
    },
    {
        id: 'ATOMIC-VIDEOPORTERO-2P',
        sku: 'VP-2P-HD',
        name: 'Portero de Video Residencial de Dos Pantallas HD',
        description: 'Seguridad y comunicación para tu hogar. Audio y video en tiempo real, 2 monitores interiores a color para máxima comodidad y frente exterior con cámara HD. Ideal para casas, departamentos y oficinas. ¡Incluye Envío Gratis!',
        price: 285.00,
        category: 'Videoporteros Residenciales',
        brand: 'ATOMIC',
        imageUrl: 'https://atomiccotizador.shop/images/products/videoportero_2p.jpg'
    },
    {
        id: 'ATOMIC-KOCOM-KIT-3DEP',
        sku: 'KIT-KOCOM-3DEP',
        name: 'Kit de Citofonía KOCOM 3 Departamentos (KDP-601A)',
        description: 'Solución completa de comunicación y seguridad para tu edificio o conjunto residencial. Incluye: 1 portero eléctrico para 3 departamentos + 3 citófonos KDP-601A KOCOM originales. Fácil instalación.',
        price: 149.00,
        category: 'Citofonía Edificios',
        brand: 'KOCOM',
        imageUrl: 'https://atomiccotizador.shop/images/products/citofono_kocom_3dep.jpg'
    },
    {
        id: 'ATOMIC-IMOU-360-FHD',
        sku: 'CAM-IMOU-360-1080P',
        name: 'Cámara de Seguridad Inteligente IMOU 360° WiFi Full HD 1080P',
        description: 'Vigila lo que más importa desde tu celular. Detección de movimiento instantánea, visión nocturna 24/7, audio bidireccional (habla y escucha), Full HD 1080P y conexión WiFi rápida. Garantía hasta 3 años.',
        price: 45.40,
        category: 'Cámaras Inteligentes',
        brand: 'IMOU',
        imageUrl: 'https://atomiccotizador.shop/images/products/camara_imou_360.jpg'
    },
    {
        id: 'ATOMIC-BARRA-ANTIPANICO',
        sku: 'CERR-BARRA-PANIC-USA',
        name: 'Cerradura Barra Antipánico Reforzada Marca Americana',
        description: 'Seguridad y elegancia para tu edificación. Fabricada con materiales reforzados para puertas de salida de emergencia. Ideal para centros comerciales, hospitales, edificios y oficinas. Durabilidad 10 años, garantía 3 años. ¡Envío Gratis!',
        price: 98.00,
        category: 'Seguridad y Emergencia',
        brand: 'ATOMIC',
        imageUrl: 'https://atomiccotizador.shop/images/products/barra_antipanico.jpg'
    },
    {
        id: 'ATOMIC-IMOU-RANGER-3MP',
        sku: 'CAM-IMOU-RANGER-3MP',
        name: 'Cámara de Seguridad IMOU PT Ranger 360° Mini 3MP',
        description: 'Visión completa, protección real. Cobertura 360° sin puntos ciegos, resolución ultra nítida 3MP, visión nocturna hasta 30m, audio bidireccional y almacenamiento en micro SD y nube. Compatible con App IMOU.',
        price: 95.00,
        category: 'Cámaras Inteligentes',
        brand: 'IMOU',
        imageUrl: 'https://atomiccotizador.shop/images/products/camara_imou_ranger_3mp.jpg'
    },
    {
        id: 'ATOMIC-CERCO-JFL-PLATA',
        sku: 'CERCO-15023',
        name: 'Kit Cerco Eléctrico JFL Plata (Cód: 15023)',
        description: 'Kit de seguridad perimetral de alta potencia. Incluye: electrificador JFL, control remoto, batería de respaldo 12V-4Amp, letrero de peligro y sirena de 20W. Máxima seguridad 24 horas.',
        price: 89.00,
        category: 'Cercos Eléctricos',
        brand: 'JFL / ATOMIC',
        imageUrl: 'https://atomiccotizador.shop/images/products/cercos_jfl.jpg'
    },
    {
        id: 'ATOMIC-CERCO-JFL-ORO',
        sku: 'CERCO-11207',
        name: 'Kit Cerco Eléctrico JFL Oro con Caja de Sirena (Cód: 11207)',
        description: 'Kit completo de cerco eléctrico con protección metálica. Incluye: electrificador JFL, control remoto, batería 12V-4Amp, sirena de 20W con caja metálica protectora y letrero de advertencia.',
        price: 109.00,
        category: 'Cercos Eléctricos',
        brand: 'JFL / ATOMIC',
        imageUrl: 'https://atomiccotizador.shop/images/products/cercos_jfl.jpg'
    },
    {
        id: 'ATOMIC-CERCO-JFL-PLATINO',
        sku: 'CERCO-11208',
        name: 'Kit Cerco Eléctrico JFL Platino con App Celular (Cód: 11208)',
        description: 'Control total de tu cerco eléctrico desde tu celular. Incluye electrificador JFL, módulo Ethernet ME-05 (armar/desarmar y notificaciones por App móvil), control remoto, batería 12V-4Amp, sirena de 30W y caja metálica.',
        price: 137.00,
        category: 'Cercos Eléctricos',
        brand: 'JFL / ATOMIC',
        imageUrl: 'https://atomiccotizador.shop/images/products/cercos_jfl.jpg'
    },
    {
        id: 'ATOMIC-CERCO-HAGROY-I8',
        sku: 'CERCO-15083',
        name: 'Kit Cerco Eléctrico Platino Hagroy i8 (Cód: 15083)',
        description: 'Electrificador Hagroy i8 de alta potencia, control remoto, batería de respaldo 12V-4Amp, letrero de peligro y potente sirena de 20W.',
        price: 98.00,
        category: 'Cercos Eléctricos',
        brand: 'Hagroy / ATOMIC',
        imageUrl: 'https://atomiccotizador.shop/images/products/cercos_jfl.jpg'
    },
    {
        id: 'ATOMIC-CERCO-YANEX',
        sku: 'CERCO-11258',
        name: 'Kit Cerco Eléctrico Hagroy Yanex (Cód: 11258)',
        description: 'Electrificador Hagroy Yanex, control remoto, batería 12V-4Amp, letrero de seguridad y sirena de 20W.',
        price: 90.00,
        category: 'Cercos Eléctricos',
        brand: 'Hagroy / ATOMIC',
        imageUrl: 'https://atomiccotizador.shop/images/products/cercos_jfl.jpg'
    },
    {
        id: 'ATOMIC-HIKVISION-DS-KIS212',
        sku: 'DS-KIS212',
        name: 'Kit de Videoportero Análogo Hikvision DS-KIS212 Pantalla 7 Pulgadas',
        description: 'Kit de videoportero de alta definición. Monitor LCD 7", micrófono omnidireccional con supresión de ruido, altavoz, calidad HD TVI, función Plug & Play y botón para apertura remota de puerta.',
        price: 92.40,
        category: 'Videoporteros Residenciales',
        brand: 'Hikvision',
        imageUrl: 'https://atomiccotizador.shop/images/products/videoportero_hikvision.jpg'
    },
    {
        id: 'ATOMIC-INTELBRAS-COLLECTIVE-4I',
        sku: 'COLLECTIVE-11433',
        name: 'Central de Citofonía Intelbras Collective 4i (4 Departamentos)',
        description: 'Central colectiva para edificios y condominios. Comunicación clara entre departamentos, desvío de llamadas a celulares y apertura de cerradura remota.',
        price: 121.81,
        category: 'Citofonía Edificios',
        brand: 'Intelbras',
        imageUrl: 'https://atomiccotizador.shop/images/products/intelbras_collective.jpg'
    },
    {
        id: 'ATOMIC-INTELBRAS-COLLECTIVE-8I',
        sku: 'COLLECTIVE-11484',
        name: 'Central de Citofonía Intelbras Collective 8i (8 Departamentos)',
        description: 'Central para hasta 8 departamentos con estabilidad de señal, conexión entre colectives y desvío telefónico.',
        price: 134.20,
        category: 'Citofonía Edificios',
        brand: 'Intelbras',
        imageUrl: 'https://atomiccotizador.shop/images/products/intelbras_collective.jpg'
    },
    {
        id: 'ATOMIC-INTELBRAS-COLLECTIVE-12I',
        sku: 'COLLECTIVE-11435',
        name: 'Central de Citofonía Intelbras Collective 12i (12 Departamentos)',
        description: 'Central de intercomunicación para edificios de hasta 12 departamentos.',
        price: 143.00,
        category: 'Citofonía Edificios',
        brand: 'Intelbras',
        imageUrl: 'https://atomiccotizador.shop/images/products/intelbras_collective.jpg'
    },
    {
        id: 'ATOMIC-INTELBRAS-COLLECTIVE-24I',
        sku: 'COLLECTIVE-11437',
        name: 'Central de Citofonía Intelbras Collective 24i (24 Departamentos)',
        description: 'Central colectiva de alta capacidad para edificios y conjuntos de hasta 24 departamentos.',
        price: 190.18,
        category: 'Citofonía Edificios',
        brand: 'Intelbras',
        imageUrl: 'https://atomiccotizador.shop/images/products/intelbras_collective.jpg'
    },
    {
        id: 'ATOMIC-ZKTECO-SENSEFACE-2A',
        sku: 'ZK-SENSEFACE-2A',
        name: 'Control de Acceso Multibiométrico ZKTeco SenseFace 2A con Videoportero por App',
        description: 'La solución todo en uno para seguridad inteligente. Reconocimiento facial ultra rápido, huella dactilar, tarjeta RFID, código PIN, conexión WiFi 100% inalámbrica y videollamada a aplicación móvil.',
        price: 175.00,
        category: 'Control de Acceso',
        brand: 'ZKTeco',
        imageUrl: 'https://atomiccotizador.shop/images/products/senseface_2a.jpg'
    },
    {
        id: 'ATOMIC-ZKTECO-TS1000-PRO',
        sku: 'ZK-TS1000-PRO',
        name: 'Torniquete Trípode Peatonal ZKTeco TS1000 Pro Acero Inoxidable',
        description: 'Torniquete trípode en acero inoxidable 304 de alto tráfico, paso bidireccional, compatible con lector facial, huella y tarjetas RFID.',
        price: 720.00,
        category: 'Torniquetes Peatonales',
        brand: 'ZKTeco',
        imageUrl: 'https://atomiccotizador.shop/images/products/torniquete_ts1000.jpg'
    },
    {
        id: 'ATOMIC-ZKTECO-FBL4000-PRO',
        sku: 'ZK-FBL4000-PRO',
        name: 'Torniquete Flap Barrier ZKTeco FBL4000 Pro Aletas Retráctiles',
        description: 'Barrera peatonal motorizada de alta gama con aletas retráctiles en acrílico/vidrio templado para lobbies corporativos y edificios de alto flujo.',
        price: 1850.00,
        category: 'Torniquetes Peatonales',
        brand: 'ZKTeco',
        imageUrl: 'https://atomiccotizador.shop/images/products/flap_barrier.jpg'
    },
    {
        id: 'ATOMIC-ZKTECO-FHT2300',
        sku: 'ZK-FHT2300',
        name: 'Torniquete Molinete Cuerpo Entero ZKTeco FHT2300 Máxima Seguridad',
        description: 'Torniquete de cuerpo completo de alta seguridad anti-intrusión en acero reforzado. Ideal para industrias, prisiones y estadios.',
        price: 2950.00,
        category: 'Torniquetes Peatonales',
        brand: 'ZKTeco',
        imageUrl: 'https://atomiccotizador.shop/images/products/molinete_fht2300.jpg'
    }
];

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const format = searchParams.get('format') || 'json';

        // 1. Obtener productos de la base de datos
        let dbProducts: any[] = [];
        try {
            dbProducts = await prisma.product.findMany({
                where: { isActive: true, isDeleted: false },
                take: 500,
                orderBy: { createdAt: 'desc' },
                include: { category: true }
            });
        } catch (dbErr) {
            console.warn('[WHATSAPP_CATALOG_DB_WARN]', dbErr);
        }

        // 2. Fusionar con productos bandera garantizando que el catálogo oficial esté completo
        const allItemsMap = new Map<string, any>();

        // Primero agregar productos de base de datos
        dbProducts.forEach(p => {
            let img = 'https://atomiccotizador.shop/icon.png';
            try {
                const parsed = JSON.parse(p.images || '[]');
                if (Array.isArray(parsed) && parsed[0]) img = parsed[0];
            } catch(e) {}

            allItemsMap.set(p.sku || p.id, {
                id: p.id,
                sku: p.sku || p.id,
                name: p.name,
                description: p.description || p.name,
                price: p.price || 0,
                stock: p.stock || 10,
                category: p.category?.name || 'General',
                brand: p.provider || 'ATOMIC',
                imageUrl: img,
                link: `https://atomiccotizador.shop/web/product/${p.id}`
            });
        });

        // Asegurar que los productos oficiales de la matriz ATOMIC estén siempre presentes
        OFFICIAL_FLAGSHIP_PRODUCTS.forEach(flagship => {
            if (!allItemsMap.has(flagship.sku) && !allItemsMap.has(flagship.id)) {
                allItemsMap.set(flagship.sku, {
                    ...flagship,
                    stock: 50,
                    link: `https://atomiccotizador.shop/web`
                });
            }
        });

        const combinedProducts = Array.from(allItemsMap.values());

        if (format === 'csv') {
            // Formato estándar CSV de Meta Commerce Manager / WhatsApp Catalog Feed
            let csv = 'id,title,description,availability,condition,price,link,image_link,brand\n';
            combinedProducts.forEach(p => {
                const id = p.sku || p.id;
                const title = `"${(p.name || '').replace(/"/g, '""')}"`;
                const description = `"${(p.description || p.name || '').replace(/"/g, '""')}"`;
                const availability = (p.stock || 1) > 0 ? 'in stock' : 'out of stock';
                const condition = 'new';
                const price = `${(p.price || 0).toFixed(2)} USD`;
                const link = p.link || `https://atomiccotizador.shop/web`;
                const imageLink = p.imageUrl || 'https://atomiccotizador.shop/icon.png';
                const brand = p.brand || 'ATOMIC';

                csv += `${id},${title},${description},${availability},${condition},${price},${link},${imageLink},${brand}\n`;
            });

            return new Response(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="whatsapp-catalog-meta-feed.csv"'
                }
            });
        }

        return NextResponse.json({
            count: combinedProducts.length,
            products: combinedProducts
        });
    } catch (error: any) {
        console.error('[WHATSAPP_CATALOG_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
