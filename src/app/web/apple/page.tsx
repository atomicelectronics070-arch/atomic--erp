import { Metadata } from "next"
import AppleClient from "./AppleClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Apple Store Ecuador — MacBook, iPhone, iPad, Apple Watch & AirPods | ATOMIC",
  description: "Catálogo completo de productos Apple oficiales y homologados en Ecuador: MacBooks M2/M3/M4/M5, iPhone 13 al 17 Pro Max, iPads, Apple Watch y accesorios con 1 año de garantía y 15% IVA.",
  keywords: [
    "Apple Ecuador", "Comprar iPhone Ecuador", "MacBook Pro M4 Quito", "MacBook Air M3 Guayaquil",
    "iPhone 17 Pro Max Ecuador", "iPad Pro Apple Pencil", "Apple Watch Ecuador", "AirPods Pro 2",
    "ATOMIC Apple Store", "Precios Apple con IVA Ecuador"
  ],
  openGraph: {
    title: "Apple Store Ecuador — ATOMIC Premium Reseller & Distribuidor",
    description: "Equipos Apple 100% originales homologados con 1 año de garantía oficial, crédito directo y despacho nacional.",
    images: ["/banners/apple-ecosystem-ecuador.jpg"]
  }
}

export default function ApplePage() {
  return <AppleClient />
}
