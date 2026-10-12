const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const META_CDN_URL = "https://pps.whatsapp.net/v/t61.24694-24/696703357_2272828623562864_7707041400620604861_n.jpg?ccb=11-4&oh=01_Q5Aa5wHeLhqf3bVssCzEB19F1GTwIJpHVe-0IcwVPm2VIehfYg&oe=6AD03251&_nc_sid=5e03e0&_nc_cat=106";

async function main() {
    console.log('Guardando URL de Meta y Base64 en PostgreSQL...');
    const imgPath = path.join(process.cwd(), 'public', 'images', 'karen_executive_avatar.jpg');
    const buffer = fs.readFileSync(imgPath);
    const base64 = buffer.toString('base64');

    await prisma.systemSetting.upsert({
        where: { key: 'KAREN_AVATAR_BASE64' },
        update: { value: base64 },
        create: {
            key: 'KAREN_AVATAR_BASE64',
            value: base64,
            description: 'Avatar oficial de Karen / WhatsApp Business'
        }
    });

    await prisma.systemSetting.upsert({
        where: { key: 'WHATSAPP_PROFILE_PICTURE_URL' },
        update: { value: META_CDN_URL },
        create: {
            key: 'WHATSAPP_PROFILE_PICTURE_URL',
            value: META_CDN_URL,
            description: 'URL oficial en CDN de Meta WhatsApp'
        }
    });

    console.log('✅ Base de datos actualizada con la URL oficial de Meta y avatar Base64.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
