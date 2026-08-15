import { prisma } from "@/lib/prisma";
import BobinasClient from "./BobinasClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bobinas de Cable UTP, FTP & Cableado Estructurado | Cat6, Cat5e, 100% Cobre & CCA — ATOMIC NETWORKING",
  description:
    "Catálogo oficial de bobinas de cable de 305m y 1000m. Cables UTP, FTP, STP, Cat6, Cat5e, 100% Cobre Puro certificables Fluke y Aleaciones CCA para CCTV. Envíos directos a todo Ecuador.",
};

export default async function BobinasLandingPage() {
  let products: any[] = [];
  try {
    const rawProducts = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        OR: [
          { name: { contains: "cable", mode: "insensitive" } },
          { name: { contains: "bobina", mode: "insensitive" } },
          { name: { contains: "utp", mode: "insensitive" } },
          { name: { contains: "ftp", mode: "insensitive" } },
          { name: { contains: "cat5", mode: "insensitive" } },
          { name: { contains: "cat6", mode: "insensitive" } },
          { name: { contains: "cobre", mode: "insensitive" } },
          { name: { contains: "cca", mode: "insensitive" } },
          { name: { contains: "fibra", mode: "insensitive" } },
          { name: { contains: "coaxial", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        stock: true,
        provider: true,
        specs: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    products = rawProducts;
  } catch (error) {
    console.error("Error fetching cable products in BobinasLandingPage:", error);
  }

  // Fallback curated cable coil items if DB has few cable items
  const fallbackCables = [
    {
      id: "cable-cat6-100-cobre-305m",
      name: "BOBINA DE CABLE UTP CAT6 100% COBRE PURO 305M (23AWG LSZH Fluke Passed)",
      description: "Bobina de cable UTP Categoria 6 de 100% Cobre Puro de 305 metros. Conductor sólido 24AWG/23AWG ideal para certificación Fluke Networks, redes Gigabit 10/100/1000Mbps y alimentación PoE+ / PoE++ (Power over Ethernet). Cubierta libre de halógenos LSZH anti-incendio.",
      price: 145.00,
      stock: 45,
      type: "100% COBRE",
      category: { name: "BOBINAS DE CABLE" },
      specs: "100% Cobre Puro, 305 Metros, Cat6 23AWG, Fluke Passed, PoE+ Support",
      images: JSON.stringify(["/api/web-banners/banner-1.jpg"])
    },
    {
      id: "cable-cat6-cca-305m",
      name: "BOBINA DE CABLE UTP CAT6 ALEACIÓN CCA 305M (24AWG PVC Interior)",
      description: "Bobina de cable UTP Categoría 6 Aleación CCA (Aluminio Revestido de Cobre) de 305 metros. Ideal para instalaciones de CCTV analógico / AHD / IP, redes residenciales y de oficina hasta 70m.",
      price: 68.00,
      stock: 60,
      type: "ALEACIÓN CCA",
      category: { name: "BOBINAS DE CABLE" },
      specs: "Aleación CCA, 305 Metros, Cat6 24AWG, Jacket PVC Interior",
      images: JSON.stringify(["/api/web-banners/banner-2.jpg"])
    },
    {
      id: "cable-cat6-ftp-exterior-cobre-305m",
      name: "BOBINA DE CABLE BLINDADO FTP CAT6 100% COBRE EXTERIOR CON MENSAJERO DE ACERO 305M",
      description: "Bobina de cable blindado FTP Cat6 100% Cobre Puro con chaqueta de Polietileno (PE) para intemperie / exterior anti-UV y guaya mensajera de acero para tendidos aéreos entre postes.",
      price: 185.00,
      stock: 25,
      type: "EXTERIOR / FTP",
      category: { name: "BOBINAS DE CABLE" },
      specs: "100% Cobre Puro, FTP Blindado, Dieléctrico Exterior PE, Guaya de Acero 305m",
      images: JSON.stringify(["/api/web-banners/banner-3.jpg"])
    },
    {
      id: "cable-cat5e-100-cobre-305m",
      name: "BOBINA DE CABLE UTP CAT5E 100% COBRE PURO 305M (24AWG PVC azul/gris)",
      description: "Bobina de cable UTP Categoría 5e 100% Cobre de 305 metros. Transmisión confiable hasta 1000Mbps, soporte PoE estándar para cámaras de seguridad IP y teléfonos VoIP.",
      price: 95.00,
      stock: 30,
      type: "100% COBRE",
      category: { name: "BOBINAS DE CABLE" },
      specs: "100% Cobre, 305m, Cat5e 24AWG, Certificación ISO9001",
      images: JSON.stringify(["/api/web-banners/banner-4.jpg"])
    },
    {
      id: "cable-cat5e-cca-305m",
      name: "BOBINA DE CABLE UTP CAT5E ALEACIÓN CCA 305M (Económica para Alarmas & CCTV)",
      description: "Bobina de cable UTP Cat5e Aleación CCA de 305m. Solución de alta relación costo-beneficio para sistemas de alarma, sensores de intrusión, citofonía y cámaras de video.",
      price: 45.00,
      stock: 80,
      type: "ALEACIÓN CCA",
      category: { name: "BOBINAS DE CABLE" },
      specs: "Aleación CCA, 305m, Cat5e, Uso Residencial & CCTV",
      images: JSON.stringify(["/api/web-banners/banner-5.jpg"])
    },
    {
      id: "fibra-optica-drop-1-hilo-1000m",
      name: "BOBINA DE FIBRA ÓPTICA DROP 1 HILO MONOMODO FTTH 1000M CON MENSAJERO DE ACERO",
      description: "Bobina de fibra óptica Drop monomodo G.657A1 de 1 hilo con mensajero de acero de 1000 metros. Diseñada para redes FTTH de internet por fibra óptica y enlaces punto a punto.",
      price: 110.00,
      stock: 15,
      type: "FIBRA ÓPTICA",
      category: { name: "BOBINAS DE CABLE" },
      specs: "Monomodo G.657A1, 1 Hilo, 1000m, Mensajero de Acero FTTH",
      images: JSON.stringify(["/api/web-banners/banner-6.jpg"])
    },
    {
      id: "cable-coaxial-rg6-305m",
      name: "BOBINA DE CABLE COAXIAL RG6 75 OHMIOS 305M (Con Malla al 60% Aluminio)",
      description: "Bobina de cable coaxial RG6 de 75 Ohmios con blindaje de malla al 60% de aluminio. Ideal para televisión por cable HD, antenas parabólicas, televisión digital terrestre (TDT) y cámaras AHD.",
      price: 52.00,
      stock: 35,
      type: "COAXIAL",
      category: { name: "BOBINAS DE CABLE" },
      specs: "RG6 75 Ohm, Malla 60%, 305m, TV HD & CCTV",
      images: JSON.stringify(["/api/web-banners/banner-7.jpg"])
    },
    {
      id: "cable-cat6a-stp-100-cobre-305m",
      name: "BOBINA DE CABLE STP CAT6A 10Gbps 100% COBRE PURO 305M (Doble Blindaje Malla + Papel de Aluminio)",
      description: "Bobina de cable Cat6A 10Gbps 500MHz con doble blindaje (S/FTP: blindaje individual por par de lámina de aluminio + malla global de cobre estañado). Diseñado para Data Centers y redes de alto tráfico.",
      price: 240.00,
      stock: 10,
      type: "100% COBRE",
      category: { name: "BOBINAS DE CABLE" },
      specs: "100% Cobre, Cat6A 10Gbps 500MHz, Double Shielded S/FTP, 305m",
      images: JSON.stringify(["/api/web-banners/banner-8.jpg"])
    }
  ];

  const combinedMap = new Map();
  fallbackCables.forEach(f => combinedMap.set(f.name.toLowerCase().trim(), f));
  products.forEach(p => combinedMap.set(p.name.toLowerCase().trim(), p));

  const finalProducts = Array.from(combinedMap.values());

  return <BobinasClient initialProducts={finalProducts} />;
}
