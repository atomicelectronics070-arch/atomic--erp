const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const data = JSON.parse(fs.readFileSync('../quito-leads/data.geojson', 'utf8'));
    const leads = data.features.filter(f => f.properties.phone || f.properties['contact:phone']);
    
    console.log(`Found ${leads.length} leads with a phone number. Importing...`);
    
    let imported = 0;
    
    for (const lead of leads) {
        const props = lead.properties;
        const phone = props.phone || props['contact:phone'];
        const name = props.name || props.brand || props.operator || "Empresa Sin Nombre";
        const email = props.email || props['contact:email'] || null;
        
        // Check if exists
        const existing = await prisma.client.findFirst({
            where: {
                OR: [
                    { phone: phone },
                    { name: name }
                ]
            }
        });
        
        if (!existing) {
            await prisma.client.create({
                data: {
                    name: name,
                    phone: phone,
                    email: email,
                    city: "Quito",
                    status: "PROSPECTO",
                    source: "SCRAPING",
                    category: "MAPS_LEAD",
                    salespersonId: "cmmfgsqqk00002d7xz2lhkc2b" // Default user
                }
            });
            imported++;
        }
    }
    
    console.log(`Imported ${imported} new leads successfully!`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
