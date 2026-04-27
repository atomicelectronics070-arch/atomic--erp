const { PrismaClient } = require('@prisma/client');

const host = "db.kkvujjyohspdynxltwqo.supabase.co";
const passwords = [
  "Jp2024013gg002@",
  "Admin12345!",
  "Jp2024013gg002",
  "Admin12345"
];

async function run() {
  for (const pw of passwords) {
    const encodedPw = encodeURIComponent(pw);
    const url = `postgresql://postgres.kkvujjyohspdynxltwqo:${encodedPw}@${host}:5432/postgres`;
    console.log(`Testing password: ${pw}`);
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: url,
        },
      },
    });

    try {
      await prisma.$connect();
      console.log(`✅ SUCCESS with password: ${pw}`);
      await prisma.$disconnect();
      return;
    } catch (e) {
      console.log(`❌ FAILED with password: ${pw} - Error: ${e.message}`);
      await prisma.$disconnect();
    }
  }
}

run();
