const query = '[out:json][timeout:25];nwr[~".*"~"conjunto",i](-0.180653,-78.467838,-0.170653,-78.457838);out center;';

fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'User-Agent': 'AtomicERP/1.0'
  },
  body: 'data=' + encodeURIComponent(query)
}).then(res => res.text()).then(console.log).catch(console.error);
