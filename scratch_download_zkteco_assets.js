const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_TO_FETCH = [
  {
    name: 'zk-tl800.png',
    url: 'https://www.zkteco.com/uploadfile/2021/0401/20210401031343714.png'
  },
  {
    name: 'zk-tl400b.png',
    url: 'https://www.zkteco.com/uploadfile/2019/0411/20190411032338573.png'
  },
  {
    name: 'zk-lh6000.png',
    url: 'https://www.zkteco.com/uploadfile/2019/0411/20190411034458319.png'
  },
  {
    name: 'zk-ll-01.png',
    url: 'https://www.zkteco.com/uploadfile/2020/0917/20200917053531475.png'
  }
];

async function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        console.log(`Failed ${url} status ${res.statusCode}`);
        return resolve(false);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Saved: ${dest} (${fs.statSync(dest).size} bytes)`);
        resolve(true);
      });
    });
    req.on('error', (err) => {
      console.log(`Error ${url}:`, err.message);
      resolve(false);
    });
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const dir = path.join(__dirname, 'public/images/cerraduras/zkteco');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const item of IMAGES_TO_FETCH) {
    const dest = path.join(dir, item.name);
    await downloadFile(item.url, dest);
  }
}

main().catch(console.error);
