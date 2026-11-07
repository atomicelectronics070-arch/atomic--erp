const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Generador de SVG para el Átomo Cyber-Neon (Atomic ERP)
function generateAtomSvg({ width = 432, height = 432, isForegroundOnly = false, isRound = false } = {}) {
    const cx = width / 2;
    const cy = height / 2;
    // Escala basada en 432px
    const scale = width / 432;

    const nucleusR = 24 * scale;
    const rx = 108 * scale;
    const ry = 38 * scale;
    const strokeW = 6.5 * scale;
    const electronR = 8.5 * scale;

    const backgroundDefs = `
        <radialGradient id="cyberBg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#0a122c"/>
            <stop offset="45%" stop-color="#060b18"/>
            <stop offset="100%" stop-color="#02040a"/>
        </radialGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45"/>
            <stop offset="40%" stop-color="#3b82f6" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#070a14" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="cyberBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
            <stop offset="50%" stop-color="#818cf8" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.9"/>
        </linearGradient>
    `;

    const atomDefs = `
        <!-- Glow Filter -->
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="${4 * scale}" result="blur1"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="${9 * scale}" result="blur2"/>
            <feMerge>
                <feMergeNode in="blur2"/>
                <feMergeNode in="blur1"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="${6 * scale}" result="blur"/>
            <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>

        <!-- Orbit Gradients -->
        <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f2fe"/>
            <stop offset="50%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#818cf8"/>
        </linearGradient>
        <linearGradient id="orbitGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#818cf8"/>
            <stop offset="50%" stop-color="#c084fc"/>
            <stop offset="100%" stop-color="#00f2fe"/>
        </linearGradient>
        <linearGradient id="orbitGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#10b981"/>
            <stop offset="50%" stop-color="#06b6d4"/>
            <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>

        <!-- Nucleus Gradients -->
        <radialGradient id="nucleusGrad" cx="40%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="35%" stop-color="#67e8f9"/>
            <stop offset="70%" stop-color="#06b6d4"/>
            <stop offset="100%" stop-color="#0284c7"/>
        </radialGradient>
        <radialGradient id="electronGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="45%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#0284c7"/>
        </radialGradient>
    `;

    // Calculate electron positions
    // Orbit 1: horizontal (0 deg)
    // Orbit 2: 60 deg
    // Orbit 3: -60 deg
    const e1_x = cx + rx * Math.cos(0.85);
    const e1_y = cy + ry * Math.sin(0.85);

    // Orbit 2: rotated 60 deg
    // x' = x cos(60) - y sin(60), y' = x sin(60) + y cos(60)
    const rad60 = Math.PI / 3;
    const o2_local_x = rx * Math.cos(2.5);
    const o2_local_y = ry * Math.sin(2.5);
    const e2_x = cx + (o2_local_x * Math.cos(rad60) - o2_local_y * Math.sin(rad60));
    const e2_y = cy + (o2_local_x * Math.sin(rad60) + o2_local_y * Math.cos(rad60));

    // Orbit 3: rotated -60 deg
    const radM60 = -Math.PI / 3;
    const o3_local_x = rx * Math.cos(-1.8);
    const o3_local_y = ry * Math.sin(-1.8);
    const e3_x = cx + (o3_local_x * Math.cos(radM60) - o3_local_y * Math.sin(radM60));
    const e3_y = cy + (o3_local_x * Math.sin(radM60) + o3_local_y * Math.cos(radM60));

    let bgMarkup = '';
    if (!isForegroundOnly) {
        if (isRound) {
            bgMarkup = `
                <circle cx="${cx}" cy="${cy}" r="${cx - 2 * scale}" fill="url(#cyberBg)"/>
                <circle cx="${cx}" cy="${cy}" r="${cx * 0.7}" fill="url(#centerGlow)"/>
                <circle cx="${cx}" cy="${cy}" r="${cx - 3 * scale}" fill="none" stroke="url(#cyberBorder)" stroke-width="${3 * scale}"/>
            `;
        } else {
            const corner = 48 * scale;
            bgMarkup = `
                <rect x="0" y="0" width="${width}" height="${height}" rx="${corner}" fill="url(#cyberBg)"/>
                <circle cx="${cx}" cy="${cy}" r="${cx * 0.8}" fill="url(#centerGlow)"/>
                <rect x="${1.5 * scale}" y="${1.5 * scale}" width="${width - 3 * scale}" height="${height - 3 * scale}" rx="${corner}" fill="none" stroke="url(#cyberBorder)" stroke-width="${3 * scale}"/>
            `;
        }
    }

    return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            ${backgroundDefs}
            ${atomDefs}
        </defs>

        ${bgMarkup}

        <!-- ATOM STRUCTURE -->
        <g id="atom-core">
            <!-- Ambient Nucleus Halo -->
            <circle cx="${cx}" cy="${cy}" r="${nucleusR * 2.5}" fill="#06b6d4" opacity="0.25" filter="url(#coreGlow)"/>
            <circle cx="${cx}" cy="${cy}" r="${nucleusR * 1.5}" fill="#38bdf8" opacity="0.4" filter="url(#coreGlow)"/>

            <!-- Orbit 1: Horizontal (0 deg) -->
            <g transform="rotate(0, ${cx}, ${cy})">
                <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" 
                    fill="none" stroke="url(#orbitGrad1)" stroke-width="${strokeW}" opacity="0.9" filter="url(#neonGlow)"/>
            </g>

            <!-- Orbit 2: 60 deg -->
            <g transform="rotate(60, ${cx}, ${cy})">
                <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" 
                    fill="none" stroke="url(#orbitGrad2)" stroke-width="${strokeW}" opacity="0.9" filter="url(#neonGlow)"/>
            </g>

            <!-- Orbit 3: -60 deg -->
            <g transform="rotate(-60, ${cx}, ${cy})">
                <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" 
                    fill="none" stroke="url(#orbitGrad3)" stroke-width="${strokeW}" opacity="0.9" filter="url(#neonGlow)"/>
            </g>

            <!-- Nucleus Central Body -->
            <circle cx="${cx}" cy="${cy}" r="${nucleusR}" fill="url(#nucleusGrad)" filter="url(#coreGlow)" stroke="#ffffff" stroke-width="${1.5 * scale}"/>
            <!-- Nucleus Inner High-Energy Spark -->
            <circle cx="${cx - nucleusR * 0.25}" cy="${cy - nucleusR * 0.25}" r="${nucleusR * 0.35}" fill="#ffffff" opacity="0.95"/>

            <!-- Electrons (Orbiting Charged Particles) -->
            <!-- Electron 1 -->
            <g filter="url(#neonGlow)">
                <circle cx="${e1_x}" cy="${e1_y}" r="${electronR * 1.6}" fill="#00f2fe" opacity="0.4"/>
                <circle cx="${e1_x}" cy="${e1_y}" r="${electronR}" fill="url(#electronGrad)" stroke="#ffffff" stroke-width="${1.2 * scale}"/>
                <circle cx="${e1_x - electronR * 0.25}" cy="${e1_y - electronR * 0.25}" r="${electronR * 0.35}" fill="#ffffff"/>
            </g>

            <!-- Electron 2 -->
            <g filter="url(#neonGlow)">
                <circle cx="${e2_x}" cy="${e2_y}" r="${electronR * 1.6}" fill="#c084fc" opacity="0.4"/>
                <circle cx="${e2_x}" cy="${e2_y}" r="${electronR}" fill="url(#electronGrad)" stroke="#ffffff" stroke-width="${1.2 * scale}"/>
                <circle cx="${e2_x - electronR * 0.25}" cy="${e2_y - electronR * 0.25}" r="${electronR * 0.35}" fill="#ffffff"/>
            </g>

            <!-- Electron 3 -->
            <g filter="url(#neonGlow)">
                <circle cx="${e3_x}" cy="${e3_y}" r="${electronR * 1.6}" fill="#10b981" opacity="0.4"/>
                <circle cx="${e3_x}" cy="${e3_y}" r="${electronR}" fill="url(#electronGrad)" stroke="#ffffff" stroke-width="${1.2 * scale}"/>
                <circle cx="${e3_x - electronR * 0.25}" cy="${e3_y - electronR * 0.25}" r="${electronR * 0.35}" fill="#ffffff"/>
            </g>
        </g>
    </svg>
    `;
}

// Background standalone SVG for adaptive icon background
function generateBackgroundSvg({ width = 432, height = 432 } = {}) {
    return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="cyberBgGrad" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stop-color="#0c1636"/>
                <stop offset="45%" stop-color="#070c1a"/>
                <stop offset="100%" stop-color="#020409"/>
            </radialGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="45%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
                <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.1"/>
                <stop offset="100%" stop-color="#020409" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#cyberBgGrad)"/>
        <circle cx="${width/2}" cy="${height/2}" r="${width*0.4}" fill="url(#centerGlow)"/>
    </svg>
    `;
}

async function buildAllIcons() {
    console.log('🚀 Generating Atom Branded Icons for Android & Web...');

    const resRoot = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

    const densities = [
        { name: 'mdpi', launcher: 48, adaptive: 108 },
        { name: 'hdpi', launcher: 72, adaptive: 162 },
        { name: 'xhdpi', launcher: 96, adaptive: 216 },
        { name: 'xxhdpi', launcher: 144, adaptive: 324 },
        { name: 'xxxhdpi', launcher: 192, adaptive: 432 },
    ];

    for (const d of densities) {
        const folder = path.join(resRoot, `mipmap-${d.name}`);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        // 1. ic_launcher.png (Square / Squircle legacy)
        const launcherSvg = generateAtomSvg({ width: d.launcher, height: d.launcher, isForegroundOnly: false, isRound: false });
        await sharp(Buffer.from(launcherSvg)).png().toFile(path.join(folder, 'ic_launcher.png'));

        // 2. ic_launcher_round.png (Circular legacy)
        const roundSvg = generateAtomSvg({ width: d.launcher, height: d.launcher, isForegroundOnly: false, isRound: true });
        await sharp(Buffer.from(roundSvg)).png().toFile(path.join(folder, 'ic_launcher_round.png'));

        // 3. ic_launcher_foreground.png (Adaptive foreground - transparent atom centered)
        const fgSvg = generateAtomSvg({ width: d.adaptive, height: d.adaptive, isForegroundOnly: true });
        await sharp(Buffer.from(fgSvg)).png().toFile(path.join(folder, 'ic_launcher_foreground.png'));

        // 4. ic_launcher_background.png (Adaptive background)
        const bgSvg = generateBackgroundSvg({ width: d.adaptive, height: d.adaptive });
        await sharp(Buffer.from(bgSvg)).png().toFile(path.join(folder, 'ic_launcher_background.png'));

        console.log(`✅ [${d.name}] Generated: ic_launcher (${d.launcher}x${d.launcher}), foreground (${d.adaptive}x${d.adaptive})`);
    }

    // 5. mipmap-anydpi-v26
    const anydpiFolder = path.join(resRoot, 'mipmap-anydpi-v26');
    if (!fs.existsSync(anydpiFolder)) {
        fs.mkdirSync(anydpiFolder, { recursive: true });
    }
    const fg432 = generateAtomSvg({ width: 432, height: 432, isForegroundOnly: true });
    await sharp(Buffer.from(fg432)).png().toFile(path.join(anydpiFolder, 'ic_launcher_foreground.png'));
    console.log(`✅ [anydpi-v26] Generated: ic_launcher_foreground.png (432x432)`);

    // 6. Web / PWA Favicons (public/)
    const publicFolder = path.join(__dirname, '..', 'public');
    const webSizes = [
        { name: 'icon-32.png', size: 32 },
        { name: 'icon-64.png', size: 64 },
        { name: 'icon-192.png', size: 192 },
        { name: 'apple-icon.png', size: 180 },
    ];
    for (const w of webSizes) {
        const svg = generateAtomSvg({ width: w.size, height: w.size, isForegroundOnly: false, isRound: true });
        await sharp(Buffer.from(svg)).png().toFile(path.join(publicFolder, w.name));
        console.log(`✅ [Web] Generated: public/${w.name} (${w.size}x${w.size})`);
    }

    console.log('🎉 ALL ATOM ICONS SUCCESSFULLY GENERATED!');
}

buildAllIcons().catch(err => {
    console.error('❌ Icon generation failed:', err);
    process.exit(1);
});
