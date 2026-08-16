const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/web-banners');
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  let count = 1;
  files.forEach((file) => {
    if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
      const oldPath = path.join(dir, file);
      const newPath = path.join(dir, `banner-${count}.jpg`);
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} -> banner-${count}.jpg`);
      count++;
    }
  });
}
