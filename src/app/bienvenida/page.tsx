import type { Metadata } from "next";
import BienvenidaClient from "./BienvenidaClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bienvenido a ATOMIC Solutions 🇪🇨 | Tarjeta Digital & Catálogo Oficial",
  description:
    "Portal oficial de bienvenida y presentación digital de ATOMIC Solutions Ecuador. Contáctanos por WhatsApp, Facebook, Instagram, TikTok o YouTube, solicita tu catálogo con descuento y consulta nuestras referencias verificadas.",
  openGraph: {
    title: "ATOMIC Solutions 🇪🇨 | Tecnología, Domótica & Seguridad",
    description: "Equipamiento tecnológico con garantía oficial de 1 año y envíos a todo el Ecuador por Servientrega.",
    images: [{ url: "/icon-192.png", width: 192, height: 192, alt: "ATOMIC Solutions Ecuador" }],
  },
};

export default function BienvenidaPage() {
  return <BienvenidaClient />;
}
