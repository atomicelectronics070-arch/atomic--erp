const fs = require('fs');
const path = require('path');

const downloadsDir = 'C:/Users/SANTIAGO/Downloads';
const publicDir = path.join(__dirname, '..', 'public');

const dirs = [
  'images/promociones', 'images/cercos', 'img/cargadores', 'images/repuestos',
  'images/scooters', 'images/bicicletas', 'images/consolas', 'images/luminarias',
  'images/generadores', 'images/servidores', 'images/software', 'images/videoporteros',
  'images/camaras', 'images/camaras-espia', 'images/inversiones', 'images/contrataciones',
  'images/parlantes', 'images/linternas', 'images/pizarras', 'images/monitores', 'images/lotes_nuevos'
];

dirs.forEach(d => {
  const p = path.join(publicDir, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Copy all WhatsApp files from 6:37 and 6:47 to public/images/lotes_nuevos
if (fs.existsSync(downloadsDir)) {
  const allFiles = fs.readdirSync(downloadsDir);
  
  const files637 = allFiles.filter(f => f.includes('2026-08-27') && f.includes('6.37.')).sort();
  const files647 = allFiles.filter(f => f.includes('2026-08-27') && f.includes('6.47.')).sort();

  files637.forEach((f, i) => {
    const num = String(i + 1).padStart(2, '0');
    try {
      fs.copyFileSync(path.join(downloadsDir, f), path.join(publicDir, 'images', 'lotes_nuevos', `foto_${num}.jpg`));
    } catch(e) {}
  });

  files647.forEach((f, i) => {
    const num = String(i + 1).padStart(2, '0');
    try {
      fs.copyFileSync(path.join(downloadsDir, f), path.join(publicDir, 'images', 'lotes_nuevos', `instruccion_${num}.jpg`));
    } catch(e) {}
  });
}

// Map WhatsApp downloaded images to exact destinations
const promoDir = path.join(publicDir, 'images', 'promociones');
const cercosDir = path.join(publicDir, 'images', 'cercos');
const cargadoresDir = path.join(publicDir, 'img', 'cargadores');
const repuestosDir = path.join(publicDir, 'images', 'repuestos');

const imageMap = [
  // 1. Promo banners
  { src: 'WhatsApp Image 2026-08-26 at 6.45.43 PM.jpeg', dst: path.join(promoDir, 'laptops-portada.jpg'), desc: 'Portada Laptops & Computación' },
  { src: 'WhatsApp Image 2026-08-26 at 6.45.43 PM (1).jpeg', dst: path.join(promoDir, 'apple-portada.jpg'), desc: 'Portada Ecosistema Apple Oficial' },
  { src: 'WhatsApp Image 2026-08-26 at 6.45.44 PM.jpeg', dst: path.join(promoDir, 'cercos-electricos-portada.jpg'), desc: 'Portada Cercos Eléctricos' },
  // 2. Cerco products
  { src: 'WhatsApp Image 2026-08-26 at 6.45.44 PM (1).jpeg', dst: path.join(cercosDir, 'cerco-hagroy-xpower-i8-15083.jpg'), desc: 'Kit Hagroy X-Power i8' },
  { src: 'WhatsApp Image 2026-08-26 at 6.45.44 PM (2).jpeg', dst: path.join(cercosDir, 'cerco-hagroy-yanex-11258.jpg'), desc: 'Kit Hagroy Yanex' },
  { src: 'WhatsApp Image 2026-08-26 at 6.45.44 PM (3).jpeg', dst: path.join(cercosDir, 'cerco-jfl-platino-11208.jpg'), desc: 'Kit Platino JFL' },
  { src: 'WhatsApp Image 2026-08-26 at 6.45.45 PM.jpeg', dst: path.join(cercosDir, 'cerco-jfl-eos18-plus-15023.jpg'), desc: 'Kit JFL EOS 18 PLUS' },
  { src: 'WhatsApp Image 2026-08-26 at 6.45.45 PM (1).jpeg', dst: path.join(cercosDir, 'cerco-jfl-eca14-plus-11207.jpg'), desc: 'Kit JFL ECA 14 PLUS' },
  // 3. EV & Repuestos
  { src: 'WhatsApp Image 2026-08-27 at 5.48.33 AM.jpeg', dst: path.join(cargadoresDir, 'ev_real_1.jpeg'), desc: 'EV Charger Real Photo 1' },
  { src: 'WhatsApp Image 2026-08-27 at 5.48.33 AM (1).jpeg', dst: path.join(cargadoresDir, 'ev_real_2.jpeg'), desc: 'EV Charger Real Photo 2' },
  { src: 'WhatsApp Image 2026-08-27 at 5.48.33 AM (2).jpeg', dst: path.join(cargadoresDir, 'ev_real_3.jpeg'), desc: 'EV Charger Real Photo 3' },
  { src: 'WhatsApp Image 2026-08-27 at 5.48.34 AM.jpeg', dst: path.join(cargadoresDir, 'ev_real_4.jpeg'), desc: 'EV Charger Real Photo 4' },
  { src: 'WhatsApp Image 2026-08-27 at 5.48.34 AM (1).jpeg', dst: path.join(cargadoresDir, 'ev_real_5.jpeg'), desc: 'EV Charger Real Photo 5' },
  { src: 'WhatsApp Image 2026-08-27 at 5.48.34 AM (2).jpeg', dst: path.join(cargadoresDir, 'cargador-wallbox-mevo.jpg'), desc: 'Cargador Wallbox Mevo 7.3kW' },
  { src: 'WhatsApp Image 2026-08-27 at 5.48.34 AM (2).jpeg', dst: path.join(promoDir, 'cargador-wallbox-mevo.jpg'), desc: 'Portada Wallbox Mevo' },
  { src: 'WhatsApp Image 2026-08-27 at 5.48.34 AM (3).jpeg', dst: path.join(promoDir, 'repuestos-computadoras-portada.jpg'), desc: 'Portada Repuestos Computadoras' },
  { src: 'WhatsApp Image 2026-08-27 at 5.48.34 AM (3).jpeg', dst: path.join(repuestosDir, 'repuestos-portada.jpg'), desc: 'Portada Repuestos' },
  // 4. Scooters
  { src: 'WhatsApp Image 2026-08-27 at 6.37.54 AM.jpeg', dst: path.join(publicDir, 'images', 'scooters', 'scooter-ninebot-f25.jpg'), desc: 'Segway Ninebot F25' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.54 AM (1).jpeg', dst: path.join(publicDir, 'images', 'scooters', 'scooter-es1l.jpg'), desc: 'KickScooter ES1L' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.54 AM (2).jpeg', dst: path.join(publicDir, 'images', 'scooters', 'scooter-e12.jpg'), desc: 'KickScooter E12' },
  // 5. Bicicletas
  { src: 'WhatsApp Image 2026-08-27 at 6.37.51 AM.jpeg', dst: path.join(publicDir, 'images', 'bicicletas', 'bicicleta-shimano-r8014.jpg'), desc: 'Bicicleta Shimano R8014' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.51 AM (1).jpeg', dst: path.join(publicDir, 'images', 'bicicletas', 'bicicleta-montana-26.jpg'), desc: 'Bicicleta Montana 26' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.51 AM (2).jpeg', dst: path.join(publicDir, 'images', 'bicicletas', 'bicicleta-plegable-48v.jpg'), desc: 'Bicicleta Plegable 48V' },
  // 6. Consolas & Gaming
  { src: 'WhatsApp Image 2026-08-27 at 6.37.52 AM.jpeg', dst: path.join(publicDir, 'images', 'consolas', 'ps4-slim-reacondicionada.jpg'), desc: 'PS4 Slim Reacondicionada' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.52 AM (1).jpeg', dst: path.join(publicDir, 'images', 'consolas', 'mantenimiento-consolas.jpg'), desc: 'Mantenimiento Consolas' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.52 AM (2).jpeg', dst: path.join(publicDir, 'images', 'consolas', 'control-wireless-gaming.jpg'), desc: 'Control Wireless Gaming' },
  // 7. Luminarias Solares
  { src: 'WhatsApp Image 2026-08-27 at 6.37.50 AM.jpeg', dst: path.join(publicDir, 'images', 'luminarias', 'luminarias-solares-atomeca.jpg'), desc: 'Luminarias Solares Atomeca' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.50 AM (1).jpeg', dst: path.join(publicDir, 'images', 'luminarias', 'luces-led-solares-300-800w.jpg'), desc: 'Luces LED Solares' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.50 AM (2).jpeg', dst: path.join(publicDir, 'images', 'luminarias', 'iluminacion-lujo-colgante.jpg'), desc: 'Iluminación Lujo Departamentos' },
  // 8. Generadores
  { src: 'WhatsApp Image 2026-08-27 at 6.37.48 AM.jpeg', dst: path.join(publicDir, 'images', 'generadores', 'comparativa-generadores.jpg'), desc: 'Comparativa Generadores' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.48 AM (1).jpeg', dst: path.join(publicDir, 'images', 'generadores', 'generadores-ecofriendly.jpg'), desc: 'Generadores Ecofriendly' },
  // 9. Servidores
  { src: 'WhatsApp Image 2026-08-27 at 6.37.49 AM.jpeg', dst: path.join(publicDir, 'images', 'servidores', 'catalogo-servidores.jpg'), desc: 'Catálogo de Servidores' },
  // 10. Software & Bots
  { src: 'WhatsApp Image 2026-08-27 at 6.37.47 AM.jpeg', dst: path.join(publicDir, 'images', 'software', 'automatizacion-bot-99.jpg'), desc: 'Bot $99/Mes' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.47 AM (1).jpeg', dst: path.join(publicDir, 'images', 'software', 'atencion-bot-24-7.jpg'), desc: 'Atiende Bot 24/7' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.47 AM (2).jpeg', dst: path.join(publicDir, 'images', 'software', 'facturacion-cotizacion.jpg'), desc: 'Facturación y Cotización Bot' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.46 AM.jpeg', dst: path.join(publicDir, 'images', 'software', 'llamadas-bot.jpg'), desc: 'Llama Bot' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.46 AM (1).jpeg', dst: path.join(publicDir, 'images', 'software', 'agenda-bot.jpg'), desc: 'Agenda Bot' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.46 AM (2).jpeg', dst: path.join(publicDir, 'images', 'software', 'sistema-control-qr.jpg'), desc: 'Software Control QR Tickets' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.45 AM.jpeg', dst: path.join(publicDir, 'images', 'software', 'impulsa-tienda-online.jpg'), desc: 'Impulsa Tu Tienda Online' },
  // 11. Videoporteros & Cámaras
  { src: 'WhatsApp Image 2026-08-27 at 6.37.43 AM.jpeg', dst: path.join(publicDir, 'images', 'videoporteros', 'videoportero-diel-10.jpg'), desc: 'Videoportero DIEL 10"' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.43 AM (1).jpeg', dst: path.join(publicDir, 'images', 'videoporteros', 'ezviz-cb1-hp7.jpg'), desc: 'EZVIZ CB1 HP7' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.44 AM.jpeg', dst: path.join(publicDir, 'images', 'camaras', 'camara-wifi-bateria.jpg'), desc: 'Cámara WiFi con Batería' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.45 AM (1).jpeg', dst: path.join(publicDir, 'images', 'camaras', 'camara-exterior-imou.jpg'), desc: 'Cámara Exterior IMOU' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.45 AM (2).jpeg', dst: path.join(publicDir, 'images', 'camaras-espia', 'gafas-camara-espia.jpg'), desc: 'Gafas con Cámara Espía' },
  // 12. Linternas, Parlantes, Pizarras, Monitores
  { src: 'WhatsApp Image 2026-08-27 at 6.37.42 AM.jpeg', dst: path.join(publicDir, 'images', 'linternas', 'linterna-potencia-steren.jpg'), desc: 'Linterna Steren Alto Nivel' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.41 AM.jpeg', dst: path.join(publicDir, 'images', 'parlantes', 'parlante-smart-rendimiento.jpg'), desc: 'Parlante Smart Alto Rendimiento' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.41 AM (1).jpeg', dst: path.join(publicDir, 'images', 'pizarras', 'pizarra-smart-4k-75.jpg'), desc: 'Pizarra Smart 4K 75"' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.40 AM.jpeg', dst: path.join(publicDir, 'images', 'monitores', 'monitor-dahua-19.jpg'), desc: 'Monitor Dahua 19"' },
  // 13. Contrataciones & Inversiones
  { src: 'WhatsApp Image 2026-08-27 at 6.37.53 AM.jpeg', dst: path.join(publicDir, 'images', 'contrataciones', 'empleo-ingeniero-redes.jpg'), desc: 'Empleo Ingeniero Redes' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.53 AM (1).jpeg', dst: path.join(publicDir, 'images', 'contrataciones', 'gana-450-celular.jpg'), desc: 'Gana $450 Celular' },
  { src: 'WhatsApp Image 2026-08-27 at 6.37.53 AM (2).jpeg', dst: path.join(publicDir, 'images', 'inversiones', 'futura-tech-invierte-100.jpg'), desc: 'Futura Tech Invierte $100' }
];

console.log('🔄 [ASSET-SYNC] Sincronizando catálogo completo de campañas...');
imageMap.forEach((item) => {
  if (fs.existsSync(downloadsDir)) {
    const srcPath = path.join(downloadsDir, item.src);
    if (fs.existsSync(srcPath)) {
      try {
        fs.copyFileSync(srcPath, item.dst);
        console.log(`✅ [ASSET-SYNC] ${item.desc} -> ${item.dst}`);
      } catch(e) {}
    }
  }
});
console.log('✅ [ASSET-SYNC] Master Asset Sync completado.');
