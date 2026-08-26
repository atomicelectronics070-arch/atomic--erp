const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputImg = 'C:/Users/SANTIAGO/.gemini/antigravity/brain/977d628f-fd7e-47df-8965-4c7d27cd0697/.user_uploaded/media_1787515537519.png';
const outDir = path.join(__dirname, 'public/images/cerraduras/bp');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function cropAll() {
  const metadata = await sharp(inputImg).metadata();
  console.log('Image dimensions:', metadata.width, metadata.height);

  const colW = Math.floor(metadata.width / 5); // ~204px
  
  // Row 1 products (y ~ 40 to 165)
  // 1. Voltex Lock (Col 1, Row 1)
  await sharp(inputImg)
    .extract({ left: colW * 0 + 10, top: 40, width: colW - 20, height: 125 })
    .toFile(path.join(outDir, 'bp-voltex-lock-bp03899.png'));

  // 2. Plasma Lock (Col 2, Row 1)
  await sharp(inputImg)
    .extract({ left: colW * 1 + 10, top: 40, width: colW - 20, height: 125 })
    .toFile(path.join(outDir, 'bp-plasma-lock-bp03900.png'));

  // 3. Hyperbolt Lock (Col 3, Row 1)
  await sharp(inputImg)
    .extract({ left: colW * 2 + 10, top: 40, width: colW - 20, height: 125 })
    .toFile(path.join(outDir, 'bp-hyperbolt-lock-bp03895.png'));

  // 4. Ionsecure Lock (Col 4, Row 1)
  await sharp(inputImg)
    .extract({ left: colW * 3 + 10, top: 40, width: colW - 20, height: 125 })
    .toFile(path.join(outDir, 'bp-ionsecure-lock-bp03897.png'));

  // 5. Quantum Lock (Col 5, Row 1)
  await sharp(inputImg)
    .extract({ left: colW * 4 + 5, top: 40, width: colW - 15, height: 125 })
    .toFile(path.join(outDir, 'bp-quantum-lock-bp03896.png'));

  // Row 2 products (y ~ 260 to 390)
  // 6. Nova Lock (Col 1, Row 2)
  await sharp(inputImg)
    .extract({ left: colW * 0 + 10, top: 260, width: colW - 20, height: 125 })
    .toFile(path.join(outDir, 'bp-nova-lock-bp03898.png'));

  console.log('Successfully cropped all 6 Banco del Perno lock images!');
}

cropAll().catch(console.error);
