const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
};

async function inspect() {
    const res = await axios.get('https://bpecuador.com/categoria-producto/acabados/', { headers: HEADERS, httpsAgent, timeout: 20000 });
    const html = res.data;
    fs.writeFileSync('debug-acabados-full.html', html);
    console.log('Saved full HTML to debug-acabados-full.html');
}

inspect().catch(e => console.error('Error:', e.message));
