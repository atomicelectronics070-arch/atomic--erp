const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres.kkvujjyohspdynxltwqo:Jp2024013gg002@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
        }
    }
});

async function runMigration() {
    try {
        console.log('🔄 Conectando a Supabase...');

        // 1. Add campaignStartDate to SocialSettings
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "SocialSettings" 
            ADD COLUMN IF NOT EXISTS "campaignStartDate" TIMESTAMP WITH TIME ZONE;
        `);
        console.log('✅ campaignStartDate agregada a SocialSettings');

        // 2. Create NfcCampaignPost table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "NfcCampaignPost" (
                "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
                "dayNumber"      INTEGER NOT NULL,
                "platform"       TEXT NOT NULL DEFAULT 'facebook',
                "status"         TEXT NOT NULL DEFAULT 'PUBLISHED',
                "content"        TEXT,
                "externalPostId" TEXT,
                "errorMessage"   TEXT,
                "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "NfcCampaignPost_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('✅ Tabla NfcCampaignPost creada');

        // 3. Verify
        const cols = await prisma.$queryRawUnsafe(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'SocialSettings' AND column_name = 'campaignStartDate';
        `);
        console.log('✅ Verificación campaignStartDate:', cols.length > 0 ? 'EXISTE' : 'NO ENCONTRADA');

        const tables = await prisma.$queryRawUnsafe(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'NfcCampaignPost';
        `);
        console.log('✅ Verificación NfcCampaignPost:', tables.length > 0 ? 'EXISTE' : 'NO ENCONTRADA');

        console.log('\n🎉 Migración completada exitosamente!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

runMigration();
