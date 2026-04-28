const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
    const catsDir = path.join(__dirname, 'public', 'categories');
    const files = fs.readdirSync(catsDir);
    
    const categories = await prisma.category.findMany();
    
    for (const cat of categories) {
        // Try to find a matching file
        const possibleNames = [
            `${cat.slug}.png`,
            `${cat.slug}.svg`,
            `${cat.slug}.jpg`,
            `${cat.name.toLowerCase().replace(/ /g, '-')}.png`,
            `${cat.name.toLowerCase().replace(/ /g, '-')}.svg`
        ];
        
        let foundFile = null;
        for (const name of possibleNames) {
            if (files.includes(name)) {
                foundFile = name;
                break;
            }
        }
        
        if (foundFile) {
            const newPath = `/categories/${foundFile}`;
            if (cat.image !== newPath) {
                await prisma.category.update({
                    where: { id: cat.id },
                    data: { image: newPath }
                });
                console.log(`Updated ${cat.name} -> ${newPath}`);
            }
        } else {
            console.log(`No image found for ${cat.name} (slug: ${cat.slug})`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
