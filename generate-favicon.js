const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\77fc2104-3877-4fa1-8aba-c0f973653e6e\\atomic_favicon_1783676359044.png';
const faviconPath = path.join(__dirname, 'src', 'app', 'favicon.ico');
const icon32Path = path.join(__dirname, 'public', 'icon-32.png');
const icon64Path = path.join(__dirname, 'public', 'icon-64.png');
const icon192Path = path.join(__dirname, 'public', 'icon-192.png');
const appleIconPath = path.join(__dirname, 'public', 'apple-icon.png');

async function generateIcons() {
    console.log("Generating icons...");

    // 32x32 PNG
    await sharp(inputPath).resize(32, 32).png().toFile(icon32Path);
    console.log("✅ icon-32.png done");

    // 64x64 PNG 
    await sharp(inputPath).resize(64, 64).png().toFile(icon64Path);
    console.log("✅ icon-64.png done");

    // 192x192 for PWA
    await sharp(inputPath).resize(192, 192).png().toFile(icon192Path);
    console.log("✅ icon-192.png done");

    // 180x180 for Apple Touch Icon
    await sharp(inputPath).resize(180, 180).png().toFile(appleIconPath);
    console.log("✅ apple-icon.png done");

    // For favicon.ico: Next.js reads the favicon.ico from src/app/
    // Copy a 32x32 version there as a PNG (Next.js will handle it)
    await sharp(inputPath).resize(32, 32).png().toFile(path.join(__dirname, 'src', 'app', 'icon.png'));
    console.log("✅ src/app/icon.png done (Next.js uses this as favicon)");

    console.log("\n✨ All icons generated!");
}

generateIcons().catch(console.error);
