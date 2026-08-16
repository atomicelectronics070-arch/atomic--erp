const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (file === 'page.tsx' || file === 'page.ts' || file === 'route.ts') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const appDir = path.join(process.cwd(), 'src', 'app');
const pages = getFiles(appDir);

let modifiedCount = 0;

for (const filePath of pages) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const isUseClient = content.includes('"use client"') || content.includes("'use client'");
  const hasForceDynamic = content.includes('force-dynamic');

  if (isUseClient) {
    if (hasForceDynamic) {
      // Client components shouldn't export dynamic
      content = content.replace(/export const dynamic = ["']force-dynamic["'];?\n?/g, '');
      content = content.replace(/export const dynamic = ["']force-dynamic["'];?\r?\n?/g, '');
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Cleaned client component: ${path.relative(process.cwd(), filePath)}`);
      modifiedCount++;
    }
  } else {
    // Server component / route
    if (!hasForceDynamic) {
      // Add force-dynamic at the top
      content = `export const dynamic = 'force-dynamic';\n` + content;
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Added force-dynamic to server page: ${path.relative(process.cwd(), filePath)}`);
      modifiedCount++;
    }
  }
}

console.log(`✅ Ensured force-dynamic across all pages/routes! Total modified: ${modifiedCount}`);
