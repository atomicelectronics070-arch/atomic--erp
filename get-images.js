const https = require('https');
function fetchHTML(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/<meta property="og:image" content="([^"]+)"/);
                resolve(match ? match[1] : 'No image found');
            });
        });
    });
}
async function run() {
    console.log('60cm:', await fetchHTML('https://cronte.net/producto/barra-antipanico-65cm-salida-de-emergencia/'));
    console.log('100cm:', await fetchHTML('https://cronte.net/producto/barra-antipanico-salida-de-emergencia-100cm/'));
    console.log('Miami:', await fetchHTML('https://yale.com.ec/producto/barra-antipanico-miami-de-1-punto/'));
    console.log('Orlando:', await fetchHTML('https://yale.com.ec/producto/barra-antipanico-orlando-de-1-punto/'));
    console.log('Eiffel:', await fetchHTML('https://yale.com.ec/producto/manija-para-barra-antipanico-eiffel/'));
}
run();
