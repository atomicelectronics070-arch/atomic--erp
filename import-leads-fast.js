const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const data = JSON.parse(fs.readFileSync('../quito-leads/data.geojson', 'utf8'));
    const leads = data.features.filter(f => f.properties.phone || f.properties['contact:phone']);
    
    console.log(`Found ${leads.length} leads with a phone number. Importing fast...`);
    
    // Get existing phones to avoid duplicates
    const existingClients = await prisma.client.findMany({
        select: { phone: true, name: true }
    });
    const existingPhones = new Set(existingClients.map(c => c.phone).filter(Boolean));
    const existingNames = new Set(existingClients.map(c => c.name).filter(Boolean));
    
    const newClients = [];
    
    for (const lead of leads) {
        const props = lead.properties;
        const phone = props.phone || props['contact:phone'];
        const name = props.name || props.brand || props.operator || "Empresa Sin Nombre";
        const email = props.email || props['contact:email'] || null;
        
        if (!existingPhones.has(phone) && !existingNames.has(name)) {
            newClients.push({
                name: String(name).substring(0, 190), // Prisma max length safeguard
                phone: String(phone).substring(0, 190),
                email: email ? String(email).substring(0, 190) : null,
                city: "Quito",
                status: "PROSPECTO",
                source: "SCRAPING",
                category: "MAPS_LEAD",
                salespersonId: "cmmfgsqqk00002d7xz2lhkc2b" // Default user
            });
            // add to sets so we don't insert duplicates within the same batch
            existingPhones.add(phone);
            existingNames.add(name);
        }
    }
    
    if (newClients.length > 0) {
        console.log(`Inserting ${newClients.length} new leads in bulk...`);
        const result = await prisma.client.createMany({
            data: newClients,
            skipDuplicates: true
        });
        console.log(`Successfully bulk inserted ${result.count} leads!`);
    } else {
        console.log(`No new leads to insert. All ${leads.length} leads already exist.`);
    }
}

run().catch(console.error).finally(() => prisma.$disconnect());
