const https = require('https');

function fetchHTML(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const allUploads = data.match(/https:\/\/cronte\.net\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[^"'\s]+\.(?:jpg|png|jpeg)/g) || [];
                const uniqueImages = [...new Set(allUploads)];
                resolve(uniqueImages.join('\n'));
            });
        });
    });
}

async function run() {
    console.log(await fetchHTML('https://cronte.net/producto/cerradura-con-manilla-para-puerta-salida-de-emergencia/'));
}

run();
