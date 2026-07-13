fetch('https://overpass-api.de/api/interpreter', { 
    method: 'POST', 
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
    },
    body: 'data=[out:json][timeout:25];area["name"="Ecuador"]->.searchArea;(nwr["phone"]["name"~"Gimnasio",i](area.searchArea);nwr["contact:phone"]["name"~"Gimnasio",i](area.searchArea););out center 5;' 
}).then(r=>r.text()).then(t=>console.log(t.substring(0, 500)));
