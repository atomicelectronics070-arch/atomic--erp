const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
};

async function inspectSub() {
    const url = 'https://bpecuador.com/categoria-producto/acabados/espejos/';
    const res = await axios.get(url, { headers: HEADERS, httpsAgent, timeout: 20000 });
    const html = res.data;
    fs.writeFileSync('debug-espejos.html', html);
    console.log('Saved full HTML to debug-espejos.html');

    const $ = cheerio.load(html);
    console.log('li.product count:', $('li.product').length);
    console.log('.product count:', $('.product').length);
    
    // Print first few products' outer HTML if found
    $('li.product').slice(0, 3).each((i, el) => {
        console.log(`Product ${i + 1} classes:`, $(el).attr('class'));
        console.log(`Product ${i + 1} html:`, $(el).html().substring(0, 500));
        console.log('-----------------');
    });
}

inspectSub().catch(e => console.error(e));
