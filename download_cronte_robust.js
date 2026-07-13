const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'img', 'panic-bars');

const imagesToDownload = [
  {
    url: "https://http2.mlstatic.com/D_NQ_NP_918501-MEC46066224168_052021-O.webp",
    filename: "cronte-1.jpg"
  },
  {
    url: "https://http2.mlstatic.com/D_NQ_NP_608144-MLM44812304910_022021-O.webp",
    filename: "cronte-2.jpg"
  }
];

async function run() {
    for (const img of imagesToDownload) {
        try {
            console.log(`Fetching ${img.url}...`);
            const response = await fetch(img.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                }
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            if (buffer.length === 0) throw new Error('Downloaded 0 bytes!');
            
            const filePath = path.join(dir, img.filename);
            fs.writeFileSync(filePath, buffer);
            console.log(`Successfully downloaded ${img.filename} (${buffer.length} bytes)`);
        } catch (e) {
            console.error(`Error downloading ${img.filename}:`, e.message);
        }
    }
}

run();
