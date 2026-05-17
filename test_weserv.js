async function main() {
  const originalUrl = "https://multitecnologiavyv.com/7251-square_large_default/vc-teclado-para-hp-14-g62-cq62-big-enter-frame.jpg";
  const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}`;
  console.log("Fetching image via images.weserv.nl...");
  try {
    const res = await fetch(proxyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      }
    });
    console.log("Status:", res.status);
    console.log("Headers:");
    for (let [key, val] of res.headers.entries()) {
      console.log(`  ${key}: ${val}`);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

main();
