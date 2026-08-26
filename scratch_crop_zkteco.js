const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function main() {
  const img1Path = 'C:/Users/SANTIAGO/.gemini/antigravity/brain/977d628f-fd7e-47df-8965-4c7d27cd0697/.user_uploaded/media_1787513688175.png';
  const img2Path = 'C:/Users/SANTIAGO/.gemini/antigravity/brain/977d628f-fd7e-47df-8965-4c7d27cd0697/.user_uploaded/media_1787513701160.png';

  const meta1 = await sharp(img1Path).metadata();
  const meta2 = await sharp(img2Path).metadata();

  console.log('Image 1 size:', meta1.width, 'x', meta1.height);
  console.log('Image 2 size:', meta2.width, 'x', meta2.height);

  const outDir = path.join(__dirname, 'public/images/cerraduras/zkteco');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // In Screenshot 1 (width x height, e.g. 1000 x 480):
  // Col 2: TL400B/L
  // Col 3: TL400B/R
  // Col 4: TL800
  // Let's calculate proportional crop regions:
  // There are ~3.5 columns visible.
  // Col 2 starts at ~13% and ends at ~40%
  // Col 3 starts at ~41% and ends at ~69%
  // Col 4 starts at ~70% and ends at ~97%

  const w1 = meta1.width;
  const h1 = meta1.height;

  // TL400B Left
  await sharp(img1Path)
    .extract({
      left: Math.round(w1 * 0.133),
      top: Math.round(h1 * 0.10),
      width: Math.round(w1 * 0.264),
      height: Math.round(h1 * 0.54)
    })
    .toFile(path.join(outDir, 'zk-tl400b-left.png'));

  // TL400B Right
  await sharp(img1Path)
    .extract({
      left: Math.round(w1 * 0.418),
      top: Math.round(h1 * 0.10),
      width: Math.round(w1 * 0.264),
      height: Math.round(h1 * 0.54)
    })
    .toFile(path.join(outDir, 'zk-tl400b-right.png'));

  // TL800 Flagship
  await sharp(img1Path)
    .extract({
      left: Math.round(w1 * 0.705),
      top: Math.round(h1 * 0.10),
      width: Math.round(w1 * 0.264),
      height: Math.round(h1 * 0.54)
    })
    .toFile(path.join(outDir, 'zk-tl800.png'));

  // In Screenshot 2:
  // Col 1: LH6000/L
  // Col 2: LH6000/R
  // Col 3: LL-01
  const w2 = meta2.width;
  const h2 = meta2.height;

  // LH6000 Left
  await sharp(img2Path)
    .extract({
      left: Math.round(w2 * 0.108),
      top: Math.round(h2 * 0.05),
      width: Math.round(w2 * 0.264),
      height: Math.round(h2 * 0.56)
    })
    .toFile(path.join(outDir, 'zk-lh6000-left.png'));

  // LH6000 Right
  await sharp(img2Path)
    .extract({
      left: Math.round(w2 * 0.395),
      top: Math.round(h2 * 0.05),
      width: Math.round(w2 * 0.264),
      height: Math.round(h2 * 0.56)
    })
    .toFile(path.join(outDir, 'zk-lh6000-right.png'));

  // LL-01 Chapa Eléctrica
  await sharp(img2Path)
    .extract({
      left: Math.round(w2 * 0.680),
      top: Math.round(h2 * 0.05),
      width: Math.round(w2 * 0.264),
      height: Math.round(h2 * 0.56)
    })
    .toFile(path.join(outDir, 'zk-ll-01.png'));

  console.log('Cropped all 6 ZKTeco lock images successfully!');
}

main().catch(console.error);
