const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateCards() {
  // 1. BANCO PICHINCHA SVG
  const pichinchaSvg = `
  <svg width="1000" height="620" viewBox="0 0 1000 620" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0d14"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="innerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#0d131f"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Outer Card Background -->
    <rect x="0" y="0" width="1000" height="620" rx="36" fill="url(#bgGrad)"/>
    <rect x="14" y="14" width="972" height="592" rx="28" fill="none" stroke="#ffcc00" stroke-width="4"/>

    <!-- Header Banner Yellow -->
    <rect x="36" y="36" width="928" height="106" rx="22" fill="#ffcc00"/>
    <text x="60" y="86" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#000000" letter-spacing="1">BANCO PICHINCHA</text>
    <text x="60" y="122" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="14" fill="#1e293b" letter-spacing="2">CUENTA OFICIAL DE PAGO Y FACTURACIÓN · ATOMIC SYSTEMS</text>

    <!-- Inner Data Card -->
    <rect x="36" y="162" width="928" height="385" rx="24" fill="url(#innerGrad)" stroke="#1e293b" stroke-width="1.5"/>

    <!-- Left Column: Titular y Cédula -->
    <text x="68" y="206" font-family="monospace, Consolas, sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="2">TITULAR DE LA CUENTA:</text>
    <text x="68" y="244" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="0.5">SANTIAGO GUZMÁN</text>

    <!-- Row 2: Cédula y Correo Separados -->
    <g transform="translate(68, 276)">
      <!-- Cédula Box -->
      <text x="0" y="0" font-family="monospace, Consolas, sans-serif" font-size="12" font-weight="600" fill="#94a3b8" letter-spacing="2">NÚMERO DE CÉDULA:</text>
      <text x="0" y="30" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#f8fafc" letter-spacing="1">1709540478</text>

      <!-- Correo Box (Clearly separated to the right) -->
      <g transform="translate(360, 0)">
        <text x="0" y="0" font-family="monospace, Consolas, sans-serif" font-size="12" font-weight="600" fill="#ffcc00" letter-spacing="2">CORREO PARA TRANSFERENCIAS:</text>
        <rect x="-6" y="8" width="360" height="34" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
        <text x="8" y="31" font-family="monospace, Consolas, sans-serif" font-size="18" font-weight="700" fill="#ffdd33">sguzmanpal@yahoo.com</text>
      </g>
    </g>

    <!-- Row 3: Tipo de Cuenta -->
    <g transform="translate(68, 370)">
      <text x="0" y="0" font-family="monospace, Consolas, sans-serif" font-size="13" font-weight="700" fill="#ffcc00" letter-spacing="2">TIPO DE CUENTA: AHORROS</text>
    </g>

    <!-- Row 4: Número de Cuenta -->
    <g transform="translate(68, 410)">
      <text x="0" y="0" font-family="monospace, Consolas, sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="2">NÚMERO DE CUENTA:</text>
      <text x="0" y="46" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#00e5a3" letter-spacing="4" filter="url(#glow)">2206020091</text>
    </g>

    <!-- Footer Note -->
    <g transform="translate(68, 510)">
      <circle cx="8" cy="-4" r="7" fill="#10b981"/>
      <path d="M5 -4 L7 -1 L12 -7" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="24" y="0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">Agradecemos su preferencia. Notifique su depósito al asesor comercial a cargo para despacho inmediato.</text>
    </g>

    <!-- Bottom security ribbon -->
    <rect x="36" y="565" width="928" height="26" rx="6" fill="#1e293b" opacity="0.6"/>
    <text x="500" y="582" text-anchor="middle" font-family="monospace, Consolas, sans-serif" font-size="11" fill="#64748b" letter-spacing="2">VALIDACIÓN OFICIAL SRI &amp; RED BANCARIA NACIONAL · ECUADOR 2026</text>
  </svg>
  `;

  // 2. BANCO GUAYAQUIL SVG
  const guayaquilSvg = `
  <svg width="1000" height="620" viewBox="0 0 1000 620" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0d14"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="innerGradG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#0d131f"/>
      </linearGradient>
      <filter id="glowG" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Outer Card Background -->
    <rect x="0" y="0" width="1000" height="620" rx="36" fill="url(#bgGradG)"/>
    <rect x="14" y="14" width="972" height="592" rx="28" fill="none" stroke="#e6007e" stroke-width="4"/>

    <!-- Header Banner Magenta -->
    <rect x="36" y="36" width="928" height="106" rx="22" fill="#e6007e"/>
    <text x="60" y="86" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="1">BANCO GUAYAQUIL</text>
    <text x="60" y="122" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="14" fill="#fdf2f8" letter-spacing="2">CUENTA OFICIAL DE RECAUDACIÓN · ATOMIC SYSTEMS</text>

    <!-- Inner Data Card -->
    <rect x="36" y="162" width="928" height="385" rx="24" fill="url(#innerGradG)" stroke="#1e293b" stroke-width="1.5"/>

    <!-- Left Column: Titular y Cédula -->
    <text x="68" y="206" font-family="monospace, Consolas, sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="2">TITULAR DE LA CUENTA:</text>
    <text x="68" y="244" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="0.5">JUAN PABLO GUZMAN MORALES</text>

    <!-- Row 2: Cédula -->
    <g transform="translate(68, 276)">
      <text x="0" y="0" font-family="monospace, Consolas, sans-serif" font-size="12" font-weight="600" fill="#94a3b8" letter-spacing="2">NÚMERO DE CÉDULA / IDENTIFICACIÓN:</text>
      <text x="0" y="30" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#f8fafc" letter-spacing="1">1751940212</text>
    </g>

    <!-- Row 3: Tipo de Cuenta -->
    <g transform="translate(68, 370)">
      <text x="0" y="0" font-family="monospace, Consolas, sans-serif" font-size="13" font-weight="700" fill="#f43f5e" letter-spacing="2">TIPO DE CUENTA: AHORROS</text>
    </g>

    <!-- Row 4: Número de Cuenta -->
    <g transform="translate(68, 410)">
      <text x="0" y="0" font-family="monospace, Consolas, sans-serif" font-size="13" font-weight="600" fill="#94a3b8" letter-spacing="2">NÚMERO DE CUENTA:</text>
      <text x="0" y="46" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#00e5a3" letter-spacing="4" filter="url(#glowG)">0124465041</text>
    </g>

    <!-- Footer Note -->
    <g transform="translate(68, 510)">
      <circle cx="8" cy="-4" r="7" fill="#10b981"/>
      <path d="M5 -4 L7 -1 L12 -7" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="24" y="0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">Enviar el comprobante con fecha, hora y valor visible para validación inmediata.</text>
    </g>

    <!-- Bottom security ribbon -->
    <rect x="36" y="565" width="928" height="26" rx="6" fill="#1e293b" opacity="0.6"/>
    <text x="500" y="582" text-anchor="middle" font-family="monospace, Consolas, sans-serif" font-size="11" fill="#64748b" letter-spacing="2">VALIDACIÓN OFICIAL SRI &amp; RED BANCARIA NACIONAL · ECUADOR 2026</text>
  </svg>
  `;

  const outDir = path.join(__dirname, '../public/images/pagos');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  await sharp(Buffer.from(pichinchaSvg))
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'banco-pichincha.png'));
  console.log('✅ Generated banco-pichincha.png');

  await sharp(Buffer.from(guayaquilSvg))
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'banco-guayaquil.png'));
  console.log('✅ Generated banco-guayaquil.png');
}

generateCards().catch(console.error);
