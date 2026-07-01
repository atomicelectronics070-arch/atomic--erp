const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'dashboard', 'shop', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// List of exact replacements for the corrupted encoding strings using literal '\\ufffd'.
const replacements = [
    { search: /p\+\\ufffdblico/gi, replace: 'público' },
    { search: /p\+\\ufffdblias/gi, replace: 'públicas' },
    { search: /p\+\\ufffdbli/gi, replace: 'público' },
    { search: /p\\ufffdblico/gi, replace: 'público' },
    
    { search: /Divisi\+\\ufffdn/gi, replace: 'División' },
    { search: /Divisi\\ufffdn/gi, replace: 'División' },
    
    { search: /LOG\+\\ufffdSTICA/gi, replace: 'LOGÍSTICA' },
    { search: /LOG\\ufffdSTICA/gi, replace: 'LOGÍSTICA' },
    
    { search: /NOTIFICACI\+\\ufffdN/gi, replace: 'NOTIFICACIÓN' },
    { search: /NOTIFICACI\\ufffdN/gi, replace: 'NOTIFICACIÓN' },
    
    { search: /Par\+\\ufffdmetros/gi, replace: 'Parámetros' },
    { search: /Par\\ufffdmetros/gi, replace: 'Parámetros' },
    
    { search: /Transacci\+\\ufffdn/gi, replace: 'Transacción' },
    { search: /Transacci\\ufffdn/gi, replace: 'Transacción' },
    
    { search: /D\+\\ufffdlares/gi, replace: 'Dólares' },
    { search: /D\\ufffdlares/gi, replace: 'Dólares' },
    
    { search: /Env\+\\ufffdo/gi, replace: 'Envío' },
    { search: /Env\\ufffdo/gi, replace: 'Envío' },
    
    { search: /Env\+\\ufffdos/gi, replace: 'Envíos' },
    { search: /Env\\ufffdos/gi, replace: 'Envíos' },
    
    { search: /Difusi\+\\ufffdn/gi, replace: 'Difusión' },
    { search: /Difusi\\ufffdn/gi, replace: 'Difusión' },
    
    { search: /Mensajer\+\\ufffda/gi, replace: 'Mensajería' },
    { search: /Mensajer\\ufffda/gi, replace: 'Mensajería' },
    
    { search: /T\+\\ufffdCTICA/gi, replace: 'TÁCTICA' },
    { search: /T\\ufffdCTICA/gi, replace: 'TÁCTICA' },
    
    { search: /ENV\+\\ufffdOS/gi, replace: 'ENVÍOS' },
    { search: /ENV\\ufffdOS/gi, replace: 'ENVÍOS' },
    
    { search: /Cr\+\\ufffdtico/gi, replace: 'Crítico' },
    { search: /Cr\\ufffdtico/gi, replace: 'Crítico' },
    
    { search: /Anal\+\\ufffdtica/gi, replace: 'Analítica' },
    { search: /Anal\\ufffdtica/gi, replace: 'Analítica' },
    
    { search: /Distribuci\+\\ufffdn/gi, replace: 'Distribución' },
    { search: /Distribuci\\ufffdn/gi, replace: 'Distribución' },
    
    { search: /Or\+\\ufffdgenes/gi, replace: 'Orígenes' },
    { search: /Or\\ufffdgenes/gi, replace: 'Orígenes' },
    
    { search: /T\+\\ufffdcnica/gi, replace: 'Técnica' },
    { search: /T\\ufffdcnica/gi, replace: 'Técnica' },
    
    { search: /Jerarqu\+\\ufffda/gi, replace: 'Jerarquía' },
    { search: /Jerarqu\\ufffda/gi, replace: 'Jerarquía' },
    
    { search: /Definici\+\\ufffdn/gi, replace: 'Definición' },
    { search: /Definici\\ufffdn/gi, replace: 'Definición' }
];

let replacedCount = 0;
replacements.forEach(r => {
    const originalLength = content.length;
    content = content.replace(r.search, r.replace);
    if (content.length !== originalLength) {
        replacedCount++;
    }
});

// Clean up the ugly comment banners containing '\\ufffd' or '+\\ufffd'
content = content.replace(/\/\/\s*[\+\\ufffd]{10,}/gi, '// ==============================');
content = content.replace(/\/\*\s*[\+\\ufffd]{10,}\s*\*\/gi, '/* ============================== */');

// Fallback to replace any remaining solitary '\\ufffd' or '+\\ufffd'
content = content.replace(/\+\\ufffd/gi, '');
content = content.replace(/\\ufffd/gi, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully fixed encoding issues in page.tsx! Applied ${replacedCount} replacement rules.`);
