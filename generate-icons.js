const sharp = require('sharp');

// SVG del átomo — vectorial puro, nítido a cualquier tamaño
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#0A0A0A"/>

  <!-- Órbita 1 - horizontal -->
  <ellipse cx="512" cy="460" rx="320" ry="105" fill="none" stroke="white" stroke-width="22" opacity="0.95"/>
  <!-- Órbita 2 - rotada 60 grados -->
  <ellipse cx="512" cy="460" rx="320" ry="105" fill="none" stroke="white" stroke-width="22" opacity="0.95" transform="rotate(60 512 460)"/>
  <!-- Órbita 3 - rotada 120 grados -->
  <ellipse cx="512" cy="460" rx="320" ry="105" fill="none" stroke="white" stroke-width="22" opacity="0.95" transform="rotate(120 512 460)"/>

  <!-- Núcleo central -->
  <circle cx="512" cy="460" r="48" fill="white"/>

  <!-- Electrones -->
  <circle cx="832" cy="460" r="28" fill="white"/>
  <circle cx="353" cy="182" r="28" fill="white"/>
  <circle cx="353" cy="738" r="28" fill="white"/>

  <!-- Texto ATOMIC -->
  <text x="512" y="900" font-family="Arial Black, Arial, sans-serif" font-size="140" font-weight="900" fill="white" text-anchor="middle" letter-spacing="20">ATOMIC</text>
</svg>`;

const base = 'C:/Users/SANTIAGO/.gemini/antigravity/scratch/atomic--erp/android/app/src/main/res';
const sizes = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

const buf = Buffer.from(svgIcon);

async function generate() {
  for (const s of sizes) {
    await sharp(buf).resize(s.size, s.size).png().toFile(`${base}/${s.dir}/ic_launcher.png`);
    await sharp(buf).resize(s.size, s.size).png().toFile(`${base}/${s.dir}/ic_launcher_round.png`);
    console.log(`✅ ${s.dir} (${s.size}x${s.size})`);
  }
  // Adaptive icon foreground
  await sharp(buf).resize(432, 432).png().toFile(`${base}/mipmap-anydpi-v26/ic_launcher_foreground.png`);
  console.log('✅ adaptive foreground (432x432)');
  console.log('🎉 Todos los iconos generados!');
}

generate().catch(e => { console.error('ERROR:', e); process.exit(1); });
