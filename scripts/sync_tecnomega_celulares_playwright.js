const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://tecnomegastore.ec';
const PROVIDER = 'TecnoMega';
const CATEGORY_CODE = '2N001-CELULARES-TABLETS-MOVILES';
const MARGIN = 1.35; // 35% margen

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function isTablet(name) {
    const n = name.toLowerCase();
    return /\b(tablet|ipad|tab |tab\d|galaxy tab|surface|fire hd|kindle|lenovo tab|matepad|mediapad|surf)\b/.test(n);
}

async function run() {
    console.log('🚀 TecnoMega Celulares & Tablets — Playwright con precios REALES (35% margen)\n');

    // Obtener IDs de categorías
    let celularesCat = await prisma.category.findFirst({ where: { name: 'Celulares' } });
    let tabletsCat   = await prisma.category.findFirst({ where: { name: 'Tablets' } });

    if (!celularesCat || !tabletsCat) {
        console.error('❌ Categorías Celulares/Tablets no encontradas en DB. Ejecuta sync_tecnomega_celulares.js primero.');
        await prisma.$disconnect();
        return;
    }

    console.log(`📂 Celulares → ID: ${celularesCat.id}`);
    console.log(`📂 Tablets   → ID: ${tabletsCat.id}\n`);

    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        locale: 'es-EC',
    });
    const page = await context.newPage();

    // ── FASE 1: Recolectar todos los links y nombres de producto ──
    console.log('🗺️  FASE 1: Recolectando productos...\n');

    const products = new Map(); // sku -> { name, url }
    let pageNum = 1;

    while (true) {
        const url = `${BASE_URL}/category/1/${CATEGORY_CODE}?page=${pageNum}`;
        console.log(`  📄 Página ${pageNum}: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await sleep(2000);

        // Extraer todos los links de productos
        const links = await page.$$eval('a[href*="/product/"]', els =>
            els
                .map(el => ({ href: el.href, text: el.innerText?.trim() }))
                .filter(l => l.href.includes('code='))
        );

        if (links.length === 0) {
            console.log(`  ⏹️  No hay más productos en página ${pageNum}.`);
            break;
        }

        let newInPage = 0;
        for (const link of links) {
            const codeMatch = link.href.match(/code=([^&]+)/);
            if (!codeMatch) continue;
            const sku = codeMatch[1];
            if (!products.has(sku)) {
                products.set(sku, { url: link.href, name: '', sku });
                newInPage++;
            }
        }

        console.log(`     → ${newInPage} nuevos links (total: ${products.size})`);

        // Verificar si hay siguiente página
        const hasNext = await page.$('a[aria-label="Next page"], a:has-text("Siguiente"), a.next, [rel="next"]');
        if (!hasNext) break;
        pageNum++;
        await sleep(1000);
    }

    console.log(`\n✅ Total productos a procesar: ${products.size}\n`);

    // ── FASE 2: Visitar cada página de producto y extraer precio real ──
    console.log('🔍 FASE 2: Extrayendo precios reales...\n');

    let celularCount = 0, tabletCount = 0, errors = 0, noPrice = 0;
    const productList = [...products.values()];

    for (let i = 0; i < productList.length; i++) {
        const { url, sku } = productList[i];
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
            await sleep(1500);

            // Extraer nombre
            const name = await page.$eval(
                'h1, [class*="product-title"], [class*="productTitle"], [class*="nombre"]',
                el => el.innerText?.trim()
            ).catch(() => '');

            if (!name) { errors++; continue; }

            // Extraer precio — TecnoMega renderiza el precio en el DOM después del JS
            let rawPrice = 0;

            // Intentar múltiples selectores de precio
            const priceSelectors = [
                '[class*="precio"]',
                '[class*="price"]',
                '[class*="Price"]',
                '[class*="Precio"]',
                '[class*="monto"]',
                '[class*="total"]',
                'span:has-text("$")',
                'p:has-text("$")',
                'div:has-text("$")',
            ];

            for (const sel of priceSelectors) {
                try {
                    const text = await page.$eval(sel, el => el.innerText?.trim());
                    if (text) {
                        const match = text.match(/\$?\s*([\d,\.]+)/);
                        if (match) {
                            const val = parseFloat(match[1].replace(',', '.'));
                            if (val > 10 && val < 50000) { rawPrice = val; break; }
                        }
                    }
                } catch (_) {}
            }

            // Si no encontramos precio por selectores, buscar en todo el texto de la página
            if (rawPrice === 0) {
                const bodyText = await page.$eval('body', el => el.innerText);
                // Buscar patrones como $450.00 o 450.00
                const matches = [...bodyText.matchAll(/\$\s*([\d]{2,5}[.,]\d{2})/g)];
                for (const m of matches) {
                    const val = parseFloat(m[1].replace(',', '.'));
                    if (val > 10 && val < 50000) { rawPrice = val; break; }
                }
            }

            // Extraer imágenes
            const images = await page.$$eval(
                'img[src*="tecnomega"], img[src*="product"], img[src*="/uploads/"]',
                els => els
                    .map(el => el.src)
                    .filter(src => src && !src.includes('logo') && !src.includes('banner'))
            ).catch(() => []);

            // Calcular precio final con margen
            let finalPrice;
            if (rawPrice > 0) {
                finalPrice = Number((rawPrice * MARGIN).toFixed(2));
            } else {
                // Estimado si no hay precio visible
                noPrice++;
                const est = isTablet(name) ? 280 : 250;
                finalPrice = Number((est * MARGIN).toFixed(2));
            }

            const tablet = isTablet(name);
            const catId = tablet ? tabletsCat.id : celularesCat.id;
            const catLabel = tablet ? 'TABLET' : 'CELULAR';

            const data = {
                name,
                price: finalPrice,
                images: JSON.stringify(images.slice(0, 8)),
                keywords: 'Celulares Tablets Móviles',
                provider: PROVIDER,
                isActive: true,
                isDeleted: false,
                sku: sku || null,
                categoryId: catId,
                stock: 10,
                createdAt: new Date(),
            };

            const existing = await prisma.product.findFirst({
                where: { provider: PROVIDER, name }
            });

            if (existing) {
                await prisma.product.update({ where: { id: existing.id }, data });
            } else {
                await prisma.product.create({ data });
            }

            tablet ? tabletCount++ : celularCount++;
            const priceTag = rawPrice > 0 ? `$${rawPrice} → $${finalPrice}` : `estimado → $${finalPrice}`;
            console.log(`[${i+1}/${productList.length}] [${catLabel}] "${name.substring(0, 50)}" ${priceTag}`);

        } catch (e) {
            errors++;
            console.log(`[${i+1}/${productList.length}] ❌ ${url.substring(0, 60)} — ${e.message.substring(0, 60)}`);
        }

        await sleep(800);
    }

    await browser.close();
    await prisma.$disconnect();

    console.log('\n🎉 ¡SINCRONIZACIÓN COMPLETA CON PRECIOS REALES!');
    console.log(`   📱 Celulares: ${celularCount}`);
    console.log(`   🖥️  Tablets:   ${tabletCount}`);
    console.log(`   ⚠️  Sin precio (estimado): ${noPrice}`);
    console.log(`   ❌ Errores:   ${errors}`);
    console.log(`   📦 TOTAL: ${celularCount + tabletCount}`);
}

run();
