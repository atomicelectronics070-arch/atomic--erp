import { prisma } from '../src/lib/prisma';

async function main() {
  const existing = await prisma.product.findFirst({
    where: { 
        isDeleted: false,
        name: { contains: 'DELL 27', mode: 'insensitive' } 
    }
  });

  if (existing) {
    console.log('EXISTING DELL 27 AIO PRODUCT:', existing.id, existing.name, '$' + existing.price);
  } else {
    const cat = await prisma.category.findFirst({
      where: { name: { contains: 'Computación', mode: 'insensitive' } }
    });

    const newProduct = await prisma.product.create({
      data: {
        name: 'COMPUTADORA TODO-EN-UNO DELL 27" INTEL CORE I7-150U 16GB RAM 512GB SSD',
        description: 'Computadora All-in-One Dell de 27 pulgadas Full HD con Procesador Intel Core i7-150U, 16GB RAM DDR5, 512GB SSD NVMe, Teclado y Mouse Inalámbrico. Rendimiento empresarial excepcional para multitarea avanzada y aplicaciones exigentes.',
        price: 890.00,
        compareAtPrice: 1050.00,
        costPrice: 720.00,
        stock: 12,
        provider: 'IMPORTADORA ELECTRÓNICA Y TECNOLOGÍA',
        categoryId: cat ? cat.id : null,
        specs: 'Intel Core i7-150U, 16GB RAM DDR5, 512GB SSD NVMe, Pantalla 27 pulgadas FHD IPS, Windows 11 Pro',
        images: JSON.stringify(['/api/web-banners/banner-16.jpg'])
      }
    });

    console.log('SUCCESSFULLY REGISTERED DELL 27 AIO IN DB:', newProduct.id, newProduct.name, '$' + newProduct.price);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
