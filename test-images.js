// Usamos el fetch nativo de Node.js (disponible en Node 18+)
const urls = [
  "https://tecnit.com.ec/wp-content/uploads/2021/11/Cable-Pigtail-Rp-sma-Hembra-A-Rp-sma-Macho-10mts-Extension-300x300.jpg",
  "https://multitecnologiavyv.com/6401-square_large_default/vc-teclado-para-hp-14-14ac-no-frame-big-enter-.jpg"
];

async function test() {
  for (const url of urls) {
    try {
      console.log(`Fetching: ${url}`);
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(5000)
      });
      console.log(`Status: ${res.status} | Content-Type: ${res.headers.get('content-type')}`);
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  }
}

test();
