process.env.DATABASE_URL = "postgresql://postgres.kkvujjyohspdynxltwqo:Jp2024013gg002%40@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, status: true },
        orderBy: { name: 'asc' }
    });
    console.log(`\nTotal users in DB: ${users.length}\n`);
    users.forEach(u => console.log(`  ${u.name || '(sin nombre)'} | role: ${u.role} | status: ${u.status} | email: ${u.email}`));
    
    const approved = users.filter(u => u.status?.toUpperCase() === 'APPROVED' || u.status?.toUpperCase() === 'ACTIVE');
    console.log(`\nUsers with APPROVED/ACTIVE status (shown in dropdown): ${approved.length}`);
    approved.forEach(u => console.log(`  ✓ ${u.name} (${u.role})`));
    
    const pending = users.filter(u => u.status?.toUpperCase() !== 'APPROVED' && u.status?.toUpperCase() !== 'ACTIVE');
    console.log(`\nUsers NOT shown in dropdown: ${pending.length}`);
    pending.forEach(u => console.log(`  ✗ ${u.name || '(sin nombre)'} | status: ${u.status}`));
    
    await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
