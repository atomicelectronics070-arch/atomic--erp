const fs = require('fs');
const products = JSON.parse(fs.readFileSync('scratch_apple_products_raw.json', 'utf8'));

console.log('=== MACS & MACBOOKS ===');
products.filter(p => /macbook|mac mini|mac studio|imac/i.test(p.name)).forEach(p => {
  console.log(`- [${p.id}] ${p.name} | $${p.price} | Provider: ${p.provider} | Img: ${p.images ? JSON.stringify(p.images).substring(0, 60) : 'none'}`);
});

console.log('\n=== IPHONES ===');
products.filter(p => /iphone/i.test(p.name)).forEach(p => {
  console.log(`- [${p.id}] ${p.name} | $${p.price} | Provider: ${p.provider} | Img: ${p.images ? JSON.stringify(p.images).substring(0, 60) : 'none'}`);
});

console.log('\n=== IPADS & WATCHES & AUDIO ===');
products.filter(p => /ipad|watch|airpods|pencil/i.test(p.name)).forEach(p => {
  console.log(`- [${p.id}] ${p.name} | $${p.price} | Provider: ${p.provider} | Img: ${p.images ? JSON.stringify(p.images).substring(0, 60) : 'none'}`);
});
