import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Iniciando busqueda de productos ocultos...");
    
    // Contar cuántos están ocultos
    const deletedCount = await prisma.product.count({
        where: { isDeleted: true }
    });
    
    if (deletedCount === 0) {
        console.log("No se encontraron productos ocultos.");
        return;
    }
    
    console.log(`Borrados lógicos encontrados: ${deletedCount}. Restaurando...`);
    
    // Restaurar todos
    const result = await prisma.product.updateMany({
        where: { isDeleted: true },
        data: { isDeleted: false }
    });
    
    console.log(`¡Éxito! Restaurados ${result.count} productos. Recarga la página web.`);
}

main()
  .catch(e => {
      console.error("Error al restaurar:", e);
  })
  .finally(async () => {
      await prisma.$disconnect();
  });
