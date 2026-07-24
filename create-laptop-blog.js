const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createLaptopBlog() {
  try {
    console.log("Buscando laptops...");
    // Fetch all products that are in the "laptops" category or have "laptop" in the name
    const laptops = await prisma.product.findMany({
      where: {
        OR: [
          { category: { name: { contains: "laptop", mode: "insensitive" } } },
          { name: { contains: "laptop", mode: "insensitive" } },
          { categoryId: { contains: "laptop", mode: "insensitive" } }
        ]
      }
    });

    console.log(`Encontradas ${laptops.length} laptops.`);

    if (laptops.length === 0) {
      console.log("No se encontraron laptops para agregar al blog.");
      return;
    }

    const firstAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!firstAdmin) {
        console.log("No admin user found to author the blog.");
        return;
    }

    let htmlContent = `
    <h2>Catálogo Completo de Laptops Disponibles</h2>
    <p>A continuación te presentamos nuestra selección de laptops actuales, con sus características principales y precios al público.</p>
    <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px;">
    `;

    laptops.forEach(laptop => {
        htmlContent += `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; width: 300px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <img src="${laptop.imageUrl || 'https://via.placeholder.com/150'}" alt="${laptop.name}" style="width: 100%; height: 200px; object-fit: contain; border-radius: 4px;" />
            <h3 style="margin-top: 12px; font-size: 1.1em; color: #1e293b;">${laptop.name}</h3>
            <p style="color: #64748b; font-size: 0.9em; height: 60px; overflow: hidden;">${laptop.description ? laptop.description.substring(0, 100) + '...' : 'Sin descripción'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span style="font-weight: bold; color: #10b981; font-size: 1.2em;">$${laptop.price.toFixed(2)}</span>
                ${laptop.stock > 0 ? '<span style="color: #3b82f6; font-size: 0.8em; font-weight: bold;">En Stock</span>' : '<span style="color: #ef4444; font-size: 0.8em; font-weight: bold;">Agotado</span>'}
            </div>
            <a href="/web/product/${laptop.id}" style="display: block; text-align: center; margin-top: 15px; background-color: #4f46e5; color: white; padding: 8px; border-radius: 4px; text-decoration: none; font-weight: bold;">Ver Detalles</a>
        </div>
        `;
    });

    htmlContent += `</div>`;

    console.log("Creando blog...");
    const blog = await prisma.blog.create({
      data: {
        title: "🔥 Mega Catálogo de Laptops: Encuentra tu equipo ideal",
        excerpt: "Descubre nuestra colección completa de laptops con los mejores precios y características del mercado. ¡Equípate hoy mismo!",
        content: htmlContent,
        published: true,
        authorId: firstAdmin.id,
        imageUrl: laptops[0]?.imageUrl || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200",
        contentType: "article"
      }
    });

    console.log(`Blog creado con éxito! ID: ${blog.id}`);

  } catch (error) {
    console.error("Error creating blog:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createLaptopBlog();
