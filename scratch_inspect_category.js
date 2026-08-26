const https = require('https');
const fs = require('fs');

https.get('https://yale.com.ec/categoria-producto/cerraduras-digitales/', { rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    fs.writeFileSync('./scratch_yale_cat1.html', body, 'utf8');
    console.log('Saved scratch_yale_cat1.html, length:', body.length);
    const idx = body.indexOf('/producto/');
    console.log('Snippet around /producto/:', body.substring(idx - 150, idx + 450));
  });
});
