const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const cats = await prisma.category.findMany();
    const withoutImage = cats.filter(c => !c.image);
    console.log('Categories without image:', withoutImage.map(c => c.name));
    
    const svgImages = cats.filter(c => c.image && c.image.endsWith('.svg'));
    console.log('Categories with SVG (potentially broken):', svgImages.map(c => c.name));

    await prisma.$disconnect();
}
main();
