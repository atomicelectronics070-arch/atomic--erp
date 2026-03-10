
import { getProducts } from './src/lib/actions/shop';

async function test() {
    try {
        const p = await getProducts();
        console.log("Success, count:", p.length);
    } catch (e: any) {
        console.error("PRISMA ERROR:", e.message);
    }
}

test();
