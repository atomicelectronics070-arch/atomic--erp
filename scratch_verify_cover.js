const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function verify() {
  const imgRes = await get('https://atomiccotizador.shop/images/barreras/barreras-portada-promociones.jpg');
  console.log('Image status:', imgRes.status, 'Content-Length:', imgRes.headers['content-length']);

  const webRes = await get('https://atomiccotizador.shop/web');
  console.log('Web page status:', webRes.status);
  
  const matches = [...webRes.body.matchAll(/src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => m[1]);
  console.log('Checking', matches.length, 'chunks...');
  
  for (const chunk of matches) {
    const chunkRes = await get('https://atomiccotizador.shop' + chunk);
    if (chunkRes.body.includes('barreras-portada-promociones.jpg')) {
      console.log('SUCCESS: Found barreras-portada-promociones.jpg in chunk:', chunk);
    }
    if (chunkRes.body.includes('/web/barreras-vehiculares')) {
      console.log('SUCCESS: Found /web/barreras-vehiculares in chunk:', chunk);
    }
  }
}

verify().catch(console.error);
