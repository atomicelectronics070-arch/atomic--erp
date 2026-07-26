import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LaptopsLongFormTemplate from '@/components/marketing/LaptopsLongFormTemplate';

export async function generateStaticParams() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'enrichedLaptops.json');
  try {
    const laptops = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return laptops.map((l: any) => ({
      id: l.slug,
    }));
  } catch (err) {
    return [];
  }
}

export default async function LaptopsDynamicLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dataPath = path.join(process.cwd(), 'src', 'data', 'enrichedLaptops.json');
  let laptop = null;
  
  try {
    const laptops = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const cleanId = id.toLowerCase().trim();
    
    // 1. Exact match by slug or ID
    laptop = laptops.find((l: any) => l.slug === cleanId || l.id === cleanId);
    
    // 2. Partial match by slug or cleanName
    if (!laptop) {
      laptop = laptops.find((l: any) => 
        l.slug.toLowerCase().includes(cleanId) || 
        cleanId.includes(l.slug.toLowerCase()) ||
        l.cleanName.toLowerCase().includes(cleanId.replace(/-/g, ' '))
      );
    }

    // 3. Fallback to first available laptop if slug not found (zero 404s)
    if (!laptop && laptops.length > 0) {
      laptop = laptops[0];
    }
  } catch (err) {
    console.error(err);
  }

  if (!laptop) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Mini Navegación (Breadcrumbs) */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/web/laptops-blog" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
          ← Volver al Catálogo Premium
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <LaptopsLongFormTemplate laptop={laptop} />
      </div>
    </div>
  );
}
