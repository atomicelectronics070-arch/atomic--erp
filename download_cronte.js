const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'public', 'img', 'panic-bars');

const imagesToDownload = [
  {
    url: "https://http2.mlstatic.com/D_NQ_NP_918501-MEC46066224168_052021-O.jpg",
    filename: "cronte-1.jpg"
  },
  {
    url: "https://http2.mlstatic.com/D_NQ_NP_608144-MLM44812304910_022021-O.jpg",
    filename: "cronte-2.jpg"
  }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(filePath));
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });
  });
}

async function run() {
    for (const img of imagesToDownload) {
        try {
            console.log(`Downloading ${img.filename}...`);
            await downloadImage(img.url, img.filename);
            console.log(`Successfully downloaded ${img.filename}`);
        } catch (e) {
            console.error(`Error downloading ${img.filename}:`, e.message);
        }
    }
}

run();
