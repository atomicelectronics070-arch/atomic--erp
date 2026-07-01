const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        console.log('Extracting data from mk-script.js...');
        const scriptContent = fs.readFileSync('mk-script.js', 'utf-8');
        
        // Extract the array using regex or string manipulation
        const startIndex = scriptContent.indexOf('const listaProductos = [');
        const endIndex = scriptContent.indexOf('// =========================================='); // or just find the end of the array
        
        // An easier way: evaluate the array string
        // The array ends right before `function toggleBuscador()` or similar
        const match = scriptContent.match(/const listaProductos = (\[[\s\S]*?\]);\s*\/\//);
        let productsArray = [];
        if (match && match[1]) {
            productsArray = eval(match[1]);
        } else {
            // fallback if regex fails
            const lines = scriptContent.split('\n');
            let jsonStr = '';
            let inArray = false;
            for(let line of lines) {
                if(line.includes('const listaProductos = [')) {
                    inArray = true;
                    jsonStr += '[\n';
                    continue;
                }
                if(inArray) {
                    if(line.trim().startsWith(']')) {
                        jsonStr += ']';
                        break;
                    }
                    jsonStr += line + '\n';
                }
            }
            
            // Clean up trailing commas before closing brackets/braces
            jsonStr = jsonStr.replace(/,(?=\s*[}\]])/g, '');
            productsArray = JSON.parse(jsonStr);
        }

        console.log(`Found ${productsArray.length} products to import.`);

        // Find categories
        const catElec = await prisma.category.findFirst({ where: { name: { contains: 'Electr', mode: 'insensitive' }, parentId: null } });
        const subcats = await prisma.category.findMany({ where: { parentId: catElec.id } });
        const idComp = subcats.find(s => s.name.includes('Componentes'))?.id;
        const idMicro = subcats.find(s => s.name.includes('Microcontroladores'))?.id;
        
        if (!idComp || !idMicro) {
            throw new Error('Categories not found!');
        }

        let imported = 0;
        for (const p of productsArray) {
            // determine category
            let targetCat = idComp;
            if (p.category && (p.category.toLowerCase().includes('microcontrolador') || p.category.toLowerCase().includes('arduino'))) {
                targetCat = idMicro;
            }

            const price = parseFloat(p.price) || 0;
            const imageUrl = p.image ? `https://mk-ecuador.com/${p.image}` : null;

            await prisma.product.upsert({
                where: { sku: p.sku || `MK-${p.id}` },
                update: {
                    name: p.name,
                    price: price,
                    description: p.description || '',
                    category: { connect: { id: targetCat } },
                    stock: p.stock || 0,
                    images: imageUrl
                },
                create: {
                    sku: p.sku || `MK-${p.id}`,
                    name: p.name,
                    price: price,
                    description: p.description || '',
                    category: { connect: { id: targetCat } },
                    stock: p.stock || 0,
                    images: imageUrl,
                    provider: 'MK Ecuador'
                }
            });
            imported++;
            if (imported % 50 === 0) console.log(`Imported ${imported}...`);
        }

        console.log(`Successfully imported ${imported} products from MK Ecuador.`);
    } catch (e) {
        console.error('Error importing:', e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
