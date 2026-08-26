const fs = require('fs');
const products = JSON.parse(fs.readFileSync('scratch_apple_products_raw.json', 'utf8'));

console.log('=== IPADS ===');
products.filter(p => /ipad|pencil/i.test(p.name)).forEach(p => {
  console.log(`ID: ${p.id} | Name: ${p.name} | Price: $${p.price} | Provider: ${p.provider} | Img: ${JSON.stringify(p.images)}`);
});

console.log('\n=== WATCHES & AUDIO & ACCESORIOS ===');
products.filter(p => /watch|airpods|airtag|magsafe|cargador|cable.*iphone|buscador.*apple|finder/i.test(p.name)).forEach(p => {
  console.log(`ID: ${p.id} | Name: ${p.name} | Price: $${p.price} | Provider: ${p.provider} | Img: ${JSON.stringify(p.images)}`);
});
