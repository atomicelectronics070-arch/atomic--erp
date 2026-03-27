import { getShopMetadata, getProducts, createCategory } from './src/lib/actions/shop';

async function main() {
  console.log("Testing getShopMetadata...");
  try {
    const meta = await getShopMetadata();
    console.log("Categories found:", meta.categories.length);
  } catch (error) {
    console.error("Error in getShopMetadata:", error.message || error);
  }

  console.log("Testing getProducts...");
  try {
    const prods = await getProducts();
    console.log("Products found:", prods.total);
  } catch (error) {
    console.error("Error in getProducts:", error.message || error);
  }
}

main();
