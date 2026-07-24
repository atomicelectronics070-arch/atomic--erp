const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLaptopBlog() {
  try {
    const blogId = "cmrzaruyu000130xwb1qkupx2";
    console.log("Obteniendo laptops reales...");

    // Fetch laptops
    const rawLaptops = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { category: { name: { contains: "laptop", mode: "insensitive" } } },
              { name: { contains: "laptop", mode: "insensitive" } }
            ]
          },
          { price: { gt: 150 } },
        ]
      },
      orderBy: { price: 'desc' }
    });

    const laptops = [];
    
    // Rigorous filtering in JS to ensure valid image
    rawLaptops.forEach(laptop => {
        let imageUrl = null;
        if (laptop.images && typeof laptop.images === 'string') {
            try {
                const parsed = JSON.parse(laptop.images);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].startsWith("http")) {
                    imageUrl = parsed[0];
                } else if (typeof parsed === 'string' && parsed.startsWith("http")) {
                    imageUrl = parsed;
                }
            } catch (e) {
                if (laptop.images.startsWith("http")) {
                    imageUrl = laptop.images;
                }
            }
        }
        
        // Block known placeholders
        if (imageUrl && (imageUrl.includes("placeholder") || imageUrl.includes("woocommerce-placeholder"))) {
            imageUrl = null;
        }

        if (imageUrl) {
            laptop.validImageUrl = imageUrl;
            laptops.push(laptop);
        }
    });

    console.log(`Encontradas ${laptops.length} laptops reales y con imágenes verdaderas.`);

    let htmlContent = `
    <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #020617; padding: 60px 20px; border-radius: 30px; color: #f8fafc; border: 1px solid #1e3a8a; box-shadow: inset 0 0 40px rgba(29, 78, 216, 0.2);">
        
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3.5rem; font-weight: 900; background: linear-gradient(to bottom right, #38bdf8, #818cf8, #c084fc); -webkit-background-clip: text; color: transparent; margin-bottom: 20px; letter-spacing: -1.5px; text-shadow: 0 0 20px rgba(56,189,248,0.3);">
                NEON LAPTOP CATALOG
            </h2>
            <p style="font-size: 1.3rem; color: #94a3b8; max-width: 650px; margin: 0 auto; line-height: 1.8; text-shadow: 0 0 10px rgba(0,0,0,0.5);">
                Descubre nuestra selección ultra-premium. Equipos de alto rendimiento para gaming, diseño y desarrollo.
            </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 40px;">
    `;

    laptops.forEach(laptop => {
        htmlContent += `
        <div style="background: linear-gradient(145deg, #0f172a 0%, #020617 100%); border: 1px solid #1e3a8a; border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(56,189,248,0.1), inset 0 0 20px rgba(29,78,216,0.2);" 
             onmouseover="this.style.transform='translateY(-10px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.9), 0 0 25px rgba(56,189,248,0.4), inset 0 0 20px rgba(29,78,216,0.4)'; this.style.borderColor='#38bdf8';" 
             onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(56,189,248,0.1), inset 0 0 20px rgba(29,78,216,0.2)'; this.style.borderColor='#1e3a8a';">
            
            <div style="position: relative; background: radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%); padding: 30px; display: flex; justify-content: center; align-items: center; height: 260px; border-bottom: 2px solid #1e3a8a;">
                <img src="${laptop.validImageUrl}" alt="${laptop.name}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 15px 15px rgba(0,0,0,0.3));" />
                ${laptop.stock > 0 
                    ? '<div style="position: absolute; top: 16px; right: 16px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; font-size: 0.75rem; font-weight: 900; padding: 6px 14px; border-radius: 30px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 0 10px rgba(16,185,129,0.3), inset 0 0 5px rgba(16,185,129,0.2); backdrop-filter: blur(4px);">Stock Listo</div>'
                    : '<div style="position: absolute; top: 16px; right: 16px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #ef4444; font-size: 0.75rem; font-weight: 900; padding: 6px 14px; border-radius: 30px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 0 10px rgba(239,68,68,0.3), inset 0 0 5px rgba(239,68,68,0.2); backdrop-filter: blur(4px);">Agotado</div>'
                }
            </div>

            <div style="padding: 28px; display: flex; flex-direction: column; flex-grow: 1;">
                <h3 style="font-size: 1.3rem; font-weight: 900; color: #f8fafc; margin-bottom: 14px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                    ${laptop.name}
                </h3>
                
                <p style="font-size: 0.95rem; color: #cbd5e1; margin-bottom: 28px; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                    ${laptop.description ? laptop.description : 'Una máquina bestial lista para cualquier desafío de productividad y gaming extremo.'}
                </p>

                <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(30,58,138,0.5);">
                    <div>
                        <span style="display: block; font-size: 0.8rem; color: #38bdf8; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 4px; text-shadow: 0 0 8px rgba(56,189,248,0.4);">Precio Final</span>
                        <span style="font-size: 2.2rem; font-weight: 900; color: #ffffff; text-shadow: 0 0 15px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.5); letter-spacing: -1px;">$${laptop.price.toFixed(2)}</span>
                    </div>
                    
                    <a href="/web/product/${laptop.id}" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; text-decoration: none; font-weight: 800; font-size: 0.9rem; padding: 14px 28px; border-radius: 14px; display: inline-block; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2); text-transform: uppercase; letter-spacing: 1px;" onmouseover="this.style.boxShadow='0 0 20px rgba(56,189,248,0.6), inset 0 2px 4px rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 4px 15px rgba(37, 99, 235, 0.4), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)'; this.style.transform='translateY(0)';">
                        VER
                    </a>
                </div>
            </div>
        </div>
        `;
    });

    htmlContent += `
        </div>
        <div style="text-align: center; margin-top: 60px; padding-top: 40px; border-top: 1px solid rgba(30,58,138,0.5);">
            <p style="color: #64748b; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">NEON CATALOG SYSTEM &copy; 2026</p>
        </div>
    </div>`;

    await prisma.blog.update({
      where: { id: blogId },
      data: { content: htmlContent }
    });

    console.log("Blog actualizado con diseño super moderno y laptops filtradas!");

  } catch (error) {
    console.error("Error updating blog:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateLaptopBlog();
