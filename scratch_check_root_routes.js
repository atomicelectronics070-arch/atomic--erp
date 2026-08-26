const fs = require('fs');
const path = require('path');

function getRootRoutes(dir, base = '') {
  let routes = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (['api', 'dashboard', 'components', 'lib', 'styles', 'public', 'node_modules', '.next', '.git'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (fs.existsSync(path.join(full, 'page.tsx')) || fs.existsSync(path.join(full, 'page.jsx')) || fs.existsSync(path.join(full, 'page.js'))) {
        routes.push(base + '/' + item.name);
      }
      if (item.name !== 'web') {
        routes = routes.concat(getRootRoutes(full, base + '/' + item.name));
      }
    }
  }
  return routes;
}

const rootRoutes = getRootRoutes('src/app');
console.log('Root routes:', rootRoutes);
