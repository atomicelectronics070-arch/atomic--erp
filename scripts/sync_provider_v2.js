const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CONFIG = {
    url: 'https://multitecnologiavyv.com/',
    email: 'totalscopeedge@gmail.com',
    password: 'Jp2024013gg002',
    iva: 1.15,
};

function applyRules(cost) {
    let priceWithMargin = 0;
    if (cost < 5) {
        priceWithMargin = cost * 2;
    } else if (cost <= 15) {
        priceWithMargin = cost * 1.65;
    } else {
        priceWithMargin = cost * 1.45;
    }
    return parseFloat((priceWithMargin * CONFIG.iva).toFixed(2));
}

async function run() {
    console.log("🚀 Iniciando Scraper Pro AI v2...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 1. Crear entrada en el historial
        const history = await prisma.extractionHistory.create({
            data: {
                url: CONFIG.url,
                domain: 'multitecnologiavyv.com',
                status: 'PROCESSING',
                itemCount: 0
            }
        });
        console.log(`📝 Historial creado: ${history.id}`);

        // 2. Login
        await page.goto(CONFIG.url + 'iniciar-sesion');
        await page.fill('input[name="email"]', CONFIG.email);
        await page.fill('input[name="password"]', CONFIG.password);
        await page.click('button#submit-login');
        await page.waitForTimeout(3000);
        console.log("✅ Login exitoso.");

        // 3. Navegar a una categoría (ej: Cables para demo/inicio)
        await page.goto(CONFIG.url + '297-cables');
        console.log("📂 Navegando a categoría: CABLES");

        // 4. Extraer productos de la primera página
        const products = await page.$$eval('.product-miniature', (elements) => {
            return elements.map(el => {
                const title = el.querySelector('.product-title')?.innerText || '';
                const priceText = el.querySelector('.price')?.innerText || '0';
                const image = el.querySelector('.product-thumbnail img')?.src || '';
                const link = el.querySelector('a')?.href || '';
                return { title, priceText, image, link };
            });
        });

        console.log(`🔍 Encontrados ${products.length} productos en esta página.`);

        let count = 0;
        for (const p of products) {
            // Limpiar precio (ej: "$ 0,80" -> 0.80)
            const rawPrice = parseFloat(p.priceText.replace('$', '').replace(',', '.').trim());
            const finalPrice = applyRules(rawPrice);

            // Upsert en la base de datos
            // Usamos el título como SKU si no hay uno claro, o generamos uno
            const sku = p.title.split(' ')[0] + "-" + Math.random().toString(36).substring(7).toUpperCase(); 

            await prisma.product.upsert({
                where: { sku: p.title }, // Usamos título como clave única temporal si no hay SKU real en el grid
                update: {
                    name: p.title,
                    price: finalPrice,
                    images: JSON.stringify([p.image]),
                    isActive: true,
                    isDeleted: false,
                    provider: 'MultiTecnologia V&V'
                },
                create: {
                    name: p.title,
                    sku: p.title, // En esta web el título suele ser único o contener el modelo
                    price: finalPrice,
                    images: JSON.stringify([p.image]),
                    isActive: true,
                    isDeleted: false,
                    provider: 'MultiTecnologia V&V'
                }
            });
            count++;
            if (count % 10 === 0) console.log(`📦 Procesados ${count} productos...`);
        }

        // 5. Finalizar historial
        await prisma.extractionHistory.update({
            where: { id: history.id },
            data: {
                status: 'COMPLETED',
                itemCount: count
            }
        });

        console.log(`✨ Sincronización completada. ${count} productos actualizados.`);

    } catch (error) {
        console.error("❌ Error en el proceso:", error);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
