const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TAXONOMY = [
  {
    name: "Electrónica",
    slug: "electronica",
    subcategories: [
      {
        name: "Componentes Electrónicos",
        slug: "componentes-electronicos",
        keywords: ["diodo", "transistor", "capacitor", "resistencia", "led", "pcb", "circuito", "integrado", "chip", "rele", "potenciometro", "regulador"]
      },
      {
        name: "Microcontroladores",
        slug: "microcontroladores",
        keywords: ["raspberry", "esp32", "esp8266", "arduino", "pic", "nodemcu", "rpi", "microcontrolador"]
      }
    ]
  },
  {
    name: "Hogar",
    slug: "hogar",
    subcategories: [
      {
        name: "Línea Blanca / Electrodomésticos",
        slug: "linea-blanca",
        keywords: ["lavadora", "refrigeradora", "congelador", "secadora", "microondas", "electrodomestico"]
      },
      {
        name: "Cocina y Extracción",
        slug: "cocina-extraccion",
        keywords: ["encimera", "extractor", "campana", "horno", "cocina", "estufa", "induccion"],
        providerHint: ["Banco del Perno"]
      },
      {
        name: "Iluminación",
        slug: "iluminacion",
        keywords: ["foco", "lampara", "plafon", "dicroico", "bombillo", "luminaria", "panel led", "cinta led", "iluminacion", "reflector"]
      }
    ]
  },
  {
    name: "Residencial",
    slug: "residencial",
    subcategories: [
      {
        name: "Automatización de Accesos",
        slug: "automatizacion-accesos",
        keywords: ["motor", "garage", "garaje", "corredizo", "batiente", "barrera", "pluma", "cremallera", "piston", "automatismo", "puerta automatica"],
        providerHint: ["CiseGURSA"]
      },
      {
        name: "Control de Acceso",
        slug: "control-acceso",
        keywords: ["portero", "citofono", "videoportero", "lector", "huella", "chapa", "cerradura", "magnetica", "teclado", "biometrico"],
        providerHint: ["CiseGURSA"]
      },
      {
        name: "Domótica",
        slug: "domotica",
        keywords: ["domotica", "smart home", "interruptor inteligente", "sensor wifi", "alexa", "sonoff", "broadlink", "smart", "tuya"]
      }
    ]
  },
  {
    name: "Industrial",
    slug: "industrial",
    subcategories: [
      {
        name: "Maquinaria de Construcción",
        slug: "maquinaria-construccion",
        keywords: ["bloquera", "fabricadora", "compresora", "mezcladora", "grua", "montacargas", "maquinaria"]
      },
      {
        name: "Tratamiento de Agua",
        slug: "tratamiento-agua",
        keywords: ["sanitizadora", "purificadora", "filtro industrial", "osmosis", "tratamiento agua"]
      }
    ]
  },
  {
    name: "Software",
    slug: "software",
    subcategories: [
      {
        name: "Desarrollo de Bots Automáticos",
        slug: "desarrollo-bots",
        keywords: ["bot", "automatizacion web", "scraping", "whatsapp bot", "chatbot"]
      },
      {
        name: "Infraestructura E-commerce",
        slug: "ecommerce",
        keywords: ["backend", "tienda", "pasarela", "carrito", "shopify", "woocommerce", "vtex", "ecommerce"]
      },
      {
        name: "Sistemas Informáticos a Medida",
        slug: "sistemas-medida",
        keywords: ["erp", "crm", "sistema web", "software medida", "saas", "desarrollo"]
      }
    ]
  }
];

async function syncTaxonomyTree() {
  console.log("Sincronizando árbol de categorías...");
  const categoryMap = new Map(); // slug -> id

  for (const parent of TAXONOMY) {
    let parentCat = await prisma.category.findUnique({ where: { slug: parent.slug } });
    if (!parentCat) {
      parentCat = await prisma.category.create({
        data: {
          name: parent.name,
          slug: parent.slug,
          isVisible: true
        }
      });
      console.log(`Creada categoría madre: ${parent.name}`);
    } else {
      categoryMap.set(parent.slug, parentCat.id);
    }
    
    // Subcategories
    for (const child of parent.subcategories) {
      let childCat = await prisma.category.findUnique({ where: { slug: child.slug } });
      if (!childCat) {
        childCat = await prisma.category.create({
          data: {
            name: child.name,
            slug: child.slug,
            isVisible: true,
            parentId: parentCat.id
          }
        });
        console.log(`  Creada subcategoría: ${child.name}`);
      } else {
        // Ensure parent is correct
        if (childCat.parentId !== parentCat.id) {
          await prisma.category.update({
            where: { id: childCat.id },
            data: { parentId: parentCat.id }
          });
        }
      }
      categoryMap.set(child.slug, childCat.id);
      child.dbId = childCat.id; // Save it to the obj for faster access later
    }
  }
  return categoryMap;
}

function classifyProduct(product) {
  const textToSearch = `${product.name} ${product.description || ''}`.toLowerCase();
  const provider = product.provider || '';

  // Calculate score for each subcategory
  let bestScore = 0;
  let bestSubcatId = null;

  for (const parent of TAXONOMY) {
    for (const sub of parent.subcategories) {
      let score = 0;

      // 1. Keyword match
      for (const kw of sub.keywords) {
        if (textToSearch.includes(kw.toLowerCase())) {
          score += 10;
        }
      }

      // 2. Provider match (boosts score)
      if (sub.providerHint && sub.providerHint.includes(provider)) {
        score += 20; 
        // If it comes from a specific provider, and it had some matching keyword, it's very likely.
        // Even if no keyword, it gives it a baseline score that might win if it's generic.
      }

      if (score > bestScore) {
        bestScore = score;
        bestSubcatId = sub.dbId;
      }
    }
  }
  
  return bestSubcatId;
}

async function run() {
  try {
    const map = await syncTaxonomyTree();
    console.log("-----------------------------------------");
    console.log("Iniciando clasificación masiva de productos...");

    const batchSize = 500;
    let cursor = null;
    let hasMore = true;
    let processed = 0;
    let classified = 0;

    while (hasMore) {
      const products = await prisma.product.findMany({
        take: batchSize,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'asc' }
      });

      if (products.length === 0) {
        hasMore = false;
        break;
      }

      const updatePromises = [];

      for (const p of products) {
        const newCategoryId = classifyProduct(p);
        if (newCategoryId && p.categoryId !== newCategoryId) {
          updatePromises.push(
            () => prisma.product.update({
              where: { id: p.id },
              data: { categoryId: newCategoryId }
            })
          );
          classified++;
        }
      }

      // Run sequentially to avoid pool exhaustion
      for (const updateFn of updatePromises) {
        await updateFn();
      }

      cursor = products[products.length - 1].id;
      processed += products.length;
      console.log(`Procesados: ${processed} | Clasificados/Actualizados: ${classified}`);
    }

    console.log("¡Categorización masiva completada!");
  } catch (error) {
    console.error("Error en categorización:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
