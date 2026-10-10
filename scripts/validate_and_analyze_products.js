const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== CONSULTANDO PRODUCTOS Y CATEGORÍAS EN ATOMIC ERP ===');
  
  // 1. Total de categorías
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  console.log(`\nTotal Categorías en DB: ${categories.length}`);
  for (const cat of categories) {
    console.log(`- [${cat.isVisible ? 'VISIBLE' : 'OCULTA'}] ${cat.name} (Slug: ${cat.slug}) -> ${cat._count.products} productos`);
  }

  // 2. Total de colecciones
  const collections = await prisma.collection.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  console.log(`\nTotal Colecciones en DB: ${collections.length}`);
  for (const col of collections) {
    console.log(`- [${col.isVisible ? 'VISIBLE' : 'OCULTA'}] ${col.name} -> ${col._count.products} productos`);
  }

  // 3. Total de productos
  const totalProducts = await prisma.product.count();
  const activeProducts = await prisma.product.count({ where: { isActive: true, isDeleted: false } });
  const inactiveProducts = await prisma.product.count({ where: { isActive: false } });
  const deletedProducts = await prisma.product.count({ where: { isDeleted: true } });
  const productsWithoutCategory = await prisma.product.count({ where: { categoryId: null } });

  console.log(`\nTotal Productos en DB: ${totalProducts}`);
  console.log(`- Activos y no borrados: ${activeProducts}`);
  console.log(`- Inactivos: ${inactiveProducts}`);
  console.log(`- Borrados lógicos: ${deletedProducts}`);
  console.log(`- Sin categoría asignada: ${productsWithoutCategory}`);

  // 4. Muestra de productos y rangos de precios por categoría
  const allProducts = await prisma.product.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      isActive: true,
      images: true,
      categoryId: true,
      category: { select: { name: true } },
      provider: true,
      keywords: true
    }
  });

  const catMap = {};
  let totalWithoutImages = 0;
  for (const p of allProducts) {
    if (!p.images || p.images.trim() === '' || p.images === '[]') {
      totalWithoutImages++;
    }
    const cName = p.category ? p.category.name : 'SIN CATEGORÍA';
    if (!catMap[cName]) {
      catMap[cName] = { count: 0, items: [], minPrice: Infinity, maxPrice: -Infinity, totalStock: 0 };
    }
    catMap[cName].count++;
    catMap[cName].totalStock += (p.stock || 0);
    if (p.price < catMap[cName].minPrice) catMap[cName].minPrice = p.price;
    if (p.price > catMap[cName].maxPrice) catMap[cName].maxPrice = p.price;
    if (catMap[cName].items.length < 6) {
      catMap[cName].items.push({ name: p.name, price: p.price, stock: p.stock, images: !!p.images });
    }
  }

  console.log(`\nProductos sin imagen: ${totalWithoutImages}`);

  console.log('\n=== DESGLOSE DETALLADO POR CATEGORÍA ===');
  for (const [cName, data] of Object.entries(catMap)) {
    console.log(`\n📁 CATEGORÍA: ${cName} (${data.count} productos | Stock total: ${data.totalStock}) | Rango: $${data.minPrice === Infinity ? 0 : data.minPrice.toFixed(2)} - $${data.maxPrice === -Infinity ? 0 : data.maxPrice.toFixed(2)}`);
    for (const item of data.items) {
      console.log(`   * ${item.name.padEnd(50).slice(0, 50)} | $${item.price.toFixed(2)} | Stock: ${item.stock} | Tiene Foto: ${item.images}`);
    }
  }
}

main()
  .catch(e => {
    console.error('Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
