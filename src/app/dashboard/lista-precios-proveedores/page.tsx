import React from "react"
import { Metadata } from "next"
import ListaPreciosProveedoresConfidencial from "@/components/shop/ListaPreciosProveedoresConfidencial"

export const metadata: Metadata = {
    title: "Lista de Precios con Links a Proveedores (Confidencial) | ATOMIC ERP",
    description: "Catálogo confidencial de proveedores, costos mayoristas y extracción de fotos y descripciones para Stefy y Cristina."
}

export default function ListaPreciosProveedoresPage() {
    return (
        <div className="min-h-screen bg-[#070a14] text-slate-100 font-sans p-4 sm:p-8 pb-32">
            <div className="max-w-7xl mx-auto space-y-6">
                <ListaPreciosProveedoresConfidencial />
            </div>
        </div>
    )
}
