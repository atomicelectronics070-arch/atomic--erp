const axios = require('axios');
const cheerio = require('cheerio');

async function findCategory() {
    // Try common URL patterns for "Fuentes de Poder"
    const candidates = [
        'https://multitecnologiavyv.com/305-fuentes-de-poder',
        'https://multitecnologiavyv.com/306-fuentes-de-poder',
        'https://multitecnologiavyv.com/307-fuentes-de-poder',
        'https://multitecnologiavyv.com/308-fuentes-de-poder',
        'https://multitecnologiavyv.com/309-fuentes-de-poder',
        'https://multitecnologiavyv.com/310-fuentes-de-poder',
        'https://multitecnologiavyv.com/320-fuentes-de-poder',
        'https://multitecnologiavyv.com/315-fuentes-de-poder',
        'https://multitecnologiavyv.com/325-fuentes-de-poder',
        'https://multitecnologiavyv.com/330-fuentes-de-poder',
    ];

    const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };

    for (const url of candidates) {
        try {
            const { data, status } = await axios.get(url, { headers, timeout: 10000, maxRedirects: 5 });
            const $ = cheerio.load(data);
            const title = $('title').text().trim();
            const h1 = $('h1').first().text().trim();
            const products = $('.js-product-miniature').length;
            console.log(`${url} → [${status}] title="${title}" h1="${h1}" products=${products}`);
            if (title.toLowerCase().includes('fuente') || h1.toLowerCase().includes('fuente')) {
                console.log('  ✅ FOUND!');
            }
        } catch(e) {
            console.log(`${url} → ERROR: ${e.message.substring(0, 50)}`);
        }
    }

    // Also scan the main menu
    console.log('\n--- Scanning main menu categories ---');
    const { data } = await axios.get('https://multitecnologiavyv.com/', { headers, timeout: 15000 });
    const $ = cheerio.load(data);
    const links = new Set();
    $('a').each((i, el) => {
        const href = $(el).attr('href') || '';
        const text = $(el).text().trim();
        if (href.includes('multitecnologiavyv.com') && href.match(/\/\d+-/) && text) {
            links.add(`${text} -> ${href}`);
        }
    });
    [...links].sort().forEach(l => console.log(l));
}

findCategory();
