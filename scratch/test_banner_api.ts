import fs from 'fs';
import path from 'path';

function testBannerPaths() {
  console.log("=== TESTING BANNER PATH RESOLUTION ===");
  const safeName = "banner-13.jpg";
  const candidatePaths = [
    path.join(process.cwd(), 'public', 'web-banners', safeName),
    path.join(process.cwd(), '..', 'public', 'web-banners', safeName),
    path.join(process.cwd(), '.next', 'standalone', 'public', 'web-banners', safeName),
  ];

  for (const p of candidatePaths) {
    console.log(`Checking path: ${p}`);
    if (fs.existsSync(p)) {
      console.log(`FOUND FILE AT: ${p}`);
    } else {
      console.log(`NOT FOUND at: ${p}`);
    }
  }
}

testBannerPaths();
