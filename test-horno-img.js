async function test() {
  const url = "https://bpecuador.com/wp-content/uploads/2025/01/BPA0264-1.png";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      }
    });
    console.log(`Status: ${res.status}`);
  } catch (e) {
    console.error("FULL ERROR DETAILS:", e);
  }
}
test();
