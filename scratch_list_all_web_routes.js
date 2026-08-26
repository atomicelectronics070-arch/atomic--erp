const fs = require('fs');
const path = require('path');

function getRoutes(dir, base = '/web') {
  let routes = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (fs.existsSync(path.join(full, 'page.tsx')) || fs.existsSync(path.join(full, 'page.jsx')) || fs.existsSync(path.join(full, 'page.js'))) {
        routes.push(base + '/' + item.name);
      }
      routes = routes.concat(getRoutes(full, base + '/' + item.name));
    }
  }
  return routes;
}

const allWebRoutes = getRoutes('src/app/web');
console.log('Total web routes found:', allWebRoutes.length);
allWebRoutes.sort().forEach((r, i) => {
  console.log(`${i + 1}. https://atomiccotizador.shop${r}`);
});
