process.env.DATABASE_URL = "postgresql://postgres.kkvujjyohspdynxltwqo:Jp2024013gg002%40@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, status: true },
            orderBy: { name: 'asc' }
        })
        console.log('API Response (raw data):', JSON.stringify(users, null, 2));
        
        // Simulate frontend filter
        const filtered = users.filter((u) => u.role !== "ADMIN" && u.status === "APPROVED");
        console.log('Filtered Users (Frontend logic):', filtered.length);
        filtered.forEach(u => console.log(`- ${u.name} (${u.role}, ${u.status})` ));
        
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
