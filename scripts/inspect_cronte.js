const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.product.findMany({
    where: { provider: 'Cronte Technology' },
    select: { id: true, name: true, price: true, images: true },
    take: 5
}).then(r => {
    r.forEach(prod => console.log(JSON.stringify(prod, null, 2)));
    p.$disconnect();
});
