export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import LaptopsCatalogClient from './LaptopsCatalogClient';

export const metadata = {
  title: 'Catálogo de Laptops Premium & Gaming | ATOMIC',
  description: 'Descubre nuestra colección exclusiva de laptops gaming, workstations y ultrabooks de alto rendimiento en Ecuador.'
};

export default function LaptopsBlogMasterPage() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'enrichedLaptops.json');
  let laptops = [];
  try {
    laptops = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (err) {
    console.error("Error reading laptops data:", err);
  }

  return <LaptopsCatalogClient initialLaptops={laptops} />;
}
