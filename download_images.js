const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'public', 'img', 'panic-bars');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const imagesToDownload = [
  {
    url: "https://yale.com.ec/wp-content/uploads/2023/11/Tampa_1-600x600.png",
    filename: "tampa-1.png"
  },
  {
    url: "https://yale.com.ec/wp-content/uploads/2025/12/Yale-Productos_2_c9c7e481-6073-4dfa-ab2a-30bbff33e2b7.webp",
    filename: "tampa-2.webp"
  },
  {
    url: "https://yale.com.ec/wp-content/uploads/2023/11/Eiffel_2.png",
    filename: "eiffel.png"
  },
  {
    url: "https://m.media-amazon.com/images/I/51r26z3Q3nL._AC_SL1500_.jpg",
    filename: "cronte-1.jpg"
  },
  {
    url: "https://m.media-amazon.com/images/I/61k3L4M-1mL._AC_SL1500_.jpg",
    filename: "cronte-2.jpg"
  }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dir, filename);
    const file = fs.createWriteStream(filePath);
    
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Referer': url.includes('yale') ? 'https://yale.com.ec/' : 'https://www.amazon.com/'
        }
    };

    https.get(url, options, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Handle redirect
          downloadImage(response.headers.location, filename).then(resolve).catch(reject);
          return;
      }
      
      if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
          return;
      }

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
