const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== RESTAURANDO ARCHIVO DE BASE DE HACE 4 DÍAS (COMMIT 7a5b462) ===');

// Extract clean PublicWebClient.tsx from commit 7a5b462
const cleanCode = execSync('git show 7a5b462:src/app/web/PublicWebClient.tsx', { encoding: 'utf8' });

console.log('Clean code length:', cleanCode.length);

fs.writeFileSync('src/app/web/PublicWebClient.tsx', cleanCode, 'utf8');

console.log('Restoration complete!');
