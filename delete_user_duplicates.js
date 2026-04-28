const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const duplicateNames = [
    "1 DS-7208HGHI-M1(C) + 2 DS-2CE16D0T-IRPF + 4 DS-2CE56D0T-IRPF + 6 DS-1H18-A + 1 HDD-1TB-DVRWD",
    "1 DS-7208HGHI-M1(C) + 2 DS-2CE16D0T-LPFS + 4 DS-2CE76D0T-LPFS + 6 DS-1H18-A + 1 HDD-1TB-DVRWD",
    "1 DS-7216HGHI-M1(C) + 2 DS-2CE16D0T-IRPF +6 DS-2CE56D0T-IRPF + 8 DS-1H18-A",
    "1 DS-7216HGHI-M1(C) +2 DS-2CE16D0T-LPFS + 6 DS-2CE76D0T-LPFS + 8 DS-1H18-A",
    "1 DS-K1T321MFWX + 1 DS-KAS-7M01",
    "1 DS-K1T323MBFWX-E1 + 1 DS-KAS-7M01",
    "1 DS-K1T342MFWX-E1 + 1DS-KAS-7M01",
    "1 DS-K1T344MBFWX-E1 + 1 DS-KAS-7M01",
    "1 DS-TMG320-ML/B + 1 DS-TMG001-3D-4MT",
    "1 DS-TMG320-MR/B + 1 DS-TMG001-3D-4MT",
    "1 PA-EVOHD+ +1 PA-K656 +1 PA-CAJAALARMABL +1 ST-EPA-73S +1 PA-TRALARM2 +1 ST-12V-4AMP",
    "1 PA-MG5050 + 1 PA-K10H + 1 PA-TRALARM2 + 1 ST-12V-4AMP + 1 PA-CAJAALARMABL +1 PA-REM25 + 1 PA-PMD2P +1 PA-DCTXP2 + 1 ST-EPA-73S",
    "1 PA-SP4000 + 1 PA-TRALARM2 + 1 ST-12V-4AMP + 1 PA-K10H + 1 PA-CAJAALARMABL + 1 ST-L-MG401 + 1 ST-EPA-73S",
    "1 PA-SP5500 + 1 PA-K10H + 1 PA-CAJAALARMABL + 1 PA-TRALARM2 + 1 ST-12V-4AMP+ 1 ST-EPA-73S",
    "1 PA-SP5500 + 1PA-K10H +1 PA-CAJAALARMABL +1 PA-TRALARM2 + 1 ST-12V-4AMP + 1 ST-EPA-73S + 1 PA-IP150"
];

async function main() {
    console.log("🚀 Deleting specific duplicates...");
    
    for (const name of duplicateNames) {
        // Find all products with this name
        const products = await prisma.product.findMany({
            where: { 
                name: name,
                isDeleted: false
            },
            orderBy: { id: 'asc' }
        });

        if (products.length > 1) {
            console.log(`- Found ${products.length} entries for "${name}". Keeping the first one.`);
            const toDelete = products.slice(1).map(p => p.id);
            await prisma.product.updateMany({
                where: { id: { in: toDelete } },
                data: { isDeleted: true }
            });
        }
    }

    console.log("✅ Duplicates processed.");
    await prisma.$disconnect();
}

main();
