"use client"
import dynamic from 'next/dynamic'

// Desactiva el Server Side Rendering para el mapa porque Leaflet requiere el objeto Window
const MapProspectingClient = dynamic(() => import('./MapProspectingClient'), {
    ssr: false,
    loading: () => (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full" />
            <span className="ml-4 font-bold text-gray-400 uppercase tracking-widest text-sm">Cargando Mapa...</span>
        </div>
    )
})

export default function MapProspectingPage() {
    return (
        <div className="h-[calc(100vh-4rem)] w-full">
            <MapProspectingClient />
        </div>
    )
}
