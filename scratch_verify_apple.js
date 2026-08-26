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
  const appleRes = await get('https://atomiccotizador.shop/web/apple');
  console.log('/web/apple status:', appleRes.status, 'HTML length:', appleRes.body.length);

  const webRes = await get('https://atomiccotizador.shop/web');
  const matches = [...webRes.body.matchAll(/src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => m[1]);
  console.log('Checking', matches.length, 'chunks on /web...');
  
  for (const chunk of matches) {
    const chunkRes = await get('https://atomiccotizador.shop' + chunk);
    if (chunkRes.body.includes('/web/apple')) {
      console.log('SUCCESS: Found /web/apple in chunk:', chunk);
    }
  }
}

verify().catch(console.error);
