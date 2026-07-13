async function testNominatim() {
    const query = encodeURIComponent('gimnasio en ecuador');
    const res = await fetch('https://nominatim.openstreetmap.org/search?q=' + query + '&format=json&extratags=1', {
        headers: {
            'User-Agent': 'AtomicERPContactFinder/1.0 (santiago.test@gmail.com)'
        }
    });
    const d = await res.json();
    console.log(d.slice(0, 3).map(r => ({name: r.name, extratags: r.extratags})));
}
testNominatim();
