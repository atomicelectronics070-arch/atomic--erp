const fs = require('fs');
const products = JSON.parse(fs.readFileSync('scratch_apple_products_raw.json', 'utf8'));

const macs = products.filter(p => /macbook|mac mini|mac studio|imac/i.test(p.name));
console.log('=== ALL MACS (' + macs.length + ') ===');
macs.forEach(m => {
  console.log(`ID: ${m.id} | Name: ${m.name} | Price: $${m.price} | Provider: ${m.provider}`);
  console.log(`Images: ${JSON.stringify(m.images)}`);
  console.log(`Description: ${m.description?.substring(0, 100)}...`);
  console.log('---');
});
