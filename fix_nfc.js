const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src/app/web/nfc/page.tsx');
let text = fs.readFileSync(p, 'utf8');
text = text.replace(/<video /g, '<video onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }} style={{ cursor: "pointer" }} title="Click para activar/desactivar volumen" ');
fs.writeFileSync(p, text, 'utf8');
console.log('Done');
