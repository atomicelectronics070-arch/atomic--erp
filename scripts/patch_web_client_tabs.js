const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'web', 'PublicWebClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const hubPattern = /\{\/\* QUICK CATEGORY HUB BUTTONS \*\/\}\s*<div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto mb-16">/;

const hubReplacement = `{/* QUICK CATEGORY HUB BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto mb-16">
            {/* NEW CATEGORY PILL: ATOMIC STUDIO */}
            <Link
              href="/web/creacion-contenido"
              className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-400 hover:border-pink-500 text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px] text-purple-950 font-black">🎬 ATOMIC STUDIO (CONTENIDO)</span>
              <span className="text-[10px] bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-0.5 rounded-full font-mono font-bold">TICKETS $100</span>
            </Link>

            {/* NEW CATEGORY PILL: CARROS INDUSTRIALES BP */}
            <Link
              href="/web/carros-industriales"
              className="px-5 py-3 rounded-full bg-slate-900 border-2 border-yellow-400 hover:border-yellow-300 text-xs font-bold text-yellow-400 transition-all flex items-center gap-2 shadow-md group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px] text-yellow-400 font-black">🚚 CARROS INDUSTRIALES BP</span>
              <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-mono font-black">CARGA 200KG</span>
            </Link>`;

if (hubPattern.test(content) && !content.includes('NEW CATEGORY PILL: ATOMIC STUDIO')) {
  content = content.replace(hubPattern, hubReplacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("✅ Quick category hub successfully injected with Atomic Studio and Carros Industriales!");
} else {
  console.log("ℹ️ Quick category hub already has the pill or pattern did not match");
}
