import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rules = [
  // Specific categories
  { id: 'cmoe7767m0000wwr9qj6erbvo', terms: ['alarma'] }, // Alarmas
  { id: 'cmoe776lt0001wwr9nnclsanx', terms: ['calefactor', 'ambiente'] }, // Ambientes
  { id: 'cmoe7770q0002wwr9qv8fzjlf', terms: ['antena', 'wifi'] }, // Antenas
  { id: 'cat-automatizacion-inteligente', terms: ['domotica', 'smart'] }, // Automatización
  { id: 'cmoe777fa0003wwr9gaosfxgt', terms: ['barrera'] }, // Barreras Vehiculares
  { id: 'cmmnzk15s0000wqk6cml88hqe', terms: ['cable'], exclude: ['teclado', 'bateria', 'flex', 'ventilador', 'repuesto'] }, // Cable UTP
  { id: 'cmoe777u20004wwr929vi9glb', terms: ['camara'] }, // Cámaras
  { id: 'cmoe779560006wwr9jgnohgqn', terms: ['celular', 'tablet'] }, // Celulares/Tablets
  { id: 'cmoe77b3r000bwwr9nado4n9q', terms: ['cerradura', 'acceso', 'control de acceso'] }, // Cerraduras
  { id: 'cmoe779ke0007wwr9315ym7bx', terms: ['generador'] }, // Energía
  { id: 'cmoe77api000awwr9lovj4q9c', terms: ['luz', 'luminaria', 'iluminacion', 'lampara'] }, // Iluminación
  { id: 'cmoe77abt0009wwr9xfrbhxor', terms: ['portero', 'porteros', 'video portero'] }, // Portería Electrónica
  
  // Laptop related
  { id: 'cmoe779ya0008wwr9i1lm0jmu', terms: ['teclado', 'bateria', 'flex', 'ventilador', 'repuestos para laptop'] }, // Electrónica Negocios
  { id: 'cmoe778p40005wwr94hp2y92j', terms: ['teclado', 'bateria', 'flex', 'ventilador', 'repuestos para laptop'] }, // Repuestos de Laptop
  
  // Broad category (Applying this if needed or as a catch-all for certain items)
  { id: 'cmn8mvs6s0000i8qxcszycltn', terms: ['portero', 'barrera', 'iluminacion', 'ambiente'] }, // TECNOLOGIA RESIDENCIAL
];

async function main() {
  console.log("Starting product categorization...");
  
  for (const rule of rules) {
    console.log(`Processing category: ${rule.id}...`);
    
    const conditions: any[] = rule.terms.map(term => ({
      name: { contains: term, mode: 'insensitive' }
    }));
    
    const where: any = {
      isDeleted: false,
      OR: conditions
    };

    if (rule.exclude) {
      where.NOT = rule.exclude.map(term => ({
        name: { contains: term, mode: 'insensitive' }
      }));
    }

    const updated = await prisma.product.updateMany({
      where,
      data: { categoryId: rule.id }
    });
    
    console.log(`Updated ${updated.count} products for category ${rule.id}`);
  }
  
  console.log("Categorization complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
