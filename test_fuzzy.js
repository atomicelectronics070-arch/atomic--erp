const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allProducts = await prisma.product.findMany({
    where: { isDeleted: false, isActive: true },
    select: { id: true, name: true, category: { select: { name: true } }, sku: true, price: true, stock: true }
  });

  const formattedProducts = allProducts.map(p => ({
    id: p.id,
    name: p.name,
    code: p.sku || 'N/A',
    price: p.price,
    image: '',
    category: p.category?.name || 'General',
    description: '',
    stock: p.stock
  }));

  function testQuery(messageText) {
    console.log(`\nTesting query: "${messageText}"`);
    // Clean punctuation first
    let cleanText = messageText.toLowerCase().replace(/[¿?¡!.,;:\(\)\-_]/g, ' ').trim();
    
    let minPrice = 0;
    let maxPrice = Infinity;
    let hasPriceFilter = false;

    const rangeRegex1 = /(?:entre|de)\s+(\d+(?:\.\d+)?)\s+(?:y|a)\s+(\d+(?:\.\d+)?)/i;
    const rangeRegex2 = /(?:menos de|menor a|bajo|hasta)\s+(\d+(?:\.\d+)?)/i;
    const rangeRegex3 = /(?:mas de|mayor a|desde|sobre)\s+(\d+(?:\.\d+)?)/i;

    let match;
    if ((match = cleanText.match(rangeRegex1))) {
      minPrice = parseFloat(match[1]);
      maxPrice = parseFloat(match[2]);
      hasPriceFilter = true;
    } else if ((match = cleanText.match(rangeRegex2))) {
      maxPrice = parseFloat(match[1]);
      hasPriceFilter = true;
    } else if ((match = cleanText.match(rangeRegex3))) {
      minPrice = parseFloat(match[1]);
      hasPriceFilter = true;
    }

    let queryText = cleanText
      .replace(/(?:entre|de)\s+\d+(?:\.\d+)?\s+(?:y|a)\s+\d+(?:\.\d+)?/gi, '') 
      .replace(/(?:menos de|menor a|bajo|hasta|mas de|mayor a|desde|sobre)\s+\d+(?:\.\d+)?/gi, '')
      .replace(/\b(precio|precios|de|cuanto|cuesta|cuestan|stock|valor|los|las|el|la|un|una|unos|unas|dame|tiene|tienes|tines|tinees|teneis|hay|busca|buscame|ver|buscar|tine|para|por|con|sin|me|te|se|nos|mi|su|sus|como|que|cual|cuales|hoy|mas|vender|tip|tips|ayuda|capacitacion|guia|manual|conversar|hablar|charlar|hola|buenas|tardes|dias|noches|gracias|favor|hago|hacer|hace|hizo|hiciste|venta|ventas|registro|registrar|reporte|reportar|recordar|recuerdame)\b/gi, ' ')
      .trim();

    const keywords = queryText.split(/\s+/).map(w => w.trim()).filter(w => w.length >= 2);
    console.log("  Extracted Keywords:", keywords);

    if (keywords.length === 0 && !hasPriceFilter) {
      console.log("  => Result: Forward to AI (no keywords)");
      return;
    }

    function isFuzzyMatch(keyword, targetField) {
      if (!targetField) return false;
      const normalizedTarget = targetField.toLowerCase();
      if (normalizedTarget.includes(keyword)) return true;

      const words = normalizedTarget.split(/[\s\-,\/()]+/).filter(w => w.length >= 2);
      return words.some(w => {
          if (w.includes(keyword)) return true;
          if (keyword.includes(w) && w.length >= 3) return true;
          if (Math.abs(w.length - keyword.length) > 2) return false;

          let commonChars = 0;
          let lastIdx = -1;
          for (let i = 0; i < keyword.length; i++) {
              const idx = w.indexOf(keyword[i], lastIdx + 1);
              if (idx > -1) {
                  commonChars++;
                  lastIdx = idx;
              }
          }
          const ratio = commonChars / Math.max(keyword.length, w.length);
          return ratio >= 0.70;
      });
    }

    let matches = formattedProducts.filter(p => {
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      if (!matchPrice) return false;

      if (keywords.length > 0) {
          return keywords.every(kw => 
              isFuzzyMatch(kw, p.name) || 
              isFuzzyMatch(kw, p.category) || 
              p.code.toLowerCase().includes(kw)
          );
      }
      return true;
    });

    console.log("  => Matches count:", matches.length);
    if (matches.length > 0) {
      console.log("  => First 3 matches:", matches.slice(0, 3).map(m => m.name));
    }
  }

  // Test cases
  testQuery("dame un tip para vender mas hoy");
  testQuery("precio de cable hdmi");
  testQuery("hola");
  testQuery("tienes stock de disco duro?");
  testQuery("como hago una venta?");
}

main();
