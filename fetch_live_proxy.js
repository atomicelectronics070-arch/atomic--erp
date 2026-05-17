async function main() {
  const url = "https://atomiccotizador.shop/api/img-proxy?url=https%3A%2F%2Fmultitecnologiavyv.com%2F7251-square_large_default%2Fvc-teclado-para-hp-14-g62-cq62-big-enter-frame.jpg";
  console.log("Fetching live proxied image...");
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      }
    });
    console.log("Status:", res.status);
    console.log("Content-Length:", res.headers.get("content-length"));
    console.log("Content-Type:", res.headers.get("content-type"));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

main();
