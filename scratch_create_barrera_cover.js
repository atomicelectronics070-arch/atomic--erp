const sharp = require('sharp');
const fs = require('fs');

async function main() {
  const original = 'C:\\Users\\SANTIAGO\\Downloads\\WhatsApp Image 2026-08-24 at 12.26.59 AM.jpeg';
  const out1 = 'public/images/barreras/barreras-portada-promociones.jpg';
  const out2 = 'public/banners/barreras-portada-promociones.jpg';

  const svgFooter = Buffer.from(`
    <svg width="1024" height="104">
      <rect x="0" y="0" width="1024" height="104" fill="#ffffff" />
      <rect x="52" y="16" width="920" height="72" rx="12" fill="#b91c1c" />
      <text x="512" y="60" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">
        SOLICITAR COTIZACIÓN | ATOMIC ECUADOR: 099 900 8080
      </text>
    </svg>
  `);

  await sharp(original)
    .composite([{ input: svgFooter, top: 920, left: 0 }])
    .jpeg({ quality: 95 })
    .toFile(out1);

  fs.copyFileSync(out1, out2);
  console.log('Successfully generated Atomic branded cover image!');
}

main().catch(console.error);
