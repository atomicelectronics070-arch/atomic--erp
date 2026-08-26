const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch_apple_products_raw.json', 'utf8'));

console.log('Processing', raw.length, 'raw products...');

const cleaned = [];

raw.forEach((p, i) => {
  let images = [];
  if (Array.isArray(p.images)) {
    images = p.images;
  } else if (typeof p.images === 'string') {
    try {
      images = JSON.parse(p.images);
    } catch(e) {
      if (p.images.startsWith('http')) images = [p.images];
    }
  }

  // Filter out irrelevant products
  if (/disipador/i.test(p.name)) return;
  if (/mesa portátil/i.test(p.name)) return;
  if (/videófono/i.test(p.name)) return;

  // Determine Family
  let family = 'accesorios';
  let familyLabel = 'Accesorios & Carga';
  let chip = 'Apple Accessory';
  let condition = 'Nuevo Sellado';

  if (/open box/i.test(p.name)) {
    condition = 'Open Box Grado A+';
  }

  if (/macbook|mac mini|mac studio|imac/i.test(p.name)) {
    family = 'mac';
    familyLabel = 'MacBooks & Macs';
    if (/m5/i.test(p.name)) chip = 'Apple Silicon M5';
    else if (/m4/i.test(p.name)) chip = 'Apple Silicon M4';
    else if (/m3/i.test(p.name)) chip = 'Apple Silicon M3';
    else if (/m2/i.test(p.name)) chip = 'Apple Silicon M2';
    else if (/a18/i.test(p.name)) chip = 'Apple Silicon A18 Pro';
    else if (/i5/i.test(p.name)) chip = 'Intel Core i5';
    else chip = 'Apple Silicon';
  } else if (/iphone/i.test(p.name)) {
    family = 'iphone';
    familyLabel = 'iPhone';
    if (/a19|17/i.test(p.name)) chip = 'A19 Pro Bionic';
    else if (/a18|16 pro/i.test(p.name)) chip = 'A18 Pro Bionic';
    else if (/16/i.test(p.name)) chip = 'A18 Bionic';
    else if (/15 pro/i.test(p.name)) chip = 'A17 Pro Bionic';
    else if (/15/i.test(p.name)) chip = 'A16 Bionic';
    else if (/14 pro/i.test(p.name)) chip = 'A16 Bionic';
    else if (/14/i.test(p.name)) chip = 'A15 Bionic';
    else if (/13/i.test(p.name)) chip = 'A15 Bionic';
    else chip = 'Apple Bionic';
  } else if (/ipad/i.test(p.name) && !/case|protector|docking|card reader/i.test(p.name)) {
    family = 'ipad';
    familyLabel = 'iPad';
    chip = 'A16 Bionic / Apple Silicon';
  } else if (/watch/i.test(p.name)) {
    family = 'watch';
    familyLabel = 'Apple Watch';
    chip = 'S8 / S9 SiP';
  } else if (/airpods/i.test(p.name)) {
    family = 'audio';
    familyLabel = 'AirPods & Audio';
    chip = 'Apple H1 / H2';
  } else if (/airtag|finder|buscador/i.test(p.name)) {
    family = 'ecosistema';
    familyLabel = 'AirTag & Find My';
    chip = 'Apple U1 Ultra Wideband';
  }

  // Price calculations
  const priceWithVat = Number(p.price) || 0;
  const priceBase = Number((priceWithVat / 1.15).toFixed(2));
  const compareAtPrice = Number((priceWithVat / 0.70).toFixed(2));

  // Clean image fallback
  let mainImage = images && images.length > 0 ? images[0] : '/images/placeholder.jpg';
  // Avoid placeholder icon if it's the brand icon list
  if (mainImage.includes('/marcas/')) {
    if (family === 'mac') mainImage = 'https://coretms.tecnomegastore.ec/assets/images/main/26/COMAPLMLY23LEA.webp';
    else if (family === 'iphone') mainImage = 'https://telefonosyaccesorios.com/wp-content/uploads/2024/09/iphone-16-pro-max.png';
    else if (family === 'ipad') mainImage = 'https://coretms.tecnomegastore.ec/assets/images/main/25/TABAPLMD4A4LLA.webp';
  }

  cleaned.push({
    id: p.id,
    name: p.name,
    provider: p.provider || 'ATOMIC Oficial',
    family,
    familyLabel,
    chip,
    condition,
    priceBase,
    priceWithVat: Number(priceWithVat.toFixed(2)),
    compareAtPrice,
    images: images.filter(img => !img.includes('/marcas/')),
    mainImage,
    description: p.description && p.description !== 'undefined' ? p.description : `${p.name} con garantía oficial Apple y soporte técnico directo en Ecuador.`
  });
});

console.log('Cleaned products count:', cleaned.length);
fs.writeFileSync('scratch_apple_catalog_clean.json', JSON.stringify(cleaned, null, 2));
