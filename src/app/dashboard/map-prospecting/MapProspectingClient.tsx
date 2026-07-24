"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Search, MapPin, Save, CheckCircle, Crosshair, Navigation } from "lucide-react"

// Íconos personalizados
const newProspectIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const savedProspectIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Componente para manejar eventos del mapa
function MapEvents({ setBounds, setDraftPin }: { setBounds: (bounds: any) => void, setDraftPin: (latlng: [number, number] | null) => void }) {
    const map = useMapEvents({
        moveend: () => {
            setBounds(map.getBounds())
        },
        zoomend: () => {
            setBounds(map.getBounds())
        },
        click: (e) => {
            setDraftPin([e.latlng.lat, e.latlng.lng])
        }
    })
    
    useEffect(() => {
        setBounds(map.getBounds())
    }, [map, setBounds])
    
    return null
}

export default function MapProspectingClient() {
    const [user, setUser] = useState<any>(null)
    const [bounds, setBounds] = useState<any>(null)
    const [draftPin, setDraftPin] = useState<[number, number] | null>(null)
    const [draftName, setDraftName] = useState("")
    const [places, setPlaces] = useState<any[]>([])
    const [savedLeads, setSavedLeads] = useState<any[]>([])
    const [keyword, setKeyword] = useState("conjunto residencial")
    const [loading, setLoading] = useState(false)
    const [mapCenter, setMapCenter] = useState<[number, number]>([-0.180653, -78.467838]) // Quito por defecto

    useEffect(() => {
        // Cargar sesión del vendedor
        fetch("/api/auth/session")
            .then(res => res.json())
            .then(data => {
                if (data?.user) setUser(data.user)
            })
            
        // Cargar leads ya guardados
        fetchSavedLeads()
    }, [])

    const fetchSavedLeads = async () => {
        try {
            const res = await fetch("/api/crm/prospects")
            const data = await res.json()
            if (Array.isArray(data)) {
                setSavedLeads(data)
            }
        } catch (error) {
            console.error("Error cargando leads:", error)
        }
    }

    const searchArea = async () => {
        if (!bounds) return
        setLoading(true)
        
        const south = bounds.getSouth()
        const west = bounds.getWest()
        const north = bounds.getNorth()
        const east = bounds.getEast()
        
        // Overpass API Query
        // Buscar nodos o caminos que coincidan con la palabra clave en el nombre
        const query = `
            [out:json][timeout:25];
            (
              node["name"~"${keyword}",i](${south},${west},${north},${east});
              way["name"~"${keyword}",i](${south},${west},${north},${east});
              relation["name"~"${keyword}",i](${south},${west},${north},${east});
            );
            out center;
        `
        
        try {
            const res = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: query
            })
            const data = await res.json()
            
            const results = data.elements.map((el: any) => ({
                id: el.id,
                name: el.tags?.name || "Sin nombre",
                lat: el.lat || el.center?.lat,
                lng: el.lon || el.center?.lon,
                address: el.tags?.["addr:street"] 
                    ? `${el.tags["addr:street"]} ${el.tags["addr:housenumber"] || ""}`
                    : "Dirección no especificada"
            })).filter((el: any) => el.lat && el.lng)
            
            setPlaces(results)
        } catch (error) {
            console.error("Error buscando en OSM:", error)
            alert("Error buscando en el mapa. Intenta acercar la vista o cambiar la palabra.")
        }
        
        setLoading(false)
    }

    const saveProspect = async (place: any) => {
        if (!user) return alert("No estás autenticado")
        
        try {
            const res = await fetch("/api/crm/prospects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: place.name,
                    lat: place.lat,
                    lng: place.lng,
                    address: place.address,
                    salespersonId: user.id
                })
            })
            
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            
            alert("¡Prospecto guardado exitosamente!")
            fetchSavedLeads() // Refrescar los guardados
        } catch (error: any) {
            alert(error.message || "Error al guardar el prospecto")
        }
    }

    const isSaved = (lat: number, lng: number) => {
        return savedLeads.some(lead => 
            Math.abs(lead.lat - lat) < 0.0001 && Math.abs(lead.lng - lng) < 0.0001
        )
    }

    // Filtrar los places que no están guardados para mostrarlos en rojo
    const newPlaces = places.filter(p => !isSaved(p.lat, p.lng))

    return (
        <div className="relative w-full h-full flex flex-col md:flex-row">
            {/* Panel Izquierdo / Superior */}
            <div className="w-full md:w-80 bg-white shadow-xl z-[1000] flex flex-col">
                <div className="p-6 bg-black text-white">
                    <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={20} /> Radar de Prospectos
                    </h2>
                    <p className="text-xs text-white/60 mt-2 font-medium">Encuentra negocios o conjuntos cerca y guárdalos en el CRM al instante.</p>
                </div>
                
                <div className="p-6 flex-1 flex flex-col gap-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">¿Qué estás buscando?</label>
                        <input 
                            type="text"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            placeholder="Ej. Conjunto, Empresa, Dental..."
                            className="w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-black border-none text-sm font-medium"
                        />
                    </div>
                    
                    <button 
                        onClick={searchArea}
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : <Search size={16} />}
                        {loading ? "Rastreando..." : "Buscar en esta Área"}
                    </button>

                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Métricas de la Sesión</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Encontrados</span>
                                <span className="text-2xl font-black text-black">{newPlaces.length}</span>
                            </div>
                            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block mb-1">Guardados</span>
                                <span className="text-2xl font-black text-green-700">{savedLeads.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mapa */}
            <div className="flex-1 relative h-[50vh] md:h-full z-0">
                <MapContainer 
                    center={mapCenter} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <MapEvents setBounds={setBounds} setDraftPin={setDraftPin} />
                            
                            {/* Draft Pin */}
                            {draftPin && (
                                <Marker position={draftPin} icon={newProspectIcon}>
                                    <Popup className="prospect-popup">
                                        <div className="p-1 min-w-[200px]">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 border-b border-indigo-100 pb-1">
                                                NUEVO PUNTO MANUAL
                                            </p>
                                            <input 
                                                autoFocus
                                                value={draftName}
                                                onChange={e => setDraftName(e.target.value)}
                                                placeholder="Ej: Conjunto Las Palmas"
                                                className="w-full text-xs font-bold text-[#0F172A] border border-slate-200 rounded p-1 mb-2 outline-none focus:border-indigo-500"
                                            />
                                            <p className="text-[9px] text-slate-500 mb-3 uppercase flex items-center gap-1">
                                                <MapPin size={10} /> Ubicación Seleccionada
                                            </p>
                                            <button 
                                                onClick={() => {
                                                    if(!draftName.trim()) return alert("Ingresa un nombre");
                                                    saveProspect({
                                                        id: `draft-${Date.now()}`,
                                                        name: draftName,
                                                        lat: draftPin[0],
                                                        lng: draftPin[1],
                                                        address: "Añadido Manualmente"
                                                    });
                                                    setDraftPin(null);
                                                    setDraftName("");
                                                }}
                                                className="w-full bg-[#0F172A] text-white py-2 rounded text-[10px] font-black tracking-widest hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Save size={12} /> GUARDAR LEAD
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {/* Nuevos Prospectos de OSM */}
                    {newPlaces.map(place => (
                        <Marker 
                            key={place.id} 
                            position={[place.lat, place.lng]}
                            icon={newProspectIcon}
                        >
                            <Popup className="prospect-popup">
                                <div className="p-1">
                                    <h4 className="font-bold text-sm mb-1">{place.name}</h4>
                                    <p className="text-xs text-gray-500 mb-3">{place.address}</p>
                                    <button 
                                        onClick={() => saveProspect(place)}
                                        className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-gray-800 transition-colors"
                                    >
                                        <Save size={14} /> Guardar Lead
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Mostrar prospectos YA GUARDADOS */}
                    {savedLeads.map(lead => (
                        <Marker 
                            key={lead.id} 
                            position={[lead.lat, lead.lng]}
                            icon={savedProspectIcon}
                        >
                            <Popup>
                                <div className="p-1">
                                    <h4 className="font-bold text-sm mb-1">{lead.name}</h4>
                                    <p className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1 mb-1">
                                        <CheckCircle size={10} /> Registrado en CRM
                                    </p>
                                    {lead.address && <p className="text-xs text-gray-500">{lead.address}</p>}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Target en el centro (UI decorativa) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[400] opacity-30">
                    <Crosshair size={40} className="text-black" strokeWidth={1} />
                </div>
            </div>
            
            {/* Styles globales para el popup custom */}
            <style dangerouslySetInnerHTML={{__html: `
                .leaflet-popup-content-wrapper {
                    border-radius: 1rem;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .leaflet-popup-content {
                    margin: 12px;
                }
            `}} />
        </div>
    )
}
