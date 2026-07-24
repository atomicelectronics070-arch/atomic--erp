const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLaptopBlog() {
  try {
    const blogId = "cmrzaruyu000130xwb1qkupx2";
    console.log("Obteniendo blog...");

    const laptops = await prisma.product.findMany({
      where: {
        OR: [
          { category: { name: { contains: "laptop", mode: "insensitive" } } },
          { name: { contains: "laptop", mode: "insensitive" } },
          { categoryId: { contains: "laptop", mode: "insensitive" } }
        ]
      }
    });

    let htmlContent = `
    <h2 class="text-2xl font-bold mb-4">Catálogo Completo de Laptops Disponibles</h2>
    <p class="mb-6">A continuación te presentamos nuestra selección de laptops actuales, con sus características principales y precios al público.</p>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
    `;

    laptops.forEach(laptop => {
        const fallbackImg = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=300';
        htmlContent += `
        <div style="border: 1px solid rgba(128,128,128,0.2); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; background: rgba(128,128,128,0.05);">
            <div>
                <img src="${laptop.imageUrl || fallbackImg}" onerror="this.onerror=null;this.src='${fallbackImg}';" alt="${laptop.name}" style="width: 100%; height: 200px; object-fit: contain; border-radius: 4px; margin-bottom: 12px; background: white;" />
                <h3 style="font-size: 1.1em; font-weight: bold; margin-bottom: 8px; line-height: 1.2;">${laptop.name}</h3>
                <p style="font-size: 0.85em; opacity: 0.8; height: 60px; overflow: hidden; margin-bottom: 12px;">${laptop.description ? laptop.description.substring(0, 100) + '...' : 'Sin descripción detallada'}</p>
            </div>
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-weight: 900; font-size: 1.2em; color: #10b981;">$${laptop.price.toFixed(2)}</span>
                    ${laptop.stock > 0 ? '<span style="font-size: 0.8em; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: rgba(59,130,246,0.1); color: #3b82f6;">En Stock</span>' : '<span style="font-size: 0.8em; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: rgba(239,68,68,0.1); color: #ef4444;">Agotado</span>'}
                </div>
                <a href="/web/product/${laptop.id}" style="display: block; text-align: center; background-color: #4f46e5; color: white; padding: 8px; border-radius: 6px; text-decoration: none; font-weight: bold;">Ver Detalles</a>
            </div>
        </div>
        `;
    });

    htmlContent += `</div>`;

    await prisma.blog.update({
      where: { id: blogId },
      data: { content: htmlContent }
    });

    console.log("Blog actualizado correctamente!");

  } catch (error) {
    console.error("Error updating blog:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLaptopBlog();
