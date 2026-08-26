const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_TO_DOWNLOAD = [
  // STEREN
  {
    url: "https://www.steren.com.ec/media/catalog/product/cache/92457bf2b5977fff7efe99bd6badebc6/image/22752c90b/cerradura-digital-bluetooth-de-seguridad.jpg",
    dest: "public/images/cerraduras/steren/steren-lock-350.jpg"
  },
  {
    url: "https://www.steren.com.ec/media/catalog/product/cache/92457bf2b5977fff7efe99bd6badebc6/image/232867c7c/cerradura-digital-wi-fi-de-seguridad-con-timbre.jpg",
    dest: "public/images/cerraduras/steren/steren-lock-450.jpg"
  },
  {
    url: "https://www.steren.com.ec/media/catalog/product/cache/92457bf2b5977fff7efe99bd6badebc6/image/234395fb0/cerradura-digital-wi-fi-de-seguridad-con-video-timbre.jpg",
    dest: "public/images/cerraduras/steren/steren-lock-480.jpg"
  },
  {
    url: "https://www.steren.com.ec/media/catalog/product/cache/92457bf2b5977fff7efe99bd6badebc6/image/2150454e4/cerradura-digital-wi-fi-de-seguridad.jpg",
    dest: "public/images/cerraduras/steren/steren-lock-500.jpg"
  },
  {
    url: "https://www.steren.com.ec/media/catalog/product/cache/92457bf2b5977fff7efe99bd6badebc6/image/232223954/cerradura-digital-wi-fi-de-seguridad-compatible-con-asistentes-de-voz.jpg",
    dest: "public/images/cerraduras/steren/steren-lock-510.jpg"
  },

  // LA COMPETENCIA / DIEL / KOCOM
  {
    url: "https://competencia.com.ec/1073-large_default/cerradura-inteligente-os527-tyfa-diel.jpg",
    dest: "public/images/cerraduras/diel/diel-os527-tyfa-facial.jpg"
  },
  {
    url: "https://competencia.com.ec/1071-large_default/cerradura-inteligente-os527-tyfv-diel.jpg",
    dest: "public/images/cerraduras/diel/diel-os527-tyfv-video.jpg"
  },
  {
    url: "https://competencia.com.ec/1117-large_default/cerradura-digital-inteligente-wifi-os527-tyf-diel.jpg",
    dest: "public/images/cerraduras/diel/diel-os527-tyf-wifi.jpg"
  },
  {
    url: "https://competencia.com.ec/941-large_default/cerradura-inteligente-con-bluetooth-tarjeta-llave-codigo-os8810ble-diel-derecha.jpg",
    dest: "public/images/cerraduras/diel/diel-os8810ble-manija.jpg"
  },
  {
    url: "https://competencia.com.ec/1077-large_default/cerradura-digital-inteligente-wifi-os477-tyf-diel.jpg",
    dest: "public/images/cerraduras/diel/diel-os477-tyf-4pestillos.jpg"
  },
  {
    url: "https://competencia.com.ec/1085-large_default/cerradura-pomo-digital-os695-fc-diel.jpg",
    dest: "public/images/cerraduras/diel/diel-os695-pomo.jpg"
  },
  {
    url: "https://competencia.com.ec/961-large_default/cerradura-kocom-4100-sk.jpg",
    dest: "public/images/cerraduras/diel/kocom-kdl-4100sk.jpg"
  },
  {
    url: "https://competencia.com.ec/92-large_default/cerradura-kdl-3700sk-kocom.jpg",
    dest: "public/images/cerraduras/diel/kocom-kdl-3700sk.jpg"
  },

  // MEELTECH
  {
    url: "https://meeltechstore.com/cdn/shop/files/61VJS33cIEL._AC_SL1500.jpg?v=1708376096&width=533",
    dest: "public/images/cerraduras/meeltech/meeltech-geek-lf500.jpg"
  },
  {
    url: "https://meeltechstore.com/cdn/shop/files/41lArSiD5hL._AC_SL1200_ca43d4d4-c8b2-4c7f-93b6-4ed2649ea14d.jpg?v=1708375825&width=533",
    dest: "public/images/cerraduras/meeltech/meeltech-geeksmart-lb400.jpg"
  },
  {
    url: "https://meeltechstore.com/cdn/shop/files/3_839010b9-2d5d-44a1-b863-3cb68ff38f00.png?v=1717011523&width=533",
    dest: "public/images/cerraduras/meeltech/meeltech-tuya-pro.png"
  },
  {
    url: "https://meeltechstore.com/cdn/shop/files/D_NQ_NP_612120-MLU73430458447_122023-O.webp?v=1726349343&width=533",
    dest: "public/images/cerraduras/meeltech/meeltech-magnetic-drawer.webp"
  }
];

function download(url, dest) {
  return new Promise((resolve) => {
    const fullDest = path.join(__dirname, dest);
    const dir = path.dirname(fullDest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(fullDest);
    const client = url.startsWith('https') ? https : http;

    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[OK] Downloaded: ${dest}`);
          resolve(true);
        });
      } else {
        console.warn(`[WARN] HTTP ${res.statusCode} for ${url}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`[ERROR] ${err.message} for ${url}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log(`Downloading ${IMAGES_TO_DOWNLOAD.length} images for Steren, DIEL/Competencia, and Meeltech...`);
  for (const item of IMAGES_TO_DOWNLOAD) {
    await download(item.url, item.dest);
  }
  console.log('Finished downloading all extra lock images!');
}

main().catch(console.error);
