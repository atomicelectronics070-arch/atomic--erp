const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images', 'cerraduras');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const imagesToDownload = [
  { name: 'yale-ymc420d.png', url: 'https://yale.com.ec/wp-content/uploads/2024/02/YMC420D-4-600x600.png' },
  { name: 'yale-ydf40a.png', url: 'https://yale.com.ec/wp-content/uploads/2023/10/YDF40-1-600x600.png' },
  { name: 'yale-ydr41.png', url: 'https://yale.com.ec/wp-content/uploads/2023/10/YDR41-1-600x600.png' },
  { name: 'yale-yrd226.png', url: 'https://yale.com.ec/wp-content/uploads/2023/10/YRD226-WEB-600x600.png' },
  { name: 'yale-ydl120.png', url: 'https://yale.com.ec/wp-content/uploads/2023/10/YDL120-1-600x600.png' },
  { name: 'yale-ph140.png', url: 'https://yale.com.ec/wp-content/uploads/2023/10/PH140-1.png' },
  { name: 'bp-voltex-lock.webp', url: 'https://bpecuador.com/wp-content/uploads/2025/07/BP03899-300x300.webp' },
  { name: 'bp-plasma-lock.png', url: 'https://bpecuador.com/wp-content/uploads/2025/04/BP03900-300x300.png' },
  { name: 'bp-quantum-lock.png', url: 'https://bpecuador.com/wp-content/uploads/2025/04/BP03896-300x300.png' },
  { name: 'bp-dortmund.png', url: 'https://bpecuador.com/wp-content/uploads/2023/05/Familia-Dortmund-300x300.png' },
  { name: 'bp-bremen.png', url: 'https://bpecuador.com/wp-content/uploads/2023/05/Familia-Bremen-300x300.png' },
  { name: 'bp-kassel.png', url: 'https://bpecuador.com/wp-content/uploads/2023/05/Familia-Kassel-300x300.png' },
  { name: 'sisegusa-dl04.jpg', url: 'https://www.sisegusa.com/web/image/product.template/4273/image_512' },
  { name: 'sisegusa-dl03.jpg', url: 'https://www.sisegusa.com/web/image/product.template/3810/image_512' },
  { name: 'sisegusa-electroiman.jpg', url: 'https://www.sisegusa.com/web/image/product.template/4249/image_512' }
];

function download(item) {
  const filePath = path.join(targetDir, item.name);
  return new Promise((resolve) => {
    const client = item.url.startsWith('https') ? https : http;
    const req = client.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download({ name: item.name, url: res.headers.location }).then(resolve);
      }
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(filePath);
          console.log(`Downloaded ${item.name} (${stats.size} bytes)`);
          resolve(true);
        });
      } else {
        console.log(`Failed ${item.name}: HTTP ${res.statusCode}`);
        resolve(false);
      }
    });
    req.on('error', (err) => {
      console.log(`Error ${item.name}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Downloading official images to', targetDir);
  for (const item of imagesToDownload) {
    await download(item);
  }
  console.log('All downloads finished.');
}

run();
