async function scrapeDDGLocal() {
    const query = encodeURIComponent('gimnasios en guayaquil ecuador');
    const res = await fetch('https://duckduckgo.com/local.js?l=ec-ec&q=' + query, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://duckduckgo.com/'
        }
    });
    const d = await res.json();
    console.log(d.results.map(r => ({name: r.name, phone: r.phone})));
}
scrapeDDGLocal();
