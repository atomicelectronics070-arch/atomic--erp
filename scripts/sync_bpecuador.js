const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const { PrismaClient } = require('@prisma/client');

// BP Ecuador has a self-signed / incomplete SSL cert chain
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const prisma = new PrismaClient();
const BASE_URL = 'https://bpecuador.com';
const PROVIDER = 'BP Ecuador';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function fetchPage(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS, timeout: 20000, httpsAgent });
        return data;
    } catch (e) {
        console.log(`  ⚠️ Error fetching ${url}: ${e.message}`);
        return null;
    }
}

// Collect all product URLs from tienda pagination
async function collectProductLinks() {
    const links = new Set();
    console.log('🗺️  Recolectando todos los links de productos...');

    for (let p = 1; p <= 500; p++) {
        const url = p === 1
            ? `${BASE_URL}/tienda/`
            : `${BASE_URL}/tienda/page/${p}/`;

        const html = await fetchPage(url);
        if (!html) break;

        const $ = cheerio.load(html);
        const productLinks = [];

        $('a[href*="/producto/"]').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('/producto/') && !href.includes('add-to-cart') && !href.includes('?')) {
                productLinks.push(href.split('?')[0]);
            }
        });

        if (productLinks.length === 0) {
            console.log(`  ✅ Fin de paginación en página ${p}.`);
            break;
        }

        productLinks.forEach(l => links.add(l));
        console.log(`  Página ${p}: ${productLinks.length} links nuevos → Total: ${links.size}`);
        await sleep(800);
    }

    return [...links];
}

// Extract product details from individual page
async function scrapeProduct(url) {
    const html = await fetchPage(url);
    if (!html) return null;

    const $ = cheerio.load(html);

    const name = $('h1.product_title, h1.entry-title').first().text().trim();
    if (!name) return null;

    // Price: prefer sale price, fallback to regular
    let price = 0;
    const salePrice = $('p.price ins .woocommerce-Price-amount bdi').first().text();
    const regPrice = $('p.price > .woocommerce-Price-amount bdi, p.price > span > .woocommerce-Price-amount bdi').first().text();
    const anyPrice = $('p.price bdi').first().text();

    const rawPrice = salePrice || regPrice || anyPrice;
    if (rawPrice) {
        price = parseFloat(rawPrice.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    }

    // SKU
    const sku = $('span.sku').first().text().trim() || '';

    // Description
    const description = $('#tab-description').text().trim() ||
        $('[class*="woocommerce-product-details__short-description"]').text().trim() ||
        $('.woocommerce-product-details__short-description').text().trim() ||
        $('div.entry-content').text().trim().substring(0, 500) || '';

    // Category
    const category = $('span.posted_in a').first().text().trim() ||
        $('[class*="product_meta"] .posted_in a').first().text().trim() || 'Ferretería';

    // Images
    const images = [];
    $('div.woocommerce-product-gallery img, figure.woocommerce-product-gallery__wrapper img').each((_, el) => {
        const src = $(el).attr('data-large_image') || $(el).attr('data-src') || $(el).attr('src');
        if (src && !src.includes('placeholder') && src.startsWith('http')) {
            images.push(src);
        }
    });

    // Also check for single featured image
    if (images.length === 0) {
        const featImg = $('div.product-images img, .woocommerce-product-gallery img').first().attr('src');
        if (featImg && featImg.startsWith('http')) images.push(featImg);
    }

    return { name, price, sku, description, category, images, url };
}

async function run() {
    console.log('🚀 Iniciando Scraper: BP Ecuador (bpecuador.com)...');
    console.log('🏭 Proveedor de nivel industrial — Ferretería, LED, Construcción\n');

    const links = await collectProductLinks();
    console.log(`\n📦 Total de productos encontrados: ${links.length}`);
    console.log('🔍 Extrayendo detalles de cada producto...\n');

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (let i = 0; i < links.length; i++) {
        const url = links[i];
        try {
            const product = await scrapeProduct(url);
            if (!product || !product.name) {
                errors++;
                continue;
            }

            const existing = await prisma.product.findFirst({
                where: { provider: PROVIDER, name: product.name }
            });

            const data = {
                name: product.name,
                price: product.price,
                description: product.description.substring(0, 1000),
                images: JSON.stringify(product.images.slice(0, 10)),
                keywords: product.category || 'Ferretería',
                provider: PROVIDER,
                isActive: true,
                isDeleted: false,
            };

            if (existing) {
                await prisma.product.update({ where: { id: existing.id }, data });
                updated++;
                console.log(`[${i+1}/${links.length}] 🔄 Actualizado: "${product.name}" → $${product.price}`);
            } else {
                await prisma.product.create({ data });
                inserted++;
                console.log(`[${i+1}/${links.length}] ✅ Insertado: "${product.name}" → $${product.price}`);
            }

        } catch (e) {
            errors++;
            console.log(`[${i+1}/${links.length}] ❌ Error en ${url}: ${e.message.substring(0, 80)}`);
        }

        await sleep(1200); // respectful delay
    }

    console.log('\n🎉 ¡SCRAPING COMPLETADO! Resumen:');
    console.log(`   ✅ ${inserted} productos insertados`);
    console.log(`   🔄 ${updated} productos actualizados`);
    console.log(`   ❌ ${errors} errores`);
    console.log(`   📦 TOTAL procesados: ${inserted + updated}`);

    await prisma.$disconnect();
}

run();
