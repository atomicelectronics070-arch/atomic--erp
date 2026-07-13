const sharp = require('sharp');
const path = require('path');

const downloadsDir = 'C:\\Users\\SANTIAGO\\Downloads';
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const panelsImg = path.join(downloadsDir, 'WhatsApp Image 2026-07-03 at 1.05.07 AM.jpeg');

async function cropPanels() {
    console.log("Cropping panels...");
    
    // Top Left: 580W
    await sharp(panelsImg)
        .extract({ left: 0, top: 0, width: 579, height: 636 })
        .toFile(path.join(uploadsDir, 'panel-580w.jpeg'));
        
    // Top Right: 555W
    await sharp(panelsImg)
        .extract({ left: 579, top: 0, width: 579, height: 636 })
        .toFile(path.join(uploadsDir, 'panel-555w.jpeg'));
        
    // Bottom Left: 355W
    await sharp(panelsImg)
        .extract({ left: 0, top: 636, width: 579, height: 637 })
        .toFile(path.join(uploadsDir, 'panel-355w.jpeg'));
        
    // Bottom Right: 60W
    await sharp(panelsImg)
        .extract({ left: 579, top: 636, width: 579, height: 637 })
        .toFile(path.join(uploadsDir, 'panel-60w.jpeg'));
        
    console.log("Cropping completed!");
}

cropPanels().catch(console.error);
