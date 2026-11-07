const fs = require('fs');
const path = require('path');

// 1. Patch src/app/globals.css
const cssPath = path.join(__dirname, '..', 'src', 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

const targetBlockRegex = /\/\* ── Global Scale Reduction ── \*\/[\s\S]*?\.min-w-screen\s*\{\s*min-width:\s*133\.333vw\s*!important;\s*\}/;

const replacementBlock = `/* ── Viewport & Scale Control: Desktop vs Mobile ── */
@media (min-width: 1024px) {
  html {
    zoom: 0.75;
    height: 100%;
    width: 100%;
  }
  .h-screen {
    height: 133.333vh !important;
  }
  .min-h-screen {
    min-height: 133.333vh !important;
  }
  .w-screen {
    width: 133.333vw !important;
  }
  .min-w-screen {
    min-width: 133.333vw !important;
  }
}

/* ── Mobile / Tablet Viewport Protection (Elimina Desplazamiento y Corte a la Derecha) ── */
@media (max-width: 1023px) {
  html {
    zoom: 1 !important;
    height: 100%;
    width: 100% !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
    -webkit-text-size-adjust: 100%;
  }
  body {
    width: 100% !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
    position: relative !important;
    -webkit-overflow-scrolling: touch;
  }
  .h-screen {
    height: 100vh !important;
    height: 100dvh !important;
  }
  .min-h-screen {
    min-height: 100vh !important;
    min-height: 100dvh !important;
  }
  .w-screen {
    width: 100% !important;
    max-width: 100vw !important;
  }
  .min-w-screen {
    min-width: 100% !important;
    max-width: 100vw !important;
  }
}

html, body {
  overflow-x: hidden !important;
  max-width: 100% !important;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}`;

if (targetBlockRegex.test(css)) {
  css = css.replace(targetBlockRegex, replacementBlock);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✅ globals.css patched successfully!');
} else {
  console.log('⚠️ targetBlockRegex did not match in globals.css');
}

// 2. Patch src/app/layout.tsx to include official Next.js Viewport export
const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
let layout = fs.readFileSync(layoutPath, 'utf8');

if (!layout.includes('export const viewport')) {
  layout = layout.replace(
    'import type { Metadata } from "next";',
    'import type { Metadata, Viewport } from "next";'
  );

  const viewportCode = `
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#070a14",
};
`;

  layout = layout.replace(
    'export const metadata: Metadata = {',
    viewportCode + '\nexport const metadata: Metadata = {'
  );

  fs.writeFileSync(layoutPath, layout, 'utf8');
  console.log('✅ layout.tsx patched with Viewport export!');
} else {
  console.log('ℹ️ layout.tsx already has viewport export');
}
