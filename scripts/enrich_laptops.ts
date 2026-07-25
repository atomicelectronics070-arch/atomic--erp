import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function searchYahooImages(query: string): Promise<string[]> {
  try {
    const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query + ' laptop product shot white background')}`;
    const response = await fetch(url);
    const html = await response.text();
    
    // Parse Yahoo Images HTML (src='https://tse...')
    const imgRegex = /src='(https:\/\/tse[0-9]\.mm\.bing\.net\/th\?id=[^']+)'/g;
    const matches = [...html.matchAll(imgRegex)];
    
    const uniqueUrls = [...new Set(matches.map(m => m[1]))];
    return uniqueUrls.slice(0, 4); // return top 4 images
  } catch (err) {
    console.error(`Error searching images for ${query}:`, err);
    return [];
  }
}

function generateSpecsFromName(name: string) {
  const n = name.toLowerCase();
  
  let cpu = "Procesador de Alta Eficiencia";
  let cpuDesc = "Multitarea fluida y tiempos de carga instantáneos para tus labores diarias.";
  if (n.includes('i7') || n.includes('core 7')) { cpu = "Intel Core i7"; cpuDesc = "Arquitectura de máximo rendimiento. Multitarea sin límites para profesionales y gamers."; }
  else if (n.includes('i5')) { cpu = "Intel Core i5"; cpuDesc = "El equilibrio perfecto entre rendimiento y precio para todas tus aplicaciones."; }
  else if (n.includes('i3')) { cpu = "Intel Core i3"; cpuDesc = "Ideal para ofimática avanzada y consumo multimedia sin interrupciones."; }
  else if (n.includes('ryzen 7') || n.includes('r7')) { cpu = "AMD Ryzen 7"; cpuDesc = "Múltiples núcleos y subprocesos para renderizado y gaming fluido."; }
  else if (n.includes('ryzen 5') || n.includes('r5')) { cpu = "AMD Ryzen 5"; cpuDesc = "Potencia pura y eficiencia energética inigualable para tu día a día."; }
  
  let gpu = "Gráficos Integrados Optimizados";
  let gpuDesc = "Reproducción de video 4K, diseño ligero y máxima duración de batería.";
  if (n.includes('rtx')) { gpu = "NVIDIA GeForce RTX"; gpuDesc = "Gráficos ultrarrealistas con Ray Tracing y revolucionario DLSS impulsado por IA."; }
  else if (n.includes('gtx')) { gpu = "NVIDIA GeForce GTX"; gpuDesc = "Rendimiento comprobado para juegos competitivos y tareas de diseño."; }
  else if (n.includes('radeon')) { gpu = "AMD Radeon Graphics"; gpuDesc = "Aceleración gráfica sólida para edición de video y gaming casual."; }

  let ram = "Memoria RAM Rápida";
  if (n.includes('32gb')) ram = "32GB RAM";
  else if (n.includes('16gb')) ram = "16GB RAM";
  else if (n.includes('8gb')) ram = "8GB RAM";

  let storage = "Almacenamiento SSD M.2";
  if (n.includes('1tb')) storage = "1TB SSD NVMe";
  else if (n.includes('512gb')) storage = "512GB SSD NVMe";
  else if (n.includes('256gb')) storage = "256GB SSD NVMe";

  return { cpu, cpuDesc, gpu, gpuDesc, ram, storage };
}

async function main() {
  const laptops = await prisma.product.findMany({
    where: {
      name: { startsWith: 'Laptop', mode: 'insensitive' }
    },
    select: { id: true, name: true, sku: true, price: true, description: true }
  });

  console.log(`Found ${laptops.length} laptops. Starting enrichment process...`);
  
  const enrichedLaptops = [];

  for (let i = 0; i < laptops.length; i++) {
    const l = laptops[i];
    console.log(`Processing [${i + 1}/${laptops.length}]: ${l.name}`);
    
    // Clean name for searching
    const cleanName = l.name.replace(/laptop/i, '').trim();
    
    // Get Images
    const images = await searchYahooImages(cleanName);
    
    // Generate Text
    const specs = generateSpecsFromName(l.name);
    
    enrichedLaptops.push({
      ...l,
      slug: (l.sku || `laptop-${l.id}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      cleanName,
      images: images.length > 0 ? images : [
        "https://m.media-amazon.com/images/I/710JGMmTGJL._AC_SL1000_.jpg" // fallback
      ],
      features: {
        hero: {
          title: `Potencia sin Límites: ${cleanName.split(' ')[0] || 'Línea Exclusiva'}`,
          subtitle: `Descubre por qué la ${cleanName} es la herramienta definitiva para llevar tu productividad y entretenimiento al siguiente nivel.`
        },
        cpu: {
          title: specs.cpu,
          desc: specs.cpuDesc
        },
        gpu: {
          title: specs.gpu,
          desc: specs.gpuDesc
        },
        display: {
          title: "Pantalla Inmersiva de Alta Resolución",
          desc: "Dile adiós a la fatiga visual. Colores vibrantes y detalles nítidos te sumergen por completo en tu trabajo o películas favoritas."
        },
        connectivity: {
          title: "Conectividad Total",
          desc: `Equipada con ${specs.ram} y ${specs.storage}, puertos ultrarrápidos y Wi-Fi de última generación. Cero lag, máxima velocidad.`
        }
      }
    });
    
    // small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  const outputPath = path.join(process.cwd(), 'src', 'data', 'enrichedLaptops.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(enrichedLaptops, null, 2), 'utf-8');
  console.log(`Enrichment complete! Saved to ${outputPath}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
