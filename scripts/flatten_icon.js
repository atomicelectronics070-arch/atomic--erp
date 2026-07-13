const sharp = require('sharp');
const path = require('path');

async function processIcon() {
    try {
        const inputPath = path.join(__dirname, '../assets/icon.png');
        const outputPath = path.join(__dirname, '../assets/icon.png'); // overwrite
        const tempPath = path.join(__dirname, '../assets/icon_temp.png');

        // Read and flatten image onto a white background
        await sharp(inputPath)
            .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .toFile(tempPath);

        const fs = require('fs');
        fs.renameSync(tempPath, outputPath);
        
        // Also do splash
        const splashIn = path.join(__dirname, '../assets/splash.png');
        const splashTemp = path.join(__dirname, '../assets/splash_temp.png');
        await sharp(splashIn)
            .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .toFile(splashTemp);
        fs.renameSync(splashTemp, splashIn);

        console.log("Icons flattened with white background successfully.");
    } catch (error) {
        console.error("Error processing icon:", error);
    }
}

processIcon();
